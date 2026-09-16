from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.database.connection import get_db
from app.models.user import User
from app.schemas.engagement import AlertCreate, AlertRead
from app.services.engagement_service import create_alert, list_alerts
from app.services.product_service import NotFoundError

router = APIRouter(prefix="/alerts", tags=["Price Alerts"])


@router.get("", response_model=list[AlertRead])
def get_alerts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return list_alerts(db, current_user.id)


@router.post("", response_model=AlertRead, status_code=201)
def post_alert(
    payload: AlertCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        alert = create_alert(db, current_user.id, payload.product_id, payload.target_price, payload.currency)
    except NotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    rows = [row for row in list_alerts(db, current_user.id) if row["id"] == alert.id]
    return rows[0]
