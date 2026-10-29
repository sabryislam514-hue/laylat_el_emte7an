import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'laylat-el-emtehan-db-v2'

export const GRADES = [
  { id: 'grade1', label: 'الصف الأول الثانوي' },
  { id: 'grade2', label: 'الصف الثاني الثانوي' },
  { id: 'grade3', label: 'الصف الثالث الثانوي' },
]

export const MASTER_ADMIN = {
  phone: '01101627917',
  password: 'eslamsabry140.,',
  name: 'المستر (الأدمن العام)',
  role: 'admin',
  grade: 'all',
}

const defaultSiteContent = {
  badge: 'منصة المراجعات الأقوى لطلاب الثانوية',
  heroTitle: 'أقوى مراجعات ليلة الامتحان في مصر',
  heroSubtitle:
    'مراجعات مركّزة، شروحات ذهبية، وملفات PDF جاهزة قبل الامتحان مباشرة — كل مادة في مكان واحد.',
  supportWhatsapp: 'https://wa.me/201101627917',
  supportTelegram: 'https://t.me/laylat_el_emtehan',
}

const defaultReviews = [
  {
    id: 'r1',
    subject: 'اللغة العربية',
    title: 'مراجعة الباب الأول لغة عربية',
    instructor: 'مستشار المادة',
    grade: 'grade1',
    videoUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 'r2',
    subject: 'الفيزياء',
    title: 'الفيزياء الحديثة في ساعتين',
    instructor: 'خبير الفيزياء',
    grade: 'grade3',
    videoUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 'r3',
    subject: 'الكيمياء',
    title: 'مراجعة شاملة للعضوية',
    instructor: 'مستشار الكيمياء',
    grade: 'grade3',
    videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    pdfUrl: '',
  },
  {
    id: 'r4',
    subject: 'الرياضيات',
    title: 'الجبر والتفاضل — ليلة الامتحان',
    instructor: 'خبير الرياضيات',
    grade: 'grade2',
    videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 'r5',
    subject: 'اللغة الإنجليزية',
    title: 'مراجعة الجرامر والنصوص',
    instructor: 'مدرس أول لغة إنجليزية',
    grade: 'grade1',
    videoUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    pdfUrl: '',
  },
  {
    id: 'r6',
    subject: 'التاريخ',
    title: 'تاريخ مصر الحديث في مراجعة واحدة',
    instructor: 'مستشار الدراسات',
    grade: 'grade2',
    videoUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
    pdfUrl: '',
  },
]

const AppContext = createContext(null)

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return {
        students: [],
        reviews: defaultReviews,
        siteContent: defaultSiteContent,
        session: null,
      }
    }
    const parsed = JSON.parse(raw)
    return {
      students: parsed.students ?? [],
      reviews: parsed.reviews?.length ? parsed.reviews : defaultReviews,
      siteContent: { ...defaultSiteContent, ...(parsed.siteContent ?? {}) },
      session: parsed.session ?? null,
    }
  } catch {
    return {
      students: [],
      reviews: defaultReviews,
      siteContent: defaultSiteContent,
      session: null,
    }
  }
}

function normalizePhone(phone) {
  return String(phone || '').replace(/\s+/g, '').trim()
}

export function AppProvider({ children }) {
  const initial = loadState()
  const [students, setStudents] = useState(initial.students)
  const [reviews, setReviews] = useState(initial.reviews)
  const [siteContent, setSiteContent] = useState(initial.siteContent)
  const [session, setSession] = useState(initial.session)
  const [liveEditMode, setLiveEditMode] = useState(false)
  const [adminGradeFilter, setAdminGradeFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ students, reviews, siteContent, session }),
    )
  }, [students, reviews, siteContent, session])

  const currentUser = useMemo(() => {
    if (!session) return null
    if (session.role === 'admin' && session.phone === MASTER_ADMIN.phone) {
      return { ...MASTER_ADMIN }
    }
    const student = students.find((s) => s.id === session.id)
    return student ? { ...student, role: 'student' } : null
  }, [session, students])

  const isAdmin = currentUser?.role === 'admin'

  const login = (phone, password) => {
    const p = normalizePhone(phone)
    if (p === MASTER_ADMIN.phone && password === MASTER_ADMIN.password) {
      setSession({ role: 'admin', phone: MASTER_ADMIN.phone })
      return { ok: true }
    }
    const student = students.find((s) => normalizePhone(s.phone) === p)
    if (!student) return { ok: false, message: 'لا يوجد حساب مرتبط بهذا الرقم' }
    if (student.password !== password) return { ok: false, message: 'كلمة المرور غير صحيحة' }
    setSession({ role: 'student', id: student.id, phone: student.phone })
    return { ok: true }
  }

  const register = ({ name, phone, password, grade }) => {
    const p = normalizePhone(phone)
    if (!name?.trim() || !p || !password || !grade) {
      return { ok: false, message: 'يرجى استكمال جميع البيانات' }
    }
    if (p === MASTER_ADMIN.phone) {
      return { ok: false, message: 'هذا الرقم محجوز ولا يمكن التسجيل به' }
    }
    if (students.some((s) => normalizePhone(s.phone) === p)) {
      return { ok: false, message: 'هذا الرقم مسجّل بالفعل، سجّل الدخول' }
    }
    const student = {
      id: crypto.randomUUID(),
      name: name.trim(),
      phone: p,
      password,
      grade,
      createdAt: Date.now(),
    }
    setStudents((prev) => [...prev, student])
    setSession({ role: 'student', id: student.id, phone: student.phone })
    return { ok: true }
  }

  const logout = () => {
    setSession(null)
    setLiveEditMode(false)
  }

  const addReview = (review) => {
    setReviews((prev) => [{ ...review, id: crypto.randomUUID() }, ...prev])
  }

  const updateReview = (id, patch) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  const deleteReview = (id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id))
  }

  const deleteStudent = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id))
    if (session?.id === id) setSession(null)
  }

  const resetStudentPassword = (id, newPassword) => {
    if (!newPassword) return { ok: false, message: 'أدخل كلمة مرور جديدة' }
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, password: newPassword } : s)),
    )
    return { ok: true }
  }

  const updateSiteContent = (patch) => {
    setSiteContent((prev) => ({ ...prev, ...patch }))
  }

  const visibleReviews = useMemo(() => {
    if (isAdmin) {
      if (adminGradeFilter === 'all') return reviews
      return reviews.filter((r) => r.grade === adminGradeFilter)
    }
    if (!currentUser) return []
    return reviews.filter((r) => r.grade === currentUser.grade)
  }, [reviews, isAdmin, adminGradeFilter, currentUser])

  const value = {
    students,
    reviews,
    siteContent,
    currentUser,
    isAdmin,
    liveEditMode,
    setLiveEditMode,
    adminGradeFilter,
    setAdminGradeFilter,
    visibleReviews,
    login,
    register,
    logout,
    addReview,
    updateReview,
    deleteReview,
    deleteStudent,
    resetStudentPassword,
    updateSiteContent,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}

export function gradeLabel(id) {
  if (id === 'all') return 'جميع الصفوف'
  return GRADES.find((g) => g.id === id)?.label || id
}

export function toEmbedUrl(url) {
  if (!url) return ''
  const trimmed = url.trim()
  if (trimmed.includes('youtube.com/embed/')) return trimmed
  const watch = trimmed.match(/[?&]v=([^&]+)/)
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`
  const short = trimmed.match(/youtu\.be\/([^?&]+)/)
  if (short) return `https://www.youtube.com/embed/${short[1]}`
  if (/youtube\.com\/shorts\/([^?&]+)/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed.match(/shorts\/([^?&]+)/)[1]}`
  }
  return trimmed
}

export function isDirectVideo(url) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url || '')
}
