from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database.connection import get_db

router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "price-comparator-backend",
    }


@router.get("/health/db")
def health_db(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "healthy", "database": "connected"}
