from pydantic import BaseModel, Field


class ScoreRequest(BaseModel):
    business: str
    user_profile: dict
    market_data: dict | None = None
    competition_data: dict | None = None


class ScoreComponents(BaseModel):
    demand: float = Field(ge=0, le=100)
    competition_advantage: float = Field(ge=0, le=100)
    resource_fit: float = Field(ge=0, le=100)
    capital_fit: float = Field(ge=0, le=100)
    accessibility: float = Field(ge=0, le=100)
    skill_fit: float = Field(ge=0, le=100)