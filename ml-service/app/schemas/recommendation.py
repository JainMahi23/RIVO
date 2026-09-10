from typing import Optional
from pydantic import BaseModel, Field


class LocationInput(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class UserProfile(BaseModel):
    capital: Optional[float] = Field(default=None, ge=0)

    location: Optional[LocationInput] = None

    skills: list[str] = Field(default_factory=list)

    experience: list[str] = Field(default_factory=list)

    resources: list[str] = Field(default_factory=list)

    land_area: Optional[float] = Field(default=None, ge=0)

    land_unit: Optional[str] = None


class MarketData(BaseModel):
    population: Optional[int] = Field(default=None, ge=0)

    market_distance_km: Optional[float] = Field(
        default=None,
        ge=0
    )

    demand_index: Optional[float] = Field(
        default=None,
        ge=0,
        le=100
    )

    market_count_5km: Optional[int] = Field(
        default=None,
        ge=0
    )


class CompetitionData(BaseModel):
    competitor_count_1km: Optional[int] = Field(
        default=None,
        ge=0
    )

    competitor_count_5km: Optional[int] = Field(
        default=None,
        ge=0
    )

    competitor_count_10km: Optional[int] = Field(
        default=None,
        ge=0
    )

    nearest_competitor_distance_km: Optional[float] = Field(
        default=None,
        ge=0
    )


class RecommendationRequest(BaseModel):
    user_profile: UserProfile
    market_data: Optional[MarketData] = None
    competition_data: Optional[CompetitionData] = None
    top_n: int = Field(default=5, ge=1, le=20)