export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  expiresIn: number
}

export interface RegisterRequest {
  username: string
  password: string
  email?: string
}

export interface RegisterResponse {
  id: string
  username: string
  createdAt: string
}

export interface SendMessageRequest {
  chatSessionId: string
  content: string
}

export interface MessageResponse {
  id: string
  chatSessionId: string
  role: 'USER' | 'ASSISTANT'
  content: string
  timestamp: string
}

export interface ChatSessionResponse {
  id: string
  title: string
  createdAt: string
}

export interface FileUploadResponse {
  fileId: string
  fileName: string
  fileSize: number
  uploadedAt: string
}

export interface ErrorResponse {
  status: number
  error: string
  message: string
  timestamp: string
}

export interface HealthResponse {
  status: string
  timestamp: string
}
