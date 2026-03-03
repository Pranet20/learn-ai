from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "learn-ai-super-secret-key"
ALGORITHM = "HS256"
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not pwd_context.verify(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    expire = datetime.utcnow() + timedelta(minutes=1440)
    token_data = {"sub": user.email, "exp": expire}
    access_token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    
    return {"access_token": access_token, "token_type": "bearer"}
