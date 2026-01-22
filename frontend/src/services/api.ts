import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const chatApi = {
  sendMessage: async (content: string, projectId?: string) => {
    const response = await api.post('/chat/message', {
      content,
      projectId,
    })
    return response.data
  },

  getHistory: async (projectId: string) => {
    const response = await api.get(`/chat/history/${projectId}`)
    return response.data
  },
}

export const projectApi = {
  list: async () => {
    const response = await api.get('/projects')
    return response.data
  },

  get: async (id: string) => {
    const response = await api.get(`/projects/${id}`)
    return response.data
  },

  create: async (data: { name: string; description?: string }) => {
    const response = await api.post('/projects', data)
    return response.data
  },

  delete: async (id: string) => {
    await api.delete(`/projects/${id}`)
  },

  publish: async (id: string) => {
    const response = await api.post(`/projects/${id}/publish`)
    return response.data
  },
}

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  register: async (email: string, password: string, name: string) => {
    const response = await api.post('/auth/register', { email, password, name })
    return response.data
  },

  logout: async () => {
    localStorage.removeItem('token')
  },
}

export default api
