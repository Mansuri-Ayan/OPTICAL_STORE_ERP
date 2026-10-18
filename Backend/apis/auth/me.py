# API: auth/me.py
from fastapi import APIRouter, Depends
from core.deps import get_current_user
from models.admin import Admin
from models.manager import Manager
from models.worker import Worker
from models.optician import Optician
from models.superadmin import SuperAdmin
from models.accountant import Accountant
from schemas.user import AuthMeResponse

router = APIRouter()


@router.get(
    "/me",
    response_model=AuthMeResponse,
    summary="Get current user profile (session identity)",
    description=(
        "Returns the minimal session identity of the authenticated user (Admin, SuperAdmin, Manager, Worker, Optician, or Accountant). "
        "Strictly provides only identity fields necessary for maintaining authentication and layout indicators."
    ),
)
async def me(
    current_user=Depends(get_current_user),
) -> AuthMeResponse:
    """
    Return the authenticated user's profile with zero unnecessary fields.
    """
    if isinstance(current_user, Admin):
        full_name = f"{current_user.owner_first_name} {current_user.owner_last_name}".strip()
        return AuthMeResponse(
            id=current_user.id,
            email=current_user.email,
            full_name=full_name or "Admin User",
            role="admin",
            store_id=None,
            store_name=current_user.business_name or "Visionary Optics",
        )
    elif isinstance(current_user, Manager):
        full_name = f"{current_user.first_name} {current_user.last_name}".strip()
        return AuthMeResponse(
            id=current_user.id,
            email=current_user.email,
            full_name=full_name or "Store Manager",
            role="manager",
            store_id=current_user.store_id,
            store_name=current_user.store.store_name if current_user.store else None,
        )
    elif isinstance(current_user, Worker):
        full_name = f"{current_user.first_name} {current_user.last_name}".strip()
        return AuthMeResponse(
            id=current_user.id,
            email=current_user.email,
            full_name=full_name or "Staff Member",
            role="worker",
            store_id=current_user.store_id,
            store_name=current_user.store.store_name if current_user.store else None,
        )
    elif isinstance(current_user, Optician):
        full_name = f"{current_user.first_name} {current_user.last_name}".strip()
        return AuthMeResponse(
            id=current_user.id,
            email=current_user.email,
            full_name=full_name or "Optician",
            role="optician",
            store_id=current_user.store_id,
            store_name=current_user.store.store_name if current_user.store else None,
        )
    elif isinstance(current_user, SuperAdmin):
        full_name = f"{current_user.first_name} {current_user.last_name}".strip()
        return AuthMeResponse(
            id=current_user.id,
            email=current_user.email,
            full_name=full_name or "Super Administrator",
            role="superadmin",
            store_id=None,
            store_name="System Administration",
        )
    elif isinstance(current_user, Accountant):
        full_name = f"{current_user.first_name} {current_user.last_name}".strip()
        return AuthMeResponse(
            id=current_user.id,
            email=current_user.email,
            full_name=full_name or "Accountant",
            role="accountant",
            store_id=None,
            store_name="Accounting Office",
        )
    else:
        return AuthMeResponse(
            id=getattr(current_user, "id", 0),
            email=getattr(current_user, "email", ""),
            full_name=getattr(current_user, "full_name", "User"),
            role=str(getattr(current_user, "role", "worker")).lower(),
            store_id=getattr(current_user, "store_id", None),
            store_name=getattr(current_user, "store_name", None),
        )
