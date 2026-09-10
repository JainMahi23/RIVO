import json

from app.prompts.roadmap_prompt import ROADMAP_SYSTEM_PROMPT
from app.models.user_query import ExtractedInformation


class RoadmapService:

    def __init__(self, client):
        self.client = client

    def generate_roadmap(
            self,
            user_info: ExtractedInformation
    ) -> dict:

        user_data = user_info.model_dump()

        prompt = f"""
{ROADMAP_SYSTEM_PROMPT}

Here is the user's extracted information:

{json.dumps(user_data, ensure_ascii=False, indent=2)}

Generate a practical business roadmap for this user.

The roadmap should start from preparation and move toward
business launch and early growth.

Return ONLY valid JSON in this structure:

{{
    "roadmap": [
        {{
            "phase": "",
            "duration": "",
            "actions": [],
            "resources_required": [],
            "milestones": [],
            "risks": []
        }}
    ]
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
            raise ValueError("Gemini returned invalid roadmap JSON")