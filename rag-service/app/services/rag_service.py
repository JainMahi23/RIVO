from app.retrieval.retriever import (
    SchemeRetriever
)


class RAGService:

    def __init__(self):

        self.retriever = (
            SchemeRetriever()
        )

    def retrieve(
            self,
            query: str,
            top_k: int = 5
    ):

        return self.retriever.search(
            query,
            top_k
        )

    def build_context(
            self,
            documents: list[dict]
    ):

        if not documents:
            return ""

        context_parts = []

        for document in documents:

            context_parts.append(
                f"""
Scheme: {document["scheme_name"]}

Section: {document["section"]}

Information:
{document["content"]}

Official Source:
{document["official_source"]}
"""
            )

        return "\n".join(
            context_parts
        )