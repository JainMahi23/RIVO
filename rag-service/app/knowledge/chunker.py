def create_scheme_chunks(
        scheme: dict
) -> list[dict]:

    chunks = []

    sections = {
        "description": scheme.get(
            "description",
            ""
        ),

        "eligibility": "\n".join(
            scheme.get(
                "eligibility",
                []
            )
        ),

        "benefits": "\n".join(
            scheme.get(
                "benefits",
                []
            )
        ),

        "required_documents": "\n".join(
            scheme.get(
                "required_documents",
                []
            )
        ),

        "application_process": "\n".join(
            scheme.get(
                "application_process",
                []
            )
        ),
    }

    for section, content in sections.items():

        if not content.strip():
            continue

        chunks.append({
            "scheme_id": scheme["scheme_id"],
            "scheme_name": scheme["name"],
            "section": section,
            "content": content,
            "official_source": scheme[
                "official_source"
            ],
        })

    return chunks