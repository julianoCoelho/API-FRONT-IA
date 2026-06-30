import { useState } from 'react'
import type { SourceResponse } from '../../types/api'

interface SourcePanelProps {
  sources: SourceResponse[]
  className?: string
}

function scoreColor(score: number): string {
  if (score >= 0.8) return 'bg-green-500'
  if (score >= 0.6) return 'bg-yellow-500'
  return 'bg-red-500'
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + '…' : text
}

export function SourcePanel({ sources, className = '' }: SourcePanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  if (sources.length === 0) return null

  const label = sources.length === 1 ? '1 fonte' : `${sources.length} fontes`

  return (
    <div className={`text-sm ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg bg-earth-sand/20 px-3 py-2 text-left text-xs text-earth-sage transition-colors hover:bg-earth-sand/40 hover:text-earth-forest"
      >
        <span>{label}</span>
        <ChevronIcon className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div
        className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <ul className="mt-2 space-y-2">
            {sources.map((source) => {
              const isExpanded = expanded[source.documentId + source.chunkIndex]
              const displayExcerpt = isExpanded ? source.excerpt : truncate(source.excerpt, 200)

              return (
                <li key={source.documentId + source.chunkIndex} className="rounded-lg bg-earth-sand/20 border border-earth-sand/40 p-2.5">
                  <div className="flex items-baseline gap-1">
                    <span className="truncate font-semibold text-earth-forest">{source.documentName}</span>
                    <span className="shrink-0 text-xs text-earth-khaki">· chunk {source.chunkIndex}</span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-earth-dark/80">{displayExcerpt}</p>
                  {source.excerpt.length > 200 && (
                    <button
                      type="button"
                      onClick={() => setExpanded((prev) => ({ ...prev, [source.documentId + source.chunkIndex]: !isExpanded }))}
                      className="mt-0.5 text-xs text-earth-olive hover:underline"
                    >
                      {isExpanded ? 'Mostrar menos' : 'Mostrar mais'}
                    </button>
                  )}
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${scoreColor(source.score)}`}
                        style={{ width: `${Math.round(source.score * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-earth-khaki shrink-0">{Math.round(source.score * 100)}%</span>
                  </div>
                </li>
              )
            })}
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
