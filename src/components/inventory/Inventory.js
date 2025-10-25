import React, { useState, useEffect } from 'react';
import ProductTable from './ProductTable';
import ProductForm from './ProductForm';

const Inventory = ({ db, currentUser }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter, stockFilter]);

  const loadProducts = () => {
    const productsData = db.getProducts();
    setProducts(productsData);
  };

  const filterProducts = () => {
    let filtered = products;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    // Apply stock filter
    if (stockFilter) {
      const settings = db.getSettings();
      const criticalThreshold = settings.criticalStockThreshold || 5;
      const lowThreshold = settings.lowStockThreshold || 10;
      
      switch (stockFilter) {
        case 'in_stock':
          filtered = filtered.filter(product => product.stock > lowThreshold);
          break;
        case 'low_stock':
          filtered = filtered.filter(product => product.stock <= lowThreshold && product.stock > 0);
          break;
        case 'out_of_stock':
          filtered = filtered.filter(product => product.stock === 0);
          break;
        case 'expiring_soon':
          const expiringProducts = db.getProductsNearExpiry();
          filtered = filtered.filter(product => 
            expiringProducts.some(p => p.id === product.id)
          );
          break;
        default:
          break;
      }
    }
    
    setFilteredProducts(filtered);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const success = db.deleteProduct(productId);
      if (success) {
        db.addActivity({
          activity: "Product Deleted",
          user: currentUser.name,
          details: `Deleted product`
        });
        loadProducts();
        alert('Product deleted successfully!');
      }
    }
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      // Update existing product
      const updatedProduct = db.updateProduct(editingProduct.id, productData);
      if (updatedProduct) {
        db.addActivity({
          activity: "Product Updated",
          user: currentUser.name,
          details: `Updated product "${updatedProduct.name}"`
        });
        alert('Product updated successfully!');
      }
    } else {
      // Add new product
      const newProduct = db.addProduct(productData);
      db.addActivity({
        activity: "Product Added",
        user: currentUser.name,
        details: `Added new product "${newProduct.name}"`
      });
      alert('Product added successfully!');
    }
    
    setShowModal(false);
    loadProducts();
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
    <div>
      {/* Search and Filters */}
      <div className="search-filter">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Stock Status:</label>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="expiring_soon">Expiring Soon</option>
          </select>
        </div>
      </div>
     
      {/* Inventory Table */}
      <div className="inventory-table">
        <div className="table-header">
          <h3>Product Inventory</h3>
          <div className="table-actions">
            <button className="btn btn-primary" onClick={handleAddProduct}>
              <i className="fas fa-plus"></i> Add Product
            </button>
            <button className="btn btn-success">
              <i className="fas fa-file-export"></i> Export
            </button>
          </div>
        </div>
       
        <ProductTable
          products={filteredProducts}
          db={db}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      </div>

      {/* Product Modal */}
      {showModal && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Inventory;