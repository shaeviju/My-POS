const mongoose = require('mongoose');

// Invoice Schema
const invoiceSchema = new mongoose.Schema({
  invoiceNo: { type: String, required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number },
    sellingPrice: { type: Number },
    subtotal: { type: Number },
  }],
  totalAmount: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

// Model for the Invoice
const Invoice = mongoose.model('Invoice', invoiceSchema);

// Invoice Sequence Schema to track daily sequence number
const invoiceSequenceSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now, unique: true },
  sequence: { type: Number, default: 1 }, // Starting from 1
});

const InvoiceSequence = mongoose.model('InvoiceSequence', invoiceSequenceSchema);

module.exports = { Invoice, InvoiceSequence };
