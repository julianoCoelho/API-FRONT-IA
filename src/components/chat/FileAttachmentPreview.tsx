interface FileAttachmentPreviewProps {
  fileName: string
  onRemove: () => void
  progress?: number
}

export function FileAttachmentPreview({ fileName, onRemove, progress }: FileAttachmentPreviewProps) {
  const isUploading = progress !== undefined && progress > 0 && progress < 100
  const isComplete = progress === 100

  return (
    <div className="flex flex-col gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-sm">
      <div className="flex items-center gap-2">
        <DocumentIcon />
        <span className="max-w-[200px] truncate text-gray-700">{fileName}</span>
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

      {progress !== undefined && (
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

export default FileAttachmentPreview
