from app.embeddings.embedding_service import (
    EmbeddingService
)

from app.knowledge.chunker import (
    create_scheme_chunks
)

from app.knowledge.loader import (
    load_schemes
)

from app.retrieval.vector_store import (
    VectorStore
)


class SchemeRetriever:

    def __init__(self):

        self.embedding_service = (
            EmbeddingService()
        )

        self.vector_store = VectorStore()

        self._build_index()

    def _build_index(self):

        schemes = load_schemes()

        documents = []

        for scheme in schemes:

            documents.extend(
                create_scheme_chunks(
                    scheme
                )
            )

        if not documents:
            return

        texts = [
            f"""
Scheme Name: {document["scheme_name"]}
Section: {document["section"]}
Information: {document["content"]}
Official Source: {document["official_source"]}
"""
            for document in documents
        ]

        embeddings = (
            self.embedding_service.embed(
                texts
            )
        )

        self.vector_store.build(
            embeddings,
            documents
        )

    def _extract_keywords(
            self,
            query: str
    ) -> list[str]:

        query_lower = query.lower()

        keywords = []

        important_terms = [
            "dairy",
            "poultry",
            "beekeeping",
            "goat farming",
            "farming",
            "agriculture",
            "food processing",
            "manufacturing",
            "trading",
            "service",
            "business",
            "loan",
            "subsidy",
            "credit",
            "finance",
            "startup",
            "scheme"
        ]

        for term in important_terms:

            if term in query_lower:
                keywords.append(term)

        return keywords

    def _keyword_score(
            self,
            query: str,
            document: dict
    ) -> float:

        keywords = self._extract_keywords(
            query
        )

        if not keywords:
            return 0.0

        document_text = (
            f'{document["scheme_name"]} '
            f'{document["section"]} '
            f'{document["content"]}'
        ).lower()

        # Business-specific terms get higher
        # importance than generic terms.
        weights = {
            "dairy": 3.0,
            "poultry": 3.0,
            "beekeeping": 3.0,
            "goat farming": 3.0,

            "farming": 2.5,
            "agriculture": 2.5,
            "food processing": 2.5,

            "loan": 1.5,
            "subsidy": 1.5,
            "credit": 1.5,
            "finance": 1.5,

            "business": 1.0,
            "manufacturing": 1.0,
            "trading": 1.0,
            "service": 1.0,
            "startup": 1.0,

            "scheme": 0.5
        }

        total_weight = 0.0
        matched_weight = 0.0

        for keyword in keywords:

            weight = weights.get(
                keyword,
                1.0
            )

            total_weight += weight

            if keyword in document_text:

                matched_weight += weight

        if total_weight == 0:
            return 0.0

        return (
                matched_weight /
                total_weight
        )

    def search(
            self,
            query: str,
            top_k: int = 5
    ):

        query_embedding = (
            self.embedding_service
            .embed_query(query)
        )

        # Retrieve extra candidates first,
        # then rerank them.
        candidate_count = max(
            top_k * 3,
            10
        )

        semantic_results = (
            self.vector_store.search(
                query_embedding,
                candidate_count
            )
        )

        if not semantic_results:
            return []

        ranked_results = []

        for document in semantic_results:

            semantic_score = float(
                document.get(
                    "score",
                    0.0
                )
            )

            keyword_score = (
                self._keyword_score(
                    query,
                    document
                )
            )

            # Hybrid ranking:
            # 70% semantic similarity
            # 30% keyword relevance.
            combined_score = (
                    (semantic_score * 0.70)
                    + (keyword_score * 0.30)
            )

            result = document.copy()

            result["semantic_score"] = round(
                semantic_score,
                4
            )

            result["keyword_score"] = round(
                keyword_score,
                4
            )

            result["score"] = round(
                combined_score,
                4
            )

            ranked_results.append(
                result
            )

        ranked_results.sort(
            key=lambda item: item["score"],
            reverse=True
        )

        return ranked_results[:top_k]