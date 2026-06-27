import { useState } from 'react'
import type { SourceResponse } from '../../types/source'

interface SourcePanelProps {
  sources: SourceResponse[]
  className?: string
}

export function SourcePanel({ sources, className = '' }: SourcePanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (sources.length === 0) return null

  const label = sources.length === 1 ? '1 fonte' : `${sources.length} fontes`

  return (
    <div className={`text-sm ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-left text-xs text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
      >
        <span>{label}</span>
        <ChevronIcon className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div
        className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <ul className="mt-2 space-y-2">
            {sources.map((source) => (
              <li key={source.id} className="rounded-lg bg-gray-50 p-2.5">
                <div className="flex items-baseline gap-1">
                  <span className="truncate font-medium text-gray-900">{source.documentName}</span>
                  {source.page != null && (
                    <span className="shrink-0 text-xs text-gray-500">· p. {source.page}</span>
                  )}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-gray-700">{source.snippet}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export default SourcePanel
