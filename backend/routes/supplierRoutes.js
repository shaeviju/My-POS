const express = require('express');
const Supplier = require('../models/supplier');
const router = express.Router();

// Route to get all suppliers
router.get('/suppliers', async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch suppliers', error: err.message });
  }
});

// Route to add a new supplier
router.post('/suppliers', async (req, res) => {
  const { name, address, contactNo, email } = req.body;

  const newSupplier = new Supplier({
    name,
    address,
    contactNo,
    email,
  });

  try {
    await newSupplier.save();
    res.status(201).json({ message: 'Supplier added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add supplier', error: err.message });
  }
});

// Route to delete a supplier
router.delete('/suppliers/:id', async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Supplier deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete supplier', error: err.message });
  }
});

// Route to update a supplier
router.put('/suppliers/:id', async (req, res) => {
  const { name, address, contactNo, email } = req.body;
  
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { name, address, contactNo, email },
      { new: true }
    );
    res.status(200).json(supplier);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update supplier', error: err.message });
  }
});

module.exports = router;
