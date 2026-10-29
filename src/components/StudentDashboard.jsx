import { useMemo, useState } from 'react'
import { FileText, Headphones, MessageCircle, Pencil, Play, Send, Trash2 } from 'lucide-react'
import { gradeLabel, useApp } from '../context/AppContext.jsx'
import EditableText from './EditableText.jsx'
import ReviewModal from './Modals/ReviewModal.jsx'
import VideoPlayerModal from './Modals/VideoPlayerModal.jsx'

export default function StudentDashboard() {
  const { visibleReviews, isAdmin, liveEditMode, siteContent, updateSiteContent, deleteReview } =
    useApp()
  const [subject, setSubject] = useState('all')
  const [playing, setPlaying] = useState(null)
  const [editing, setEditing] = useState(null)
  const [supportOpen, setSupportOpen] = useState(false)

  const subjects = useMemo(() => {
    const map = new Map()
    visibleReviews.forEach((r) => map.set(r.subject, (map.get(r.subject) || 0) + 1))
    return Array.from(map.entries())
  }, [visibleReviews])

  const cards = subject === 'all' ? visibleReviews : visibleReviews.filter((r) => r.subject === subject)

  return (
    <main className="mx-auto max-w-7xl px-4 pb-28 pt-8">
      <section className="mb-10 text-center">
        <EditableText
          field="badge"
          as="div"
          className="mb-4 inline-block rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-4 py-1.5 text-sm text-fuchsia-200"
        />
        <EditableText
          field="heroTitle"
          as="h1"
          className="mx-auto max-w-4xl font-cairo text-3xl font-black leading-tight sm:text-5xl"
        />
        <EditableText
          field="heroSubtitle"
          as="p"
          className="mx-auto mt-4 max-w-2xl font-tajawal text-base text-slate-400 sm:text-lg"
        />
      </section>

      <section className="mb-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => setSubject('all')}
          className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${
            subject === 'all'
              ? 'bg-gradient-to-l from-cyan-500 to-violet-500 shadow-glow'
              : 'glass'
          }`}
        >
          كل المواد
          <span className="mr-2 text-xs opacity-80">{visibleReviews.length} مراجعة متاحة</span>
        </button>
        {subjects.map(([name, count]) => (
          <button
            key={name}
            onClick={() => setSubject(name)}
            className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${
              subject === name
                ? 'bg-gradient-to-l from-cyan-500 to-violet-500 shadow-glow'
                : 'glass hover:border-cyan-400/30'
            }`}
          >
            {name}
            <span className="mr-2 text-xs opacity-80">
              {count} {count === 1 ? 'مراجعة متاحة' : 'مراجعات متاحة'}
            </span>
          </button>
        ))}
      </section>

      {cards.length === 0 ? (
        <p className="glass rounded-3xl p-12 text-center text-slate-400">لا توجد مراجعات في هذا التصنيف بعد.</p>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((review) => (
            <article
              key={review.id}
              className="glass group relative overflow-hidden rounded-3xl p-5 transition duration-300 hover:-translate-y-1 hover:shadow-glow"
            >
              <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl transition group-hover:bg-cyan-400/20" />
              <div className="relative">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <span className="rounded-full bg-violet-400/15 px-3 py-1 text-xs font-bold text-violet-200">
                    {review.subject}
                  </span>
                  <span className="text-xs text-slate-400">{gradeLabel(review.grade)}</span>
                </div>
                <h3 className="mb-2 text-lg font-black leading-snug">{review.title}</h3>
                <p className="mb-4 text-sm text-slate-400">{review.instructor}</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setPlaying(review)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-cyan-500 to-violet-500 px-3 py-2.5 text-sm font-bold"
                  >
                    <Play size={16} />
                    مشاهدة المراجعة الآن
                  </button>
                  {review.pdfUrl && (
                    <a
                      href={review.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm"
                    >
                      <FileText size={16} />
                      PDF
                    </a>
                  )}
                </div>
                {isAdmin && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => setEditing(review)}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-white/5 py-2 text-xs font-bold"
                    >
                      <Pencil size={14} />
                      تعديل
                    </button>
                    <button
                      type="button"
                      aria-label="حذف المراجعة"
                      onClick={() => {
                        if (confirm('حذف هذه المراجعة؟')) deleteReview(review.id)
                      }}
                      className="inline-flex items-center justify-center gap-1 rounded-xl bg-rose-500/15 px-3 py-2 text-xs font-bold text-rose-200"
                    >
                      <Trash2 size={14} />
                      حذف
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </section>
      )}

      <div className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2">
        <div className="relative">
          {supportOpen && (
            <div className="glass absolute bottom-14 left-1/2 w-72 -translate-x-1/2 rounded-2xl p-4 shadow-glow">
              <p className="mb-3 text-sm font-bold">تواصل مع الدعم الفني</p>
              {isAdmin && liveEditMode ? (
                <div className="space-y-2">
                  <input
                    dir="ltr"
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-2 py-2 text-left text-xs"
                    value={siteContent.supportWhatsapp}
                    onChange={(e) => updateSiteContent({ supportWhatsapp: e.target.value })}
                    placeholder="WhatsApp URL"
                  />
                  <input
                    dir="ltr"
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-2 py-2 text-left text-xs"
                    value={siteContent.supportTelegram}
                    onChange={(e) => updateSiteContent({ supportTelegram: e.target.value })}
                    placeholder="Telegram URL"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <a
                    href={siteContent.supportWhatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500/20 py-2 text-sm font-bold text-emerald-200"
                  >
                    <MessageCircle size={16} />
                    واتساب
                  </a>
                  <a
                    href={siteContent.supportTelegram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500/20 py-2 text-sm font-bold text-sky-200"
                  >
                    <Send size={16} />
                    تيليجرام
                  </a>
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => setSupportOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-cyan-500 via-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-black shadow-glow-lg"
          >
            <Headphones size={18} />
            تواصل مع الدعم الفني
          </button>
        </div>
      </div>

      {playing && <VideoPlayerModal review={playing} onClose={() => setPlaying(null)} />}
      {editing && <ReviewModal review={editing} onClose={() => setEditing(null)} />}
    </main>
  )
}
