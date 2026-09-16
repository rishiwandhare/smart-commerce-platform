from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models.enums import UserRole
from app.models.user import User
from app.schemas.user import UserCreate


class AuthError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


def register_user(db: Session, payload: UserCreate) -> User:
    if payload.role == UserRole.ADMIN:
        raise AuthError("Admin accounts cannot be self-registered", 403)
    existing = db.query(User).filter(User.email == str(payload.email).lower()).first()
    if existing:
        raise AuthError("Email already registered", 409)
    user = User(
        email=str(payload.email).lower(),
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
        phone=payload.phone,
        address=payload.address,
        role=payload.role.value,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User:
    user = db.query(User).filter(User.email == email.lower()).first()
    if user is None or not verify_password(password, user.hashed_password):
        raise AuthError("Invalid email or password", 401)
    if not user.is_active:
        raise AuthError("Account is disabled", 403)
    return user


def issue_token(user: User) -> str:
    return create_access_token(str(user.id), extra_claims={"role": user.role})
