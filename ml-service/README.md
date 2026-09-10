# RIVO ML Recommendation Service

## Purpose

RIVO ML Service provides deterministic, data-driven business recommendation and feasibility scoring.

## Technology

- Python
- FastAPI
- Pydantic
- NumPy
- Pandas
- scikit-learn
- pytest

## Scoring Model

Overall Feasibility Score:

- Demand: 30%
- Competition Advantage: 20%
- Resource Fit: 15%
- Capital Fit: 15%
- Accessibility: 10%
- Skill/Experience Fit: 10%

All weights are configured in:

`configs/scoring_weights.json`

Weights must sum to 1.0.

## API Endpoints

### GET /health

Service health check.

### GET /ml/businesses

Returns available business catalog.

### POST /ml/features

Calculates business-specific features.

### POST /ml/score

Scores one business.

### POST /ml/recommend

Ranks businesses and returns Top-N recommendations.

### POST /ml/market-analysis

Calculates demand-related market analysis.

### POST /ml/explain-score

Returns deterministic score breakdown and contributions.

## Data Quality

The service distinguishes between:

- GOOD
- FAIR
- LIMITED

Missing market, competition, location, capital, resource, or skill data is explicitly reported through warnings.

## Important Design Rules

The ML service does not use an LLM to calculate feasibility scores.

LLMs may explain recommendation results, but numerical scoring remains deterministic.

Market data must be sourced from real data providers or verified datasets before production deployment.

Derived demand scores are labelled as heuristic estimates.

Government scheme eligibility is handled by the separate government knowledge/RAG service.

Financial calculations such as EMI and interest are handled by the financial engine.

## Current Business Catalog

- Dairy Farming
- Poultry Farming
- Goat Farming
- Vegetable Farming
- Food Processing
- Tailoring
- Kirana / Retail Store
- Food Stall

## Future ML Pipeline

Future versions can introduce supervised ML when sufficient labelled historical business outcome data becomes available.

Until meaningful labelled data exists, the deterministic weighted baseline is the primary recommendation model.

No artificial accuracy metrics are reported.