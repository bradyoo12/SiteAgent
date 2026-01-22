import { useTranslation } from 'react-i18next'
import { Message } from '../../types/chat'

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const { i18n } = useTranslation()

  const formatTime = (date: Date): string => {
    const locale = i18n.language === 'ko' ? 'ko-KR' : 'en-US'
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-primary-600 text-white rounded-br-md'
            : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <span
          className={`text-xs mt-1 block ${
            isUser ? 'text-primary-200' : 'text-gray-400'
          }`}
        >
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  )
}
