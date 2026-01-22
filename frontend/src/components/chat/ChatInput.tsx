import { useState, KeyboardEvent } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-3 bg-gray-50 rounded-xl p-3 border border-gray-200 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="원하는 사이트를 설명해주세요..."
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 disabled:opacity-50"
            style={{ maxHeight: '120px' }}
          />
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || disabled}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            전송
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-400 text-center">
          Shift + Enter로 줄바꿈
        </p>
      </div>
    </div>
  )
}
