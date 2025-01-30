import { useState, useEffect } from 'react';
import axios from 'axios';

const StockPage = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentProduct, setCurrentProduct] = useState({
    productName: '',
    productCode: '',
    buyingPrice: '',
    sellingPrice: '',
    quantity: '',
    supplierName: '',
    description: ''
  });

  // Fetch products from API and filter by searchQuery
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/products?search=${searchQuery}`);
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Fetch data when component mounts or search query changes
  useEffect(() => {
    fetchProducts();
  }, [searchQuery]);

  // Handle input field changes for product
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  // Handle form submission for updating product
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { buyingPrice, sellingPrice, quantity } = currentProduct;
    if (!buyingPrice || !sellingPrice || !quantity) {
      alert('Buying Price, Selling Price, and Quantity are required');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/products/${currentProduct._id}`, currentProduct);
      alert('Product updated successfully');
      setCurrentProduct({ productName: '', productCode: '', buyingPrice: '', sellingPrice: '', quantity: '', description: '', supplierName: '' });
      fetchProducts();
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  // Handle edit button click
  const handleEdit = (product) => {
    setCurrentProduct({
      ...product,
      supplierName: product.supplierName?._id,
    });
  };

  // Handle delete functionality
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      alert('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-1/3"
        />
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Product Name</th>
              <th className="px-4 py-2 text-left">Product Code</th>
              <th className="px-4 py-2 text-left">Buying Price</th>
              <th className="px-4 py-2 text-left">Selling Price</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Supplier Name</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{product.productName}</td>
                <td className="px-4 py-2">{product.productCode}</td>
                <td className="px-4 py-2">{product.buyingPrice}</td>
                <td className="px-4 py-2">{product.sellingPrice}</td>
                <td className="px-4 py-2">{product.quantity}</td>
                <td className="px-4 py-2">{product.supplierName?.name}</td>
                <td className="px-4 py-2">{product.description}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
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

      {/* Edit Product */}
      {currentProduct._id && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                name="productName"
                value={currentProduct.productName}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Code</label>
              <input
                type="text"
                name="productCode"
                value={currentProduct.productCode}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Buying Price</label>
              <input
                type="number"
                name="buyingPrice"
                value={currentProduct.buyingPrice}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Selling Price</label>
              <input
                type="number"
                name="sellingPrice"
                value={currentProduct.sellingPrice}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={currentProduct.quantity}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={currentProduct.description}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Update Product
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default StockPage;
