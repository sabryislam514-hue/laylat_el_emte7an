import { useMemo, useState } from 'react'
import { Search, Trash2, X, KeyRound } from 'lucide-react'
import { gradeLabel, useApp } from '../../context/AppContext.jsx'

export default function StatsModal({ onClose }) {
  const { students, reviews, deleteStudent, resetStudentPassword } = useApp()
  const [query, setQuery] = useState('')
  const [resetFor, setResetFor] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim()
    if (!q) return students
    return students.filter(
      (s) => s.name.includes(q) || s.phone.includes(q) || gradeLabel(s.grade).includes(q),
    )
  }, [students, query])

  const onReset = (id) => {
    const result = resetStudentPassword(id, newPassword)
    if (result.ok) {
      setMessage('تم تحديث كلمة المرور')
      setResetFor(null)
      setNewPassword('')
    } else {
      setMessage(result.message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="glass neon-border relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl p-6 shadow-glow-lg">
        <button onClick={onClose} className="absolute left-4 top-4 text-slate-400 hover:text-white">
          <X />
        </button>
        <h3 className="mb-5 text-xl font-black">الإحصائيات والأعضاء</h3>
        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
            <p className="text-sm text-cyan-200">إجمالي الطلاب</p>
            <p className="text-3xl font-black">{students.length}</p>
          </div>
          <div className="rounded-2xl border border-violet-400/20 bg-violet-400/10 p-4">
            <p className="text-sm text-violet-200">إجمالي المراجعات</p>
            <p className="text-3xl font-black">{reviews.length}</p>
          </div>
        </div>
        <div className="relative mb-4">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="بحث بالاسم أو الهاتف أو الصف"
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 py-3 pr-10 pl-3 outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
        </div>
        {message && <p className="mb-3 text-sm text-cyan-300">{message}</p>}
        <div className="max-h-[42vh] overflow-auto rounded-2xl border border-white/10">
          <table className="w-full text-right text-sm">
            <thead className="sticky top-0 bg-slate-900/95 text-slate-300">
              <tr>
                <th className="p-3">الاسم</th>
                <th className="p-3">الهاتف</th>
                <th className="p-3">الصف</th>
                <th className="p-3">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-400">
                    لا يوجد طلاب مسجّلون بعد
                  </td>
                </tr>
              )}
              {filtered.map((s) => (
                <tr key={s.id} className="border-t border-white/5">
                  <td className="p-3 font-bold">{s.name}</td>
                  <td className="p-3 font-tajawal" dir="ltr">
                    {s.phone}
                  </td>
                  <td className="p-3">{gradeLabel(s.grade)}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setResetFor(s.id)
                          setNewPassword('')
                          setMessage('')
                        }}
                        className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1 text-xs hover:bg-cyan-400/10"
                      >
                        <KeyRound size={12} />
                        إعادة تعيين كلمة المرور
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`حذف/حظر الطالب ${s.name}؟`)) deleteStudent(s.id)
                        }}
                        className="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 px-2 py-1 text-xs text-rose-200 hover:bg-rose-500/20"
                      >
                        <Trash2 size={12} />
                        حذف / حظر
                      </button>
                    </div>
                    {resetFor === s.id && (
                      <div className="mt-2 flex gap-2">
                        <input
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="كلمة المرور الجديدة"
                          className="flex-1 rounded-lg border border-white/10 bg-slate-950 px-2 py-1 text-xs"
                        />
                        <button
                          onClick={() => onReset(s.id)}
                          className="rounded-lg bg-cyan-500 px-2 py-1 text-xs font-bold text-slate-950"
                        >
                          حفظ
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
