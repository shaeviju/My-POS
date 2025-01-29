import { useState, useEffect } from "react";
import axios from "axios";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({
    productName: "",
    productCode: "",
    buyingPrice: "",
    sellingPrice: "",
    quantity: "",
    supplierName: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("view");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProductsAndSuppliers = async () => {
    try {
      const productRes = await axios.get(
        `http://localhost:5000/api/products?search=${searchQuery}`
      );
      setProducts(productRes.data);

      const supplierRes = await axios.get("http://localhost:5000/api/suppliers");
      setSuppliers(supplierRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchProductsAndSuppliers();
  }, [searchQuery]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { productName, productCode, buyingPrice, sellingPrice, quantity, supplierName, description } = currentProduct;

    if (!productName || !productCode || !buyingPrice || !sellingPrice || !quantity || !supplierName || !description) {
      alert("All fields are required");
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/products/${currentProduct._id}`, currentProduct);
        alert("Product updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/products", currentProduct);
        alert("Product added successfully");
      }

      setCurrentProduct({
        productName: "",
        productCode: "",
        buyingPrice: "",
        sellingPrice: "",
        quantity: "",
        supplierName: "",
        description: "",
      });
      setIsEditing(false);
      setActiveTab("view");

      fetchProductsAndSuppliers();
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setActiveTab("add");
    setCurrentProduct(product);
  };

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleDeleteConfirmation = (product) => {
    setShowDeleteConfirmation(true);
    setProductToDelete(product); // Set the product that needs to be deleted
  };

  const handleDelete = async () => {
    if (!productToDelete || !productToDelete._id) {
      alert("No product selected for deletion.");
      setShowDeleteConfirmation(false); // Close confirmation modal
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/products/${productToDelete._id}`);
      alert('Product deleted successfully');
      fetchProductsAndSuppliers();
      setShowDeleteConfirmation(false); // Close the confirmation modal
      setProductToDelete(null); // Clear the product reference
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Error deleting product');
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setProductToDelete(null); // Clear the product reference
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("view")}
          className={`px-6 py-2 text-lg font-medium rounded-md ${
            activeTab === "view"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          View Products
        </button>
        <button
          onClick={() => setActiveTab("add")}
          className={`px-6 py-2 text-lg font-medium rounded-md ${
            activeTab === "add"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {isEditing ? "Edit Product" : "Add Product"}
        </button>
      </div>

      {activeTab === "view" && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-1/3"
          />
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg">Are you sure you want to delete this product?</p>
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

      {activeTab === "view" && (
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
                  <td className="px-4 py-2">
                    {product.supplierName ? product.supplierName.name : "N/A"}
                  </td>{" "}
                  <td className="px-4 py-2">{product.description}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteConfirmation(product)}
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

      {activeTab === "add" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            {isEditing ? "Edit Product" : "Add Product"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                name="productName"
                value={currentProduct.productName}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                required
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
                required
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
              <label className="block text-sm font-medium text-gray-700">Supplier</label>
              <select
                name="supplierName"
                value={currentProduct.supplierName}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
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
              {isEditing ? "Update Product" : "Add Product"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
