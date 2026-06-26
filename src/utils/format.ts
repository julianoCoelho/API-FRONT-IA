export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date

  const hours = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')
  const time = `${hours}:${minutes}`

  const now = new Date()
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()

  if (isToday) return time

  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  return `${day}/${month} ${time}`
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`

  const kb = bytes / 1024
  if (kb < 1024) return `${parseFloat(kb.toFixed(1))} KB`

  const mb = kb / 1024
  return `${parseFloat(mb.toFixed(1))} MB`
}
