var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String
  }
}, {timestamps: true});

ProductSchema.plugin(uniqueValidator);

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
