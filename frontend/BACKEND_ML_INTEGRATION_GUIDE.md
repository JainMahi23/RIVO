# RIVO Frontend - Backend & ML Microservice Integration Guide

This guide details the API contracts, JSON schemas, payload formats, and microservice endpoints expected by the RIVO frontend application.

---

## 1. Environment Configuration

Configure environment parameters in `frontend/.env` (or via deployment pipeline env vars):

```env
# Main REST API Backend Base URL
VITE_API_URL=http://localhost:5000/api

# Machine Learning / AI Microservices Base URL
VITE_ML_API_URL=http://localhost:8000/api/v1/ml

# Enable client-side mock fallback when backend/ML service is offline (true | false)
VITE_ENABLE_MOCK_FALLBACK=true
```

---

## 2. Authentication Protocol

All authenticated requests include credentials:
- **Cookie Auth**: `rivo_session` HTTP-Only Cookie (`withCredentials: true`)
- **Bearer Header**: `Authorization: Bearer <token>` (if stored in localStorage `rivo_auth_token`)

### Endpoints (`/api/auth`)

| Endpoint | Method | Request Payload | Success Response (200) |
| :--- | :--- | :--- | :--- |
| `/auth/otp/request` | `POST` | `{ "mobile": "9876543210" }` | `{ "message": "OTP sent" }` |
| `/auth/otp/verify` | `POST` | `{ "mobile": "...", "otp": "123456" }` | `{ "user": { "id", "name", "mobile" }, "token": "jwt..." }` |
| `/auth/login` | `POST` | `{ "identifier": "...", "password": "..." }` | `{ "user": { ... }, "token": "..." }` |
| `/auth/register` | `POST` | `{ "fullName", "mobile", "village", "district" }` | `{ "user": { ... }, "token": "..." }` |
| `/auth/me` | `GET` | — | `{ "user": { "id", "name", "mobile", ... } }` |
| `/auth/logout` | `POST` | — | `{ "message": "Logged out" }` |

---

## 3. Machine Learning & AI Microservices (`VITE_ML_API_URL`)

### A. Feasibility Scoring Model (`POST /feasibility/predict`)
Predicts overall business feasibility, financial health index, and generates SWOT analysis using ML classification models.

**Request Payload:**
```json
{
  "assessmentId": "asmt_01",
  "personal": {
    "experienceYears": 5,
    "category": "OBC"
  },
  "business": {
    "businessType": "Kirana & Agro-Store",
    "lat": 32.1109,
    "lng": 76.5363,
    "initialInvestment": 350000,
    "expectedMonthlyRevenue": 120000,
    "expectedMonthlyExpense": 75000,
    "loanRequired": 250000
  }
}
```

**Expected ML Response:**
```json
{
  "overallScore": 84,
  "marketScore": 79,
  "financialScore": 88,
  "modelConfidence": 0.92,
  "swot": {
    "strengths": ["High catchment population", "Low competitor saturation"],
    "weaknesses": ["Seasonal cash flow variations"],
    "opportunities": ["PMEGP subsidy eligible"],
    "threats": ["Fluctuating distributor costs"]
  },
  "recommendations": [
    "Maintain 45 days of working capital buffer."
  ]
}
```

---

### B. Market Demand & Footfall Model (`POST /market/demand-forecast`)
Estimates population catchment, daily footfall, and competitor density based on GIS lat/lng coordinates.

**Request Payload:**
```json
{
  "assessmentId": "asmt_01",
  "lat": 32.1109,
  "lng": 76.5363,
  "radiusKm": 3
}
```

**Expected ML Response:**
```json
{
  "catchmentPopulation": 20800,
  "estimatedDailyFootfall": 145,
  "demandIntensityIndex": 8.4,
  "series": [
    { "label": "Mon", "value": 65 },
    { "label": "Tue", "value": 92 },
    { "label": "Wed", "value": 78 },
    { "label": "Thu", "value": 110 },
    { "label": "Fri", "value": 105 },
    { "label": "Sat", "value": 140 },
    { "label": "Sun", "value": 155 }
  ],
  "competitorDensity": [
    { "name": "General stores", "count": 5, "risk": "Medium" }
  ]
}
```

---

### C. Government Scheme Ranker Model (`POST /schemes/rank`)
Uses feature-matching and decision trees to rank government loan schemes (PMEGP, MUDRA, Stand-Up India) by eligibility match score.

**Expected ML Response:**
```json
{
  "schemes": [
    {
      "id": "pmegp",
      "name": "PMEGP",
      "category": "Central Subsidy Scheme",
      "matchPercent": 94,
      "subsidy": "25% - 35%",
      "maxLoan": "₹25,00,000",
      "reasons": ["Rural location eligible for 35% margin money"]
    }
  ]
}
```

---

### D. AI Copilot / LLM Service (`POST /ai/chat`)
Generates context-aware conversational advice for small business owners.

**Request Payload:**
```json
{
  "assessmentId": "asmt_01",
  "message": "How do I calculate my PMEGP subsidy?",
  "history": []
}
```

**Expected Response:**
```json
{
  "reply": "PMEGP provides 25% subsidy in urban areas and 35% in rural areas for special category entrepreneurs...",
  "suggestedPrompts": [
    "What documents are needed?",
    "How to prepare a DPR report?"
  ]
}
```

---

## 4. REST API Endpoint Mapping

- `GET /api/assessments` — List user assessments
- `GET /api/assessments/active` — Active assessment details
- `POST /api/assessments` — Create new assessment draft
- `PATCH /api/assessments/:id/steps/:step` — Update step details (`personal`, `business`)
- `POST /api/assessments/:id/submit` — Finalize assessment
- `GET /api/finance/:id/feasibility` — Retrieve feasibility & financial projection metrics
- `GET /api/finance/:id/reports/:reportId/download` — Stream PDF report blob
- `GET /api/schemes/:id/matches` — Fetch matched government schemes
- `POST /api/schemes/:id/:schemeId/apply` — Record scheme application

---

## 5. System Health Check Endpoints

The frontend settings page monitors system connectivity by querying:
- Backend REST API: `GET {VITE_API_URL}/health` (200 OK)
- ML Microservice: `GET {VITE_ML_API_URL}/health` (200 OK)
