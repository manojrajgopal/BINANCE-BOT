from fastapi import APIRouter, HTTPException, Depends
from models.order_models import StopLimitOrder, OCOOrder, TWAPOrder, GridOrder, OrderResponse
from models.database import orders_collection
from routers.auth import get_current_user
from datetime import datetime
import logging
import asyncio

router = APIRouter(prefix="/advanced", tags=["advanced"])

@router.post("/stop-limit", response_model=OrderResponse)
async def create_stop_limit_order(order: StopLimitOrder, current_user: dict = Depends(get_current_user)):
    try:
        # Validate inputs
        if order.quantity <= 0:
            raise HTTPException(status_code=400, detail="Quantity must be positive")
        if order.price <= 0 or order.stop_price <= 0:
            raise HTTPException(status_code=400, detail="Price and stop price must be positive")
        
        order_data = {
            "symbol": order.symbol,
            "side": order.side,
            "quantity": order.quantity,
            "price": order.price,
            "stop_price": order.stop_price,
            "order_type": order.order_type,
            "status": "PENDING",
            "created_at": datetime.utcnow(),
            "user_id": current_user["username"]
        }
        
        result = await orders_collection.insert_one(order_data)
        order_data["id"] = str(result.inserted_id)
        
        logging.info(f"Stop-limit order placed: {order_data}")
        
        return order_data
    except Exception as e:
        logging.error(f"Error placing stop-limit order: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/oco", response_model=dict)
async def create_oco_order(order: OCOOrder, current_user: dict = Depends(get_current_user)):
    try:
        # Validate inputs
        if order.quantity <= 0:
            raise HTTPException(status_code=400, detail="Quantity must be positive")
        if order.limit_price <= 0 or order.stop_price <= 0 or order.stop_limit_price <= 0:
            raise HTTPException(status_code=400, detail="All prices must be positive")
        
        # Create two orders (limit and stop-limit)
        limit_order = {
            "symbol": order.symbol,
            "side": "SELL",
            "quantity": order.quantity,
            "price": order.limit_price,
            "order_type": "LIMIT",
            "status": "PENDING",
            "created_at": datetime.utcnow(),
            "user_id": current_user["username"],
            "oco_group": datetime.utcnow().timestamp()
        }
        
        stop_order = {
            "symbol": order.symbol,
            "side": "SELL",
            "quantity": order.quantity,
            "price": order.stop_limit_price,
            "stop_price": order.stop_price,
            "order_type": "STOP_LIMIT",
            "status": "PENDING",
            "created_at": datetime.utcnow(),
            "user_id": current_user["username"],
            "oco_group": datetime.utcnow().timestamp()
        }
        
        result1 = await orders_collection.insert_one(limit_order)
        result2 = await orders_collection.insert_one(stop_order)
        
        logging.info(f"OCO order placed: {limit_order} and {stop_order}")
        
        return {
            "message": "OCO order placed successfully",
            "limit_order_id": str(result1.inserted_id),
            "stop_order_id": str(result2.inserted_id)
        }
    except Exception as e:
        logging.error(f"Error placing OCO order: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/twap", response_model=OrderResponse)
async def create_twap_order(order: TWAPOrder, current_user: dict = Depends(get_current_user)):
    try:
        # Validate inputs
        if order.quantity <= 0:
            raise HTTPException(status_code=400, detail="Quantity must be positive")
        if order.price <= 0:
            raise HTTPException(status_code=400, detail="Price must be positive")
        if order.duration <= 0 or order.slices <= 0:
            raise HTTPException(status_code=400, detail="Duration and slices must be positive")
        
        order_data = {
            "symbol": order.symbol,
            "side": order.side,
            "quantity": order.quantity,
            "price": order.price,
            "duration": order.duration,
            "slices": order.slices,
            "order_type": order.order_type,
            "status": "PENDING",
            "created_at": datetime.utcnow(),
            "user_id": current_user["username"]
        }
        
        result = await orders_collection.insert_one(order_data)
        order_data["id"] = str(result.inserted_id)
        
        logging.info(f"TWAP order placed: {order_data}")
        
        # Simulate TWAP execution (in real implementation, this would be more complex)
        asyncio.create_task(execute_twap_order(order_data))
        
        return order_data
    except Exception as e:
        logging.error(f"Error placing TWAP order: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

async def execute_twap_order(order):
    slice_quantity = order["quantity"] / order["slices"]
    slice_interval = order["duration"] * 60 / order["slices"]  # Convert to seconds
    
    for i in range(order["slices"]):
        await asyncio.sleep(slice_interval)
        logging.info(f"Executing TWAP slice {i+1}/{order['slices']} for order {order['id']}")

@router.post("/grid", response_model=OrderResponse)
async def create_grid_order(order: GridOrder, current_user: dict = Depends(get_current_user)):
    try:
        # Validate inputs
        if order.quantity <= 0:
            raise HTTPException(status_code=400, detail="Quantity must be positive")
        if order.lower_price <= 0 or order.upper_price <= 0 or order.grids <= 0:
            raise HTTPException(status_code=400, detail="Prices, grids must be positive")
        if order.lower_price >= order.upper_price:
            raise HTTPException(status_code=400, detail="Lower price must be less than upper price")
        
        order_data = {
            "symbol": order.symbol,
            "side": order.side,
            "quantity": order.quantity,
            "lower_price": order.lower_price,
            "upper_price": order.upper_price,
            "grids": order.grids,
            "order_type": order.order_type,
            "status": "PENDING",
            "created_at": datetime.utcnow(),
            "user_id": current_user["username"]
        }
        
        result = await orders_collection.insert_one(order_data)
        order_data["id"] = str(result.inserted_id)
        
        logging.info(f"Grid order placed: {order_data}")
        
        return order_data
    except Exception as e:
        logging.error(f"Error placing grid order: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))