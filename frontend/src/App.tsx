import { Route, Routes } from 'react-router-dom'
import { DocumentDetailPage } from './pages/DocumentDetailPage'
import { SessionDetailPage } from './pages/SessionDetailPage'
import { SessionsListPage } from './pages/SessionsListPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SessionsListPage />} />
      <Route path="/sessions/:sessionId" element={<SessionDetailPage />} />
      <Route path="/documents/:documentId" element={<DocumentDetailPage />} />
    </Routes>
  )
}

export default App
