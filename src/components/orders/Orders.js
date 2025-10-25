import React, { useState, useEffect } from 'react';
import OrderTable from './OrderTable';
import OrderForm from './OrderForm';

const Orders = ({ db, currentUser }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const loadOrders = () => {
    const ordersData = db.getOrders();
    setOrders(ordersData);
  };

  const filterOrders = () => {
    let filtered = orders;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Apply date filter
    if (dateFilter) {
      const today = new Date().toISOString().split('T')[0];
      const currentWeek = getWeekNumber(new Date());
      const currentMonth = new Date().getMonth() + 1;
      const currentQuarter = Math.floor((new Date().getMonth() + 3) / 3);
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(order => order.date === today);
          break;
        case 'week':
          filtered = filtered.filter(order => {
            const orderWeek = getWeekNumber(new Date(order.date));
            return orderWeek === currentWeek && new Date(order.date).getFullYear() === new Date().getFullYear();
          });
          break;
        case 'month':
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate.getMonth() + 1 === currentMonth && orderDate.getFullYear() === new Date().getFullYear();
          });
          break;
        case 'quarter':
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.date);
            const orderQuarter = Math.floor((orderDate.getMonth() + 3) / 3);
            return orderQuarter === currentQuarter && orderDate.getFullYear() === new Date().getFullYear();
          });
          break;
        default:
          break;
      }
    }
    
    setFilteredOrders(filtered);
  };

  const handleAddOrder = () => {
    setEditingOrder(null);
    setShowModal(true);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setShowModal(true);
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      const success = db.deleteOrder(orderId);
      if (success) {
        db.addActivity({
          activity: "Order Deleted",
          user: currentUser.name,
          details: `Deleted order`
        });
        loadOrders();
        alert('Order deleted successfully!');
      }
    }
  };

  const handleSaveOrder = (orderData) => {
    if (editingOrder) {
      // Update existing order
      const updatedOrder = db.updateOrder(editingOrder.id, orderData);
      if (updatedOrder) {
        db.addActivity({
          activity: "Order Updated",
          user: currentUser.name,
          details: `Updated order ${updatedOrder.poNumber}`
        });
        alert('Order updated successfully!');
      }
    } else {
      // Add new order
      const newOrder = db.addOrder(orderData);
      db.addActivity({
        activity: "Order Created",
        user: currentUser.name,
        details: `Created new order ${newOrder.poNumber}`
      });
      alert('Order created successfully!');
    }
    
    setShowModal(false);
    loadOrders();
  };

  // Helper function to get week number
  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  return (
    <div>
      {/* Search and Filters */}
      <div className="search-filter">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Shipped">Shipped</option>
            <option value="Received">Received</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Date Range:</label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
      </div>
     
      {/* Orders Table */}
      <div className="inventory-table">
        <div className="table-header">
          <h3>Purchase Orders</h3>
          <div className="table-actions">
            <button className="btn btn-primary" onClick={handleAddOrder}>
              <i className="fas fa-plus"></i> New Order
            </button>
            <button className="btn btn-success">
              <i className="fas fa-file-export"></i> Export
            </button>
          </div>
        </div>
       
        <OrderTable
          orders={filteredOrders}
          onEdit={handleEditOrder}
          onDelete={handleDeleteOrder}
        />
      </div>

      {/* Order Modal */}
      {showModal && (
        <OrderForm
          order={editingOrder}
          onSave={handleSaveOrder}
          onClose={() => setShowModal(false)}
          db={db}
        />
      )}
    </div>
  );
};

export default Orders;