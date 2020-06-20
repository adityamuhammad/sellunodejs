const express = require('express');
const router = express.Router();
const ProductsController = require('../controllers/products_controller.js');
const TokenAuthorization = require('../middleware/token_authorization.js');

router.get('/:id', ProductsController.find);
router.post('/', ProductsController.create);
router.get('/', TokenAuthorization.verifyToken, ProductsController.findAll);
router.delete('/:id', TokenAuthorization.verifyToken, ProductsController.delete);
router.put('/:id', TokenAuthorization.verifyToken, ProductsController.update);

module.exports = router;
