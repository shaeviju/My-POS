import { useState, useEffect } from 'react';
import axios from 'axios';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [currentCustomer, setCurrentCustomer] = useState({
    nameBusiness: '',
    nameOwner: '',
    address: '',
    city: '',
    contactNo1: '',
    contactNo2: '',
    email: '',
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('view');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Fetch customers when the component mounts or when search query changes
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/customers?search=${searchQuery}`);
        setCustomers(data);
      } catch (err) {
        console.error('Error fetching customers:', err);
      }
    };
    fetchCustomers();
  }, [searchQuery]); // Re-fetch when searchQuery changes

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCustomer({ ...currentCustomer, [name]: value });
  };

  // Handle form submission for adding/updating Customer
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentCustomer.nameBusiness || !currentCustomer.nameOwner || !currentCustomer.address || !currentCustomer.city || !currentCustomer.contactNo1 || !currentCustomer.contactNo2 || !currentCustomer.email || !currentCustomer.description) {
      setError('All fields are required');
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/customers/${currentCustomer._id}`, currentCustomer);
        setSuccess('Customer updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/customers', currentCustomer);
        setSuccess('Customer added successfully');
      }

      setCurrentCustomer({ nameBusiness: '', nameOwner: '', address: '', city: '', contactNo1: '' , contactNo2: '', email: '', description: '' });
      setIsEditing(false);

      // Re-fetch the customers list
      const { data } = await axios.get(`http://localhost:5000/api/customers?search=${searchQuery}`);
      setCustomers(data);
    } catch (err) {
      setError('Failed to save customer');
      setSuccess('');
    }
  };

  // Handle editing a customer
  const handleEdit = (customer) => {
    setIsEditing(true);
    setActiveTab('add');
    setCurrentCustomer(customer); // Corrected: setCurrentCustomer instead of setCurrentCustomers
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = (customerId) => {
    setShowDeleteConfirmation(true);
    setCustomerToDelete(customerId); // Corrected: setCustomerToDelete
  };

  // Handle deleting a customer
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/customers/${customerToDelete}`);
      setSuccess('Customer deleted successfully');

      // Re-fetch the customer list
      const { data } = await axios.get(`http://localhost:5000/api/customers?search=${searchQuery}`);
      setCustomers(data);

      setShowDeleteConfirmation(false);
      setCustomerToDelete(null);
    } catch (err) {
      setError('Failed to delete customer');
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setCustomerToDelete(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Search Input */}
      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="Search Customer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded-lg w-1/3"
        />

        {/* Tab Navigation */}
        <div className="space-x-4">
          <button
            onClick={() => setActiveTab('view')}
            className={`px-6 py-2 text-lg font-medium rounded-lg focus:outline-none ${
              activeTab === 'view' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            View Customers
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-6 py-2 text-lg font-medium rounded-lg focus:outline-none ${
              activeTab === 'add' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {isEditing ? 'Edit Customer' : 'Add Customer'}
          </button>
        </div>
      </div>

      {success && <p className="text-green-500 text-center">{success}</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* View Customers Tab */}
      {activeTab === 'view' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Customer List</h2>
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Business Name</th>
                <th className="px-4 py-2 text-left">Owner Name</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">City</th>
                <th className="px-4 py-2 text-left">Contact No</th>
                <th className="px-4 py-2 text-left">WhatsApp No</th>
                <th className="px-4 py-2 text-left">E-mail</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td className="px-4 py-2">{customer.nameBusiness}</td>
                  <td className="px-4 py-2">{customer.nameOwner}</td>
                  <td className="px-4 py-2">{customer.address}</td>
                  <td className="px-4 py-2">{customer.city}</td>
                  <td className="px-4 py-2">{customer.contactNo1}</td>
                  <td className="px-4 py-2">{customer.contactNo2}</td>
                  <td className="px-4 py-2">{customer.email}</td>
                  <td className="px-4 py-2">{customer.description}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteConfirmation(customer._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Customer Tab */}
      {activeTab === 'add' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Edit Customer' : 'Add Customer'}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nameBusiness" className="block text-sm font-medium text-gray-700">Business Name</label>
              <input
                type="text"
                name="nameBusiness"
                id="nameBusiness"
                value={currentCustomer.nameBusiness}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="nameOwner" className="block text-sm font-medium text-gray-700">Owner Name</label>
              <input
                type="text"
                name="nameOwner"
                id="nameOwner"
                value={currentCustomer.nameOwner}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                id="address"
                value={currentCustomer.address}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                id="city"
                value={currentCustomer.city}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="contactNo1" className="block text-sm font-medium text-gray-700">Contact No</label>
              <input
                type="text"
                name="contactNo1"
                id="contactNo1"
                value={currentCustomer.contactNo1}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="contactNo2" className="block text-sm font-medium text-gray-700">WhatsApp No</label>
              <input
                type="text"
                name="contactNo2"
                id="contactNo2"
                value={currentCustomer.contactNo2}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={currentCustomer.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                id="description"
                value={currentCustomer.description}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              {isEditing ? 'Update Customer' : 'Add Customer'}
            </button>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg">Are you sure you want to delete this Customer?</p>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
