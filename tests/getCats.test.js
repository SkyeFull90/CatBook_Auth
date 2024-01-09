const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const catController = require('../controllers/catController');
const Cat = require('../models/catModel');

describe('Cat Controller', function() {
    describe('getAllCats', function() {
        it('should fetch all cats', async function() {
            const req = { user: {} };
            const res = { 
                render: sinon.spy(),
                status: sinon.stub().returnsThis(),
                send: sinon.spy()
            };

            const mockCats = [{ name: 'Test Cat 1' }, { name: 'Test Cat 2' }];

            sinon.stub(Cat, 'find').returns({
                populate: sinon.stub().resolves(mockCats)
            });

            await catController.getAllCats(req, res);

            expect(res.render.calledOnce).to.be.true;
            expect(res.render.firstCall.args[0]).to.equal('home');
            expect(res.render.firstCall.args[1]).to.deep.equal({ cats: mockCats, user: req.user });

            Cat.find.restore();
        });
    });
});