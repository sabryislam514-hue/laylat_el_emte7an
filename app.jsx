import React, { useState, useEffect } from 'react';
import { 
  Lock, User, Phone, LogIn, Plus, Edit3, Trash2, Video, 
  Settings, CheckCircle, ShieldCheck, Play, X, Camera, Palette, 
  MessageCircle, BarChart2, BookOpen, GraduationCap, ArrowRight, Eye
} from 'lucide-react';

// Main Application Component
export default function ExamNightPlatform() {
  // --- States ---
  const [currentUser, setCurrentUser] = useState(null); // { phone, name, grade, role }
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [phoneInput, setPhoneInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [gradeInput, setGradeInput] = useState('الصف الثالث الثانوي');

  // Admin Data & Customization State
  const [editMode, setEditMode] = useState(false);
  const [siteName, setSiteName] = useState(localStorage.getItem('site_name') || 'ليلة الامتحان');
  const [heroTitle, setHeroTitle] = useState(localStorage.getItem('hero_title') || 'أقوى مراجعات ليلة الامتحان في مصر');
  const [heroSubtitle, setHeroSubtitle] = useState(localStorage.getItem('hero_subtitle') || 'تجمع لك أهم مدرسي المواد الأساسية في مكان واحد بتنظيم احترافي وسريع.');
  const [primaryColor, setPrimaryColor] = useState(localStorage.getItem('primary_color') || 'from-indigo-600 to-violet-600');
  const [accentColor, setAccentColor] = useState(localStorage.getItem('accent_color') || '#6366f1');
  const [whatsappLink, setWhatsappLink] = useState(localStorage.getItem('whatsapp_link') || '201101627917');
  const [logoImage, setLogoImage] = useState(localStorage.getItem('logo_image') || '');

  // Videos State
  const [videos, setVideos] = useState(JSON.parse(localStorage.getItem('exam_videos')) || [
    { id: 1, title: 'مراجعة الباب الأول لغة عربية', instructor: 'مستشار المادة', subject: 'اللغة العربية', grade: 'الصف الثالث الثانوي', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { id: 2, title: 'الفيزياء الحديثة في ساعتين', instructor: 'خبير الفيزياء', subject: 'الفيزياء', grade: 'الصف الثالث الثانوي', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
  ]);

  // Students Database State
  const [students, setStudents] = useState(JSON.parse(localStorage.getItem('exam_students')) || []);

  // Admin Modal States
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  
  // New Video Form
  const [newTitle, setNewTitle] = useState('');
  const [newInstructor, setNewInstructor] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newGrade, setNewGrade] = useState('الصف الثالث الثانوي');
  const [newUrl, setNewUrl] = useState('');

  // Active Video Modal for Student
  const [activeVideo, setActiveVideo] = useState(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('exam_videos', JSON.stringify(videos));
    localStorage.setItem('exam_students', JSON.stringify(students));
    localStorage.setItem('site_name', siteName);
    localStorage.setItem('hero_title', heroTitle);
    localStorage.setItem('hero_subtitle', heroSubtitle);
    localStorage.setItem('primary_color', primaryColor);
    localStorage.setItem('accent_color', accentColor);
    localStorage.setItem('whatsapp_link', whatsappLink);
    localStorage.setItem('logo_image', logoImage);
  }, [videos, students, siteName, heroTitle, heroSubtitle, primaryColor, accentColor, whatsappLink, logoImage]);

  // Grades List
  const gradesList = [
    'الصف الرابع الابتدائي', 'الصف الخامس الابتدائي', 'الصف السادس الابتدائي',
    'الصف الأول الإعدادي', 'الصف الثاني الإعدادي', 'الصف الثالث الإعدادي',
    'الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي'
  ];

  // --- Authentication Handler ---
  const handleAuth = (e) => {
    e.preventDefault();
    if (!phoneInput || !passwordInput) {
      alert('من فضلك ادخل رقم التليفون وكلمة المرور');
      return;
    }

    // Check Super Admin Credentials
    if (phoneInput === '01101627917' && passwordInput === 'eslamsabry140.,') {
      const adminUser = { phone: '01101627917', name: 'المستر (الأدمن العام)', grade: 'جميع الصفوف', role: 'admin' };
      setCurrentUser(adminUser);
      return;
    }

    if (authMode === 'signup') {
      if (!nameInput) {
        alert('من فضلك أدخل الاسم الكامل');
        return;
      }
      const newStudent = { name: nameInput, phone: phoneInput, password: passwordInput, grade: gradeInput, date: new Date().toLocaleDateString('ar-EG') };
      setStudents([...students, newStudent]);
      setCurrentUser({ ...newStudent, role: 'student' });
    } else {
      // Login check from saved students or admin
      const found = students.find(s => s.phone === phoneInput && s.password === passwordInput);
      if (found) {
        setCurrentUser({ ...found, role: 'student' });
      } else {
        alert('رقم التليفون أو كلمة المرور غير صحيحة، أو قم بإنشاء حساب جديد.');
      }
    }
  };

  // --- Image Upload Helper (+) ---
  const handleImageUpload = (setter) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          setter(uploadEvent.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // --- YouTube ID Extractor ---
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  // --- Add Video Handler ---
  const handleAddVideo = (e) => {
    e.preventDefault();
    if (!newTitle || !newSubject || !newUrl) {
      alert('من فضلك املأ الحقول الأساسية');
      return;
    }
    const newVid = {
      id: Date.now(),
      title: newTitle,
      instructor: newInstructor || 'مدرس المادة',
      subject: newSubject,
      grade: newGrade,
      url: newUrl
    };
    setVideos([newVid, ...videos]);
    setNewTitle('');
    setNewInstructor('');
    setNewSubject('');
    setNewUrl('');
    setShowAddVideoModal(false);
  };

  // --- If Not Logged In: Gorgeous Auth Screen ---
  if (!currentUser) {
    return (
      <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex items-center justify-center p-4 font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent_50%)]"></div>
        
        <div className="relative w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              {siteName}
            </h1>
            <p className="text-slate-400 text-sm mt-2">منصة مراجعات ليلة الامتحان الرسمية</p>
          </div>

          {/* Auth Tabs */}
          <div className="flex bg-slate-950 p-1.5 rounded-2xl mb-6 border border-slate-800">
            <button 
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${authMode === 'login' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              تسجيل الدخول
            </button>
            <button 
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${authMode === 'signup' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              حساب جديد
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">الاسم الكامل</label>
                <div className="relative">
                  <User className="absolute right-3.5 top-3.5 w-5 h-5 text-slate-500" />
                  <input 
                    type="text" 
                    value={nameInput} 
                    onChange={(e) => setNameInput(e.target.value)} 
                    placeholder="اكتب اسمك الثلاثي"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-12 pl-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">رقم الموبايل</label>
              <div className="relative">
                <Phone className="absolute right-3.5 top-3.5 w-5 h-5 text-slate-500" />
                <input 
                  type="text" 
                  value={phoneInput} 
                  onChange={(e) => setPhoneInput(e.target.value)} 
                  placeholder="010xxxxxxxx"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-12 pl-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3.5 top-3.5 w-5 h-5 text-slate-500" />
                <input 
                  type="password" 
                  value={passwordInput} 
                  onChange={(e) => setPasswordInput(e.target.value)} 
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-12 pl-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">الصف الدراسي</label>
                <select 
                  value={gradeInput} 
                  onChange={(e) => setGradeInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  {gradesList.map((g, idx) => (
                    <option key={idx} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>{authMode === 'login' ? 'دخول المنصة' : 'إنشاء الحساب الان'}</span>
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-slate-500">
            جميع الحقوق محفوظة © منصة ليلة الامتحان التعليمية
          </div>
        </div>
      </div>
    );
  }

  // --- Main Platform Interface ---
  const isAdmin = currentUser.role === 'admin';

  // Group videos by subject
  const subjectsMap = {};
  videos.forEach(v => {
    if (!subjectsMap[v.subject]) subjectsMap[v.subject] = [];
    subjectsMap[v.subject].push(v);
  });

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-600 selection:text-white pb-20">
      
      {/* Top Admin Control Bar (Only for Admin when Edit Mode is On or Always Visible to Admin) */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-violet-950 border-b border-indigo-900/50 px-4 py-3 sticky top-0 z-50 backdrop-blur-md shadow-xl">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> لوحة التحكم الإدارية
              </span>
              <button 
                onClick={() => setEditMode(!editMode)}
                className={`text-xs font-bold px-4 py-1.5 rounded-xl transition-all flex items-center gap-2 ${editMode ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                <Edit3 className="w-4 h-4" />
                {editMode ? 'وضع التعديل المباشر: مفعل (اضغط للإيقاف)' : 'تفعيل وضع التعديل المباشر'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowAddVideoModal(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> إضافة مراجعة جديدة
              </button>
              <button 
                onClick={() => setShowAdminDashboard(true)}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
              >
                <BarChart2 className="w-4 h-4" /> الإحصائيات والأعضاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo with (+) button for Admin */}
            <div className="relative group flex items-center gap-3">
              {logoImage ? (
                <img src={logoImage} alt="Logo" className="w-11 h-11 rounded-2xl object-cover border border-indigo-500/30" />
              ) : (
                <div className="w-11 h-11 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
              )}
              
              {editMode && (
                <button 
                  onClick={() => handleImageUpload(setLogoImage)} 
                  className="absolute -bottom-1 -right-1 bg-indigo-600 hover:bg-indigo-500 text-white p-1 rounded-full shadow-lg border border-slate-900" 
                  title="تغيير اللوجو"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Editable Site Name */}
              {editMode ? (
                <input 
                  type="text" 
                  value={siteName} 
                  onChange={(e) => setSiteName(e.target.value)}
                  className="bg-slate-900 border border-indigo-500 px-3 py-1 rounded-lg text-lg font-black tracking-tight text-white w-48"
                />
              ) : (
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                  {siteName}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <div className="text-xs font-bold text-slate-200">{currentUser.name}</div>
              <div className="text-[10px] text-indigo-400 font-medium">{currentUser.grade}</div>
            </div>
            <button 
              onClick={() => setCurrentUser(null)}
              className="bg-slate-900 hover:bg-rose-500/20 hover:text-rose-400 border border-slate-800 text-slate-400 text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
            >
              خروج
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-4 pt-16 pb-12 text-center">
        <div className="max-w-3xl mx-auto">
          {editMode ? (
            <textarea 
              value={heroTitle} 
              onChange={(e) => setHeroTitle(e.target.value)} 
              className="w-full bg-slate-900 border border-indigo-500 p-3 rounded-2xl text-3xl md:text-5xl font-black text-center text-white mb-4"
              rows={2}
            />
          ) : (
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-6 bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent leading-tight">
              {heroTitle}
            </h1>
          )}

          {editMode ? (
            <textarea 
              value={heroSubtitle} 
              onChange={(e) => setHeroSubtitle(e.target.value)} 
              className="w-full bg-slate-900 border border-indigo-500 p-2 rounded-xl text-sm text-slate-300 text-center mb-6"
            />
          ) : (
            <p className="text-base md:text-lg text-slate-400 mb-8 leading-relaxed">
              {heroSubtitle}
            </p>
          )}

          <div className="flex items-center justify-center gap-3">
            <span className="bg-indigo-600/10 border border-indigo-500/25 text-indigo-400 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-500" /> مراجعات شاملة ومحدثة لجميع المواد
            </span>
          </div>
        </div>
      </header>

      {/* Dynamic Video Review Sections */}
      <main className="max-w-7xl mx-auto px-4 space-y-16">
        {Object.keys(subjectsMap).length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 border border-slate-800/80 rounded-3xl">
            <Video className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-300">لا توجد مراجعات مضافة حتى الآن</h3>
            <p className="text-slate-500 text-xs mt-1">اضغط على "إضافة مراجعة جديدة" من أعلى اللوحة لبدء عرض الفيديوهات.</p>
          </div>
        ) : (
          Object.entries(subjectsMap).map(([subjectName, subjectVideos]) => (
            <section key={subjectName} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                  <span className="w-3 h-8 bg-indigo-600 rounded-full inline-block"></span>
                  {subjectName}
                </h2>
                <span className="text-xs bg-slate-900 border border-slate-800 text-slate-400 px-3 py-1 rounded-full font-bold">
                  {subjectVideos.length} مراجعة متاحة
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjectVideos.map((video) => (
                  <div 
                    key={video.id}
                    className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/40 rounded-3xl overflow-hidden shadow-xl transition-all group flex flex-col justify-between"
                  >
                    <div>
                      {/* Video Thumbnail / Player preview trigger */}
                      <div 
                        onClick={() => setActiveVideo(video)}
                        className="relative aspect-video bg-slate-950 cursor-pointer overflow-hidden flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 z-10"></div>
                        <div className="w-14 h-14 bg-indigo-600/90 group-hover:bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/40 z-20 transition-transform group-hover:scale-110">
                          <Play className="w-6 h-6 fill-white ml-0.5" />
                        </div>
                        <span className="absolute bottom-3 right-3 z-20 bg-slate-950/80 backdrop-blur-md text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">
                          {video.grade}
                        </span>
                      </div>

                      <div className="p-5">
                        <div className="text-xs font-bold text-indigo-400 mb-1">{video.instructor}</div>
                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-200 transition-colors line-clamp-2">
                          {video.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex items-center justify-between mt-auto border-t border-slate-800/50 pt-4">
                      <button 
                        onClick={() => setActiveVideo(video)}
                        className="w-full bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white text-xs font-bold py-2.5 rounded-xl transition-all border border-indigo-500/20 flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4 fill-current" /> مشاهدة المراجعة الان
                      </button>

                      {isAdmin && (
                        <button 
                          onClick={() => {
                            if(confirm('هل أنت متأكد من حذف هذه المراجعة؟')) {
                              setVideos(videos.filter(v => v.id !== video.id));
                            }
                          }}
                          className="mr-2 p-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-xl border border-rose-500/20 transition-all"
                          title="حذف الفيديو"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      {/* Floating WhatsApp Support Button */}
      <a 
        href={`https://wa.me/${whatsappLink}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-2xl shadow-2xl shadow-emerald-600/40 transition-all hover:scale-110 flex items-center gap-2 group"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-bold text-sm">
          تواصل مع الدعم الفني
        </span>
      </a>

      {/* --- Video Watch Modal --- */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-400 ml-2">{activeVideo.subject}</span>
                <span className="text-xs text-slate-400">({activeVideo.instructor})</span>
                <h3 className="text-base font-bold text-white mt-0.5">{activeVideo.title}</h3>
              </div>
              <button 
                onClick={() => setActiveVideo(null)}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all border border-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="aspect-video bg-slate-950 w-full">
              <iframe 
                src={getYouTubeEmbedUrl(activeVideo.url)} 
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* --- Admin: Add Video Modal --- */}
      {showAddVideoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-500" /> إضافة فيديو مراجعة جديد
              </h3>
              <button onClick={() => setShowAddVideoModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">عنوان المراجعة</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: مراجعة ليلة الامتحان فيزياء أ. محمد مرعي"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">اسم المدرس</label>
                <input 
                  type="text" 
                  value={newInstructor} 
                  onChange={(e) => setNewInstructor(e.target.value)}
                  placeholder="مثال: مستر أحمد الباشا"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">اسم المادة (سيتم عمل قسم لها تلقائياً)</label>
                  <input 
                    type="text" 
                    value={newSubject} 
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="مثال: الكيمياء"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">الصف الدراسي</label>
                  <select 
                    value={newGrade} 
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                  >
                    {gradesList.map((g, idx) => (
                      <option key={idx} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">لينك فيديو اليوتيوب</label>
                <input 
                  type="text" 
                  value={newUrl} 
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all mt-2"
              >
                حفظ ونشر الفيديو الان
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- Admin: Dashboard Analytics Modal --- */}
      {showAdminDashboard && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-6 h-6 text-indigo-500" /> لوحة إحصائيات المنصة والأعضاء
              </h3>
              <button onClick={() => setShowAdminDashboard(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
                <div className="text-slate-400 text-xs font-bold mb-1">إجمالي الطلاب المسجلين</div>
                <div className="text-3xl font-black text-indigo-400">{students.length} طالب</div>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
                <div className="text-slate-400 text-xs font-bold mb-1">إجمالي مراجعات الفيديوهات</div>
                <div className="text-3xl font-black text-emerald-400">{videos.length} فيديو</div>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
                <div className="text-slate-400 text-xs font-bold mb-1">حالة السيرفر</div>
                <div className="text-lg font-black text-violet-400 mt-1">نشط وسريع 🚀</div>
              </div>
            </div>

            {/* Students Table */}
            <h4 className="text-base font-bold text-white mb-4">قائمة الطلاب المسجلين على المنصة</h4>
            <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">اسم الطالب</th>
                    <th className="p-3.5">رقم الموبايل</th>
                    <th className="p-3.5">الصف الدراسي</th>
                    <th className="p-3.5">تاريخ التسجيل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-slate-500">لا توجد حسابات مسجلة بعد</td>
                    </tr>
                  ) : (
                    students.map((st, i) => (
                      <tr key={i} className="hover:bg-slate-900/50">
                        <td className="p-3.5 font-bold text-white">{st.name}</td>
                        <td className="p-3.5 text-indigo-300 font-mono">{st.phone}</td>
                        <td className="p-3.5 text-slate-300">{st.grade}</td>
                        <td className="p-3.5 text-slate-500">{st.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* WhatsApp number setting */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <label className="block text-xs font-bold text-slate-300 mb-2">رقم واتساب الدعم الفني (بدون علامة +)</label>
              <input 
                type="text" 
                value={whatsappLink} 
                onChange={(e) => setWhatsappLink(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}