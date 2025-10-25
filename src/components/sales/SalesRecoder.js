import React, { useState, useEffect } from 'react';

const SalesRecorder = ({ db, currentUser, onSaleRecorded }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customer, setCustomer] = useState('Retail Customer');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const productsData = db.getProducts();
    setProducts(productsData);
  };

  const handleRecordSale = () => {
    if (!selectedProduct) {
      alert('Please select a product');
      return;
    }

    try {
      const sale = db.recordSale(parseInt(selectedProduct), parseInt(quantity), customer);
      alert(`Sale recorded successfully! Amount: ₹${sale.amount}`);
      
      // Reset form
      setSelectedProduct('');
      setQuantity(1);
      setCustomer('Retail Customer');
      
      // Notify parent component
      if (onSaleRecorded) {
        onSaleRecorded();
      }
    } catch (error) {
      alert(`Error recording sale: ${error.message}`);
    }
  };

  const getSelectedProduct = () => {
    return products.find(p => p.id === parseInt(selectedProduct));
  };

  const selectedProductData = getSelectedProduct();
  const totalAmount = selectedProductData ? selectedProductData.price * quantity : 0;

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div className="card-header">
        <h3>Record New Sale</h3>
      </div>
      <div style={{ padding: '20px' }}>
        <div className="form-group">
          <label>Product</label>
          <select 
            value={selectedProduct} 
            onChange={(e) => setSelectedProduct(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="">Select Product</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} - Stock: {product.stock} {product.unit} - ₹{product.price}
              </option>
            ))}
          </select>
        </div>
        
        {selectedProductData && (
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '10px', 
            borderRadius: '4px',
            marginBottom: '15px'
          }}>
            <strong>Product Info:</strong> 
            {selectedProductData.stock < (db.getSettings().lowStockThreshold || 10) && (
              <span style={{ color: '#e74c3c', marginLeft: '10px' }}>
                <i className="fas fa-exclamation-triangle"></i> Low Stock
              </span>
            )}
          </div>
        )}
        
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            max={selectedProductData ? selectedProductData.stock : 1}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        
        <div className="form-group">
          <label>Customer</label>
          <input
            type="text"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="Customer name"
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        
        {selectedProductData && (
          <div style={{ 
            backgroundColor: '#27ae60', 
            color: 'white',
            padding: '10px', 
            borderRadius: '4px',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            <strong>Total Amount: ₹{totalAmount.toLocaleString()}</strong>
          </div>
        )}
        
        <button 
          className="btn btn-primary" 
          onClick={handleRecordSale}
          disabled={!selectedProduct}
          style={{ width: '100%' }}
        >
          <i className="fas fa-cash-register"></i> Record Sale
        </button>
      </div>
    </div>
  );
};

export default SalesRecorder;