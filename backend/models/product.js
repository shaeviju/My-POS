const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productCode: { type: String, required: true },
  buyingPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  description: { type: String, required: true },
  supplierName: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
