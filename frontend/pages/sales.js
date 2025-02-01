import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const SalesPage = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [grandTotal, setGrandTotal] = useState(0);
  const [customerAddress, setCustomerAddress] = useState('');
  const [notification, setNotification] = useState(null);
  const [invoiceNo, setInvoiceNo] = useState(''); // Invoice number state
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false); // Track if invoice is generated

  // For the invoice printing functionality
  const invoiceRef = useRef();

  // Fetch Customers and Products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await axios.get('http://localhost:5000/api/customers');
        setCustomers(customersResponse.data);

        const productsResponse = await axios.get('http://localhost:5000/api/products');
        setProducts(productsResponse.data);
      } catch (err) {
        console.error('Error fetching data', err);
      }
    };
    fetchData();
  }, []);

  // Handle Customer Change (Auto-fetch Address)
  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    const customer = customers.find((c) => c._id === customerId);
    setSelectedCustomer(customerId);
    setCustomerAddress(customer?.address || '');
  };

  // Add Product to Cart
  const handleAddToCart = (productId, quantity) => {
    const product = products.find(p => p._id === productId);
    const newProduct = {
      productId: product._id,
      productName: product.productName,
      sellingPrice: product.sellingPrice,
      quantity: quantity,
      subtotal: product.sellingPrice * quantity,
    };
    setCart([...cart, newProduct]);

    // Update the grand total
    updateGrandTotal([...cart, newProduct]);

    // Show notification that item has been added to the cart
    setNotification({ type: 'success', message: `Added ${product.productName} to the cart!` });

    // Automatically hide the notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 1000);
  };

  // Update Grand Total
  const updateGrandTotal = (cartItems) => {
    const total = cartItems.reduce((acc, item) => acc + item.subtotal, 0);
    setGrandTotal(total);
  };

  // Edit Cart Item (Quantity or Selling Price)
  const handleEditCartItem = (index, field, value) => {
    const updatedCart = [...cart];
    updatedCart[index][field] = value;
    updatedCart[index].subtotal = updatedCart[index].quantity * updatedCart[index].sellingPrice;
    setCart(updatedCart);

    updateGrandTotal(updatedCart);
  };

  // Delete Cart Item
  const handleDeleteCartItem = (index) => {
    setShowDeleteConfirmation(true);
    setItemToDelete(index); // Set the index of the item to delete
  };

  // Confirm Deletion
  const handleDeleteConfirm = () => {
    const updatedCart = cart.filter((_, index) => index !== itemToDelete);
    setCart(updatedCart);
    setShowDeleteConfirmation(false);
    setItemToDelete(null);

    updateGrandTotal(updatedCart);
  };

  // Cancel Deletion
  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
    setItemToDelete(null);
  };

  // Generate PDF Invoice
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text('Invoice', 105, 20, null, null, 'center');

    // Add customer details
    doc.setFontSize(12);
    doc.text(`Invoice No: ${invoiceNo}`, 20, 40); // Ensure the invoice number is printed here
    doc.text(`Customer: ${customers.find(c => c._id === selectedCustomer)?.nameOwner}`, 20, 50);
    doc.text(`Business Name: ${customers.find(c => c._id === selectedCustomer)?.nameBusiness}`, 20, 60);
    doc.text(`Address: ${customerAddress}`, 20, 70);

    // Add table for products
    const startY = 80;
    doc.text('Product Name', 20, startY);
    doc.text('Quantity', 80, startY);
    doc.text('Unit Price', 120, startY);
    doc.text('Subtotal', 160, startY);

    let y = startY + 10;
    cart.forEach(item => {
      doc.text(item.productName, 20, y);
      doc.text(item.quantity.toString(), 80, y);
      doc.text(item.sellingPrice.toString(), 120, y);
      doc.text(item.subtotal.toString(), 160, y);
      y += 10;
    });

    // Add Grand Total
    doc.text(`Grand Total: ${grandTotal}`, 20, y + 20);

    // Save the PDF
    doc.save('invoice.pdf');
  };

  // Confirm and Save Invoice
  const handleConfirmAndPrint = async () => {
    try {
      const invoiceData = {
        customerId: selectedCustomer,
        products: cart,
      };

      const response = await axios.post('http://localhost:5000/api/invoices', invoiceData);
      setInvoiceNo(response.data.invoiceNo); // Set the generated invoice number from backend response
      setInvoiceGenerated(true); // Disable the button and show invoice number message
      setNotification({ type: 'success', message: `Invoice Created Successfully! Invoice No: ${response.data.invoiceNo}` });
      handleDownloadPDF(); // Immediately print the invoice PDF after saving

      setTimeout(() => {
        setNotification(null);
      }, 1000);
      // Clear cart after printing
      setCart([]);

      // Reset form after printing
      setSelectedCustomer('');
      setSelectedProduct('');
      setQuantity(1);
      setGrandTotal(0);
      setCustomerAddress('');
      setInvoiceNo('');
      setInvoiceGenerated(false); // Reset invoice generated state
    } catch (error) {
      console.error('Error saving invoice:', error);
      setNotification({ type: 'error', message: 'Error: Could not save invoice' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-0 left-1/2 transform -translate-x-1/2 p-4 rounded-md shadow-lg w-96 ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {notification.message}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="space-x-4 mb-6">
        <button onClick={() => setActiveTab('add')} className={`px-6 py-2 ${activeTab === 'add' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Add Items to Cart</button>
        <button onClick={() => setActiveTab('view')} className={`px-6 py-2 ${activeTab === 'view' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>View Cart</button>
        <button onClick={() => setActiveTab('invoice')} className={`px-6 py-2 ${activeTab === 'invoice' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Find Invoice</button>
      </div>

      {/* Tab Content */}
      {activeTab === 'add' && (
        <div>
          {/* Customer Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Select Customer</label>
            <select className="w-full p-2 border rounded" value={selectedCustomer} onChange={handleCustomerChange}>
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>{customer.nameOwner} ({customer.nameBusiness})</option>
              ))}
            </select>
          </div>

          {/* Customer Address */}
          {customerAddress && (
            <div className="mb-4">
              <p><strong>Customer Address:</strong> {customerAddress}</p>
            </div>
          )}

          {/* Product Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Select Product</label>
            <select className="w-full p-2 border rounded" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>{product.productName} ({product.productCode})</option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Add Product to Cart Button */}
          <div>
            <button onClick={() => handleAddToCart(selectedProduct, quantity)} className="bg-blue-600 text-white p-2 rounded-lg">Add to Cart</button>
          </div>
        </div>
      )}

      {activeTab === 'view' && (
        <div>
          {/* Cart */}
          <h3 className="text-2xl mb-4">Cart</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Product Name</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Selling Price</th>
                <th className="border px-4 py-2">Subtotal</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{item.productName}</td>
                  <td className="border px-4 py-2">{item.quantity}</td>
                  <td className="border px-4 py-2">{item.sellingPrice}</td>
                  <td className="border px-4 py-2">{item.subtotal}</td>
                  <td className="border px-4 py-2">
                    <button onClick={() => handleDeleteCartItem(index)} className="bg-red-500 text-white p-2 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Grand Total Display */}
          <div className="mt-4">
            <p><strong>Grand Total: </strong>{grandTotal}</p>
          </div>

          {/* Confirm and Save Invoice Button */}
          <div className="mt-4">
            <button  
              onClick={handleConfirmAndPrint}  
              className="bg-blue-600 text-white p-2 rounded-lg" 
              disabled={invoiceGenerated}> 
              {invoiceGenerated ? `Invoice no ${invoiceNo} Generated` : 'Confirm and Print Invoice'}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg">Are you sure you want to delete this item?</p>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={handleDeleteCancel}
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

export default SalesPage;
