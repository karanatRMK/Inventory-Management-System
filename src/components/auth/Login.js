import React, { useState } from 'react';

const Login = ({ onLogin, db }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const user = db.authenticateUser(username, password);
    
    if (user) {
      setError('');
      onLogin(user);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h2>🛒 StockVerse</h2>
          <p>Grocery Inventory Management System</p>
        </div>
       
        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
         
          <div className="login-form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
         
          <button type="submit" className="login-btn">Login</button>
        </form>
       
        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <div style={{ marginTop: '20px', fontSize: '14px', color: '#7f8c8d', textAlign: 'center' }}>
         
        </div>
      </div>
    </div>
  );
};

export default Login;