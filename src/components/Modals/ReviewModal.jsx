import { useState } from 'react'
import { X } from 'lucide-react'
import { GRADES, useApp } from '../../context/AppContext.jsx'

const emptyForm = {
  subject: '',
  title: '',
  instructor: '',
  grade: 'grade3',
  videoUrl: '',
  pdfUrl: '',
}

export default function ReviewModal({ onClose, review }) {
  const { addReview, updateReview } = useApp()
  const [form, setForm] = useState(review ? { ...review } : emptyForm)

  const onChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const payload = {
      subject: form.subject.trim(),
      title: form.title.trim(),
      instructor: form.instructor.trim(),
      grade: form.grade,
      videoUrl: form.videoUrl.trim(),
      pdfUrl: form.pdfUrl.trim(),
    }
    if (review) updateReview(review.id, payload)
    else addReview(payload)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="glass neon-border relative w-full max-w-lg rounded-3xl p-6 shadow-glow-lg"
      >
        <button type="button" onClick={onClose} className="absolute left-4 top-4 text-slate-400 hover:text-white">
          <X />
        </button>
        <h3 className="mb-5 text-xl font-black">
          {review ? 'تعديل المراجعة' : 'إضافة مراجعة جديدة'}
        </h3>
        <div className="grid gap-3">
          <input
            required
            value={form.subject}
            onChange={onChange('subject')}
            placeholder="اسم المادة (مثل: اللغة العربية، الفيزياء)"
            className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
          <input
            required
            value={form.title}
            onChange={onChange('title')}
            placeholder="عنوان المراجعة"
            className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
          <input
            required
            value={form.instructor}
            onChange={onChange('instructor')}
            placeholder="اسم المدرس / الصفة (مستشار المادة)"
            className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
          <select
            value={form.grade}
            onChange={onChange('grade')}
            className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none"
          >
            {GRADES.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
          <input
            required
            dir="ltr"
            value={form.videoUrl}
            onChange={onChange('videoUrl')}
            placeholder="رابط الفيديو (YouTube أو رابط مباشر)"
            className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-left outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
          <input
            dir="ltr"
            value={form.pdfUrl}
            onChange={onChange('pdfUrl')}
            placeholder="رابط ملف PDF / المادة (اختياري)"
            className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-left outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
        </div>
        <button
          type="submit"
          className="mt-5 w-full rounded-xl bg-gradient-to-l from-cyan-500 to-violet-500 py-3 font-bold"
        >
          حفظ المراجعة
        </button>
      </form>
    </div>
  )
}
