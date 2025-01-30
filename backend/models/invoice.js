// models/invoice.js
const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNo: { 
    type: String, 
    required: true, 
    unique: true 
  },
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true 
  },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    subtotal: { type: Number, required: true },
  }],
  totalAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Invoice', invoiceSchema);
