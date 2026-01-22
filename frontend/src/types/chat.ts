export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

export interface ChatSession {
  id: string
  projectId?: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  name: string
  description?: string
  previewUrl?: string
  status: 'draft' | 'generating' | 'ready' | 'published'
  createdAt: Date
  updatedAt: Date
}
