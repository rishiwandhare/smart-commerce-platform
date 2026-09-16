from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.database.connection import get_db
from app.models.user import User
from app.schemas.user import AuthResponse, UserCreate, UserLogin, UserRead
from app.services.auth_service import AuthError, authenticate_user, issue_token, register_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=AuthResponse, status_code=201)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    try:
        user = register_user(db, payload)
    except AuthError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message)
    return AuthResponse(access_token=issue_token(user), user=user)


@router.post("/login", response_model=AuthResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    try:
        user = authenticate_user(db, payload.email, payload.password)
    except AuthError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message)
    return AuthResponse(access_token=issue_token(user), user=user)


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)):
    return current_user
