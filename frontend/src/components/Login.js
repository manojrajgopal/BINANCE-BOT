import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Clear messages after 5 seconds
    const timer = setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [successMessage, errorMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      let response;
      
      if (isLogin) {
        // For login, use form data
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('grant_type', 'password');
        
        response = await axios.post(
          `${BACKEND_URL}/auth/token`, 
          formData,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        );
        
        localStorage.setItem('token', response.data.access_token);
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/market'), 1500);
      } else {
        // For registration, use form data
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        
        response = await axios.post(
          `BACKEND_URL/auth/register`, 
          formData,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        );
        
        setSuccessMessage('Registration successful. Please login.');
        setIsLogin(true);
      }
    } catch (error) {
      setErrorMessage(`Error: ${error.response?.data?.detail || 'Something went wrong'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="background-animation">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
      </div>
      
      <div className="card login-card">
        <div className="card-header">
          <h2 className="animated-text">
            <span className="text-gradient">{isLogin ? 'Welcome Back' : 'Create Account'}</span>
          </h2>
          <p>{isLogin ? 'Sign in to access your trading dashboard' : 'Join us to start your trading journey'}</p>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="glow-on-focus"
                disabled={isLoading}
              />
            </div>
            
            <div className="input-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="glow-on-focus"
                disabled={isLoading}
              />
            </div>
            
            <button 
              type="submit" 
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : (
                isLogin ? 'Login' : 'Register'
              )}
            </button>
          </form>
          
          <div className="auth-switch">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                onClick={() => setIsLogin(!isLogin)}
                className="switch-mode-button"
                disabled={isLoading}
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
          
          {successMessage && (
            <div className="message success animated-slideIn">
              <span className="icon">✓</span>
              {successMessage}
            </div>
          )}
          
          {errorMessage && (
            <div className="message error animated-slideIn">
              <span className="icon">⚠</span>
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;