interface HealthStatusBadgeProps {
  isActive: boolean
  lastCheck: string | null
}

function formatTime(isoString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(isoString))
}

export function HealthStatusBadge({ isActive, lastCheck }: HealthStatusBadgeProps) {
  const dotColor = lastCheck === null
    ? 'bg-gray-400'
    : isActive
      ? 'bg-green-500'
      : 'bg-red-500'

  const label = lastCheck === null
    ? 'Verificando...'
    : isActive
      ? 'API Ativa'
      : 'API Inativa'

  return (
    <div className="flex flex-col items-end gap-0.5">
      <div className="flex items-center gap-1.5">
        <span className={`inline-block h-2 w-2 rounded-full ${dotColor}`} />
        <span className="text-xs font-medium text-gray-600">{label}</span>
      </div>
      {lastCheck && (
        <span className="text-[10px] text-gray-400">
          Última verificação: {formatTime(lastCheck)}
        </span>
      )}
    </div>
  )
}

export default HealthStatusBadge
