from typing import Any


class GuardrailsService:

    ALLOWED_INTENTS = {
        "START_BUSINESS",
        "FIND_BUSINESS",
        "CHECK_SCHEME",
        "FINANCIAL_QUERY",
        "GENERATE_REPORT",
        "GENERAL_QA",
        "UNKNOWN"
    }

    ALLOWED_SEVERITIES = {
        "LOW",
        "MEDIUM",
        "HIGH"
    }

    def validate_nlu(self, data: dict) -> dict:
        if data.get("intent") not in self.ALLOWED_INTENTS:
            data["intent"] = "UNKNOWN"

        if data.get("project_cost") is not None:
            try:
                data["project_cost"] = float(data["project_cost"])
            except (TypeError, ValueError):
                data["project_cost"] = None

        return data

    def validate_advisor(self, data: dict) -> dict:
        required_fields = [
            "summary",
            "business_fit",
            "required_resources",
            "next_steps",
            "challenges",
            "risks",
            "roadmap"
        ]

        for field in required_fields:
            if field not in data:
                data[field] = [] if field in {
                    "required_resources",
                    "next_steps",
                    "challenges",
                    "risks",
                    "roadmap"
                } else ""

        return data

    def validate_swot(self, data: dict) -> dict:
        fields = [
            "strengths",
            "weaknesses",
            "opportunities",
            "threats"
        ]

        for field in fields:
            if field not in data or not isinstance(data[field], list):
                data[field] = []

        return data

    def validate_risk(self, data: dict) -> dict:
        if data.get("overall_risk_level") not in self.ALLOWED_SEVERITIES:
            data["overall_risk_level"] = "MEDIUM"

        risks = data.get("risks", [])

        if not isinstance(risks, list):
            risks = []

        for risk in risks:
            if not isinstance(risk, dict):
                continue

            if risk.get("severity") not in self.ALLOWED_SEVERITIES:
                risk["severity"] = "MEDIUM"

            risk.setdefault("risk", "")
            risk.setdefault("explanation", "")
            risk.setdefault("mitigation", "")

        data["risks"] = risks

        return data

    def validate_roadmap(self, data: dict) -> dict:
        roadmap = data.get("roadmap", [])

        if not isinstance(roadmap, list):
            roadmap = []

        for phase in roadmap:
            if not isinstance(phase, dict):
                continue

            phase.setdefault("phase", "")
            phase.setdefault("duration", "")
            phase.setdefault("actions", [])
            phase.setdefault("resources_required", [])
            phase.setdefault("milestones", [])
            phase.setdefault("risks", [])

        data["roadmap"] = roadmap

        return data

    def sanitize_text(self, value: Any) -> Any:
        if isinstance(value, str):
            return value.strip()

        if isinstance(value, list):
            return [self.sanitize_text(item) for item in value]

        if isinstance(value, dict):
            return {
                key: self.sanitize_text(val)
                for key, val in value.items()
            }

        return value

    def validate_business_explanation(self, data: dict) -> dict:
        allowed_confidence = {
            "LOW",
            "MEDIUM",
            "HIGH"
        }

        if data.get("confidence") not in allowed_confidence:
            data["confidence"] = "LOW"

        list_fields = [
            "why_it_fits",
            "matching_factors",
            "limitations",
            "what_to_verify"
        ]

        for field in list_fields:
            if field not in data or not isinstance(data[field], list):
                data[field] = []

        data.setdefault("recommendation", "")

        return data