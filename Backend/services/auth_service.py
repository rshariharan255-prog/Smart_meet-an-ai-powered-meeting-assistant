from fastapi import HTTPException, status
from database.db import users_collection
from utils.security import hash_password, verify_password, create_token

def register_user(user):
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )

    hashed_password = hash_password(user.password)

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password
    }

    users_collection.insert_one(new_user)

    return {"message": "User registered successfully"}

def login_user(user):
    db_user = users_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid password"
        )

    token = create_token({"sub": db_user["email"]})

    return {
        "access_token": token,
        "token_type": "bearer"
    }