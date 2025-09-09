import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import MarketOrder from './components/MarketOrder';
import LimitOrder from './components/LimitOrder';
import AdvancedOrders from './components/AdvancedOrders';
import OrderHistory from './components/OrderHistory';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="background-animation">
          <div className="floating-circle circle-1"></div>
          <div className="floating-circle circle-2"></div>
          <div className="floating-circle circle-3"></div>
        </div>
        
        <header className="app-header">
          <h1 className="app-title">
            <span className="text-gradient">Binance Futures Order Bot</span>
          </h1>
          <p className="app-subtitle">Advanced trading made simple</p>
        </header>
        
        <Navigation />
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/market" element={<MarketOrder />} />
            <Route path="/limit" element={<LimitOrder />} />
            <Route path="/advanced" element={<AdvancedOrders />} />
            <Route path="/history" element={<OrderHistory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;