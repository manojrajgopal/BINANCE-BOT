from pydantic import BaseModel, validator
from typing import Optional, List
from enum import Enum
from datetime import datetime

class OrderType(str, Enum):
    MARKET = "MARKET"
    LIMIT = "LIMIT"
    STOP_LIMIT = "STOP_LIMIT"
    OCO = "OCO"
    TWAP = "TWAP"
    GRID = "GRID"

class OrderSide(str, Enum):
    BUY = "BUY"
    SELL = "SELL"

class OrderBase(BaseModel):
    symbol: str
    side: OrderSide
    quantity: float
    order_type: OrderType

class MarketOrder(OrderBase):
    order_type: OrderType = OrderType.MARKET

class LimitOrder(OrderBase):
    order_type: OrderType = OrderType.LIMIT
    price: float

class StopLimitOrder(OrderBase):
    order_type: OrderType = OrderType.STOP_LIMIT
    price: float
    stop_price: float

class OCOOrder(BaseModel):
    symbol: str
    quantity: float
    limit_price: float
    stop_price: float
    stop_limit_price: float

class TWAPOrder(OrderBase):
    order_type: OrderType = OrderType.TWAP
    price: float
    duration: int  # in minutes
    slices: int

class GridOrder(OrderBase):
    order_type: OrderType = OrderType.GRID
    lower_price: float
    upper_price: float
    grids: int

class OrderResponse(BaseModel):
    id: str
    symbol: str
    side: str
    quantity: float
    order_type: str
    status: str
    created_at: datetime
    price: Optional[float] = None
    stop_price: Optional[float] = None
    limit_price: Optional[float] = None
    lower_price: Optional[float] = None
    upper_price: Optional[float] = None
    duration: Optional[int] = None
    slices: Optional[int] = None
    grids: Optional[int] = None

    class Config:
        from_attributes = True