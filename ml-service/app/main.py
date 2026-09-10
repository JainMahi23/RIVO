from fastapi import FastAPI
from app.api.features import router as features_router
from app.api.market import router as market_router
from app.features.user_features import (
    calculate_capital_fit,
    calculate_skill_fit
)

from app.features.resource_features import (
    calculate_resource_fit
)

from app.features.market_features import (
    calculate_accessibility,
    calculate_demand_index
)

from app.features.competition_features import (
    calculate_competition_advantage,
    get_competition_level
)

from app.scoring.feasibility import calculate_feasibility

from app.scoring.opportunity import calculate_opportunity
from app.schemas.recommendation import RecommendationRequest
from app.services.recommendation_service import (
    recommend_businesses,
    score_single_business,
)
from app.schemas.scoring import ScoreRequest
from app.api.explanation import router as explanation_router
from app.api.businesses import router as businesses_router

app = FastAPI(
    title="RIVO ML Recommendation Service",
    version="1.0.0"
)

app.include_router(features_router)
app.include_router(market_router)
app.include_router(explanation_router)
app.include_router(businesses_router)

@app.get("/")
def root():
    return {
        "message": "RIVO ML Service is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "rivo-ml-service"
    }


@app.post("/ml/test-score")
def test_score():

    demand = 86
    competition_advantage = 80
    resource_fit = 90
    capital_fit = 78
    accessibility = 85
    skill_fit = 82

    score = calculate_feasibility(
        demand=demand,
        competition_advantage=competition_advantage,
        resource_fit=resource_fit,
        capital_fit=capital_fit,
        accessibility=accessibility,
        skill_fit=skill_fit
    )

    opportunity = calculate_opportunity(
        demand=demand,
        competition_advantage=competition_advantage,
        resource_fit=resource_fit,
        capital_fit=capital_fit
    )

    return {
        "score": score,
        "components": {
            "demand": demand,
            "competition_advantage": competition_advantage,
            "resource_fit": resource_fit,
            "capital_fit": capital_fit,
            "accessibility": accessibility,
            "skill_fit": skill_fit
        },
        "opportunity": opportunity
    }
@app.post("/ml/recommend")
def recommend(request: RecommendationRequest):

    recommendations = recommend_businesses(
        user_profile=request.user_profile.model_dump(),
        market_data=(
            request.market_data.model_dump()
            if request.market_data
            else None
        ),
        competition_data=(
            request.competition_data.model_dump()
            if request.competition_data
            else None
        ),
        top_n=request.top_n,
    )

    return {
        "status": "SUCCESS",
        "recommendations": recommendations,
    }
@app.post("/ml/score")
def score_business(request: ScoreRequest):

    try:
        result = score_single_business(
            business_code=request.business,
            user_profile=request.user_profile,
            market_data=request.market_data,
            competition_data=request.competition_data,
        )

        return {
            "status": "SUCCESS",
            "result": result,
        }

    except ValueError as error:
        return {
            "status": "ERROR",
            "message": str(error),
        }