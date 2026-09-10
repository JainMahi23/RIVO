def calculate_competition_advantage(
        competitor_count_5km: int | None
) -> float:

    if competitor_count_5km is None:
        return 0.0

    if competitor_count_5km <= 2:
        return 100.0

    if competitor_count_5km <= 5:
        return 80.0

    if competitor_count_5km <= 10:
        return 60.0

    if competitor_count_5km <= 20:
        return 40.0

    return 20.0


def get_competition_level(
        competitor_count_5km: int | None
) -> str:

    if competitor_count_5km is None:
        return "UNKNOWN"

    if competitor_count_5km <= 2:
        return "LOW"

    if competitor_count_5km <= 5:
        return "MEDIUM"

    return "HIGH"