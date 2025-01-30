import { useState, useEffect } from "react";
import axios from "axios";

const SalesPage = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [grandTotal, setGrandTotal] = useState(0); // Grand total of all subtotals

  useEffect(() => {
    // Fetch customers and products when the component mounts
    const fetchData = async () => {
      try {
        const customerRes = await axios.get("http://localhost:5000/api/customers");
        setCustomers(customerRes.data);

        const productRes = await axios.get("http://localhost:5000/api/products");
        setProducts(productRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // Handle Customer Selection
  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    const customer = customers.find((c) => c._id === customerId);
    setSelectedCustomer(customer);
  };

  // Add product to cart
  const handleAddProduct = () => {
    if (!selectedProduct || quantity <= 0) {
      alert("Please select a product and enter quantity.");
      return;
    }

    const product = products.find((p) => p._id === selectedProduct);
    const newProduct = {
      ...product,
      quantity,
      sellingPrice: product.sellingPrice, // Default selling price
      subtotal: product.sellingPrice * quantity, // Calculate subtotal for this product
    };

    setCart([...cart, newProduct]);
    updateTotal(); // Recalculate grand total when product is added
  };

  // Edit quantity or price of a product in the cart
  const handleCartEdit = (index, field, value) => {
    const updatedCart = [...cart];
    updatedCart[index][field] = value;

    if (field === "quantity" || field === "sellingPrice") {
      updatedCart[index].subtotal = updatedCart[index].quantity * updatedCart[index].sellingPrice;
    }

    setCart(updatedCart);
    updateTotal(); // Recalculate grand total when any cart item is edited
  };

  // Delete a product from the cart
  const handleDeleteProduct = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    updateTotal(); // Recalculate grand total when a product is deleted
  };

  // Update grand total
  const updateTotal = () => {
    const newGrandTotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
    setGrandTotal(newGrandTotal); // Set the new grand total
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Customer Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Customer</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md"
          onChange={handleCustomerChange}
          value={selectedCustomer ? selectedCustomer._id : ""}
        >
          <option value="">Select Customer</option>
          {customers.map((customer) => (
            <option key={customer._id} value={customer._id}>
              {customer.nameOwner} ({customer.nameBusiness})
            </option>
          ))}
        </select>
      </div>

      {/* Customer Details */}
      {selectedCustomer && (
        <div className="mb-6">
          <p><strong>Address: </strong>{selectedCustomer.address}</p>
        </div>
      )}

      {/* Add Product to Cart */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Product</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md"
          onChange={(e) => setSelectedProduct(e.target.value)}
          value={selectedProduct}
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.productName} ({product.productCode})
            </option>
          ))}
        </select>
      </div>

      {/* Quantity */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Quantity</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Add to Cart Button */}
      <div className="mb-6">
        <button
          onClick={handleAddProduct}
          className="bg-blue-600 text-white p-2 rounded-md"
        >
          Add Product to Cart
        </button>
      </div>

      {/* Cart Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Product Name</th>
              <th className="px-4 py-2 text-left">Product Code</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Selling Price</th>
              <th className="px-4 py-2 text-left">Subtotal</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{item.productName}</td>
                <td className="px-4 py-2">{item.productCode}</td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleCartEdit(index, "quantity", e.target.value)}
                    className="p-2 border border-gray-300 rounded-md"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.sellingPrice}
                    onChange={(e) => handleCartEdit(index, "sellingPrice", e.target.value)}
                    className="p-2 border border-gray-300 rounded-md"
                  />
                </td>
                <td className="px-4 py-2">{item.subtotal}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDeleteProduct(index)}
                    className="bg-red-500 text-white p-2 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Grand Total */}
      <div className="mt-6">
        <p><strong>Grand Total: </strong>${grandTotal.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default SalesPage;
