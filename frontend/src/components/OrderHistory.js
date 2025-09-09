import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderHistory.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BACKEND_URL}/orders/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on selected filter and search term
  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'ALL' || order.status === filter;
    const matchesSearch = order.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toString().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'FILLED': return 'status-badge filled';
      case 'PARTIALLY_FILLED': return 'status-badge partial';
      case 'CANCELLED': return 'status-badge cancelled';
      case 'REJECTED': return 'status-badge rejected';
      case 'PENDING': return 'status-badge pending';
      case 'NEW': return 'status-badge new';
      default: return 'status-badge';
    }
  };

  const getSideClass = (side) => {
    return side === 'BUY' ? 'side-buy' : 'side-sell';
  };

  return (
    <div className="order-history-container">
      <div className="background-animation">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
      </div>
      
      <div className="card order-history-card">
        <div className="card-header">
          <h2 className="animated-text">
            <span className="text-gradient">Order History</span>
          </h2>
          <p>Track and manage your order execution history</p>
        </div>
        
        <div className="card-body">
          {/* Filters and Search */}
          <div className="history-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by symbol or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glow-on-focus"
              />
              <span className="search-icon">🔍</span>
            </div>
            
            <div className="filter-buttons">
              <button 
                className={filter === 'ALL' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setFilter('ALL')}
              >
                All Orders
              </button>
              <button 
                className={filter === 'FILLED' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setFilter('FILLED')}
              >
                Filled
              </button>
              <button 
                className={filter === 'PARTIALLY_FILLED' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setFilter('PARTIALLY_FILLED')}
              >
                Partial
              </button>
              <button 
                className={filter === 'CANCELLED' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setFilter('CANCELLED')}
              >
                Cancelled
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="table-container">
            {isLoading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading order history...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No orders found</h3>
                <p>{searchTerm || filter !== 'ALL' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Your order history will appear here once you place orders'}</p>
              </div>
            ) : (
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Symbol</th>
                    <th>Side</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr key={order.id} className="animated-fadeIn" style={{ animationDelay: `${index * 0.05}s` }}>
                      <td className="order-id">#{order.id}</td>
                      <td className="symbol">{order.symbol}</td>
                      <td>
                        <span className={`side-indicator ${getSideClass(order.side)}`}>
                          {order.side}
                        </span>
                      </td>
                      <td>{order.quantity}</td>
                      <td className="price">
                        {order.order_type === 'MARKET' ? 'Market Price' : 
                        order.price ? `$${parseFloat(order.price).toFixed(4)}` : 
                        order.limit_price ? `$${parseFloat(order.limit_price).toFixed(4)}` :
                        order.lower_price ? `$${parseFloat(order.lower_price).toFixed(4)}` : 
                        order.upper_price ? `$${parseFloat(order.upper_price).toFixed(4)}` : 
                        order.stop_price ? `$${parseFloat(order.stop_price).toFixed(4)}` : '-'}
                      </td>
                      <td>{order.order_type?.replace('_', ' ') || '-'}</td>
                      <td>
                        <span className={getStatusBadgeClass(order.status)}>
                          {order.status?.replace('_', ' ') || 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="order-date">
                        {new Date(order.created_at).toLocaleDateString()}
                        <span className="time">
                          {new Date(order.created_at).toLocaleTimeString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Summary Stats */}
          {filteredOrders.length > 0 && (
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-value">{filteredOrders.length}</span>
                <span className="stat-label">Orders</span>
              </div>
              <div className="stat">
                <span className="stat-value">
                  {filteredOrders.filter(o => o.side === 'BUY').length}
                </span>
                <span className="stat-label">Buy Orders</span>
              </div>
              <div className="stat">
                <span className="stat-value">
                  {filteredOrders.filter(o => o.side === 'SELL').length}
                </span>
                <span className="stat-label">Sell Orders</span>
              </div>
              <div className="stat">
                <span className="stat-value">
                  {filteredOrders.filter(o => o.status === 'FILLED').length}
                </span>
                <span className="stat-label">Filled</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;