import { useState } from 'react'
import { Eye, EyeOff, GraduationCap, MoonStar, Phone, Shield, UserRound } from 'lucide-react'
import { GRADES, useApp } from '../context/AppContext.jsx'

export default function AuthPage() {
  const { login, register } = useApp()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [grade, setGrade] = useState('grade3')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result =
      mode === 'login'
        ? login(phone, password)
        : register({ name, phone, password, grade })
    setLoading(false)
    if (!result.ok) setError(result.message)
  }

  return (
    <div dir="rtl" className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-hero-radial" />
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 animate-glow-pulse rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 animate-glow-pulse rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-10 lg:flex-row lg:gap-16">
        <div className="mb-10 max-w-xl animate-fade-up text-center lg:mb-0 lg:text-right">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-sm text-cyan-200">
            <MoonStar size={16} />
            ليلة الامتحان
          </div>
          <h1 className="font-cairo text-4xl font-black leading-tight sm:text-5xl">
            منصتك الذهبية
            <span className="block bg-gradient-to-l from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
              قبل الامتحان بخطوة
            </span>
          </h1>
          <p className="mt-4 font-tajawal text-lg text-slate-400">
            سجّل برقم الهاتف للوصول إلى المراجعات الخاصة بصفك الدراسي. المحتوى محمي ولا يُعرض إلا بعد تسجيل الدخول.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="glass neon-border w-full max-w-md animate-fade-up rounded-3xl p-7 shadow-glow-lg"
        >
          <div className="mb-6 flex rounded-2xl bg-slate-900/70 p-1">
            <button
              type="button"
              onClick={() => {
                setMode('login')
                setError('')
              }}
              className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition ${
                mode === 'login' ? 'bg-gradient-to-l from-cyan-500 to-violet-500 text-white shadow-glow' : 'text-slate-400'
              }`}
            >
              تسجيل دخول
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register')
                setError('')
              }}
              className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition ${
                mode === 'register' ? 'bg-gradient-to-l from-cyan-500 to-violet-500 text-white shadow-glow' : 'text-slate-400'
              }`}
            >
              إنشاء حساب جديد
            </button>
          </div>

          {mode === 'register' && (
            <label className="mb-4 block">
              <span className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                <UserRound size={16} /> الاسم بالكامل
              </span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none ring-cyan-400/30 focus:ring-2"
                placeholder="مثال: أحمد محمد"
              />
            </label>
          )}

          <label className="mb-4 block">
            <span className="mb-2 flex items-center gap-2 text-sm text-slate-300">
              <Phone size={16} /> رقم الهاتف
            </span>
            <input
              required
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-left outline-none ring-cyan-400/30 focus:ring-2"
              placeholder="01xxxxxxxxx"
            />
          </label>

          <label className="mb-4 block">
            <span className="mb-2 flex items-center gap-2 text-sm text-slate-300">
              <Shield size={16} /> كلمة المرور
            </span>
            <div className="relative">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 pl-12 outline-none ring-cyan-400/30 focus:ring-2"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                aria-label="إظهار كلمة المرور"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          {mode === 'register' && (
            <label className="mb-4 block">
              <span className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                <GraduationCap size={16} /> الصف الدراسي
              </span>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none ring-cyan-400/30 focus:ring-2"
              >
                {GRADES.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          {error && (
            <p className="mb-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-l from-cyan-500 via-violet-500 to-fuchsia-500 py-3 font-bold text-white shadow-glow transition hover:brightness-110 disabled:opacity-60"
          >
            {mode === 'login' ? 'دخول المنصة' : 'إنشاء الحساب والدخول'}
          </button>
        </form>
      </div>
    </div>
  )
}
