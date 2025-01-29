import { useState, useEffect } from 'react';
import axios from 'axios';

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [currentSupplier, setCurrentSupplier] = useState({
    name: '',
    address: '',
    contactNo: '',
    email: '',
    description: '' // Add description field here
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('view'); // 'view' or 'add'
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // For delete confirmation
  const [supplierToDelete, setSupplierToDelete] = useState(null); // Store supplier id to delete

  // Fetch suppliers when the component mounts
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/suppliers');
        setSuppliers(data);
      } catch (err) {
        console.error('Error fetching suppliers:', err);
      }
    };
    fetchSuppliers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSupplier({ ...currentSupplier, [name]: value });
  };

  // Handle form submission for adding/updating supplier
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentSupplier.name || !currentSupplier.address || !currentSupplier.contactNo || !currentSupplier.email || !currentSupplier.description) {
      setError('All fields are required');
      return;
    }

    try {
      if (isEditing) {
        // Update supplier
        await axios.put(`http://localhost:5000/api/suppliers/${currentSupplier._id}`, currentSupplier);
        setSuccess('Supplier updated successfully');
      } else {
        // Add new supplier
        await axios.post('http://localhost:5000/api/suppliers', currentSupplier);
        setSuccess('Supplier added successfully');
      }

      setCurrentSupplier({ name: '', address: '', contactNo: '', email: '', description: '' });
      setIsEditing(false);

      // Re-fetch the supplier list
      const { data } = await axios.get('http://localhost:5000/api/suppliers');
      setSuppliers(data);
    } catch (err) {
      setError('Failed to save supplier');
      setSuccess('');
    }
  };

  // Handle editing a supplier
  const handleEdit = (supplier) => {
    setIsEditing(true);
    setActiveTab('add');
    setCurrentSupplier(supplier);
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = (supplierId) => {
    setShowDeleteConfirmation(true);
    setSupplierToDelete(supplierId); // Store supplier id to delete
  };

  // Handle deleting a supplier
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/suppliers/${supplierToDelete}`);
      setSuccess('Supplier deleted successfully');

      // Re-fetch the supplier list
      const { data } = await axios.get('http://localhost:5000/api/suppliers');
      setSuppliers(data);

      // Close confirmation dialog
      setShowDeleteConfirmation(false);
      setSupplierToDelete(null);
    } catch (err) {
      setError('Failed to delete supplier');
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setSupplierToDelete(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-center space-x-4 mb-6">
        {/* Tab Navigation */}
        <button
          onClick={() => setActiveTab('view')}
          className={`px-6 py-2 text-lg font-medium rounded-lg focus:outline-none ${
            activeTab === 'view' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          View Suppliers
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`px-6 py-2 text-lg font-medium rounded-lg focus:outline-none ${
            activeTab === 'add' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {isEditing ? 'Edit Supplier' : 'Add Supplier'}
        </button>
      </div>

      {success && <p className="text-green-500 text-center">{success}</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* View Suppliers Tab */}
      {activeTab === 'view' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Supplier List</h2>
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Contact No</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier._id}>
                  <td className="px-4 py-2">{supplier.name}</td>
                  <td className="px-4 py-2">{supplier.address}</td>
                  <td className="px-4 py-2">{supplier.contactNo}</td>
                  <td className="px-4 py-2">{supplier.email}</td>
                  <td className="px-4 py-2">{supplier.description}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(supplier)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteConfirmation(supplier._id)}
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

      {/* Add/Edit Supplier Tab */}
      {activeTab === 'add' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Edit Supplier' : 'Add Supplier'}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={currentSupplier.name}
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
                value={currentSupplier.address}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700">Contact No</label>
              <input
                type="text"
                name="contactNo"
                id="contactNo"
                value={currentSupplier.contactNo}
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
                value={currentSupplier.email}
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
                value={currentSupplier.description}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              {isEditing ? 'Update Supplier' : 'Add Supplier'}
            </button>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg">Are you sure you want to delete this supplier?</p>
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

export default SuppliersPage;
