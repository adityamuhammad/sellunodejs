const express = require('express');
const router = express.Router();
const ProductsController = require('../controllers/products_controller.js');
const TokenAuthorization = require('../middleware/token_authorization.js');

router.get('/:id', ProductsController.find);
router.get('/', ProductsController.findAll);
router.post('/', TokenAuthorization.verifyToken, ProductsController.create);
router.delete('/:id', TokenAuthorization.verifyToken, ProductsController.delete);
router.put('/:id', TokenAuthorization.verifyToken, ProductsController.update);

module.exports = router;
