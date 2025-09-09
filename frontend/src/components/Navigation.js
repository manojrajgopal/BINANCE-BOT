import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Set active tab based on current path
    const path = location.pathname;
    if (path.includes('market')) setActiveTab('market');
    else if (path.includes('limit')) setActiveTab('limit');
    else if (path.includes('advanced')) setActiveTab('advanced');
    else if (path.includes('history')) setActiveTab('history');
    else setActiveTab('');
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!token) {
    return null;
  }

  return (
    <div className={`navigation-container ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-background-animation">
        <div className="nav-floating-circle nav-circle-1"></div>
        <div className="nav-floating-circle nav-circle-2"></div>
        <div className="nav-floating-circle nav-circle-3"></div>
      </div>
      
      <nav className="nav-card">
        <div className="nav-header">
          <div className="nav-brand">
            <h3 className="nav-title">
              <span className="nav-text-gradient">CryptoTrader Pro</span>
            </h3>
            <div className="nav-status">
              <div className="status-indicator"></div>
              <span>Connected</span>
            </div>
          </div>
          
          <button 
            className={`nav-hamburger ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        
        <div className={`nav-links ${isMenuOpen ? 'nav-open' : ''}`}>
          <Link 
            to="/market" 
            className={`nav-link ${activeTab === 'market' ? 'nav-active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-link-text">Market Order</span>
            <div className="nav-link-highlight"></div>
          </Link>
          
          <Link 
            to="/limit" 
            className={`nav-link ${activeTab === 'limit' ? 'nav-active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="nav-icon">🔒</span>
            <span className="nav-link-text">Limit Order</span>
            <div className="nav-link-highlight"></div>
          </Link>
          
          <Link 
            to="/advanced" 
            className={`nav-link ${activeTab === 'advanced' ? 'nav-active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="nav-icon">⚡</span>
            <span className="nav-link-text">Advanced Orders</span>
            <div className="nav-link-highlight"></div>
          </Link>
          
          <Link 
            to="/history" 
            className={`nav-link ${activeTab === 'history' ? 'nav-active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="nav-icon">📋</span>
            <span className="nav-link-text">Order History</span>
            <div className="nav-link-highlight"></div>
          </Link>
          
          <div className="nav-divider"></div>
          
          <button 
            onClick={handleLogout} 
            className="nav-logout-btn"
            aria-label="Logout"
          >
            <span className="nav-icon">🚪</span>
            <span className="nav-link-text">Logout</span>
            <div className="nav-link-highlight"></div>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;