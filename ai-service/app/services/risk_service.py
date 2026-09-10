import json

from app.prompts.risk_prompt import RISK_SYSTEM_PROMPT
from app.models.user_query import ExtractedInformation


class RiskService:

    def __init__(self, client):
        self.client = client

    def generate_risk_explanation(
            self,
            user_info: ExtractedInformation
    ) -> dict:

        user_data = user_info.model_dump()

        prompt = f"""
{RISK_SYSTEM_PROMPT}

Here is the user's extracted information:

{json.dumps(user_data, ensure_ascii=False, indent=2)}

Analyze the business risks for this user.

Identify the most relevant practical risks based on the
available information.

For every risk provide:
- risk
- severity
- explanation
- mitigation

Return ONLY valid JSON in this structure:

{{
    "overall_risk_level": "MEDIUM",
    "risks": [
        {{
            "risk": "",
            "severity": "MEDIUM",
            "explanation": "",
            "mitigation": ""
        }}
    ]
}}
"""

        response = self.client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        text = response.text.strip()

        # Remove markdown code fences if Gemini adds them
        if text.startswith("```"):
            text = text.replace("```json", "")
            text = text.replace("```", "")
            text = text.strip()

        try:
            return json.loads(text)
        except json.JSONDecodeError:
            raise ValueError("Gemini returned invalid risk JSON")