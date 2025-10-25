import React, { useState, useEffect } from 'react';

const SupplierForm = ({ supplier, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    phone: '',
    email: '',
    category: '',
    products: '',
    status: 'Active',
    address: ''
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        contact: supplier.contact,
        phone: supplier.phone,
        email: supplier.email,
        category: supplier.category,
        products: supplier.products,
        status: supplier.status,
        address: supplier.address || ''
      });
    }
  }, [supplier]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const categories = [
    'Fruits & Vegetables',
    'Dairy & Eggs',
    'Meat & Poultry',
    'Bakery',
    'Beverages',
    'Snacks',
    'Household'
  ];

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{supplier ? 'Edit Supplier' : 'Add New Supplier'}</h3>
          <span className="close-modal" onClick={onClose}>&times;</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="supplierName">Supplier Name</label>
            <input
              type="text"
              id="supplierName"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="supplierContact">Contact Person</label>
            <input
              type="text"
              id="supplierContact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="supplierPhone">Phone</label>
            <input
              type="tel"
              id="supplierPhone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="supplierEmail">Email</label>
            <input
              type="email"
              id="supplierEmail"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="supplierCategory">Category</label>
            <select
              id="supplierCategory"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="supplierProducts">Products Supplied</label>
            <input
              type="text"
              id="supplierProducts"
              name="products"
              value={formData.products}
              onChange={handleChange}
              placeholder="e.g., Fruits, Vegetables, Dairy"
            />
          </div>
          <div className="form-group">
            <label htmlFor="supplierStatus">Status</label>
            <select
              id="supplierStatus"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="supplierAddress">Address</label>
            <textarea
              id="supplierAddress"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {supplier ? 'Update Supplier' : 'Save Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierForm;