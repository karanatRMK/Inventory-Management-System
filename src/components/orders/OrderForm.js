import React, { useState, useEffect } from 'react';

const OrderForm = ({ order, onSave, onClose, db }) => {
  const [formData, setFormData] = useState({
    supplierId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    notes: '',
    items: [{ productId: '', quantity: '', price: '' }]
  });

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadSuppliersAndProducts();
    
    if (order) {
      setFormData({
        supplierId: order.supplierId,
        date: order.date,
        status: order.status,
        notes: order.notes || '',
        items: order.items.map(item => ({
          productId: item.productId.toString(),
          quantity: item.quantity.toString(),
          price: item.price.toString()
        }))
      });
    }
  }, [order]);

  const loadSuppliersAndProducts = () => {
    const suppliersData = db.getSuppliers();
    const productsData = db.getProducts();
    setSuppliers(suppliersData);
    setProducts(productsData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productId: '', quantity: '', price: '' }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        items: updatedItems
      }));
    } else {
      alert('An order must have at least one item.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const orderData = {
      supplierId: parseInt(formData.supplierId),
      date: formData.date,
      status: formData.status,
      notes: formData.notes,
      items: formData.items
        .filter(item => item.productId && item.quantity && item.price)
        .map(item => ({
          productId: parseInt(item.productId),
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price)
        }))
    };

    if (orderData.items.length === 0) {
      alert('Please add at least one valid item to the order.');
      return;
    }

    onSave(orderData);
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === parseInt(productId));
    return product ? product.name : 'Unknown Product';
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{order ? 'Edit Purchase Order' : 'Create Purchase Order'}</h3>
          <span className="close-modal" onClick={onClose}>&times;</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="orderSupplier">Supplier</label>
            <select
              id="orderSupplier"
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              required
            >
              <option value="">Select Supplier</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="orderDate">Order Date</label>
            <input
              type="date"
              id="orderDate"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="orderStatus">Status</label>
            <select
              id="orderStatus"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Shipped">Shipped</option>
              <option value="Received">Received</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Order Items</label>
            {formData.items.map((item, index) => (
              <div key={index} className="order-item" style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <select
                    value={item.productId}
                    onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                    style={{ flex: 2 }}
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} (₹{product.price})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    style={{ flex: 1 }}
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                    style={{ flex: 1 }}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeItem(index)}
                    style={{ flex: '0.5' }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                {item.productId && (
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    Product: {getProductName(item.productId)} | 
                    Subtotal: ₹{(parseFloat(item.quantity) * parseFloat(item.price) || 0).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
            <button type="button" className="btn btn-primary" onClick={addItem}>
              <i className="fas fa-plus"></i> Add Item
            </button>
          </div>
          
          <div className="form-group">
            <label htmlFor="orderNotes">Notes</label>
            <textarea
              id="orderNotes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {order ? 'Update Order' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;