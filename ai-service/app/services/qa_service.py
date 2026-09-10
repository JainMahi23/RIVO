import json

from app.prompts.qa_prompt import QA_SYSTEM_PROMPT


class QAService:

    def __init__(self, client):
        self.client = client

    def answer_question(self, message: str) -> dict:

        prompt = f"""
{QA_SYSTEM_PROMPT}

User question:

{message}

Answer the user's question.

Return ONLY valid JSON in this structure:

{{
    "answer": "",
    "key_points": [],
    "next_steps": []
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
            raise ValueError("Gemini returned invalid Q&A JSON")