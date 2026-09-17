from sentence_transformers import SentenceTransformer


class EmbeddingService:

    def __init__(self):

        self.model = SentenceTransformer(
            "all-MiniLM-L6-v2"
        )

    def embed(
            self,
            texts: list[str]
    ):

        return self.model.encode(
            texts,
            normalize_embeddings=True
        )

    def embed_query(
            self,
            query: str
    ):

        return self.model.encode(
            [query],
            normalize_embeddings=True
        )[0]