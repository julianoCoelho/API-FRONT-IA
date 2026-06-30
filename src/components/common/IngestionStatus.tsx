import type { DocumentStatus, StatusConfig } from '../../types/ingestion'

interface IngestionStatusProps {
  status: DocumentStatus
  fileName?: string
  errorMessage?: string | null
  className?: string
}

const statusConfig: Record<DocumentStatus, StatusConfig> = {
  PENDING: {
    label: 'Pendente',
    color: 'bg-yellow-100 text-yellow-800',
    Icon: ClockIcon,
  },
  PROCESSING: {
    label: 'Processando…',
    color: 'bg-blue-100 text-blue-800',
    Icon: SyncIcon,
  },
  COMPLETED: {
    label: 'Indexado',
    color: 'bg-green-100 text-green-800',
    Icon: CheckCircleIcon,
  },
  FAILED: {
    label: 'Falha na indexação',
    color: 'bg-red-100 text-red-800',
    Icon: AlertCircleIcon,
  },
}

export function IngestionStatus({ status, fileName, errorMessage, className = '' }: IngestionStatusProps) {
  const { label, color, Icon } = statusConfig[status]

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center gap-2">
        {fileName && (
          <span className="max-w-[180px] truncate text-xs text-earth-dark/70">{fileName}</span>
        )}
        <span
          role="status"
          aria-label={label}
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors duration-200 hover:brightness-95 ${color}`}
        >
          <Icon aria-hidden="true" className="h-3.5 w-3.5" />
          {label}
        </span>
      </div>
      {status === 'PROCESSING' && (
        <div className="h-1 w-full rounded-full bg-gray-200 overflow-hidden">
          <div className="h-full w-1/2 rounded-full bg-blue-500 animate-pulse" />
        </div>
      )}
      {status === 'FAILED' && errorMessage && (
        <span className="text-xs text-red-600 leading-relaxed">{errorMessage}</span>
      )}
    </div>
  )
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function SyncIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${props.className ?? ''} animate-spin`} {...props}>
      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2" />
    </svg>
  )
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function AlertCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

export default IngestionStatus
