import React from 'react';

const DashboardCard = ({ title, value, footer, icon, color }) => {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">{title}</span>
        <div className="card-icon" style={{ backgroundColor: color }}>
          <i className={icon}></i>
        </div>
      </div>
      <div className="card-value">{value}</div>
      <div className="card-footer">{footer}</div>
    </div>
  );
};

export default DashboardCard;