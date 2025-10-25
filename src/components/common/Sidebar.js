import React from 'react';

const Sidebar = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { id: 'inventory', label: 'Inventory', icon: 'fas fa-boxes' },
    { id: 'orders', label: 'Purchase Orders', icon: 'fas fa-shopping-cart' },
    { id: 'suppliers', label: 'Suppliers', icon: 'fas fa-truck' },
    { id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-line' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>🛒 StockVerse</h2>
      </div>
      <ul className="sidebar-menu">
        {menuItems.map(item => (
          <li
            key={item.id}
            className={activeSection === item.id ? 'active' : ''}
            onClick={() => onSectionChange(item.id)}
          >
            <a href="#">
              <i className={item.icon}></i> {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;