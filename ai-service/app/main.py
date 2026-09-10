# import os
#
# from dotenv import load_dotenv
# from fastapi import FastAPI
# from google import genai
# from app.services.swot_service import SWOTService
# from app.models.user_query import UserQuery, ExtractedInformation
# from app.services.nlu_service import NLUService
# from app.services.advisor_service import AdvisorService
# from app.services.risk_service import RiskService
# load_dotenv()
#
# app = FastAPI(
#     title="RIVO AI Service",
#     version="1.0.0",
#     description="AI/NLU service for RIVO"
# )
#
# nlu_service = NLUService()
# gemini_client = genai.Client(
#     api_key=os.getenv("GEMINI_API_KEY")
# )
#
# advisor_service = AdvisorService(gemini_client)
# swot_service = SWOTService(gemini_client)
# risk_service = RiskService(gemini_client)
# @app.get("/")
# def root():
#     return {
#         "message": "RIVO AI Service is running"
#     }
#
#
# @app.get("/health")
# def health():
#     return {
#         "status": "healthy",
#         "service": "rivo-ai-service"
#     }
#
#
# @app.post("/api/v1/nlu", response_model=ExtractedInformation)
# def analyze_query(query: UserQuery):
#     return nlu_service.analyze(query.message)
#
#
# @app.post("/api/v1/advisor")
# def generate_advice(query: UserQuery):
#     user_info = nlu_service.analyze(query.message)
#
#     advice = advisor_service.generate_advice(user_info)
#
#     return {
#         "user_information": user_info,
#         "advice": advice
#     }
# @app.post("/api/v1/swot")
# def generate_swot(query: UserQuery):
#     user_info = nlu_service.analyze(query.message)
#
#     swot = swot_service.generate_swot(user_info)
#
#     return {
#         "user_information": user_info,
#         "swot": swot
#     }
# @app.post("/api/v1/risk")
# def generate_risk(query: UserQuery):
#     user_info = nlu_service.analyze(query.message)
#
#     risk = risk_service.generate_risk_explanation(user_info)
#
#     return {
#         "user_information": user_info,
#         "risk_analysis": risk
#     }
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from google import genai

from app.models.user_query import UserQuery, ExtractedInformation
from app.services.nlu_service import NLUService
from app.services.advisor_service import AdvisorService
from app.services.swot_service import SWOTService
from app.services.risk_service import RiskService
from app.services.roadmap_service import RoadmapService
from app.guardrails.guardrails_service import GuardrailsService
from app.services.qa_service import QAService
from app.services.business_explanation_service import (
    BusinessExplanationService
)

load_dotenv()

app = FastAPI(
    title="RIVO AI Service",
    version="1.0.0",
    description="AI/NLU service for RIVO"
)

nlu_service = NLUService()

gemini_client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

advisor_service = AdvisorService(gemini_client)
swot_service = SWOTService(gemini_client)
risk_service = RiskService(gemini_client)
roadmap_service = RoadmapService(gemini_client)
guardrails_service = GuardrailsService()
qa_service = QAService(gemini_client)
business_explanation_service = BusinessExplanationService(
    gemini_client
)


@app.get("/")
def root():
    return {
        "message": "RIVO AI Service is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "rivo-ai-service"
    }


# @app.post("/api/v1/nlu", response_model=ExtractedInformation)
# def analyze_query(query: UserQuery):
#     return nlu_service.analyze(query.message)
@app.post("/api/v1/nlu", response_model=ExtractedInformation)
def analyze_query(query: UserQuery):
    user_info = nlu_service.analyze(query.message)

    validated_data = guardrails_service.validate_nlu(
        user_info.model_dump()
    )

    return validated_data


@app.post("/api/v1/advisor")
def generate_advice(query: UserQuery):
    user_info = nlu_service.analyze(query.message)

    advice = advisor_service.generate_advice(user_info)

    advice = guardrails_service.validate_advisor(advice)
    advice = guardrails_service.sanitize_text(advice)

    return {
        "user_information": user_info,
        "advice": advice
    }


@app.post("/api/v1/swot")
def generate_swot(query: UserQuery):
    user_info = nlu_service.analyze(query.message)

    swot = swot_service.generate_swot(user_info)

    swot = guardrails_service.validate_swot(swot)
    swot = guardrails_service.sanitize_text(swot)

    return {
        "user_information": user_info,
        "swot": swot
    }


@app.post("/api/v1/risk")
def generate_risk(query: UserQuery):
    user_info = nlu_service.analyze(query.message)

    risk = risk_service.generate_risk_explanation(user_info)

    risk = guardrails_service.validate_risk(risk)
    risk = guardrails_service.sanitize_text(risk)

    return {
        "user_information": user_info,
        "risk_analysis": risk
    }


@app.post("/api/v1/roadmap")
def generate_roadmap(query: UserQuery):
    user_info = nlu_service.analyze(query.message)

    roadmap = roadmap_service.generate_roadmap(user_info)

    roadmap = guardrails_service.validate_roadmap(roadmap)
    roadmap = guardrails_service.sanitize_text(roadmap)

    return {
        "user_information": user_info,
        "roadmap": roadmap
    }


@app.post("/api/v1/guardrails/test")
def test_guardrails():
    test_data = {
        "overall_risk_level": "INVALID",
        "risks": [
            {
                "risk": " Test risk ",
                "severity": "INVALID",
                "explanation": " Test explanation ",
                "mitigation": " Test mitigation "
            }
        ]
    }

    validated = guardrails_service.validate_risk(test_data)
    validated = guardrails_service.sanitize_text(validated)

    return validated


@app.post("/api/v1/qa")
def general_qa(query: UserQuery):
    answer = qa_service.answer_question(query.message)

    answer = guardrails_service.sanitize_text(answer)

    return {
        "question": query.message,
        "answer": answer
    }
@app.post("/api/v1/business-explanation")
def explain_business_recommendation(query: dict):
    explanation = business_explanation_service.explain_recommendation(
        query
    )

    explanation = guardrails_service.validate_business_explanation(
        explanation
    )

    explanation = guardrails_service.sanitize_text(
        explanation
    )

    return {
        "explanation": explanation
    }