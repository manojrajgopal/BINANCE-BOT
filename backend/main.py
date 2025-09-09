from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import orders, advanced, auth
from models.database import client
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Binance Futures Order Bot", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(orders.router)
app.include_router(advanced.router)

@app.get("/", include_in_schema=True)
@app.head("/")
async def root():
    return {"status": "ok", "message": "Binance Futures Order Bot API"}

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.on_event("shutdown")
async def shutdown_event():
    client.close()