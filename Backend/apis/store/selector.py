# API: store/selector.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from core.deps import get_user_admin_id, get_current_user
from db.session import get_db
from schemas.store import StoreSelectorResponse, StoreSelectorItem
from services.store_service import get_store_selector_by_admin

router = APIRouter()


@router.get(
    "/selector",
    response_model=StoreSelectorResponse,
    summary="List store branches for switcher / dropdown",
    description="Returns a lightweight list containing only the essential fields needed for the store switcher (id, name, city, is_active).",
)
async def list_store_selector(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user),
) -> StoreSelectorResponse:
    admin_id = get_user_admin_id(current_user)
    items, total = await get_store_selector_by_admin(db, admin_id=admin_id)
    return StoreSelectorResponse(
        items=[StoreSelectorItem.model_validate(item) for item in items],
        total=total,
    )
