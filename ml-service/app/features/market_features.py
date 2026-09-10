def calculate_accessibility(
        market_distance_km: float | None
) -> float:

    if market_distance_km is None:
        return 0.0

    if market_distance_km <= 1:
        return 100.0

    if market_distance_km <= 3:
        return 90.0

    if market_distance_km <= 5:
        return 80.0

    if market_distance_km <= 10:
        return 60.0

    if market_distance_km <= 20:
        return 40.0

    return 20.0
def calculate_demand_index(
        direct_demand_index: float | None,
        population: int | None,
        market_count: int | None
) -> float:

    if direct_demand_index is not None:
        return round(
            max(0, min(100, direct_demand_index)),
            2
        )

    signals = []

    if population is not None:
        population_score = min(
            100,
            (population / 10000) * 50
        )
        signals.append(population_score)

    if market_count is not None:
        market_activity_score = min(
            100,
            market_count * 10
        )
        signals.append(market_activity_score)

    if not signals:
        return 0.0

    return round(sum(signals) / len(signals), 2)