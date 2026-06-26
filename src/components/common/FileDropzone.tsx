import { useState, useRef, type DragEvent, type ChangeEvent } from 'react'

interface FileDropzoneProps {
  onFileSelect: (files: File[]) => void
  accept?: string
  multiple?: boolean
  className?: string
}

export function FileDropzone({
  onFileSelect,
  accept,
  multiple = false,
  className = '',
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleDragOver(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleDragEnter(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      onFileSelect(files)
    }
  }

  function handleClick() {
    inputRef.current?.click()
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length > 0) {
      onFileSelect(files)
    }
    e.target.value = ''
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 bg-white hover:border-gray-400'
      } ${className}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
        tabIndex={-1}
      />

      <UploadIcon />

      <p className="mt-4 text-sm text-gray-600">
        <span className="font-semibold text-blue-600">Clique para selecionar</span>{' '}
        ou arraste os arquivos aqui
      </p>

      {accept && (
        <p className="mt-1 text-xs text-gray-400">
          Formatos aceitos: {accept}
        </p>
      )}
    </div>
  )
}

function UploadIcon() {
  return (
    <svg
      className="h-10 w-10 text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.323-2.652 3.75 3.75 0 013.837 4.46A3.002 3.002 0 0018 19.5H6.75z"
      />
    </svg>
  )
}

export default FileDropzone
