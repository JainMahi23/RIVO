from fastapi import APIRouter

from app.knowledge.loader import (
    load_schemes
)


router = APIRouter(
    prefix="/rag",
    tags=["Eligibility"]
)


@router.post("/eligibility")
def check_eligibility(data: dict):

    scheme_id = data.get(
        "scheme_id"
    )

    schemes = load_schemes()

    scheme = next(
        (
            item
            for item in schemes
            if item["scheme_id"] == scheme_id
        ),
        None
    )

    if scheme is None:

        return {
            "status": "NOT_FOUND",
            "message": (
                "Scheme was not found in the "
                "verified knowledge base."
            )
        }

    return {
        "status": "SUCCESS",
        "scheme_id": scheme["scheme_id"],
        "scheme_name": scheme["name"],
        "eligibility": scheme["eligibility"],
        "required_documents": scheme[
            "required_documents"
        ],
        "official_source": scheme[
            "official_source"
        ],
        "last_verified": scheme[
            "last_verified"
        ]
    }