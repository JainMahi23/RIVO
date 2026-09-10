from fastapi import APIRouter

from app.features.market_features import calculate_demand_index


router = APIRouter(
    prefix="/ml",
    tags=["Market Analysis"]
)


@router.post("/market-analysis")
def market_analysis(market_data: dict):

    demand_index = market_data.get("demand_index")
    population = market_data.get("population")
    market_count = market_data.get("market_count_5km")

    demand_score = calculate_demand_index(
        direct_demand_index=demand_index,
        population=population,
        market_count=market_count,
    )

    if demand_index is not None:
        data_source = "DIRECT"
        data_note = "Demand score is based on the provided demand index."
    elif population is not None or market_count is not None:
        data_source = "DERIVED"
        data_note = (
            "Demand score is an estimated heuristic derived "
            "from available market signals."
        )
    else:
        data_source = "MISSING"
        data_note = "Insufficient market data to estimate demand."

    if demand_score >= 75:
        opportunity_level = "HIGH"
    elif demand_score >= 50:
        opportunity_level = "MEDIUM"
    else:
        opportunity_level = "LOW"

    return {
        "status": "SUCCESS",
        "market_analysis": {
            "population": population,
            "market_distance_km": market_data.get(
                "market_distance_km"
            ),
            "market_count_5km": market_count,
            "demand_index": demand_index,
            "demand_score": demand_score,
            "data_source": data_source,
            "opportunity_level": opportunity_level,
            "data_note": data_note,
        }
    }