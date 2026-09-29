from docx import Document


def extract_docx(file_path: str):
    document = Document(file_path)

    content = []

    for paragraph in document.paragraphs:
        if paragraph.text.strip():
            content.append(
                paragraph.text
            )

    for table in document.tables:
        for row in table.rows:
            values = [
                cell.text.strip()
                for cell in row.cells
            ]

            content.append(
                " | ".join(values)
            )

    return "\n".join(content)