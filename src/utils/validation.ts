const ALLOWED_EXTENSIONS = ['.txt', '.pdf']
const MAX_FILE_SIZE = 5 * 1024 * 1024

export function validateFile(file: {
  name: string
  size: number
  type: string
}): string | null {
  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
  const isAllowed = ALLOWED_EXTENSIONS.includes(extension)

  if (!isAllowed) {
    return 'Formato não suportado. Aceitamos apenas arquivos .txt e .pdf'
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'O arquivo excede o limite de 5 MB'
  }

  return null
}

export function validateMessage(text: string): string | null {
  if (text.trim().length === 0) {
    return 'A mensagem não pode estar vazia'
  }

  return null
}
