import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LimitOrder.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const LimitOrder = () => {
  const [symbol, setSymbol] = useState('');
  const [side, setSide] = useState('BUY');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BACKEND_URL}/orders/limit`,
        { symbol, side, quantity, price, order_type: 'LIMIT' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccessMessage(`Order placed successfully: ${response.data.id}`);
      // Reset form
      setSymbol('');
      setQuantity('');
      setPrice('');
    } catch (error) {
      setErrorMessage(`Error: ${error.response?.data?.detail || 'Something went wrong'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="limit-order-container">
      <div className="background-animation">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
      </div>
      
      <div className="card limit-order-card">
        <div className="card-header">
          <h2 className="animated-text">
            <span className="text-gradient">Limit Order</span>
          </h2>
          <p>Place buy or sell orders at specific price points</p>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSubmit} className="order-form">
            <div className="form-grid">
              <div className="input-group">
                <label>Symbol (e.g., BTCUSDT):</label>
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  required
                  className="glow-on-focus"
                  placeholder="Enter trading pair"
                />
              </div>
              
              <div className="input-group">
                <label>Side:</label>
                <div className="side-toggle">
                  <button
                    type="button"
                    className={side === 'BUY' ? 'buy active' : 'buy'}
                    onClick={() => setSide('BUY')}
                  >
                    BUY
                  </button>
                  <button
                    type="button"
                    className={side === 'SELL' ? 'sell active' : 'sell'}
                    onClick={() => setSide('SELL')}
                  >
                    SELL
                  </button>
                </div>
              </div>
              
              <div className="input-group">
                <label>Quantity:</label>
                <input
                  type="number"
                  step="0.001"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  className="glow-on-focus"
                  placeholder="0.00"
                />
              </div>
              
              <div className="input-group">
                <label>Price:</label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="glow-on-focus"
                  placeholder="0.00"
                />
              </div>
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
                'Place Limit Order'
              )}
            </button>
          </form>
          
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

export default LimitOrder;