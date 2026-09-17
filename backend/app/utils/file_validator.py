import os
from typing import Tuple
from fastapi import UploadFile, HTTPException
from app.config.settings import settings

PDF_MAGIC = b"%PDF-"
DOCX_MAGIC = b"PK\x03\x04"

def validate_uploaded_file(file: UploadFile, content: bytes) -> Tuple[str, str]:
    """
    Validates uploaded file size, extension, and magic header bytes.
    Returns (sanitized_file_name, extension).
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename missing in upload.")

    # Sanitize file name
    base_name = os.path.basename(file.filename)
    parts = base_name.rsplit(".", 1)
    if len(parts) < 2:
        raise HTTPException(
            status_code=400,
            detail="File has no extension. Only PDF (.pdf) and Word (.docx) files are supported."
        )

    ext = parts[1].lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '.{ext}'. Supported formats: {', '.join(settings.ALLOWED_EXTENSIONS).upper()}."
        )

    # Check file size limit
    size_bytes = len(content)
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if size_bytes > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB}MB (received {round(size_bytes / (1024 * 1024), 2)}MB)."
        )

    if size_bytes == 0:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty (0 bytes)."
        )

    # Verify magic bytes
    if ext == "pdf" and not content.startswith(PDF_MAGIC):
        raise HTTPException(
            status_code=400,
            detail="Invalid PDF file: corrupted header or incorrect file format."
        )
    elif ext == "docx" and not content.startswith(DOCX_MAGIC):
        raise HTTPException(
            status_code=400,
            detail="Invalid DOCX file: corrupted header or incorrect file format."
        )

    return base_name, ext
