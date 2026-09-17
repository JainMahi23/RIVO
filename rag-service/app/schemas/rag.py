from typing import Optional

from pydantic import BaseModel, Field


class RAGQuery(BaseModel):

    query: str = Field(
        min_length=3
    )

    business: Optional[str] = None

    location: Optional[str] = None

    capital: Optional[float] = None

    top_k: int = Field(
        default=5,
        ge=1,
        le=10
    )


class RetrievedDocument(BaseModel):

    scheme_id: str

    scheme_name: str

    section: str

    content: str

    score: float

    official_source: str


class RAGResponse(BaseModel):

    status: str

    answer: str

    sources: list[RetrievedDocument]

    confidence: str