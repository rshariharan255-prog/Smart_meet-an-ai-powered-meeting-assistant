from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from database.db import users_collection
from config import SECRET_KEY, ALGORITHM
from utils.dependency import get_current_user
import bcrypt

router = APIRouter(prefix="/auth", tags=["Auth"])

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register(user: UserCreate):
    try:
        # Check if user exists
        existing_user = users_collection.find_one({"email": user.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Hash password
        hashed_password = pwd_context.hash(user.password)
        
        # Create user
        user_dict = {
            "name": user.name,
            "email": user.email,
            "hashed_password": hashed_password,
            "created_at": datetime.utcnow()
        }
        
        result = users_collection.insert_one(user_dict)
        
        # Create JWT token
        payload = {
            "sub": user.email,
            "exp": datetime.utcnow() + timedelta(hours=24)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "name": user.name,
                "email": user.email
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@router.post("/login")
async def login(user: UserLogin):
    # Find user
    db_user = users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Verify password
    if not pwd_context.verify(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Create JWT token
    payload = {
        "sub": db_user["email"],
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    
    return {
    "access_token": token,
    "token_type": "bearer",
    "user": {
        "name": db_user["name"],
        "email": db_user["email"]
    }
    }

@router.get("/me")
async def get_me(user_email: str = Depends(get_current_user)):
    """Test endpoint to verify token is working"""
    db_user = users_collection.find_one({"email": user_email})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "name": db_user["name"],
        "email": db_user["email"]
    }