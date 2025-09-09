# Binance Futures Order Bot

A full-stack trading bot for Binance USDT-M Futures with a React frontend and FastAPI backend. This application supports multiple order types with robust validation, logging, and MongoDB persistence.

---

## Features

- Market Orders: Instant execution at current market price
- Limit Orders: Execution at specified price or better
- Advanced Orders:
    - Stop-Limit Orders: Trigger a limit order when stop price is hit
    - OCO (One-Cancels-the-Other): Place take-profit and stop-loss simultaneously
    - TWAP (Time-Weighted Average Price): Split large orders into smaller chunks over time
    - Grid Orders: Automated buy-low/sell-high within a price range
- User Authentication: JWT-based secure authentication
- Order History: View all placed orders with details
- Comprehensive Logging: All actions logged to bot.log with timestamps
- Input Validation: Robust validation for all order parameters

---

### Prerequisites
Before running this application, make sure you have:
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Binance API Keys (optional, for real trading integration)

---

## 🛠️ Installation

1. Clone the Repository
```bash
git clone <your-repository-url>
cd binance-bot
```

2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env if needed
```
---

## ⚙️ Configuration
### MongoDB Setup

Option A: Local MongoDB Installation
1. Install MongoDB Community Edition
2. Start MongoDB service:
```bash
# On macOS with Homebrew
brew services start mongodb/brew/mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
net start MongoDB
```

Option B: MongoDB Atlas (Cloud)
1. Create an account at (MongoDB Atlas)[https://www.mongodb.com/products/platform]
2. Create a new cluster and database
3. Get your connection string
4. Update MONGODB_URI in backend/.env

---

### Environment Variables

Backend (.env)
```bash
MONGODB_URI=mongodb://localhost:27017/binance_bot
BINANCE_API_KEY=your_binance_api_key_here
BINANCE_SECRET_KEY=your_binance_secret_key_here
JWT_SECRET=your_secure_jwt_secret_here
```

Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:8000
```

---

## 🚀 Running the Application

### 1. Start the Backend Server
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
The API will be available at: http://localhost:8000

### 2. Start the Frontend Development Server
```bash
cd frontend
npm start
```
The application will open at: http://localhost:3000

### 3. Access the Application
1. Open your browser and navigate to http://localhost:3000
2. Register a new account or login with existing credentials
3. Start placing orders!

## 📝 Usage Guide
### Market Orders
Navigate to Market Order section
1. Enter trading symbol (e.g., BTCUSDT, ETHUSDT)
2. Select BUY or SELL
3. Enter quantity
4. Click Place Market Order
Example Input:
```bash
Symbol: BTCUSDT
Side: BUY
Quantity: 0.01
```

### Limit Orders
1. Navigate to Limit Order section
2. Enter trading symbol
3. Select BUY or SELL
4. Enter quantity and price
5. Click Place Limit Order
Example Input:
```bash
Symbol: ETHUSDT
Side: SELL
Quantity: 0.5
Price: 2000
```

### Advanced Orders
1. Stop-Limit Orders
2. Select Stop-Limit from Order Type dropdown
3. Enter symbol, side, and quantity
4. Set execution price and stop trigger price
5. Click Place STOP_LIMIT Order
Example Input:
```bash
Symbol: BTCUSDT
Side: SELL
Quantity: 0.02
Price: 49000
Stop Price: 50000
```

#### OCO Orders (One-Cancels-the-Other)
1. Select OCO from Order Type dropdown
2. Enter symbol and quantity
3. Set limit price (take-profit), stop price, and stop limit price
4. Click Place OCO Order

```bash
Symbol: ETHUSDT
Quantity: 1.0
Limit Price: 2200
Stop Price: 1800
Stop Limit Price: 1790
```

#### TWAP Orders (Time-Weighted Average Price)
1. Select TWAP from Order Type dropdown
2. Enter symbol, side, and quantity
3. Set target price, duration (minutes), and number of slices
4. Click Place TWAP Order
Example Input:
```bash
Symbol: BTCUSDT
Side: BUY
Quantity: 0.1
Price: 48000
Duration: 60
Slices: 12
```

#### Grid Orders
1. Select Grid from Order Type dropdown
2. Enter symbol, side, and quantity
3. Set lower price, upper price, and number of grids
4. Click Place GRID Order
Example Input:
```bash
Symbol: ETHUSDT
Side: BUY
Quantity: 5.0
Lower Price: 1700
Upper Price: 2300
Grids: 10
```

---

## 📊 Viewing Order History
1. Navigate to Order History section
2. View all placed orders with details:
    - Order ID
    - Symbol and order type
    - Side (BUY/SELL) and quantity
    - Status and timestamp

### 🔍 Checking Logs

All application actions are logged to backend/bot.log with timestamps:
```bash
cd backend
tail -f bot.log
```

Example log entries:
```bash
2023-11-15 10:30:45 - INFO - Market order placed: {'symbol': 'BTCUSDT', 'side': 'BUY', 'quantity': 0.01, ...}
2023-11-15 10:31:22 - ERROR - Error placing limit order: Quantity must be positive
```

---

## 🧪 Testing
### API Testing with curl
```bash
# Get authentication token
curl -X POST "http://localhost:8000/auth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=testpass&grant_type=password"

# Place market order (replace TOKEN with actual JWT)
curl -X POST "http://localhost:8000/orders/market" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"symbol": "BTCUSDT", "side": "BUY", "quantity": 0.01, "order_type": "MARKET"}'
```

### Frontend Testing
1. Test all form validations
2. Verify error messages display correctly
3. Test navigation between components
4. Verify order history updates

---

## 📁 Project Structure
```bash
binance-bot/
├── backend/
│   ├── main.py                 # FastAPI main application
│   ├── routers/                # API route handlers
│   │   ├── orders.py           # Basic order endpoints
│   │   ├── advanced.py         # Advanced order endpoints
│   │   └── auth.py             # Authentication endpoints
│   ├── models/                 # Data models and database
│   │   ├── order_models.py     # Pydantic models
│   │   └── database.py         # MongoDB connection
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment variables
│   └── bot.log                 # Application logs
├── frontend/
│   ├── public/
│   │   └── index.html          # HTML template
│   ├── src/
│   │   ├── App.js              # Main React component
│   │   ├── components/         # React components
│   │   │   ├── MarketOrder.js
│   │   │   ├── LimitOrder.js
│   │   │   ├── AdvancedOrders.js
│   │   │   ├── OrderHistory.js
│   │   │   ├── Login.js
│   │   │   └── Navigation.js
│   │   ├── index.js            # React entry point
│   │   └── App.css             # Styles
│   ├── package.json            # Node.js dependencies
│   └── .env                    # Frontend environment
└── README.md                   # This file
```

---

## 🐛 Troubleshooting

### Common Issues
1. MongoDB Connection Error

```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB service
sudo systemctl start mongod
```

2. Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill

# Or use different port
uvicorn main:app --reload --port 8001
```

3. CORS Errors
    - Ensure backend is running on http://localhost:8000
    - Check frontend .env has correct API URL

4. Module Not Found Errors
```bash
# Reinstall dependencies
pip install -r requirements.txt
npm install
```

### Getting Help
If you encounter issues:
1. Check the logs in backend/bot.log
2. Verify all services are running
3. Ensure all environment variables are set
4. Check that MongoDB is accessible

---

## 📸 Screenshots

### Login Page

### Market Order Form

### Advanced Orders Interface

### Order History

### Log File Example

---

## 🚀 Deployment

### Backend Deployment

```bash
# Production deployment with Gunicorn
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Serve with a static server
serve -s build
```

## Environment Variables for Production
Update your production .env files with:
    - Production MongoDB URI
    - Real Binance API keys (if integrating)
    - Secure JWT secret
    - Appropriate API URLs

---

# 🤝 Contributing
To extend this project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

# 📞 Support
For questions about this implementation, please contact:

Email: [manojrajgopal15@icloud.com]
GitHub: [https://github.com/manojrajgopal]

---