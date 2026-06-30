import type { DocumentStatus } from '../../types/ingestion'
import { formatFileSize } from '../../utils/format'

interface FileAttachmentPreviewProps {
  fileName: string
  onRemove: () => void
  progress?: number
  status?: DocumentStatus
  fileSize?: number
}

const statusConfig: Record<DocumentStatus, { label: string; color: string }> = {
  PENDING: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
  PROCESSING: { label: 'Processando', color: 'bg-blue-100 text-blue-800' },
  COMPLETED: { label: 'Concluído', color: 'bg-green-100 text-green-800' },
  FAILED: { label: 'Falhou', color: 'bg-red-100 text-red-800' },
}

export function FileAttachmentPreview({
  fileName,
  onRemove,
  progress,
  status,
  fileSize,
}: FileAttachmentPreviewProps) {
  const isUploading = progress !== undefined && progress > 0 && progress < 100
  const isComplete = progress === 100
  const showProgress = progress !== undefined && !status
  const currentStatus = status ? statusConfig[status] : null

  return (
    <div className="flex flex-col gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-sm">
      <div className="flex items-center gap-2">
        <DocumentIcon />
        <span className="max-w-[200px] truncate text-gray-700">{fileName}</span>
        {fileSize !== undefined && (
          <span className="hidden whitespace-nowrap text-xs text-gray-400 sm:inline">
            {formatFileSize(fileSize)}
          </span>
        )}
        <button
          type="button"
          onClick={onRemove}
          className="ml-auto flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-gray-400 hover:bg-gray-200 hover:text-gray-600"
          aria-label={`Remover ${fileName}`}
        >
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {showProgress && (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          {isUploading && (
            <span className="text-xs text-gray-500 whitespace-nowrap">
              Enviando... {progress}%
            </span>
          )}
          {isComplete && (
            <span className="flex items-center gap-1 text-xs text-green-600 whitespace-nowrap">
              <CheckIcon />
              Concluído
            </span>
          )}
        </div>
      )}

      {currentStatus && (
        <div className="flex items-center gap-1.5">
          {status === 'PENDING' && <ClockIcon />}
          {status === 'PROCESSING' && <SyncIcon />}
          {status === 'COMPLETED' && <CheckCircleIcon />}
          {status === 'FAILED' && <AlertCircleIcon />}
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${currentStatus.color}`}>
            {currentStatus.label}
          </span>
        </div>
      )}
    </div>
  )
}

function CheckIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

function DocumentIcon() {
  return (
    <svg
      className="h-4 w-4 flex-shrink-0 text-gray-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-yellow-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function SyncIcon() {
  return (
    <svg className="h-3.5 w-3.5 animate-spin text-blue-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-green-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function AlertCircleIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-red-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

export default FileAttachmentPreview
