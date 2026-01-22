import { create } from 'zustand'
import api from '../services/api'

interface User {
  id: string
  email: string
  name: string
  profileImageUrl?: string
  credits: number
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  loginWithGoogle: (idToken: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  loginWithGoogle: async (idToken: string) => {
    set({ isLoading: true })
    try {
      const response = await api.post('/auth/google', { idToken })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, isAuthenticated: false })
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({ user: null, isAuthenticated: false })
      return
    }

    try {
      const response = await api.get('/auth/me')
      set({ user: response.data, isAuthenticated: true })
    } catch {
      localStorage.removeItem('token')
      set({ user: null, isAuthenticated: false })
    }
  },
}))
