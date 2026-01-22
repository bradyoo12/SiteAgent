import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ChatInput from '../components/chat/ChatInput'
import ChatMessage from '../components/chat/ChatMessage'
import { useChatStore } from '../store/chatStore'

export default function Chat() {
  const { projectId } = useParams()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, isLoading, sendMessage } = useChatStore()
  const { t } = useTranslation()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (content: string) => {
    await sendMessage(content, projectId)
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <h2 className="text-2xl font-semibold mb-4">{t('chat.empty.title')}</h2>
              <p className="text-center max-w-md">
                {t('chat.empty.description')}
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <SuggestionButton text={t('chat.suggestions.portfolio')} onClick={() => handleSendMessage(t('chat.suggestions.portfolioMessage'))} />
                <SuggestionButton text={t('chat.suggestions.landing')} onClick={() => handleSendMessage(t('chat.suggestions.landingMessage'))} />
                <SuggestionButton text={t('chat.suggestions.blog')} onClick={() => handleSendMessage(t('chat.suggestions.blogMessage'))} />
                <SuggestionButton text={t('chat.suggestions.shop')} onClick={() => handleSendMessage(t('chat.suggestions.shopMessage'))} />
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </div>

      {/* Preview area */}
      <div className="hidden lg:flex w-1/2 border-l border-gray-200 bg-white items-center justify-center text-gray-400">
        <div className="text-center">
          <p className="text-lg">{t('chat.preview.title')}</p>
          <p className="text-sm mt-2">{t('chat.preview.description')}</p>
        </div>
      </div>
    </div>
  )
}

function SuggestionButton({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
    >
      {text}
    </button>
  )
}
