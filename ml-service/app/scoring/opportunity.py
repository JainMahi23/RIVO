def calculate_opportunity(
        demand: float,
        competition_advantage: float,
        resource_fit: float,
        capital_fit: float
) -> dict:

    opportunity_score = (
            demand * 0.40
            + competition_advantage * 0.25
            + resource_fit * 0.20
            + capital_fit * 0.15
    )

    opportunity_score = round(
        max(0, min(100, opportunity_score)),
        2
    )

    if opportunity_score >= 75:
        level = "HIGH"
    elif opportunity_score >= 50:
        level = "MEDIUM"
    else:
        level = "LOW"

    return {
        "score": opportunity_score,
        "level": level
    }