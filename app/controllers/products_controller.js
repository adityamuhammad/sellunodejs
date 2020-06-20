const Product = require('../models/product.js');
const response = require('../helpers/standard_response.js');

const ProductsController = {
  find: async (req, res) => {
    try {
      let product = await Product.findById(req.params.id);
      if(product == null){
        response.notFound(res);
      } else {
        response.ok(res, product);
      }
    } catch (err) {
      response.notFound(res);
    }
  },
  findAll: async (req, res) => {
    try {
      let products = await Product.find();
      response.ok(res, products);
    } catch {
      response.internalError(res);
    }
  },
  update: async (req, res) => {
    try {
      await Product.findOneAndUpdate(
        {
          _id: req.params.id},
        {
          name: req.body.name,
          price: req.body.price
        }, (err, data) => {
          if (err){
            response.badRequest(res, err);
          } else {
            response.ok(res, data);
          }
        });
    } catch(err){
      response.internalError(res);
    }
  },
  delete: async (req, res) => {
    try {
      let id = req.params.id;
      let product = await Product.findById(id);
      if(product == null){
        response.notFound(res);
      } else {
        await Product.deleteOne({_id:id});
        response.noContent(res);
      }
    } catch(err) {
      response.badRequest(res,err);
    }
  },
  create: async (req, res) => {
    let product = new Product({
      name: req.body.name,
      price: req.body.price
    });
    await product.save((err) => {
      if(err){
        response.badRequest(res, err);
      } else {
        response.ok(res,product);
      }
    });
  }
}

module.exports = ProductsController;
