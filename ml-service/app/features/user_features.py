def calculate_capital_fit(
        user_capital: float | None,
        required_min: float,
        required_max: float
) -> float:

    if user_capital is None:
        return 0.0

    if user_capital < required_min:
        ratio = user_capital / required_min

        return round(max(0, min(100, ratio * 100)), 2)

    if user_capital <= required_max:
        return 100.0

    excess_ratio = required_max / user_capital

    return round(
        max(80, min(100, excess_ratio * 100)),
        2
    )
def calculate_skill_fit(
        user_skills: list[str],
        user_experience: list[str],
        required_skills: list[str]
) -> float:

    if not required_skills:
        return 100.0

    skills = {
        item.strip().lower()
        for item in user_skills
    }

    experience = {
        item.strip().lower()
        for item in user_experience
    }

    required = {
        item.strip().lower()
        for item in required_skills
    }

    skill_matches = skills.intersection(required)
    experience_matches = experience.intersection(required)

    skill_score = (
                          len(skill_matches) / len(required)
                  ) * 70

    experience_score = (
                               len(experience_matches) / len(required)
                       ) * 30

    return round(
        min(100, skill_score + experience_score),
        2
    )