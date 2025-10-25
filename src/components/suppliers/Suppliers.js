import React, { useState, useEffect } from 'react';
import SupplierTable from './SupplierTable';
import SupplierForm from './SupplierForm';

const Suppliers = ({ db, currentUser }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadSuppliers();
  }, []);

  useEffect(() => {
    filterSuppliers();
  }, [suppliers, searchTerm, categoryFilter, statusFilter]);

  const loadSuppliers = () => {
    const suppliersData = db.getSuppliers();
    setSuppliers(suppliersData);
  };

  const filterSuppliers = () => {
    let filtered = suppliers;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(supplier => supplier.category === categoryFilter);
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(supplier => supplier.status === statusFilter);
    }
    
    setFilteredSuppliers(filtered);
  };

  const handleAddSupplier = () => {
    setEditingSupplier(null);
    setShowModal(true);
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier);
    setShowModal(true);
  };

  const handleDeleteSupplier = (supplierId) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      const success = db.deleteSupplier(supplierId);
      if (success) {
        db.addActivity({
          activity: "Supplier Deleted",
          user: currentUser.name,
          details: `Deleted supplier`
        });
        loadSuppliers();
        alert('Supplier deleted successfully!');
      }
    }
  };

  const handleSaveSupplier = (supplierData) => {
    if (editingSupplier) {
      // Update existing supplier
      const updatedSupplier = db.updateSupplier(editingSupplier.id, supplierData);
      if (updatedSupplier) {
        db.addActivity({
          activity: "Supplier Updated",
          user: currentUser.name,
          details: `Updated supplier "${updatedSupplier.name}"`
        });
        alert('Supplier updated successfully!');
      }
    } else {
      // Add new supplier
      const newSupplier = db.addSupplier(supplierData);
      db.addActivity({
        activity: "Supplier Added",
        user: currentUser.name,
        details: `Added new supplier "${newSupplier.name}"`
      });
      alert('Supplier added successfully!');
    }
    
    setShowModal(false);
    loadSuppliers();
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
            placeholder="Search suppliers..."
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
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
     
      {/* Suppliers Table */}
      <div className="inventory-table">
        <div className="table-header">
          <h3>Supplier List</h3>
          <div className="table-actions">
            <button className="btn btn-primary" onClick={handleAddSupplier}>
              <i className="fas fa-plus"></i> Add Supplier
            </button>
            <button className="btn btn-success">
              <i className="fas fa-file-export"></i> Export
            </button>
          </div>
        </div>
       
        <SupplierTable
          suppliers={filteredSuppliers}
          onEdit={handleEditSupplier}
          onDelete={handleDeleteSupplier}
        />
      </div>

      {/* Supplier Modal */}
      {showModal && (
        <SupplierForm
          supplier={editingSupplier}
          onSave={handleSaveSupplier}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Suppliers;