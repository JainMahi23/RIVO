from fastapi import FastAPI

from app.api.rag import (
    router as rag_router
)

from app.api.schemes import (
    router as schemes_router
)

from app.api.eligibility import (
    router as eligibility_router
)


app = FastAPI(
    title="RIVO Government Knowledge RAG Service",
    version="1.0.0"
)


app.include_router(
    rag_router
)

app.include_router(
    schemes_router
)

app.include_router(
    eligibility_router
)


@app.get("/")
def root():

    return {
        "service": (
            "RIVO Government Knowledge "
            "RAG Service"
        ),
        "status": "running"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }