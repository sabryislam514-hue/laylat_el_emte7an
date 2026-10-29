import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'

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

const AppContext = createContext(null)

function normalizePhone(phone) {
  return String(phone || '').replace(/\s+/g, '').trim()
}

export function AppProvider({ children }) {
  const [students, setStudents] = useState([])
  const [reviews, setReviews] = useState([])
  const [siteContent, setSiteContent] = useState(defaultSiteContent)
  const [session, setSession] = useState(null)
  const [liveEditMode, setLiveEditMode] = useState(false)
  const [adminGradeFilter, setAdminGradeFilter] = useState('all')
  const [loadingData, setLoadingData] = useState(true)

  // جلب البيانات حصرياً من Supabase بدون أي إضافات وهمية تلقائية
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: studentsData } = await supabase.from('students').select('*')
        if (studentsData) setStudents(studentsData)

        const { data: reviewsData } = await supabase.from('reviews').select('*')
        if (reviewsData) {
          setReviews(reviewsData)
        }

        const { data: contentData } = await supabase.from('site_content').select('*').single()
        if (contentData) {
          setSiteContent({ ...defaultSiteContent, ...contentData })
        }
      } catch (err) {
        console.error('Error fetching from Supabase:', err)
      } finally {
        setLoadingData(false)
      }
    }
    fetchData()
  }, [])

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

  const register = async ({ name, phone, password, grade }) => {
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

    try {
      const { error } = await supabase.from('students').insert([student])
      if (error) throw error
      setStudents((prev) => [...prev, student])
      setSession({ role: 'student', id: student.id, phone: student.phone })
      return { ok: true }
    } catch (err) {
      console.error(err)
      return { ok: false, message: 'حدث خطأ أثناء التسجيل، حاول مرة أخرى' }
    }
  }

  const logout = () => {
    setSession(null)
    setLiveEditMode(false)
  }

  const addReview = async (review) => {
    const newRev = { ...review, id: crypto.randomUUID() }
    try {
      await supabase.from('reviews').insert([newRev])
      setReviews((prev) => [newRev, ...prev])
    } catch (err) {
      console.error(err)
    }
  }

  const updateReview = async (id, patch) => {
    try {
      await supabase.from('reviews').update(patch).eq('id', id)
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
    } catch (err) {
      console.error(err)
    }
  }

  const deleteReview = async (id) => {
    try {
      await supabase.from('reviews').delete().eq('id', id)
      setReviews((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const deleteStudent = async (id) => {
    try {
      await supabase.from('students').delete().eq('id', id)
      setStudents((prev) => prev.filter((s) => s.id !== id))
      if (session?.id === id) setSession(null)
    } catch (err) {
      console.error(err)
    }
  }

  const resetStudentPassword = async (id, newPassword) => {
    if (!newPassword) return { ok: false, message: 'أدخل كلمة مرور جديدة' }
    try {
      await supabase.from('students').update({ password: newPassword }).eq('id', id)
      setStudents((prev) =>
        prev.map((s) => (s.id === id ? { ...s, password: newPassword } : s)),
      )
      return { ok: true }
    } catch (err) {
      console.error(err)
      return { ok: false, message: 'حدث خطأ أثناء التحديث' }
    }
  }

  const updateSiteContent = async (patch) => {
    const updated = { ...siteContent, ...patch }
    setSiteContent(updated)
    try {
      await supabase.from('site_content').upsert({ id: 1, ...updated })
    } catch (err) {
      console.error(err)
    }
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
    loadingData,
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
