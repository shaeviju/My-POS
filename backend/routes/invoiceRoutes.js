const express = require('express');
const { Invoice, InvoiceSequence } = require('../models/invoice');
const Customer = require('../models/customer');
const Product = require('../models/product');
const router = express.Router(); 

// Helper function to generate invoice number
const generateInvoiceNo = async () => {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, ''); // Format the date as YYYYMMDD
  
  // Find or create a sequence for today
  let invoiceSequence = await InvoiceSequence.findOne({ date: { $gte: today.setHours(0, 0, 0, 0) } });
  if (!invoiceSequence) {
    invoiceSequence = new InvoiceSequence({ date: today, sequence: 1 });
    await invoiceSequence.save();
  } else {
    invoiceSequence.sequence += 1; // Increment sequence for the day
    await invoiceSequence.save();
  }

  return `${dateStr}${invoiceSequence.sequence.toString().padStart(3, '0')}`; // Generate a unique invoice number like YYYYMMDD001
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

    // Validate the products and calculate subtotal for each product
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
        subtotal: subtotal,
      });
      grandTotal += subtotal;
    }

    // Create the invoice
    const newInvoice = new Invoice({
      invoiceNo: invoiceNo,
      customerId: customerId,
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
