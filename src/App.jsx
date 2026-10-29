import Navbar from './components/Navbar.jsx'
import AuthPage from './components/AuthPage.jsx'
import StudentDashboard from './components/StudentDashboard.jsx'
import AdminControls from './components/AdminControls.jsx'
import { useApp } from './context/AppContext.jsx'

export default function App() {
  const { currentUser, isAdmin } = useApp()

  if (!currentUser) {
    return <AuthPage />
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-hero-radial" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="relative z-10">
        <Navbar />
        {isAdmin && <AdminControls />}
        <StudentDashboard />
      </div>
    </div>
  )
}
