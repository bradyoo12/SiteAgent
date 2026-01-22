import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="h-16 border-b border-gray-200 bg-white">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SA</span>
          </div>
          <span className="text-xl font-bold text-gray-900">SiteAgent</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/chat" className="text-gray-600 hover:text-gray-900 transition-colors">
            새 프로젝트
          </Link>
          <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
            로그인
          </button>
        </nav>
      </div>
    </header>
  )
}
