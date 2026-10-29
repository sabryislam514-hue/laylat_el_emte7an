import { useState } from 'react'
import { BarChart3, Pencil, Plus, Sparkles } from 'lucide-react'
import { GRADES, useApp } from '../context/AppContext.jsx'
import ReviewModal from './Modals/ReviewModal.jsx'
import StatsModal from './Modals/StatsModal.jsx'

export default function AdminControls() {
  const { liveEditMode, setLiveEditMode, adminGradeFilter, setAdminGradeFilter } = useApp()
  const [reviewOpen, setReviewOpen] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)

  return (
    <>
      <div className="sticky top-[68px] z-30 mx-auto max-w-7xl px-4 pt-4">
        <div className="glass flex flex-col gap-3 rounded-2xl p-3 shadow-glow sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-cyan-200">
            <Sparkles size={16} />
            لوحة التحكم الإدارية
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={adminGradeFilter}
              onChange={(e) => setAdminGradeFilter(e.target.value)}
              className="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm outline-none"
            >
              <option value="all">جميع الصفوف</option>
              {GRADES.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => setLiveEditMode((v) => !v)}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${
                liveEditMode
                  ? 'bg-cyan-400 text-slate-950 shadow-glow'
                  : 'border border-white/10 bg-white/5'
              }`}
            >
              <Pencil size={15} />
              تفعيل وضع التعديل المباشر
            </button>
            <button
              onClick={() => setReviewOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-500 to-violet-500 px-3 py-2 text-sm font-bold"
            >
              <Plus size={15} />
              إضافة مراجعة جديدة
            </button>
            <button
              onClick={() => setStatsOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold"
            >
              <BarChart3 size={15} />
              الإحصائيات والأعضاء
            </button>
          </div>
        </div>
      </div>
      {reviewOpen && <ReviewModal onClose={() => setReviewOpen(false)} />}
      {statsOpen && <StatsModal onClose={() => setStatsOpen(false)} />}
    </>
  )
}
