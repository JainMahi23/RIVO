import json

from google import genai

from app.prompts.advisor_prompt import ADVISOR_SYSTEM_PROMPT
from app.models.user_query import ExtractedInformation


class AdvisorService:

    def __init__(self, client):
        self.client = client

    def generate_advice(self, user_info: ExtractedInformation) -> dict:

        user_data = user_info.model_dump()

        prompt = f"""
{ADVISOR_SYSTEM_PROMPT}

Here is the user's extracted information:

{json.dumps(user_data, ensure_ascii=False, indent=2)}

Generate practical business advice for this user.

Return ONLY valid JSON in this structure:

{{
    "summary": "",
    "business_fit": "",
    "required_resources": [],
    "next_steps": [],
    "challenges": [],
    "risks": [],
    "roadmap": []
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
            raise ValueError("Gemini returned invalid advisor JSON")