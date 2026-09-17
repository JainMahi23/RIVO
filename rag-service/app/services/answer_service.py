import os
from dotenv import load_dotenv
from google import genai
load_dotenv()

class AnswerService:

    def __init__(self):

        api_key = os.getenv(
            "GEMINI_API_KEY"
        )

        if not api_key:

            raise RuntimeError(
                "GEMINI_API_KEY is not configured."
            )

        self.client = genai.Client(
            api_key=api_key
        )

    def generate(
            self,
            query: str,
            context: str
    ) -> str:

        if not context.strip():

            return (
                "I could not find verified government "
                "scheme information for this query. "
                "Please verify the latest information "
                "on the official government portal."
            )

        prompt = f"""
You are RIVO's Government Scheme Knowledge Assistant.

Answer the user's question ONLY using the
verified government information provided in CONTEXT.

USER QUESTION:
{query}

CONTEXT:
{context}

STRICT RULES:

1. Do not invent schemes.
2. Do not invent eligibility criteria.
3. Do not invent subsidy amounts.
4. Do not invent loan amounts or interest rates.
5. Do not claim approval is guaranteed.
6. Do not claim profit or business success.
7. If the context does not contain an answer,
   explicitly say that the information is not available.
8. Preserve uncertainty where the source is uncertain.
9. Mention the relevant official source.
10. Keep the answer practical and easy to understand.

Return a concise answer.
"""

        response = self.client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        return response.text.strip()