import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    stock: '',
    unit: 'kg',
    price: '',
    expiryDate: '',
    description: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category,
        stock: product.stock,
        unit: product.unit,
        price: product.price,
        expiryDate: product.expiryDate || '',
        description: product.description || ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      stock: parseInt(formData.stock),
      unit: formData.unit,
      price: parseFloat(formData.price),
      expiryDate: formData.expiryDate || null,
      description: formData.description
    };

    onSave(productData);
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

  const units = ['kg', 'g', 'lb', 'pcs', 'pack', 'bottle', 'box'];

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
          <span className="close-modal" onClick={onClose}>&times;</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="productName">Product Name</label>
            <input
              type="text"
              id="productName"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="productSku">SKU</label>
            <input
              type="text"
              id="productSku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="productCategory">Category</label>
            <select
              id="productCategory"
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
            <label htmlFor="productStock">Current Stock</label>
            <input
              type="number"
              id="productStock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="productUnit">Unit</label>
            <select
              id="productUnit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
            >
              {units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="productPrice">Price (₹)</label>
            <input
              type="number"
              step="0.01"
              id="productPrice"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="productExpiry">Expiry Date</label>
            <input
              type="date"
              id="productExpiry"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="productDescription">Description</label>
            <textarea
              id="productDescription"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {product ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;