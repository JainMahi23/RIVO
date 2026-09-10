def calculate_resource_fit(
        user_resources: list[str],
        required_resources: list[str]
) -> float:

    if not required_resources:
        return 100.0

    user_set = {
        resource.strip().lower()
        for resource in user_resources
    }

    required_set = {
        resource.strip().lower()
        for resource in required_resources
    }

    matched = user_set.intersection(required_set)

    score = (
                    len(matched) / len(required_set)
            ) * 100

    return round(score, 2)