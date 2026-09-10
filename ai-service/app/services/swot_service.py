import json

from app.prompts.swot_prompt import SWOT_SYSTEM_PROMPT
from app.models.user_query import ExtractedInformation


class SWOTService:

    def __init__(self, client):
        self.client = client

    def generate_swot(self, user_info: ExtractedInformation) -> dict:

        user_data = user_info.model_dump()

        prompt = f"""
{SWOT_SYSTEM_PROMPT}

Here is the user's extracted information:

{json.dumps(user_data, ensure_ascii=False, indent=2)}

Generate a practical SWOT analysis for this user's business.

Return ONLY valid JSON in this structure:

{{
    "strengths": [],
    "weaknesses": [],
    "opportunities": [],
    "threats": []
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
            raise ValueError("Gemini returned invalid SWOT JSON")