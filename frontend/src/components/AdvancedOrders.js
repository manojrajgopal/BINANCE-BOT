import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdvancedOrders.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const AdvancedOrders = () => {
  const [orderType, setOrderType] = useState('STOP_LIMIT');
  const [symbol, setSymbol] = useState('');
  const [side, setSide] = useState('BUY');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [stopLimitPrice, setStopLimitPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [slices, setSlices] = useState('');
  const [lowerPrice, setLowerPrice] = useState('');
  const [upperPrice, setUpperPrice] = useState('');
  const [grids, setGrids] = useState('');
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
      let data = {};
      let url = '';

      switch (orderType) {
        case 'STOP_LIMIT':
          data = { symbol, side, quantity, price, stop_price: stopPrice, order_type: 'STOP_LIMIT' };
          url = `${BACKEND_URL}/advanced/stop-limit`;
          break;
        case 'OCO':
          data = { symbol, quantity, limit_price: limitPrice, stop_price: stopPrice, stop_limit_price: stopLimitPrice };
          url = `${BACKEND_URL}/advanced/oco`;
          break;
        case 'TWAP':
          data = { symbol, side, quantity, price, duration: parseInt(duration), slices: parseInt(slices), order_type: 'TWAP' };
          url = `${BACKEND_URL}/advanced/twap`;
          break;
        case 'GRID':
          data = { symbol, side, quantity, lower_price: parseFloat(lowerPrice), upper_price: parseFloat(upperPrice), grids: parseInt(grids), order_type: 'GRID' };
          url = `${BACKEND_URL}/advanced/grid`;
          break;
        default:
          return;
      }

      const response = await axios.post(url, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccessMessage(`Order placed successfully: ${JSON.stringify(response.data)}`);
    } catch (error) {
      setErrorMessage(`Error: ${error.response?.data?.detail || 'Something went wrong'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    switch (orderType) {
      case 'STOP_LIMIT':
        return (
          <div className="form-section animated-fadeIn">
            <div className="input-group">
              <label>Price:</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="glow-on-focus"
              />
            </div>
            <div className="input-group">
              <label>Stop Price:</label>
              <input
                type="number"
                step="0.01"
                value={stopPrice}
                onChange={(e) => setStopPrice(e.target.value)}
                required
                className="glow-on-focus"
              />
            </div>
          </div>
        );
      case 'OCO':
        return (
          <div className="form-section animated-fadeIn">
            <div className="input-group">
              <label>Limit Price:</label>
              <input
                type="number"
                step="0.01"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                required
                className="glow-on-focus"
              />
            </div>
            <div className="input-group">
              <label>Stop Price:</label>
              <input
                type="number"
                step="0.01"
                value={stopPrice}
                onChange={(e) => setStopPrice(e.target.value)}
                required
                className="glow-on-focus"
              />
            </div>
            <div className="input-group">
              <label>Stop Limit Price:</label>
              <input
                type="number"
                step="0.01"
                value={stopLimitPrice}
                onChange={(e) => setStopLimitPrice(e.target.value)}
                required
                className="glow-on-focus"
              />
            </div>
          </div>
        );
      case 'TWAP':
        return (
          <div className="form-section animated-fadeIn">
            <div className="input-group">
              <label>Price:</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="glow-on-focus"
              />
            </div>
            <div className="input-group">
              <label>Duration (minutes):</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                className="glow-on-focus"
              />
            </div>
            <div className="input-group">
              <label>Slices:</label>
              <input
                type="number"
                value={slices}
                onChange={(e) => setSlices(e.target.value)}
                required
                className="glow-on-focus"
              />
            </div>
          </div>
        );
      case 'GRID':
        return (
          <div className="form-section animated-fadeIn">
            <div className="input-group">
              <label>Lower Price:</label>
              <input
                type="number"
                step="0.01"
                value={lowerPrice}
                onChange={(e) => setLowerPrice(e.target.value)}
                required
                className="glow-on-focus"
              />
            </div>
            <div className="input-group">
              <label>Upper Price:</label>
              <input
                type="number"
                step="0.01"
                value={upperPrice}
                onChange={(e) => setUpperPrice(e.target.value)}
                required
                className="glow-on-focus"
              />
            </div>
            <div className="input-group">
              <label>Grids:</label>
              <input
                type="number"
                value={grids}
                onChange={(e) => setGrids(e.target.value)}
                required
                className="glow-on-focus"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="advanced-orders-container">
      <div className="background-animation">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
      </div>
      
      <div className="card advanced-orders-card">
        <div className="card-header">
          <h2 className="animated-text">
            <span className="text-gradient">Advanced Orders</span>
          </h2>
          <p>Execute sophisticated trading strategies with precision</p>
        </div>
        
        <div className="card-body">
          <div className="order-type-selector">
            <label>Order Type:</label>
            <div className="segmented-control">
              {['STOP_LIMIT', 'OCO', 'TWAP', 'GRID'].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={orderType === type ? 'segment active' : 'segment'}
                  onClick={() => setOrderType(type)}
                >
                  {type.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
          
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
                />
              </div>
              
              {orderType !== 'OCO' && (
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
              )}
              
              <div className="input-group">
                <label>Quantity:</label>
                <input
                  type="number"
                  step="0.001"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  className="glow-on-focus"
                />
              </div>
            </div>
            
            {renderForm()}
            
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
                `Place ${orderType.replace('_', ' ')} Order`
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

export default AdvancedOrders;