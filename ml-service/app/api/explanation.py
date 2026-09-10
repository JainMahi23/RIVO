from fastapi import APIRouter

from app.scoring.weights import load_weights


router = APIRouter(
    prefix="/ml",
    tags=["Score Explanation"]
)


@router.post("/explain-score")
def explain_score(data: dict):

    components = data.get("components", {})
    business = data.get("business", "unknown")

    weights = load_weights()

    contributions = {
        "demand": round(
            components.get("demand", 0) * weights["demand"], 2
        ),
        "competition_advantage": round(
            components.get("competition_advantage", 0)
            * weights["competition"], 2
        ),
        "resource_fit": round(
            components.get("resource_fit", 0)
            * weights["resource"], 2
        ),
        "capital_fit": round(
            components.get("capital_fit", 0)
            * weights["capital"], 2
        ),
        "accessibility": round(
            components.get("accessibility", 0)
            * weights["accessibility"], 2
        ),
        "skill_fit": round(
            components.get("skill_fit", 0)
            * weights["skill"], 2
        ),
    }

    overall_score = round(sum(contributions.values()), 2)

    strengths = []
    weaknesses = []

    for name, value in components.items():

        if name == "competition_level":
            continue

        if value >= 80:
            strengths.append(name)

        elif value < 50:
            weaknesses.append(name)

    return {
        "status": "SUCCESS",
        "explanation": {
            "business": business,
            "overall_score": overall_score,
            "components": components,
            "weights": weights,
            "contributions": contributions,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "summary": (
                f"{business} has an overall feasibility score "
                f"of {overall_score}/100 based on the configured "
                f"weighted scoring model."
            )
        }
    }