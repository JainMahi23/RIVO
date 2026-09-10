import os
import json

from dotenv import load_dotenv
from google import genai

from app.models.user_query import ExtractedInformation

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError("GEMINI_API_KEY is not configured")

client = genai.Client(api_key=api_key)


class NLUService:

    def analyze(self, message: str) -> ExtractedInformation:

        prompt = f"""
You are the Natural Language Understanding engine for RIVO,
an AI platform that helps users discover and start businesses.

Analyze the user's message and extract structured information.

Possible intents:
- START_BUSINESS
- FIND_BUSINESS
- CHECK_SCHEME
- FINANCIAL_QUERY
- GENERATE_REPORT
- GENERAL_QA
- UNKNOWN

Extract:
- intent
- business
- location
- skills
- experience
- resources
- project_cost
- language

Language must be one of:
- en
- hi
- hinglish

Rules:
1. Understand English, Hindi and Hinglish.
2. Do not invent information that the user did not provide.
3. project_cost must be a number in INR.
4. Convert lakh/crore into actual INR numbers.
5. Keep skills and resources as arrays.
6. Return ONLY valid JSON.
7. If information is unavailable, use null.
8. If the user asks about starting a business, use START_BUSINESS.

User message:
{message}

Return JSON in exactly this structure:

{{
    "intent": "START_BUSINESS",
    "business": null,
    "location": null,
    "skills": null,
    "experience": null,
    "resources": null,
    "project_cost": null,
    "language": "en"
}}
"""

        response = client.models.generate_content(
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
            data = json.loads(text)
        except json.JSONDecodeError:
            raise ValueError("Gemini returned invalid JSON")

        return ExtractedInformation(**data)