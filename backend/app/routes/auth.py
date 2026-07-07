from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import requests
import uuid
import os
import random
from ..database import get_db
from ..models import User
from ..schemas import UserCreate, UserResponse, Token, GoogleLoginRequest
from ..auth import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if username or email already exists
    db_user_by_email = db.query(User).filter(User.email == user_in.email).first()
    if db_user_by_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    db_user_by_username = db.query(User).filter(User.username == user_in.username).first()
    if db_user_by_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Hash password and create user
    hashed_pwd = get_password_hash(user_in.password)
    db_user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hashed_pwd
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Authenticate by username or email
    user = db.query(User).filter(
        (User.username == form_data.username) | (User.email == form_data.username)
    ).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create token
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/google", response_model=Token)
def google_login(google_in: GoogleLoginRequest, db: Session = Depends(get_db)):
    # Verify Google Token via Google tokeninfo API
    token_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={google_in.token}"
    try:
        response = requests.get(token_url, timeout=10)
        token_info = response.json()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to reach Google verification server: {str(e)}"
        )
        
    if "error" in token_info or "error_description" in token_info:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=token_info.get("error_description", "Invalid Google Token")
        )
        
    email = token_info.get("email")
    email_verified = token_info.get("email_verified")
    
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email not provided by Google account"
        )
        
    # Check if verified
    # Google API might return email_verified as a string 'true' or boolean True
    if str(email_verified).lower() != "true" and email_verified is not True:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account email is not verified"
        )
        
    # Optional Client ID verification (Audience check)
    google_client_id = os.getenv("GOOGLE_CLIENT_ID")
    if google_client_id and google_client_id != "YOUR_GOOGLE_CLIENT_ID_HERE":
        aud = token_info.get("aud")
        if aud != google_client_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Google Client ID mismatch"
            )

    # Check if user already exists
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # Create a clean unique username
        base_username = email.split("@")[0]
        # Clean username from special characters if any
        base_username = "".join(c for c in base_username if c.isalnum() or c == "_")
        username = base_username
        
        # Ensure username uniqueness
        while db.query(User).filter(User.username == username).first() is not None:
            username = f"{base_username}_{random.randint(100, 999)}"
            
        # Create user with a generated secure random password
        random_pwd = str(uuid.uuid4())
        hashed_pwd = get_password_hash(random_pwd)
        
        user = User(
            username=username,
            email=email,
            hashed_password=hashed_pwd
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Generate JWT access token
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/forgot-password")
def forgot_password(email: str, db: Session = Depends(get_db)):
    # Dummy implementation for forgot password
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # Avoid user enumeration, return success message anyway
        pass
    
    return {"message": "If this email is registered, a password reset link has been simulated."}
