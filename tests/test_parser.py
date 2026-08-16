from io import BytesIO

import pytest
from pypdf import PdfWriter
from reportlab.pdfgen import canvas

from app.ingestion.parser import PdfParseError, parse_pdf


class TestParsePdf:
    def test_parses_text_from_each_page(self, sample_pdf_bytes: bytes) -> None:
        pages = parse_pdf(sample_pdf_bytes)

        assert len(pages) == 2
        assert pages[0][0] == 1
        assert "Hello world" in pages[0][1]
        assert pages[1][0] == 2
        assert "page two" in pages[1][1]

    def test_invalid_bytes_raise_pdf_parse_error(self) -> None:
        with pytest.raises(PdfParseError):
            parse_pdf(b"not a pdf file at all")

    def test_pdf_with_no_extractable_text_raises(self) -> None:
        writer = PdfWriter()
        writer.add_blank_page(width=200, height=200)
        buffer = BytesIO()
        writer.write(buffer)

        with pytest.raises(PdfParseError):
            parse_pdf(buffer.getvalue())

    def test_page_order_preserved(self) -> None:
        buffer = BytesIO()
        c = canvas.Canvas(buffer)
        for i in range(3):
            c.drawString(100, 750, f"Content of page {i + 1}")
            c.showPage()
        c.save()

        pages = parse_pdf(buffer.getvalue())

        assert [p[0] for p in pages] == [1, 2, 3]
        for i, (_, text) in enumerate(pages):
            assert f"page {i + 1}" in text
