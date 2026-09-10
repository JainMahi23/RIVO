import json

from app.prompts.business_explanation_prompt import (
    BUSINESS_EXPLANATION_SYSTEM_PROMPT
)


class BusinessExplanationService:

    def __init__(self, client):
        self.client = client

    def explain_recommendation(
            self,
            recommendation_data: dict
    ) -> dict:

        prompt = f"""
{BUSINESS_EXPLANATION_SYSTEM_PROMPT}

Recommendation data:

{json.dumps(
            recommendation_data,
            ensure_ascii=False,
            indent=2
        )}

Explain why this recommendation may fit the user.

Do not modify any supplied score or factual value.

Return ONLY valid JSON in this structure:

{{
    "recommendation": "",
    "why_it_fits": [],
    "matching_factors": [],
    "limitations": [],
    "what_to_verify": [],
    "confidence": "LOW"
}}
"""

        response = self.client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        text = response.text.strip()

        if text.startswith("```"):
            text = text.replace("```json", "")
            text = text.replace("```", "")
            text = text.strip()

        try:
            return json.loads(text)
        except json.JSONDecodeError:
            raise ValueError(
                "Gemini returned invalid business explanation JSON"
            )