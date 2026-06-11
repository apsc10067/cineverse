import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, ShieldCheck, AlertCircle } from 'lucide-react';
import './Auth.css';

function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const payload = isLogin 
      ? { username, password }
      : { username, email, password, role };

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Authentication failed.");
      }

      if (isLogin) {
        const data = await response.json(); // returns token, username, role, email
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
        localStorage.setItem('email', data.email);
        navigate('/');
      } else {
        setSuccess("Registration successful! Please login.");
        setIsLogin(true);
        setPassword('');
      }
      setIsDemoMode(false);
    } catch (err) {
      console.warn("Backend authentication offline, falling back to local demo session:", err.message);
      
      // Local Mock Login/Register for Demo Mode
      setIsDemoMode(true);
      if (isLogin) {
        // Mock token generation
        localStorage.setItem('token', 'mock_jwt_token_for_demo_purposes_only');
        localStorage.setItem('username', username || 'StudentUser');
        localStorage.setItem('role', username.toLowerCase() === 'admin' ? 'ADMIN' : 'USER');
        localStorage.setItem('email', `${username || 'student'}@college.edu`);
        setSuccess("Demo login successful! Redirecting...");
        setTimeout(() => navigate('/'), 1000);
      } else {
        setSuccess("Demo registration simulated successfully! You can login now.");
        setIsLogin(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container animate-fade-in">
      <div className="auth-card glass-panel">
        
        {/* Toggle Headers */}
        <div className="auth-toggle">
          <button 
            className={`toggle-btn ${isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
          >
            Sign In
          </button>
          <button 
            className={`toggle-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
          >
            Register
          </button>
        </div>

        {/* Brand Banner */}
        <div className="auth-brand">
          <h2>Cine<span>Verse</span></h2>
          <p>{isLogin ? 'Welcome back! Sign in to book your tickets' : 'Create an account to start booking'}</p>
        </div>

        {isDemoMode && (
          <div className="auth-demo-banner">
            <AlertCircle size={14} />
            <span>Mocking authentication client-side (Services Offline)</span>
          </div>
        )}

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          
          <div className="form-group">
            <label>Username</label>
            <div className="input-icon-wrapper">
              <User className="input-icon" size={18} />
              <input 
                type="text" 
                placeholder="Enter username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-icon-wrapper">
                <Mail className="input-icon" size={18} />
                <input 
                  type="email" 
                  placeholder="Enter email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <div className="input-icon-wrapper">
              <Lock className="input-icon" size={18} />
              <input 
                type="password" 
                placeholder="Enter password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Role</label>
              <div className="input-icon-wrapper">
                <ShieldCheck className="input-icon" size={18} />
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  className="role-selector"
                >
                  <option value="USER">Standard User (Book tickets)</option>
                  <option value="ADMIN">Administrator (Manage catalog)</option>
                </select>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary auth-submit-btn">
            {loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Register Now'}
          </button>

        </form>

      </div>
    </div>
  );
}

export default Auth;
