import os
import tempfile

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
)

from app.core.document_parser import (
    extract_document,
)

from app.core.flight_extractor import (
    extract_flights,
)


router = APIRouter()


@router.post(
    "/documents/extract-flights"
)
async def extract_flights_from_document(
    file: UploadFile = File(...)
):

    suffix = ""

    if file.filename:
        _, extension = os.path.splitext(
            file.filename
        )

        suffix = extension

    try:

        file_content = await file.read()

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix
        ) as temp_file:

            temp_file.write(
                file_content
            )

            temp_path = temp_file.name

        text = extract_document(
            temp_path
        )

        flights = extract_flights(
            text
        )

        return {
            "success": True,

            "filename":
                file.filename,

            "documentType":
                suffix.lower(),

            "flightCount":
                len(flights),

            "flights":
                flights,

            "warnings": [],
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

    finally:

        if (
            "temp_path" in locals()
            and os.path.exists(temp_path)
        ):
            os.remove(temp_path)