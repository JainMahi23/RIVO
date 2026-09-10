from app.scoring.weights import load_weights


def calculate_feasibility(
        demand: float,
        competition_advantage: float,
        resource_fit: float,
        capital_fit: float,
        accessibility: float,
        skill_fit: float
) -> float:

    weights = load_weights()

    score = (
            demand * weights["demand"]
            + competition_advantage * weights["competition"]
            + resource_fit * weights["resource"]
            + capital_fit * weights["capital"]
            + accessibility * weights["accessibility"]
            + skill_fit * weights["skill"]
    )

    return round(max(0, min(100, score)), 2)