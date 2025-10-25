import React from 'react';

const Header = ({ user, onLogout, section }) => {
  const getSectionTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      inventory: 'Inventory Management',
      orders: 'Purchase Orders',
      suppliers: 'Suppliers',
      analytics: 'Analytics'
    };
    return titles[section] || 'Dashboard';
  };

  return (
    <div className="header">
      <h1 className="page-title">{getSectionTitle()}</h1>
      <div className="user-profile">
        <span>{user?.name}</span>
        <div className="user-avatar">
          <i className="fas fa-user"></i>
        </div>
        <button 
          className="btn btn-danger" 
          onClick={onLogout}
          style={{ marginLeft: '10px' }}
        >
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </div>
  );
};

export default Header;