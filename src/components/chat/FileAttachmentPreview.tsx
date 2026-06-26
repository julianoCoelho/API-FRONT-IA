interface FileAttachmentPreviewProps {
  fileName: string
  onRemove: () => void
}

export function FileAttachmentPreview({ fileName, onRemove }: FileAttachmentPreviewProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm">
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
