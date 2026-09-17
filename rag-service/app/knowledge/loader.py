import json
from pathlib import Path


DATA_PATH = (
        Path(__file__).resolve().parents[2]
        / "data"
        / "processed"
        / "schemes.json"
)


def load_schemes() -> list[dict]:

    if not DATA_PATH.exists():
        return []

    with open(
            DATA_PATH,
            "r",
            encoding="utf-8"
    ) as file:

        return json.load(file)