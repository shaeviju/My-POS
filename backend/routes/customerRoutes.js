const express = require('express');
const Customer = require('../models/customer');
const router = express.Router();

// Route to get all customers or search customers
router.get('/customers', async (req, res) => {
  const { search } = req.query;
  try {
    const customers = search
      ? await Customer.find({
          $or: [
            { nameBusiness: { $regex: search, $options: 'i' } },
            { nameOwner: { $regex: search, $options: 'i' } },
            { address: { $regex: search, $options: 'i' } },
            { city: { $regex: search, $options: 'i' } },
            { contactNo1: { $regex: search, $options: 'i' } },
            { contactNo2: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ],
        })
      : await Customer.find();

    res.json(customers);
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ message: 'Failed to fetch customers', error: err.message });
  }
});

// Route to add a new customer
router.post('/customers', async (req, res) => {
  const { nameBusiness, nameOwner, address, city, contactNo1, contactNo2, email, description } = req.body;

  // Ensure all fields are provided
  if (!nameBusiness || !nameOwner || !address || !city || !contactNo1 || !contactNo2 || !email || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newCustomer = new Customer({
    nameBusiness,
    nameOwner,
    address,
    city,
    contactNo1,
    contactNo2,
    email,
    description,
  });

  try {
    await newCustomer.save();
    res.status(201).json({ message: 'Customer added successfully' });
  } catch (err) {
    console.error('Error adding customer:', err);
    res.status(500).json({ message: 'Failed to add customer', error: err.message });
  }
});

// Route to delete a customer
router.delete('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (err) {
    console.error('Error deleting customer:', err);
    res.status(500).json({ message: 'Failed to delete customer', error: err.message });
  }
});

// Route to update a customer
router.put('/customers/:id', async (req, res) => {
  const { nameBusiness, nameOwner, address, city, contactNo1, contactNo2, email, description } = req.body;
  
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      { nameBusiness, nameOwner, address, city, contactNo1, contactNo2, email, description },
      { new: true } // Return the updated customer
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(updatedCustomer);
  } catch (err) {
    console.error('Error updating customer:', err);
    res.status(500).json({ message: 'Failed to update customer', error: err.message });
  }
});

module.exports = router;
