class NotFoundError(Exception):
    """Raised when a requested resource does not exist."""


class UnsupportedFileTypeError(ValueError):
    """Raised when an uploaded file is not a supported type (PDF only in v0)."""


class DocumentNotReadyError(Exception):
    """Raised when an action is triggered on a document that isn't READY."""


class DocumentParsingError(Exception):
    """Raised when a document fails to parse/chunk/embed during ingestion."""


class UnsupportedActionError(ValueError):
    """Raised when a generate action isn't one of the supported action types."""


class GenerationFailedError(Exception):
    """Raised when the LLM call or its response fails during content generation."""
