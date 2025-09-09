from fastapi import APIRouter, HTTPException, Depends
from models.order_models import MarketOrder, LimitOrder, OrderResponse
from models.database import orders_collection
from routers.auth import get_current_user
from datetime import datetime
import logging

router = APIRouter(prefix="/orders", tags=["orders"])

logging.basicConfig(
    filename="bot.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

@router.post("/market", response_model=OrderResponse)
async def create_market_order(order: MarketOrder, current_user: dict = Depends(get_current_user)):
    try:
        # Validate symbol format
        if not order.symbol.isalpha() or len(order.symbol) < 3:
            raise HTTPException(status_code=400, detail="Invalid symbol format")
        
        # Validate quantity
        if order.quantity <= 0:
            raise HTTPException(status_code=400, detail="Quantity must be positive")
        
        # In a real implementation, you would call Binance API here
        # For this example, we'll just log and store the order
        
        order_data = {
            "symbol": order.symbol,
            "side": order.side,
            "quantity": order.quantity,
            "order_type": order.order_type,
            "status": "PENDING",
            "created_at": datetime.utcnow(),
            "user_id": current_user["username"]
        }
        
        result = await orders_collection.insert_one(order_data)
        order_data["id"] = str(result.inserted_id)
        
        logging.info(f"Market order placed: {order_data}")
        
        return order_data
    except Exception as e:
        logging.error(f"Error placing market order: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/limit", response_model=OrderResponse)
async def create_limit_order(order: LimitOrder, current_user: dict = Depends(get_current_user)):
    try:
        # Validate symbol format
        if not order.symbol.isalpha() or len(order.symbol) < 3:
            raise HTTPException(status_code=400, detail="Invalid symbol format")
        
        # Validate quantity and price
        if order.quantity <= 0:
            raise HTTPException(status_code=400, detail="Quantity must be positive")
        if order.price <= 0:
            raise HTTPException(status_code=400, detail="Price must be positive")
        
        order_data = {
            "symbol": order.symbol,
            "side": order.side,
            "quantity": order.quantity,
            "price": order.price,
            "order_type": order.order_type,
            "status": "PENDING",
            "created_at": datetime.utcnow(),
            "user_id": current_user["username"]
        }
        
        result = await orders_collection.insert_one(order_data)
        order_data["id"] = str(result.inserted_id)
        
        logging.info(f"Limit order placed: {order_data}")
        
        return order_data
    except Exception as e:
        logging.error(f"Error placing limit order: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=list[OrderResponse])
async def get_orders(current_user: dict = Depends(get_current_user)):
    orders = await orders_collection.find({"user_id": current_user["username"]}).to_list(100)
    
    # Ensure all orders have consistent fields
    for order in orders:
        order["id"] = str(order["_id"])
        # Add missing fields with None values
        if "price" not in order:
            order["price"] = None
        print(order)
        print("_______________________________________")
        # Add any other fields that might be missing
    
    return orders