from app.scoring.feasibility import calculate_feasibility


def test_feasibility_score():

    score = calculate_feasibility(
        demand=86,
        competition_advantage=80,
        resource_fit=90,
        capital_fit=78,
        accessibility=85,
        skill_fit=82,
    )

    assert score == 83.7