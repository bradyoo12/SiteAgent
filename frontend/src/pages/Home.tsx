import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Home() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleStartChat = () => {
    navigate('/chat')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          {t('home.hero.title')}
          <span className="text-primary-600"> {t('home.hero.highlight')}</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {t('home.hero.description1')}
          <br />
          {t('home.hero.description2')}
        </p>
        <button
          onClick={handleStartChat}
          className="px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
        >
          {t('home.cta.button')}
        </button>
        <p className="mt-4 text-sm text-gray-500">
          {t('home.cta.subtext')}
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
        <FeatureCard
          title={t('home.features.conversational.title')}
          description={t('home.features.conversational.description')}
        />
        <FeatureCard
          title={t('home.features.preview.title')}
          description={t('home.features.preview.description')}
        />
        <FeatureCard
          title={t('home.features.deploy.title')}
          description={t('home.features.deploy.description')}
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
