var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true
  }
}, {timestamps: true});

productSchema.plugin(uniqueValidator);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
