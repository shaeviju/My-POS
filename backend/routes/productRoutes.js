const express = require('express');
const Product = require('../models/product');
const Supplier = require('../models/supplier');
const router = express.Router();

// Route to get all products or search products
router.get('/products', async (req, res) => {
  const { search } = req.query;

  try {
    const filter = {};

    // If search query exists, add filtering
    if (search && search.trim() !== '') {
      // Handle numeric fields (buyingPrice, sellingPrice, quantity)
      if (!isNaN(search)) {
        filter.$or = [
          { buyingPrice: { $eq: parseFloat(search) } },
          { sellingPrice: { $eq: parseFloat(search) } },
          { quantity: { $eq: parseInt(search) } }
        ];
      } else { // Handle string fields (productName, productCode, supplierName, description)
        filter.$or = [
          { productName: { $regex: search, $options: 'i' } },
          { productCode: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { 'supplierName.name': { $regex: search, $options: 'i' } },  // Match supplier's name
        ];
      }
    }

    const products = await Product.find(filter).populate('supplierName'); // populate supplierName
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
});


// Route to add a new product
router.post('/products', async (req, res) => {
  const { productName, productCode, buyingPrice, sellingPrice, quantity, supplierName,description } = req.body;

  if (!productName || !productCode || !buyingPrice || !sellingPrice || !quantity || !supplierName || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newProduct = new Product({
    productName,
    productCode,
    buyingPrice,
    sellingPrice,
    quantity,
    supplierName,
    description,
  });

  try {
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add product', error: err.message });
  }
});

// Route to update a product
router.put('/products/:id', async (req, res) => {
  const { productName, productCode, buyingPrice, sellingPrice, quantity, supplierName,description } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { productName, productCode, buyingPrice, sellingPrice, quantity, supplierName,description },
      { new: true }
    ).populate('supplierName');

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
});

// Route to delete a product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
});

// Route to get suppliers (for dropdown)
router.get('/suppliers', async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch suppliers', error: err.message });
  }
});

module.exports = router;
