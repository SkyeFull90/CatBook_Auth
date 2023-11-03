const express = require('express');
const catController = require('../controllers/catController');
const router = express.Router();
const multer = require('multer');

// Multer configuration for file upload
const upload = multer({ dest: 'temp/' });

router
    .route('/')
    .get(catController.getAllCats);

router
    .route('/upload')
    .get(catController.uploadPage)
    .post(upload.single('image'), catController.createCat); // Using the multer upload for single image upload

router
    .route('/edit/:id')
    .get(catController.editPage)
    .post(upload.single('image'), catController.updateCat); // Using multer upload for updating an image

router
    .route('/delete/:id')
    .post(catController.deleteCat);

module.exports = router;
