from fastapi import APIRouter

from app.services.recommendation_service import load_business_catalog


router = APIRouter(
    prefix="/ml",
    tags=["Businesses"]
)


@router.get("/businesses")
def get_businesses():

    catalog = load_business_catalog()

    businesses = []

    for code, config in catalog.items():
        businesses.append({
            "business": code,
            "name": config["name"],
            "category": config["category"],
            "required_capital": {
                "min": config["required_capital_min"],
                "max": config["required_capital_max"]
            },
            "required_resources": config["required_resources"],
            "required_skills": config["required_skills"],
            "risk_categories": config["risk_categories"]
        })

    return {
        "status": "SUCCESS",
        "count": len(businesses),
        "businesses": businesses
    }