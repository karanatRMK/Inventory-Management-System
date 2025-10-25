import React, { useState, useEffect } from 'react';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import Inventory from './components/inventory/Inventory';
import Orders from './components/orders/Orders';
import Suppliers from './components/suppliers/Suppliers';
import Analytics from './components/analytics/Analytics';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import { InventDB } from './services/database';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [db] = useState(new InventDB());

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Log login activity
    db.addActivity({
      activity: "User Login",
      user: user.name,
      details: `${user.name} logged into the system`
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard db={db} currentUser={currentUser} />;
      case 'inventory':
        return <Inventory db={db} currentUser={currentUser} />;
      case 'orders':
        return <Orders db={db} currentUser={currentUser} />;
      case 'suppliers':
        return <Suppliers db={db} currentUser={currentUser} />;
      case 'analytics':
        return <Analytics db={db} currentUser={currentUser} />;
      default:
        return <Dashboard db={db} currentUser={currentUser} />;
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} db={db} />;
  }

  return (
    <div className="app">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <div className="main-content">
        <Header 
          user={currentUser} 
          onLogout={handleLogout} 
          section={activeSection}
        />
        {renderContent()}
      </div>
    </div>
  );
}

export default App;