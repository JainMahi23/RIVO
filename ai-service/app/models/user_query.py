from typing import Optional, Literal
from pydantic import BaseModel


class UserQuery(BaseModel):
    message: str


class ExtractedInformation(BaseModel):
    intent: Literal[
        "START_BUSINESS",
        "FIND_BUSINESS",
        "CHECK_SCHEME",
        "FINANCIAL_QUERY",
        "GENERATE_REPORT",
        "GENERAL_QA",
        "UNKNOWN"
    ]

    business: Optional[str] = None
    location: Optional[str] = None
    skills: Optional[list[str]] = None
    experience: Optional[str] = None
    resources: Optional[list[str]] = None
    project_cost: Optional[float] = None
    language: Optional[str] = None