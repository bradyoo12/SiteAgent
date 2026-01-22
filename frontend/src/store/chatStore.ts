import { create } from 'zustand'
import { Message } from '../types/chat'
import { chatApi } from '../services/api'

interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
  sendMessage: (content: string, projectId?: string) => Promise<void>
  clearMessages: () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  sendMessage: async (content: string, projectId?: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      createdAt: new Date(),
    }

    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: true,
      error: null,
    }))

    try {
      const response = await chatApi.sendMessage(content, projectId)

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.content,
        createdAt: new Date(),
      }

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false,
      }))
    } catch (error) {
      // 개발 중에는 임시 응답 제공
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `"${content}"에 대해 사이트를 생성할 준비가 되었습니다.\n\n현재 개발 중이므로 실제 생성 기능은 추후 연동됩니다.`,
        createdAt: new Date(),
      }

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }))
    }
  },

  clearMessages: () => {
    set({ messages: [], error: null })
  },
}))
