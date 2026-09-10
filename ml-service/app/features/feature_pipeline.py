from app.features.market_features import (
    calculate_accessibility,
    calculate_demand_index,
)

from app.features.competition_features import (
    calculate_competition_advantage,
    get_competition_level,
)

from app.features.resource_features import calculate_resource_fit

from app.features.user_features import (
    calculate_capital_fit,
    calculate_skill_fit,
)


def build_business_features(
        user_profile,
        business_config: dict,
        market_data=None,
        competition_data=None,
) -> dict:

    market_data = market_data or {}
    competition_data = competition_data or {}

    demand = calculate_demand_index(
        direct_demand_index=market_data.get("demand_index"),
        population=market_data.get("population"),
        market_count=market_data.get("market_count_5km"),
    )

    competition_advantage = calculate_competition_advantage(
        competition_data.get("competitor_count_5km")
    )

    resource_fit = calculate_resource_fit(
        user_resources=user_profile.get("resources", []),
        required_resources=business_config.get(
            "required_resources", []
        ),
    )

    capital_fit = calculate_capital_fit(
        user_capital=user_profile.get("capital"),
        required_min=business_config.get(
            "required_capital_min", 0
        ),
        required_max=business_config.get(
            "required_capital_max", 0
        ),
    )

    skill_fit = calculate_skill_fit(
        user_skills=user_profile.get("skills", []),
        user_experience=user_profile.get("experience", []),
        required_skills=business_config.get(
            "required_skills", []
        ),
    )

    accessibility = calculate_accessibility(
        market_data.get("market_distance_km")
    )

    return {
        "demand": demand,
        "competition_advantage": competition_advantage,
        "resource_fit": resource_fit,
        "capital_fit": capital_fit,
        "accessibility": accessibility,
        "skill_fit": skill_fit,
        "competition_level": get_competition_level(
            competition_data.get("competitor_count_5km")
        ),
    }