import { useState } from 'react'
import type { FormEvent } from 'react'
import { ErrorBanner } from './ErrorBanner'

interface UploadFormProps {
  onUpload: (file: File) => void
  isPending: boolean
  errorMessage: string | null
}

export function UploadForm({ onUpload, isPending, errorMessage }: UploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedFile) return
    onUpload(selectedFile)
  }

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <label htmlFor="pdf-file">Upload a PDF</label>
      <input
        id="pdf-file"
        type="file"
        accept=".pdf"
        disabled={isPending}
        onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
        required
      />
      <button type="submit" disabled={isPending || !selectedFile}>
        {isPending ? 'Uploading...' : 'Upload'}
      </button>
      {errorMessage && <ErrorBanner message={errorMessage} />}
    </form>
  )
}
