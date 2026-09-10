def rank_recommendations(
        recommendations: list[dict]
) -> list[dict]:

    sorted_recommendations = sorted(
        recommendations,
        key=lambda item: (
            -item["score"],
            -item["data_quality_score"],
            -item["components"]["resource_fit"],
            item["business"]
        )
    )

    for index, recommendation in enumerate(
            sorted_recommendations,
            start=1
    ):
        recommendation["rank"] = index

    return sorted_recommendations