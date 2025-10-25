import React, { useState, useEffect } from 'react';
import DashboardCard from '../common/DashboardCard';

const Dashboard = ({ db, currentUser }) => {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    expiringProducts: 0,
    todaySales: 0,
    todayPurchases: 0,
    newOrdersToday: 0,
    pendingOrders: 0,
    monthlySales: 0,
    monthlyPurchases: 0,
    salesGrowth: 0,
    purchaseGrowth: 0,
    topProduct: { product: '', sales: 0 },
    inventoryValue: 0,
    avgDailySales: 0,
    salesTrend: 0,
    lastUpdate: Date.now()
  });

  const [activities, setActivities] = useState([]);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [saleQuantity, setSaleQuantity] = useState(1);
  const [saleCustomer, setSaleCustomer] = useState('Walk-in Customer');
  const [isLoading, setIsLoading] = useState(false);

  // Load dashboard data
  const loadDashboardData = () => {
    setIsLoading(true);
    
    try {
      const settings = db.getSettings();
      const totalProducts = db.getProducts().length;
      const lowStockItems = db.getLowStockItems();
      const expiringProducts = db.getProductsNearExpiry().length;
      const todaySales = db.getTodaySales();
      const todayPurchases = db.getTodayPurchases ? db.getTodayPurchases() : 0;
      const newOrdersToday = db.getNewOrdersToday();
      const pendingOrders = db.getPendingOrders();
      const monthlySales = db.getMonthlySales();
      const monthlyPurchases = db.getMonthlyPurchases ? db.getMonthlyPurchases() : 0;
      const salesGrowth = db.getSalesGrowth();
      const purchaseGrowth = db.getPurchaseGrowth ? db.getPurchaseGrowth() : 15;
      const topProduct = db.getTopProduct();
      const inventoryValue = db.getInventoryValue();
      const avgDailySales = db.getAverageDailySales();
      const salesTrend = db.getSalesTrend();
      const activitiesData = db.getActivities();

      setDashboardData({
        totalProducts,
        lowStockItems,
        expiringProducts,
        todaySales,
        todayPurchases,
        newOrdersToday,
        pendingOrders,
        monthlySales,
        monthlyPurchases,
        salesGrowth,
        purchaseGrowth,
        topProduct,
        inventoryValue,
        avgDailySales,
        salesTrend,
        lastUpdate: Date.now()
      });

      setActivities(activitiesData.slice(0, 10));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Main effect - load data on mount and set up real-time updates
  useEffect(() => {
    loadDashboardData();

    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(loadDashboardData, 30000);

    // Refresh when page becomes visible (user comes back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadDashboardData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Listen for custom events from other components
    const handleDataUpdate = () => {
      loadDashboardData();
    };

    window.addEventListener('dashboardRefresh', handleDataUpdate);
    window.addEventListener('purchaseOrderUpdated', handleDataUpdate);
    window.addEventListener('saleRecorded', handleDataUpdate);
    window.addEventListener('productUpdated', handleDataUpdate);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('dashboardRefresh', handleDataUpdate);
      window.removeEventListener('purchaseOrderUpdated', handleDataUpdate);
      window.removeEventListener('saleRecorded', handleDataUpdate);
      window.removeEventListener('productUpdated', handleDataUpdate);
    };
  }, []);

  // Listen for hash changes (navigation between sections)
  useEffect(() => {
    const handleHashChange = () => {
      // Refresh when returning to dashboard
      if (window.location.hash === '#dashboard' || window.location.hash === '' || window.location.hash === '#/') {
        setTimeout(loadDashboardData, 100); // Small delay to ensure DOM is ready
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const recordSale = () => {
    if (!selectedProduct) {
      alert('Please select a product');
      return;
    }

    const product = db.getProduct(parseInt(selectedProduct));
    if (!product) {
      alert('Product not found');
      return;
    }

    if (product.stock < saleQuantity) {
      alert(`Insufficient stock! Only ${product.stock} ${product.unit} available.`);
      return;
    }

    try {
      // Use the recordSale method from database
      const sale = db.recordSale(parseInt(selectedProduct), parseInt(saleQuantity), saleCustomer);
      
      alert(`Sale recorded successfully! Amount: ₹${sale.amount}`);

      // Trigger global update event
      window.dispatchEvent(new CustomEvent('saleRecorded'));
      window.dispatchEvent(new CustomEvent('dashboardRefresh'));

      // Reset form and refresh data
      setSelectedProduct('');
      setSaleQuantity(1);
      setSaleCustomer('Walk-in Customer');
      setShowSaleForm(false);
      loadDashboardData();
    } catch (error) {
      alert(`Error recording sale: ${error.message}`);
    }
  };

  // Fixed navigation functions
  const navigateToInventory = () => {
    window.location.hash = '#inventory';
  };

  const navigateToOrders = () => {
    window.location.hash = '#orders';
  };

  const navigateToSuppliers = () => {
    window.location.hash = '#suppliers';
  };

  const products = db.getProducts();
  const inStockProducts = products.filter(p => p.stock > 0);

  // Updated cards array - removed Today's Sales and Monthly Sales
  const cards = [
    {
      title: 'Total Products',
      value: dashboardData.totalProducts.toLocaleString(),
      footer: `${inStockProducts.length} in stock`,
      icon: 'fas fa-box',
      color: '#3498db'
    },
    {
      title: 'Low Stock',
      value: dashboardData.lowStockItems,
      footer: 'Items need reordering',
      icon: 'fas fa-exclamation-triangle',
      color: '#f39c12'
    },
    {
      title: 'Expiring Soon',
      value: dashboardData.expiringProducts,
      footer: dashboardData.expiringProducts > 0 ? 'Check inventory for discounts' : 'No products expiring soon',
      icon: 'fas fa-hourglass-end',
      color: '#e74c3c'
    },
    {
      title: "Today's Purchases",
      value: `₹${dashboardData.todayPurchases.toLocaleString()}`,
      footer: `${dashboardData.newOrdersToday} new orders today`,
      icon: 'fas fa-shopping-cart',
      color: '#9b59b6'
    },
    {
      title: "Pending Orders",
      value: dashboardData.pendingOrders,
      footer: 'Awaiting approval/receipt',
      icon: 'fas fa-clipboard-list',
      color: '#e67e22'
    },
    {
      title: "Inventory Value",
      value: `₹${dashboardData.inventoryValue.toLocaleString()}`,
      footer: `Based on current stock`,
      icon: 'fas fa-warehouse',
      color: '#34495e'
    }
  ];

  return (
    <div>
      {/* Loading Indicator */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          backgroundColor: '#3498db',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '4px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <i className="fas fa-sync-alt fa-spin"></i>
          Updating Dashboard...
        </div>
      )}

      {/* Quick Actions Section */}
      <div className="card" style={{ marginBottom: '20px', backgroundColor: '#f8f9fa' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Quick Actions</h3>
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={loadDashboardData}
            disabled={isLoading}
          >
            <i className={`fas fa-sync-alt ${isLoading ? 'fa-spin' : ''}`}></i> 
            {isLoading ? ' Refreshing...' : ' Refresh Data'}
          </button>
        </div>
        <div style={{ padding: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary"
            onClick={() => setShowSaleForm(!showSaleForm)}
            style={{ padding: '12px 20px' }}
            disabled={isLoading}
          >
            <i className="fas fa-cash-register"></i> Record Sale
          </button>
          <button 
            className="btn btn-success"
            onClick={() => window.location.hash = '#inventory'}
            style={{ padding: '12px 20px' }}
            disabled={isLoading}
          >
            <i className="fas fa-plus"></i> Add Product
          </button>
          <button 
            className="btn btn-info"
            onClick={navigateToOrders}
            style={{ padding: '12px 20px' }}
            disabled={isLoading}
          >
            <i className="fas fa-shopping-cart"></i> Create Order
          </button>
          <button 
            className="btn btn-warning"
            onClick={navigateToSuppliers}
            style={{ padding: '12px 20px' }}
            disabled={isLoading}
          >
            <i className="fas fa-truck"></i> Manage Suppliers
          </button>
        </div>
      </div>

      {/* Sale Form */}
      {showSaleForm && (
        <div className="card" style={{ marginBottom: '20px', border: '2px solid #27ae60' }}>
          <div className="card-header" style={{ backgroundColor: '#27ae60', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Record Quick Sale</h3>
            <button 
              className="btn btn-sm btn-light"
              onClick={() => setShowSaleForm(false)}
              disabled={isLoading}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div style={{ padding: '20px' }}>
            <div className="form-group">
              <label><strong>Select Product:</strong></label>
              <select 
                value={selectedProduct} 
                onChange={(e) => setSelectedProduct(e.target.value)}
                style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '4px' }}
                disabled={isLoading}
              >
                <option value="">Choose a product...</option>
                {inStockProducts.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - Stock: {product.stock} {product.unit} - ₹{product.price}
                  </option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <>
                <div className="form-group">
                  <label><strong>Quantity:</strong></label>
                  <input
                    type="number"
                    value={saleQuantity}
                    onChange={(e) => setSaleQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max={db.getProduct(parseInt(selectedProduct))?.stock || 1}
                    style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '4px' }}
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label><strong>Customer:</strong></label>
                  <input
                    type="text"
                    value={saleCustomer}
                    onChange={(e) => setSaleCustomer(e.target.value)}
                    placeholder="Customer name"
                    style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '4px' }}
                    disabled={isLoading}
                  />
                </div>

                <div style={{ 
                  backgroundColor: '#27ae60', 
                  color: 'white',
                  padding: '15px', 
                  borderRadius: '4px',
                  margin: '15px 0',
                  textAlign: 'center'
                }}>
                  <h4 style={{ margin: 0 }}>
                    Total: ₹{(db.getProduct(parseInt(selectedProduct))?.price * saleQuantity || 0).toLocaleString()}
                  </h4>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    className="btn btn-success"
                    onClick={recordSale}
                    style={{ flex: 1, padding: '12px' }}
                    disabled={isLoading}
                  >
                    <i className="fas fa-check"></i> {isLoading ? 'Processing...' : 'Confirm Sale'}
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => setShowSaleForm(false)}
                    style={{ flex: 1, padding: '12px' }}
                    disabled={isLoading}
                  >
                    <i className="fas fa-times"></i> Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Dashboard Cards */}
      <div className="dashboard-cards">
        {cards.map((card, index) => (
          <DashboardCard 
            key={index} 
            title={card.title}
            value={card.value}
            footer={card.footer}
            icon={card.icon}
            color={card.color}
            loading={isLoading}
          />
        ))}
      </div>

      {/* Summary Section */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Financial Summary</h3>
          <small style={{ color: '#7f8c8d' }}>
            Last updated: {new Date(dashboardData.lastUpdate).toLocaleTimeString()}
          </small>
        </div>
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>
              ₹{dashboardData.todaySales.toLocaleString()}
            </div>
            <div style={{ color: '#7f8c8d', fontSize: '14px' }}>Today's Revenue</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9b59b6' }}>
              ₹{dashboardData.todayPurchases.toLocaleString()}
            </div>
            <div style={{ color: '#7f8c8d', fontSize: '14px' }}>Today's Purchases</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>
              ₹{(dashboardData.todaySales - dashboardData.todayPurchases).toLocaleString()}
            </div>
            <div style={{ color: '#7f8c8d', fontSize: '14px' }}>Net Today</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e67e22' }}>
              {dashboardData.topProduct.product || 'N/A'}
            </div>
            <div style={{ color: '#7f8c8d', fontSize: '14px' }}>
              Top Product ({dashboardData.topProduct.sales || 0} sold)
            </div>
          </div>
        </div>
      </div>
     
      {/* Recent Activity Section */}
      <div className="inventory-table">
        <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Recent Activity</h3>
          <button 
            className="btn btn-primary btn-sm"
            onClick={loadDashboardData}
            disabled={isLoading}
          >
            <i className={`fas fa-sync-alt ${isLoading ? 'fa-spin' : ''}`}></i> 
            {isLoading ? ' Refreshing...' : ' Refresh'}
          </button>
        </div>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Activity</th>
                <th>User</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {activities.length > 0 ? (
                activities.map(activity => (
                  <tr key={activity.id}>
                    <td>{new Date(activity.date).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${
                        activity.activity.includes('Sale') ? 'badge-success' :
                        activity.activity.includes('Order') ? 'badge-primary' :
                        activity.activity.includes('Product') ? 'badge-info' :
                        'badge-secondary'
                      }`}>
                        {activity.activity}
                      </span>
                    </td>
                    <td>{activity.user}</td>
                    <td>{activity.details}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#7f8c8d' }}>
                    {isLoading ? 'Loading activities...' : 'No recent activity'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;