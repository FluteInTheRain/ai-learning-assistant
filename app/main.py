from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse

from app.api.documents import documents_router, session_documents_router
from app.api.sessions import router as sessions_router
from app.config import get_settings
from app.ingestion.parser import PdfParseError
from app.services.exceptions import (
    DocumentNotReadyError,
    DocumentParsingError,
    GenerationFailedError,
    NotFoundError,
    UnsupportedActionError,
    UnsupportedFileTypeError,
)

app = FastAPI(title="AI Learning Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().cors_origins_list,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sessions_router)
app.include_router(session_documents_router)
app.include_router(documents_router)


@app.get("/")
def root() -> RedirectResponse:
    return RedirectResponse(url="/docs")


@app.exception_handler(NotFoundError)
async def not_found_handler(request: Request, exc: NotFoundError) -> JSONResponse:
    return JSONResponse(status_code=404, content={"detail": str(exc)})


@app.exception_handler(UnsupportedFileTypeError)
async def unsupported_file_type_handler(
    request: Request, exc: UnsupportedFileTypeError
) -> JSONResponse:
    return JSONResponse(status_code=400, content={"detail": str(exc)})


@app.exception_handler(DocumentNotReadyError)
async def document_not_ready_handler(
    request: Request, exc: DocumentNotReadyError
) -> JSONResponse:
    return JSONResponse(status_code=409, content={"detail": str(exc)})


@app.exception_handler(DocumentParsingError)
async def document_parsing_error_handler(
    request: Request, exc: DocumentParsingError
) -> JSONResponse:
    return JSONResponse(status_code=422, content={"detail": str(exc)})


@app.exception_handler(PdfParseError)
async def pdf_parse_error_handler(request: Request, exc: PdfParseError) -> JSONResponse:
    return JSONResponse(status_code=422, content={"detail": str(exc)})


@app.exception_handler(UnsupportedActionError)
async def unsupported_action_handler(
    request: Request, exc: UnsupportedActionError
) -> JSONResponse:
    return JSONResponse(status_code=400, content={"detail": str(exc)})


@app.exception_handler(GenerationFailedError)
async def generation_failed_handler(
    request: Request, exc: GenerationFailedError
) -> JSONResponse:
    return JSONResponse(status_code=502, content={"detail": str(exc)})
