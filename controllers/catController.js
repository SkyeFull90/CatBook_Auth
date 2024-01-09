const Cat = require('../models/catModel');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Load environment variables from .env file
require('dotenv').config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer configuration for file upload
const upload = multer({ dest: './public/images' });

const getAllCats = async (req, res) => {
  try {
    const cats = await Cat.find().populate('owner');
    res.render('home', { cats: cats, user: req.user });
  } catch(err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const uploadPage = (req, res) => {
  res.render('upload', { user: req.user });
};

const createCat = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Save the Cloudinary URL to the 'image' field in your database (Cat model)
    const cat = new Cat({
      name: req.body.name,
      age: req.body.age,
      favoriteFood: req.body.favoriteFood,
      funFact: req.body.funFact,
      image: result.secure_url, // Save Cloudinary URL to the 'image' field
      owner: req.user._id // If using authentication and 'req.user' holds the user's ID
    });

    // Save the new cat to the database
    await cat.save();

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};


const editPage = async (req, res) => {
  try {
    const cat = await Cat.findById(req.params.id);
    res.render('edit', { cat: cat, user: req.user });
  } catch(err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const updateCat = async (req, res) => {
  try {
    let cat = await Cat.findById(req.params.id);

        const updatedCat = {
          name: req.body.name,
          age: req.body.age,
          favoriteFood: req.body.favoriteFood,
          funFact: req.body.funFact,
        };

        if (cat.owner.equals(req.user._id)) {
          await Cat.findByIdAndUpdate(req.params.id, updatedCat);
        }
        res.redirect('/');

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const deleteCat = async (req, res) => {
  try {
    let cat = await Cat.findById(req.params.id);
    if (cat.owner.equals(req.user._id)) {
      await Cat.findByIdAndRemove(req.params.id);
    }
    res.redirect('/');
  } catch(err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getAllCats,
  upload,
  uploadPage,
  createCat,
  editPage,
  updateCat,
  deleteCat
};