const Product = require('../models/product.js');
const response = require('../helpers/standard_response.js');

const ProductsController = {
  find: async (req, res) => {
    try {
      let product = await Product.findById(req.params.id);
      if(product == null){
        return response.notFound(res);
      }
      return response.ok(res, product);
    } catch (err) {
      return response.notFound(res);
    }
  },
  findAll: async (req, res) => {
    try {
      let products = await Product.find();
      return response.ok(res, products);
    } catch {
      return response.internalError(res);
    }
  },
  update: async (req, res) => {
    try {
      await Product.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { name: req.body.name, price: req.body.price, description: req.body.description }
        }, {new: true}, (err, data) => {
          if (err){
            return response.badRequest(res, err);
          }
          return response.ok(res, data);
        });
    } catch(err){
      return response.internalError(res);
    }
  },
  delete: async (req, res) => {
    try {
      let id = req.params.id;
      let product = await Product.findById(id);
      if(product == null){
        return response.notFound(res);
      }
      await Product.deleteOne({_id:id});
      return response.noContent(res);
    } catch(err) {
      response.badRequest(res,err);
    }
  },
  create: async (req, res) => {
    let product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description
    });
    await product.save((err) => {
      if(err){
        return response.badRequest(res, err);
      }
      return response.created(res,product);
    });
  }
}

module.exports = ProductsController;
