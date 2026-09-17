from fastapi import APIRouter

from app.knowledge.loader import (
    load_schemes
)


router = APIRouter(
    prefix="/schemes",
    tags=["Schemes"]
)


@router.get("")
def get_schemes():

    schemes = load_schemes()

    return {
        "status": "SUCCESS",
        "count": len(schemes),
        "schemes": schemes
    }