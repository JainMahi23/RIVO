from app.scoring.ranking import rank_recommendations


def test_ranking():

    recommendations = [
        {
            "business": "business_b",
            "score": 70,
            "data_quality_score": 3,
            "components": {
                "resource_fit": 80
            }
        },
        {
            "business": "business_a",
            "score": 90,
            "data_quality_score": 3,
            "components": {
                "resource_fit": 80
            }
        }
    ]

    result = rank_recommendations(recommendations)

    assert result[0]["business"] == "business_a"
    assert result[0]["rank"] == 1
    assert result[1]["rank"] == 2