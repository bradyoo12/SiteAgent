import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import ChatInput from '../components/chat/ChatInput'
import ChatMessage from '../components/chat/ChatMessage'
import { useChatStore } from '../store/chatStore'

export default function Chat() {
  const { projectId } = useParams()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, isLoading, sendMessage } = useChatStore()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (content: string) => {
    await sendMessage(content, projectId)
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* 채팅 영역 */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <h2 className="text-2xl font-semibold mb-4">어떤 사이트를 만들어 드릴까요?</h2>
              <p className="text-center max-w-md">
                원하는 사이트의 종류, 디자인, 기능 등을 자유롭게 설명해주세요.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <SuggestionButton text="포트폴리오 사이트" onClick={() => handleSendMessage('포트폴리오 사이트를 만들고 싶어요')} />
                <SuggestionButton text="랜딩 페이지" onClick={() => handleSendMessage('제품 랜딩 페이지를 만들고 싶어요')} />
                <SuggestionButton text="블로그" onClick={() => handleSendMessage('개인 블로그를 만들고 싶어요')} />
                <SuggestionButton text="쇼핑몰" onClick={() => handleSendMessage('간단한 쇼핑몰을 만들고 싶어요')} />
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

      {/* 프리뷰 영역 (추후 구현) */}
      <div className="hidden lg:flex w-1/2 border-l border-gray-200 bg-white items-center justify-center text-gray-400">
        <div className="text-center">
          <p className="text-lg">사이트 프리뷰</p>
          <p className="text-sm mt-2">생성된 사이트가 여기에 표시됩니다</p>
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
