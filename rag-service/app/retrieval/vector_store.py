import faiss
import numpy as np


class VectorStore:

    def __init__(self):

        self.index = None

        self.documents = []

    def build(
            self,
            embeddings,
            documents
    ):

        embeddings = np.asarray(
            embeddings,
            dtype="float32"
        )

        dimension = embeddings.shape[1]

        self.index = faiss.IndexFlatIP(
            dimension
        )

        self.index.add(embeddings)

        self.documents = documents

    def search(
            self,
            query_embedding,
            top_k: int = 5
    ):

        if (
                self.index is None
                or not self.documents
        ):
            return []

        query_embedding = np.asarray(
            [query_embedding],
            dtype="float32"
        )

        scores, indices = self.index.search(
            query_embedding,
            min(
                top_k,
                len(self.documents)
            )
        )

        results = []

        for score, index in zip(
                scores[0],
                indices[0]
        ):

            if index < 0:
                continue

            document = self.documents[index].copy()

            document["score"] = round(
                float(score),
                4
            )

            results.append(document)

        return results