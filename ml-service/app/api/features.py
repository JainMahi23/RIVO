from fastapi import APIRouter

from app.features.feature_pipeline import build_business_features
from app.services.recommendation_service import load_business_catalog
from app.schemas.recommendation import RecommendationRequest


router = APIRouter(
    prefix="/ml",
    tags=["Features"]
)


@router.post("/features")
def extract_features(request: RecommendationRequest):

    catalog = load_business_catalog()

    features = {}

    market_data = (
        request.market_data.model_dump()
        if request.market_data
        else None
    )

    competition_data = (
        request.competition_data.model_dump()
        if request.competition_data
        else None
    )

    user_profile = request.user_profile.model_dump()

    for business_code, business_config in catalog.items():

        features[business_code] = build_business_features(
            user_profile=user_profile,
            business_config=business_config,
            market_data=market_data,
            competition_data=competition_data,
        )

    return {
        "status": "SUCCESS",
        "features": features,
    }