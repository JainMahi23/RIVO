from app.features.resource_features import calculate_resource_fit
from app.features.user_features import (
    calculate_capital_fit,
    calculate_skill_fit,
)
from app.features.market_features import calculate_accessibility


def test_resource_fit():

    score = calculate_resource_fit(
        ["land", "water"],
        ["land", "water"]
    )

    assert score == 100


def test_partial_resource_fit():

    score = calculate_resource_fit(
        ["land"],
        ["land", "water"]
    )

    assert score == 50


def test_capital_fit():

    score = calculate_capital_fit(
        500000,
        100000,
        1000000
    )

    assert score == 100


def test_skill_fit():

    score = calculate_skill_fit(
        ["farming", "animal_handling"],
        ["dairy"],
        ["farming", "animal_handling"]
    )

    assert score == 70


def test_accessibility():

    assert calculate_accessibility(3) == 90
    assert calculate_accessibility(20) == 40