import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  const handleStartChat = () => {
    navigate('/chat')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          대화로 만드는
          <span className="text-primary-600"> 나만의 웹사이트</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          코딩 없이 AI와 대화하며 웹사이트를 만들어보세요.
          <br />
          아이디어만 있으면 충분합니다.
        </p>
        <button
          onClick={handleStartChat}
          className="px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
        >
          무료로 시작하기
        </button>
        <p className="mt-4 text-sm text-gray-500">
          신용카드 불필요 · 무료로 사이트 생성 가능
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
        <FeatureCard
          title="대화형 생성"
          description="원하는 사이트를 자연어로 설명하면 AI가 자동으로 생성합니다."
        />
        <FeatureCard
          title="실시간 프리뷰"
          description="생성 과정을 실시간으로 확인하며 수정할 수 있습니다."
        />
        <FeatureCard
          title="즉시 배포"
          description="완성된 사이트는 바로 임시 URL로 배포됩니다."
        />
      </div>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
