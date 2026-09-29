from pypdf import PdfReader


def extract_pdf(file_path: str):
    reader = PdfReader(file_path)

    pages = []

    for page in reader.pages:
        text = page.extract_text() or ""

        pages.append(text)

    return "\n".join(pages)