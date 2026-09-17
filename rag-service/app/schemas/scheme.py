from typing import Optional

from pydantic import BaseModel, Field


class Scheme(BaseModel):

    scheme_id: str

    name: str

    level: str

    state: Optional[str] = None

    ministry: Optional[str] = None

    category: str

    description: str

    eligibility: list[str] = Field(
        default_factory=list
    )

    benefits: list[str] = Field(
        default_factory=list
    )

    required_documents: list[str] = Field(
        default_factory=list
    )

    application_process: list[str] = Field(
        default_factory=list
    )

    official_source: str

    last_verified: Optional[str] = None