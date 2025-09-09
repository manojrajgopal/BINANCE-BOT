import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MarketOrder.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const MarketOrder = () => {
  const [symbol, setSymbol] = useState('');
  const [side, setSide] = useState('BUY');
  const [quantity, setQuantity] = useState('');
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
        `${BACKEND_URL}/orders/market`,
        { symbol, side, quantity, order_type: 'MARKET' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccessMessage(`Order placed successfully: ${response.data.id}`);
      // Reset form
      setSymbol('');
      setQuantity('');
    } catch (error) {
      setErrorMessage(`Error: ${error.response?.data?.detail || 'Something went wrong'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="market-order-container">
      <div className="background-animation">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
      </div>
      
      <div className="card market-order-card">
        <div className="card-header">
          <h2 className="animated-text">
            <span className="text-gradient">Market Order</span>
          </h2>
          <p>Execute instant trades at the current market price</p>
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
                `Place Market Order`
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
        
        <div className="card-footer">
          <div className="market-info">
            <h4>Market Order Details</h4>
            <ul>
              <li>Executed immediately at current market price</li>
              <li>No price guarantee - fills at best available price</li>
              <li>High probability of execution</li>
              <li>Ideal for quick entry/exit positions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketOrder;