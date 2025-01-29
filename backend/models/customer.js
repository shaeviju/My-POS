const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  nameBusiness: { type: String, required: true },
  nameOwner: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  contactNo1: { type: String, required: true },
  contactNo2: { type: String, required: true },
  email: { type: String, required: true },
  description: { type: String, required: true }, 
});

module.exports = mongoose.model('Customer', customerSchema);
