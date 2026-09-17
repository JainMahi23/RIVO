from fastapi import APIRouter

from app.schemas.rag import RAGQuery

from app.services.answer_service import (
    AnswerService
)

from app.services.rag_service import (
    RAGService
)


router = APIRouter(
    prefix="/rag",
    tags=["RAG"]
)


rag_service = RAGService()
answer_service = AnswerService()


def build_search_query(request: RAGQuery) -> str:

    search_query = request.query

    if request.business:
        search_query += f" Business: {request.business}"

    if request.location:
        search_query += f" Location: {request.location}"

    if request.capital:
        search_query += f" Capital: Rs. {request.capital}"

    return search_query


@router.post("/search")
def search_schemes(
        request: RAGQuery
):

    search_query = build_search_query(request)

    results = rag_service.retrieve(
        query=search_query,
        top_k=request.top_k
    )

    return {
        "status": "SUCCESS",
        "query": request.query,
        "search_query": search_query,
        "results": results
    }


@router.post("/query")
def query_schemes(
        request: RAGQuery
):

    search_query = build_search_query(request)

    documents = rag_service.retrieve(
        query=search_query,
        top_k=request.top_k
    )

    if not documents:

        return {
            "status": "NO_VERIFIED_INFORMATION",
            "answer": (
                "No verified government scheme "
                "information was found for this query."
            ),
            "sources": [],
            "confidence": "LOW"
        }

    context = rag_service.build_context(
        documents
    )

    answer = answer_service.generate(
        query=request.query,
        context=context
    )

    best_score = documents[0]["score"]

    if best_score >= 0.60:
        confidence = "HIGH"
    elif best_score >= 0.40:
        confidence = "MEDIUM"
    else:
        confidence = "LOW"

    return {
        "status": "SUCCESS",
        "answer": answer,
        "sources": documents,
        "confidence": confidence
    }