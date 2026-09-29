from pathlib import Path

from app.parsers.pdf_parser import extract_pdf
from app.parsers.docx_parser import extract_docx
from app.parsers.csv_parser import extract_csv
from app.parsers.excel_parser import extract_excel
from app.parsers.json_parser import extract_json
from app.parsers.text_parser import extract_text


def extract_document(file_path: str):

    extension = Path(
        file_path
    ).suffix.lower()

    if extension == ".pdf":
        return extract_pdf(file_path)

    if extension in [".doc", ".docx"]:
        return extract_docx(file_path)

    if extension == ".csv":
        return extract_csv(file_path)

    if extension in [".xls", ".xlsx"]:
        return extract_excel(file_path)

    if extension == ".json":
        return extract_json(file_path)

    if extension == ".txt":
        return extract_text(file_path)

    raise ValueError(
        f"Unsupported file format: {extension}"
    )