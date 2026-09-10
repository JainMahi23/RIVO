from app.features.market_features import calculate_demand_index
from app.features.competition_features import (
    calculate_competition_advantage,
    get_competition_level,
)


def test_missing_market_data():

    score = calculate_demand_index(
        direct_demand_index=None,
        population=None,
        market_count=None,
    )

    assert score == 0


def test_missing_competition_data():

    score = calculate_competition_advantage(None)

    assert score == 0


def test_unknown_competition():

    level = get_competition_level(None)

    assert level == "UNKNOWN"


def test_demand_bounds():

    assert calculate_demand_index(150, None, None) == 100
    assert calculate_demand_index(-20, None, None) == 0