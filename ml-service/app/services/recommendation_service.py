import json
from pathlib import Path

from app.features.feature_pipeline import build_business_features
from app.scoring.feasibility import calculate_feasibility
from app.scoring.opportunity import calculate_opportunity
from app.scoring.ranking import rank_recommendations


CONFIG_PATH = (
        Path(__file__).resolve().parents[2]
        / "configs"
        / "business_config.json"
)


def load_business_catalog() -> dict:
    with open(CONFIG_PATH, "r", encoding="utf-8") as file:
        return json.load(file)


def calculate_data_quality(
        user_profile: dict,
        market_data: dict | None,
        competition_data: dict | None,
) -> dict:

    market_data = market_data or {}
    competition_data = competition_data or {}

    market_complete = (
            market_data.get("demand_index") is not None
            or market_data.get("population") is not None
    )

    competition_complete = (
            competition_data.get("competitor_count_5km") is not None
    )

    user_complete = (
            user_profile.get("capital") is not None
            and len(user_profile.get("resources", [])) > 0
            and (
                    len(user_profile.get("skills", [])) > 0
                    or len(user_profile.get("experience", [])) > 0
            )
    )

    location = user_profile.get("location")

    location_complete = (
            location is not None
            and location.get("latitude") is not None
            and location.get("longitude") is not None
    )

    def quality(value: bool) -> str:
        return "GOOD" if value else "LIMITED"

    qualities = {
        "market": quality(market_complete),
        "competition": quality(competition_complete),
        "user_profile": quality(user_complete),
        "location": quality(location_complete),
    }

    good_count = sum(
        value == "GOOD"
        for value in qualities.values()
    )

    if good_count >= 3:
        overall = "GOOD"
    elif good_count >= 2:
        overall = "FAIR"
    else:
        overall = "LIMITED"

    qualities["overall"] = overall

    return qualities


def get_missing_data_warnings(
        user_profile: dict,
        market_data: dict | None,
        competition_data: dict | None,
) -> list[str]:

    market_data = market_data or {}
    competition_data = competition_data or {}

    warnings = []

    # Capital
    if user_profile.get("capital") is None:
        warnings.append(
            "Available capital is missing; capital-fit score is limited."
        )

    # Location
    location = user_profile.get("location")

    if (
            location is None
            or location.get("latitude") is None
            or location.get("longitude") is None
    ):
        warnings.append(
            "Location coordinates are missing; hyper-local analysis cannot be fully verified."
        )

    # Market
    if (
            market_data.get("demand_index") is None
            and market_data.get("population") is None
            and market_data.get("market_count_5km") is None
    ):
        warnings.append(
            "Market data is missing; demand score cannot be based on local market signals."
        )
    elif market_data.get("demand_index") is None:
        warnings.append(
            "Direct demand index is missing; demand score is estimated from available market signals."
        )

    # Competition
    if competition_data.get("competitor_count_5km") is None:
        warnings.append(
            "5 km competitor data is missing; competition advantage cannot be verified."
        )

    # Resources
    if not user_profile.get("resources"):
        warnings.append(
            "User resource information is missing; resource-fit score is limited."
        )

    # Skills / experience
    if (
            not user_profile.get("skills")
            and not user_profile.get("experience")
    ):
        warnings.append(
            "Skills and experience information is missing; skill-fit score is limited."
        )

    return warnings


def calculate_confidence(data_quality: dict) -> str:

    overall = data_quality["overall"]

    if overall == "GOOD":
        return "HIGH"

    if overall == "FAIR":
        return "MEDIUM"

    return "LOW"


def calculate_data_quality_score(data_quality: dict) -> int:

    return {
        "GOOD": 3,
        "FAIR": 2,
        "LIMITED": 1,
    }[data_quality["overall"]]


def recommend_businesses(
        user_profile: dict,
        market_data: dict | None = None,
        competition_data: dict | None = None,
        top_n: int = 5,
) -> list[dict]:

    catalog = load_business_catalog()

    market_data = market_data or {}
    competition_data = competition_data or {}

    data_quality = calculate_data_quality(
        user_profile,
        market_data,
        competition_data,
    )

    warnings = get_missing_data_warnings(
        user_profile,
        market_data,
        competition_data,
    )

    confidence = calculate_confidence(data_quality)

    recommendations = []

    for business_code, business_config in catalog.items():

        components = build_business_features(
            user_profile=user_profile,
            business_config=business_config,
            market_data=market_data,
            competition_data=competition_data,
        )

        score = calculate_feasibility(
            demand=components["demand"],
            competition_advantage=components["competition_advantage"],
            resource_fit=components["resource_fit"],
            capital_fit=components["capital_fit"],
            accessibility=components["accessibility"],
            skill_fit=components["skill_fit"],
        )

        opportunity = calculate_opportunity(
            demand=components["demand"],
            competition_advantage=components["competition_advantage"],
            resource_fit=components["resource_fit"],
            capital_fit=components["capital_fit"],
        )

        recommendations.append({
            "rank": 0,
            "business": business_code,
            "business_name": business_config["name"],
            "score": score,

            "components": {
                "demand": components["demand"],
                "competition_advantage": components["competition_advantage"],
                "resource_fit": components["resource_fit"],
                "capital_fit": components["capital_fit"],
                "accessibility": components["accessibility"],
                "skill_fit": components["skill_fit"],
            },

            "opportunity_level": opportunity["level"],
            "competition_level": components["competition_level"],

            "data_quality": data_quality,
            "data_quality_score": calculate_data_quality_score(
                data_quality
            ),

            "confidence": confidence,
            "warnings": warnings,
        })

    recommendations = rank_recommendations(recommendations)

    return recommendations[:top_n]


def score_single_business(
        business_code: str,
        user_profile: dict,
        market_data: dict | None = None,
        competition_data: dict | None = None,
) -> dict:

    catalog = load_business_catalog()

    if business_code not in catalog:
        raise ValueError(
            f"Unknown business: {business_code}"
        )

    market_data = market_data or {}
    competition_data = competition_data or {}

    business_config = catalog[business_code]

    components = build_business_features(
        user_profile=user_profile,
        business_config=business_config,
        market_data=market_data,
        competition_data=competition_data,
    )

    score = calculate_feasibility(
        demand=components["demand"],
        competition_advantage=components["competition_advantage"],
        resource_fit=components["resource_fit"],
        capital_fit=components["capital_fit"],
        accessibility=components["accessibility"],
        skill_fit=components["skill_fit"],
    )

    opportunity = calculate_opportunity(
        demand=components["demand"],
        competition_advantage=components["competition_advantage"],
        resource_fit=components["resource_fit"],
        capital_fit=components["capital_fit"],
    )

    data_quality = calculate_data_quality(
        user_profile,
        market_data,
        competition_data,
    )

    warnings = get_missing_data_warnings(
        user_profile,
        market_data,
        competition_data,
    )

    confidence = calculate_confidence(data_quality)

    return {
        "business": business_code,
        "business_name": business_config["name"],
        "score": score,

        "components": {
            "demand": components["demand"],
            "competition_advantage": components["competition_advantage"],
            "resource_fit": components["resource_fit"],
            "capital_fit": components["capital_fit"],
            "accessibility": components["accessibility"],
            "skill_fit": components["skill_fit"],
        },

        "opportunity_level": opportunity["level"],
        "competition_level": components["competition_level"],

        "data_quality": data_quality,
        "confidence": confidence,
        "warnings": warnings,
    }