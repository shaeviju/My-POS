// routes/invoiceRoutes.js
const express = require('express');
const Invoice = require('../models/invoice');
const Customer = require('../models/customer');
const Product = require('../models/product');
const router = express.Router();

// Helper function to generate invoice number
const generateInvoiceNo = async () => {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
  
  // Get the count of invoices for today
  const count = await Invoice.countDocuments({ date: { $gte: new Date(dateStr) } });
  
  // Generate a unique invoice number in the format YYYY-MM-DD-001
  const invoiceNo = `${dateStr}-${count + 1}`;
  return invoiceNo;
};

// Route to create a new invoice
router.post('/invoices', async (req, res) => {
  const { customerId, products, totalAmount } = req.body;

  try {
    // Generate invoice number
    const invoiceNo = await generateInvoiceNo();

    // Ensure customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(400).json({ message: 'Customer not found' });
    }

    // Validate the products
    const productDetails = [];
    let grandTotal = 0;
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product with ID ${item.productId} not found` });
      }

      const subtotal = item.quantity * item.sellingPrice;
      productDetails.push({
        productId: product._id,
        quantity: item.quantity,
        sellingPrice: item.sellingPrice,
        subtotal: subtotal
      });
      grandTotal += subtotal;
    }

    // Create the invoice
    const newInvoice = new Invoice({
      invoiceNo: invoiceNo,
      customer: customerId,
      products: productDetails,
      totalAmount: grandTotal,
    });

    // Save the invoice to the database
    await newInvoice.save();
    res.status(201).json(newInvoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating invoice', error: err.message });
  }
});

module.exports = router;
