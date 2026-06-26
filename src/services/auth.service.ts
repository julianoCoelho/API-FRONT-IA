import { api } from './api'
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/api'

export const authService = {
  login(data: LoginRequest): Promise<LoginResponse> {
    return api.post('/auth/login', data).then((res) => res.data)
  },

  register(data: RegisterRequest): Promise<RegisterResponse> {
    return api.post('/auth/register', data).then((res) => res.data)
  },
}
