import io

from pypdf import PdfReader


class PdfParseError(ValueError):
    """Raised when a PDF cannot be parsed."""


def parse_pdf(file_bytes: bytes) -> list[tuple[int, str]]:
    """Extract text from a PDF's bytes.

    Returns a list of (page_number, text) pairs, one per page, in order.
    Page numbers are 1-indexed. Pages with no extractable text are skipped.
    """
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
    except Exception as exc:
        raise PdfParseError(f"Could not read PDF: {exc}") from exc

    pages: list[tuple[int, str]] = []
    for index, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        text = text.strip()
        if text:
            pages.append((index + 1, text))

    if not pages:
        raise PdfParseError("No extractable text found in PDF")

    return pages
