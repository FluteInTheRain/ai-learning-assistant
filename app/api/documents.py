from typing import Annotated

from fastapi import APIRouter, File, UploadFile

from app.db.session import DbSession
from app.schemas.documents import (
    DocumentResponse,
    GenerateActionRequest,
    GeneratedContentResponse,
)
from app.services.document_service import DocumentService
from app.services.generation_service import GenerationService

session_documents_router = APIRouter(prefix="/sessions", tags=["documents"])
documents_router = APIRouter(prefix="/documents", tags=["documents"])


@session_documents_router.post(
    "/{session_id}/documents", response_model=DocumentResponse, status_code=201
)
async def upload_document(
    session_id: int,
    db: DbSession,
    file: Annotated[UploadFile, File(...)],
) -> DocumentResponse:
    service = DocumentService(db)
    file_bytes = await file.read()
    document = await service.upload_document(
        session_id=session_id,
        filename=file.filename or "document.pdf",
        file_bytes=file_bytes,
    )
    return DocumentResponse.model_validate(document)


@session_documents_router.get(
    "/{session_id}/documents", response_model=list[DocumentResponse]
)
async def list_documents(session_id: int, db: DbSession) -> list[DocumentResponse]:
    service = DocumentService(db)
    documents = await service.list_documents(session_id)
    return [DocumentResponse.model_validate(d) for d in documents]


@documents_router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: int, db: DbSession) -> DocumentResponse:
    service = DocumentService(db)
    document = await service.get_document(document_id)
    return DocumentResponse.model_validate(document)


@documents_router.post(
    "/{document_id}/generate", response_model=GeneratedContentResponse
)
async def generate_content(
    document_id: int,
    action_in: GenerateActionRequest,
    db: DbSession,
) -> GeneratedContentResponse:
    service = GenerationService(db)
    generated = await service.generate(document_id, action_in.action)
    return GeneratedContentResponse.model_validate(generated)


@documents_router.get(
    "/{document_id}/generated", response_model=list[GeneratedContentResponse]
)
async def list_generated(
    document_id: int, db: DbSession
) -> list[GeneratedContentResponse]:
    service = GenerationService(db)
    generated = await service.list_generated(document_id)
    return [GeneratedContentResponse.model_validate(g) for g in generated]
