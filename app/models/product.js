var mongoose = require('mongoose');

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

productSchema.path('price').get((num) => {
  return (num / 100).tofixed(2);
});

productSchema.path('price').set((num) => {
  return num * 100
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
