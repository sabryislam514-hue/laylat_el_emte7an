import { LogOut, MoonStar } from 'lucide-react'
import { gradeLabel, useApp } from '../context/AppContext.jsx'

export default function Navbar() {
  const { currentUser, isAdmin, logout } = useApp()

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-glow">
            <MoonStar size={22} className="text-slate-950" />
          </div>
          <div>
            <p className="font-cairo text-lg font-black">ليلة الامتحان</p>
            <p className="text-xs text-slate-400">Laylat El-Emtehan</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm sm:block">
            <p className="font-bold">{currentUser?.name}</p>
            <p className="text-xs text-cyan-300">
              {isAdmin ? 'جميع الصفوف' : gradeLabel(currentUser?.grade)}
            </p>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-200"
          >
            <LogOut size={16} />
            خروج
          </button>
        </div>
      </div>
    </header>
  )
}
