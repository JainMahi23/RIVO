import json
from pathlib import Path


CONFIG_PATH = (
        Path(__file__).resolve().parents[2]
        / "configs"
        / "scoring_weights.json"
)


def load_weights() -> dict:
    with open(CONFIG_PATH, "r", encoding="utf-8") as file:
        weights = json.load(file)

    required = {
        "demand",
        "competition",
        "resource",
        "capital",
        "accessibility",
        "skill"
    }

    if set(weights.keys()) != required:
        raise ValueError("Invalid scoring weight configuration")

    total = sum(weights.values())

    if abs(total - 1.0) > 1e-9:
        raise ValueError(
            f"Scoring weights must sum to 1.0, got {total}"
        )

    for name, value in weights.items():
        if not 0 <= value <= 1:
            raise ValueError(
                f"Invalid weight for {name}: {value}"
            )

    return weights