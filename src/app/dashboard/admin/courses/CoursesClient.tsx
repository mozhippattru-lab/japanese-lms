'use client'
import { useState, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  BookOpen, CheckCircle2, FileText, Users, Plus, Pencil, X,
  Video, FileText as FileReading, ClipboardList, Target, Headphones,
  Clock, ChevronDown, FolderOpen, ArrowLeft, File,
} from 'lucide-react'

type Course = {
  id: string
  title: string
  jlpt_level: string
  description: string | null
  duration_weeks: number
  status: string
  enrolled_count: number
  created_at: string
}

type CourseModule = {
  id: string
  course_id: string
  title: string
  order_index: number
}

type Lesson = {
  id: string
  module_id: string
  course_id: string
  title: string
  lesson_type: string
  duration_minutes: number
  order_index: number
  content_url: string | null
}

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1']
const STATUSES = ['Active', 'Draft', 'Archived']
const LESSON_TYPES: { value: string; label: string; icon: ReactNode }[] = [
  { value: 'video', label: 'Video', icon: <Video size={15} /> },
  { value: 'reading', label: 'Reading', icon: <FileReading size={15} /> },
  { value: 'quiz', label: 'Quiz', icon: <ClipboardList size={15} /> },
  { value: 'practice', label: 'Practice', icon: <Target size={15} /> },
  { value: 'audio', label: 'Audio', icon: <Headphones size={15} /> },
]

const levelColor: Record<string, string> = { N5: '#22c55e', N4: '#2d7dd2', N3: '#f59e0b', N2: '#e84040', N1: '#8b5cf6' }
const statusColor: Record<string, string> = { Active: '#22c55e', Draft: '#f59e0b', Archived: '#9ca3af' }

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  border: '1.5px solid #e5e7eb',
  borderRadius: '10px',
  fontSize: '14px',
  outline: 'none',
  background: '#f9fafb',
  color: '#1a1f3c',
  fontWeight: 500,
  boxSizing: 'border-box' as const,
} as const

function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: wide ? '640px' : '520px', maxHeight: '90vh', overflowY: 'auto', overflowX: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 24px 0' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1f3c' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#9ca3af' }}>×</button>
        </div>
        <div style={{ padding: '20px 24px 24px' }}>{children}</div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>{label}</label>
      {children}
    </div>
  )
}

function lessonIcon(type: string): ReactNode {
  return LESSON_TYPES.find(t => t.value === type)?.icon || <File size={15} />
}

const emptyCourseForm = { title: '', jlpt_level: 'N5', description: '', duration_weeks: 12, status: 'Active' }
const emptyLessonForm = { title: '', lesson_type: 'video', duration_minutes: 30, content_url: '' }

export default function CoursesClient({ initialCourses }: { initialCourses: Course[] }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [activeCourse, setActiveCourse] = useState<Course | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [editCourse, setEditCourse] = useState<Course | null>(null)
  const [courseForm, setCourseForm] = useState(emptyCourseForm)
  const [loading, setLoading] = useState(false)

  // Content view state
  const [modules, setModules] = useState<CourseModule[]>([])
  const [lessons, setLessons] = useState<Record<string, Lesson[]>>({})
  const [expandedMods, setExpandedMods] = useState<Set<string>>(new Set())
  const [contentLoading, setContentLoading] = useState(false)
  const [showAddModule, setShowAddModule] = useState(false)
  const [editModule, setEditModule] = useState<CourseModule | null>(null)
  const [moduleTitle, setModuleTitle] = useState('')
  const [addLessonModId, setAddLessonModId] = useState<string | null>(null)
  const [editLesson, setEditLesson] = useState<Lesson | null>(null)
  const [lessonForm, setLessonForm] = useState(emptyLessonForm)

  async function openCourse(course: Course) {
    setActiveCourse(course)
    setContentLoading(true)
    const supabase = createClient()
    const { data: mods } = await supabase
      .from('course_modules')
      .select('*')
      .eq('course_id', course.id)
      .order('order_index')
    const modList = mods || []
    setModules(modList)
    if (modList.length > 0) {
      const { data: lsns } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', course.id)
        .order('order_index')
      const grouped: Record<string, Lesson[]> = {}
      for (const l of (lsns || [])) {
        if (!grouped[l.module_id]) grouped[l.module_id] = []
        grouped[l.module_id].push(l)
      }
      setLessons(grouped)
    }
    setExpandedMods(new Set(modList.map(m => m.id)))
    setContentLoading(false)
  }

  // --- Course CRUD ---
  async function addCourse(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase.from('courses').insert({
      title: courseForm.title,
      jlpt_level: courseForm.jlpt_level,
      description: courseForm.description || null,
      duration_weeks: courseForm.duration_weeks,
      status: courseForm.status,
      enrolled_count: 0,
    }).select().single()
    if (data) setCourses(prev => [data, ...prev])
    setShowAdd(false)
    setCourseForm(emptyCourseForm)
    setLoading(false)
  }

  async function updateCourse(e: React.FormEvent) {
    e.preventDefault()
    if (!editCourse) return
    setLoading(true)
    const supabase = createClient()
    const updates = {
      title: editCourse.title,
      jlpt_level: editCourse.jlpt_level,
      description: editCourse.description,
      duration_weeks: editCourse.duration_weeks,
      status: editCourse.status,
    }
    await supabase.from('courses').update(updates).eq('id', editCourse.id)
    setCourses(prev => prev.map(c => c.id === editCourse.id ? { ...c, ...updates } : c))
    setEditCourse(null)
    setLoading(false)
  }

  async function deleteCourse(id: string) {
    if (!confirm('Delete this course and all its content?')) return
    const supabase = createClient()
    await supabase.from('courses').delete().eq('id', id)
    setCourses(prev => prev.filter(c => c.id !== id))
  }

  // --- Module CRUD ---
  async function addModule(e: React.FormEvent) {
    e.preventDefault()
    if (!activeCourse || !moduleTitle.trim()) return
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase.from('course_modules').insert({
      course_id: activeCourse.id,
      title: moduleTitle.trim(),
      order_index: modules.length,
    }).select().single()
    if (data) {
      setModules(prev => [...prev, data])
      setExpandedMods(prev => new Set([...prev, data.id]))
      setLessons(prev => ({ ...prev, [data.id]: [] }))
    }
    setModuleTitle('')
    setShowAddModule(false)
    setLoading(false)
  }

  async function updateModule(e: React.FormEvent) {
    e.preventDefault()
    if (!editModule) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('course_modules').update({ title: editModule.title }).eq('id', editModule.id)
    setModules(prev => prev.map(m => m.id === editModule.id ? { ...m, title: editModule.title } : m))
    setEditModule(null)
    setLoading(false)
  }

  async function deleteModule(id: string) {
    if (!confirm('Delete this module and all its lessons?')) return
    const supabase = createClient()
    await supabase.from('course_modules').delete().eq('id', id)
    setModules(prev => prev.filter(m => m.id !== id))
    setLessons(prev => { const n = { ...prev }; delete n[id]; return n })
  }

  // --- Lesson CRUD ---
  async function addLesson(e: React.FormEvent) {
    e.preventDefault()
    if (!activeCourse || !addLessonModId) return
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase.from('lessons').insert({
      module_id: addLessonModId,
      course_id: activeCourse.id,
      title: lessonForm.title,
      lesson_type: lessonForm.lesson_type,
      duration_minutes: Number(lessonForm.duration_minutes),
      order_index: (lessons[addLessonModId] || []).length,
      content_url: lessonForm.content_url || null,
    }).select().single()
    if (data) {
      setLessons(prev => ({ ...prev, [addLessonModId]: [...(prev[addLessonModId] || []), data] }))
    }
    setLessonForm(emptyLessonForm)
    setAddLessonModId(null)
    setLoading(false)
  }

  async function updateLesson(e: React.FormEvent) {
    e.preventDefault()
    if (!editLesson) return
    setLoading(true)
    const supabase = createClient()
    const updates = {
      title: editLesson.title,
      lesson_type: editLesson.lesson_type,
      duration_minutes: editLesson.duration_minutes,
      content_url: editLesson.content_url,
    }
    await supabase.from('lessons').update(updates).eq('id', editLesson.id)
    setLessons(prev => ({
      ...prev,
      [editLesson.module_id]: (prev[editLesson.module_id] || []).map(l =>
        l.id === editLesson.id ? { ...l, ...updates } : l
      ),
    }))
    setEditLesson(null)
    setLoading(false)
  }

  async function deleteLesson(lesson: Lesson) {
    if (!confirm('Delete this lesson?')) return
    const supabase = createClient()
    await supabase.from('lessons').delete().eq('id', lesson.id)
    setLessons(prev => ({
      ...prev,
      [lesson.module_id]: (prev[lesson.module_id] || []).filter(l => l.id !== lesson.id),
    }))
  }

  // =====================
  // CONTENT VIEW
  // =====================
  if (activeCourse) {
    const allLessons = Object.values(lessons).flat()
    const totalMins = allLessons.reduce((s, l) => s + l.duration_minutes, 0)

    return (
      <>
        {/* Back + header */}
        <div style={{ marginBottom: '24px' }}>
          <button onClick={() => setActiveCourse(null)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#6e6e73', fontSize: '13px', fontWeight: '500', padding: 0, marginBottom: '14px', fontFamily: 'inherit' }}>
            <ArrowLeft size={15} /> Back to Courses
          </button>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <span style={{ background: (levelColor[activeCourse.jlpt_level] || '#e84040') + '20', color: levelColor[activeCourse.jlpt_level] || '#e84040', fontSize: '12px', fontWeight: '700', padding: '3px 12px', borderRadius: '20px' }}>
                  {activeCourse.jlpt_level}
                </span>
                <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1d1d1f', margin: 0, letterSpacing: '-0.02em' }}>{activeCourse.title}</h1>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>
                {modules.length} modules · {allLessons.length} lessons · {Math.floor(totalMins / 60)}h {totalMins % 60}m total
              </p>
            </div>
            <button onClick={() => { setShowAddModule(true); setModuleTitle('') }} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit' }}>
              <Plus size={15} /> Add Module
            </button>
          </div>
        </div>

        {contentLoading ? (
          <div style={{ textAlign: 'center', padding: '64px', color: '#9ca3af', fontSize: '14px' }}>Loading content…</div>
        ) : modules.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #ececef', padding: '56px', textAlign: 'center', color: '#9ca3af' }}>
            <FolderOpen size={36} style={{ margin: '0 auto 16px', display: 'block', color: '#d1d5db' }} strokeWidth={1.5} />
            <p style={{ fontSize: '15px', fontWeight: '600', color: '#6e6e73' }}>No modules yet</p>
            <p style={{ fontSize: '13px', marginTop: '6px' }}>Click &ldquo;Add Module&rdquo; to start building this course</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {modules.map((mod, idx) => {
              const expanded = expandedMods.has(mod.id)
              const modLessons = lessons[mod.id] || []
              return (
                <div key={mod.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #ececef', overflow: 'hidden' }}>
                  {/* Module row */}
                  <div
                    onClick={() => setExpandedMods(prev => { const s = new Set(prev); s.has(mod.id) ? s.delete(mod.id) : s.add(mod.id); return s })}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', cursor: 'pointer', userSelect: 'none' }}
                  >
                    <div style={{ width: '28px', height: '28px', background: '#1a1f3c', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>
                      {idx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a1f3c' }}>{mod.title}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '1px' }}>{modLessons.length} lesson{modLessons.length !== 1 ? 's' : ''}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button onClick={e => { e.stopPropagation(); setEditModule({ ...mod }) }} style={{ padding: '4px 10px', background: '#eff6ff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#2d7dd2' }}>Edit</button>
                      <button onClick={e => { e.stopPropagation(); deleteModule(mod.id) }} style={{ padding: '4px 10px', background: '#fef2f2', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#e84040' }}>×</button>
                      <span style={{ color: '#9ca3af', marginLeft: '4px', display: 'inline-flex', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><ChevronDown size={16} /></span>
                    </div>
                  </div>

                  {/* Lessons */}
                  {expanded && (
                    <div style={{ borderTop: '1px solid #f3f4f6' }}>
                      {modLessons.map(lesson => (
                        <div key={lesson.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 20px 11px 64px', borderBottom: '1px solid #fafafa' }}>
                          <span style={{ flexShrink: 0, color: '#6e6e73', display: 'flex', alignItems: 'center' }}>{lessonIcon(lesson.lesson_type)}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>{lesson.title}</div>
                            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '1px', textTransform: 'capitalize' }}>
                              {lesson.lesson_type} · {lesson.duration_minutes} min
                            </div>
                          </div>
                          <button onClick={() => setEditLesson({ ...lesson })} style={{ padding: '3px 9px', background: '#eff6ff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '11px', color: '#2d7dd2' }}>Edit</button>
                          <button onClick={() => deleteLesson(lesson)} style={{ padding: '3px 9px', background: '#fef2f2', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '11px', color: '#e84040' }}>×</button>
                        </div>
                      ))}
                      <div style={{ padding: '10px 20px 10px 64px' }}>
                        <button onClick={() => { setAddLessonModId(mod.id); setLessonForm(emptyLessonForm) }}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: 'transparent', border: '1.5px dashed #d1d5db', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', color: '#9ca3af', fontWeight: '600' }}>
                          + Add Lesson
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Add Module */}
        {showAddModule && (
          <Modal title="Add Module" onClose={() => setShowAddModule(false)}>
            <form onSubmit={addModule}>
              <Field label="Module Title">
                <input style={inputStyle} autoFocus required value={moduleTitle} onChange={e => setModuleTitle(e.target.value)} placeholder="e.g. Week 1 — Hiragana Basics" />
              </Field>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowAddModule(false)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ flex: 2, padding: '12px', background: 'var(--red)', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', color: '#fff' }}>{loading ? 'Adding…' : 'Add Module'}</button>
              </div>
            </form>
          </Modal>
        )}

        {/* Edit Module */}
        {editModule && (
          <Modal title="Edit Module" onClose={() => setEditModule(null)}>
            <form onSubmit={updateModule}>
              <Field label="Module Title">
                <input style={inputStyle} autoFocus required value={editModule.title} onChange={e => setEditModule(m => m ? { ...m, title: e.target.value } : m)} />
              </Field>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setEditModule(null)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ flex: 2, padding: '12px', background: '#2d7dd2', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', color: '#fff' }}>{loading ? 'Saving…' : 'Save Changes'}</button>
              </div>
            </form>
          </Modal>
        )}

        {/* Add Lesson */}
        {addLessonModId && (
          <Modal title="Add Lesson" onClose={() => setAddLessonModId(null)} wide>
            <form onSubmit={addLesson}>
              <Field label="Lesson Title">
                <input style={inputStyle} autoFocus required value={lessonForm.title} onChange={e => setLessonForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Introduction to Hiragana" />
              </Field>
              <Field label="Lesson Type">
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {LESSON_TYPES.map(t => {
                    const active = lessonForm.lesson_type === t.value
                    return (
                      <button key={t.value} type="button" onClick={() => setLessonForm(f => ({ ...f, lesson_type: t.value }))} style={{
                        display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px',
                        border: `2px solid ${active ? '#e84040' : '#e5e7eb'}`,
                        background: active ? '#fef2f2' : '#f9fafb',
                        color: active ? '#e84040' : '#6b7280',
                        fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s',
                      }}>
                        {t.icon} <span>{t.label}</span>
                      </button>
                    )
                  })}
                </div>
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <Field label="Duration (minutes)">
                  <input style={inputStyle} type="number" min={1} max={300} value={lessonForm.duration_minutes} onChange={e => setLessonForm(f => ({ ...f, duration_minutes: Number(e.target.value) }))} />
                </Field>
                <Field label="Content URL (optional)">
                  <input style={inputStyle} value={lessonForm.content_url} onChange={e => setLessonForm(f => ({ ...f, content_url: e.target.value }))} placeholder="https://…" />
                </Field>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setAddLessonModId(null)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ flex: 2, padding: '12px', background: 'var(--red)', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', color: '#fff' }}>{loading ? 'Adding…' : 'Add Lesson'}</button>
              </div>
            </form>
          </Modal>
        )}

        {/* Edit Lesson */}
        {editLesson && (
          <Modal title="Edit Lesson" onClose={() => setEditLesson(null)} wide>
            <form onSubmit={updateLesson}>
              <Field label="Lesson Title">
                <input style={inputStyle} autoFocus required value={editLesson.title} onChange={e => setEditLesson(l => l ? { ...l, title: e.target.value } : l)} />
              </Field>
              <Field label="Lesson Type">
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {LESSON_TYPES.map(t => {
                    const active = editLesson.lesson_type === t.value
                    return (
                      <button key={t.value} type="button" onClick={() => setEditLesson(l => l ? { ...l, lesson_type: t.value } : l)} style={{
                        display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px',
                        border: `2px solid ${active ? '#e84040' : '#e5e7eb'}`,
                        background: active ? '#fef2f2' : '#f9fafb',
                        color: active ? '#e84040' : '#6b7280',
                        fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s',
                      }}>
                        {t.icon} <span>{t.label}</span>
                      </button>
                    )
                  })}
                </div>
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <Field label="Duration (minutes)">
                  <input style={inputStyle} type="number" min={1} max={300} value={editLesson.duration_minutes} onChange={e => setEditLesson(l => l ? { ...l, duration_minutes: Number(e.target.value) } : l)} />
                </Field>
                <Field label="Content URL (optional)">
                  <input style={inputStyle} value={editLesson.content_url || ''} onChange={e => setEditLesson(l => l ? { ...l, content_url: e.target.value } : l)} placeholder="https://…" />
                </Field>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setEditLesson(null)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ flex: 2, padding: '12px', background: '#2d7dd2', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', color: '#fff' }}>{loading ? 'Saving…' : 'Save Changes'}</button>
              </div>
            </form>
          </Modal>
        )}
      </>
    )
  }

  // =====================
  // COURSE GRID VIEW
  // =====================
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1d1d1f', margin: 0, letterSpacing: '-0.02em' }}>Courses</h1>
          <p style={{ color: '#6e6e73', fontSize: '13px', marginTop: '3px' }}>Manage JLPT course content and structure</p>
        </div>
        <button onClick={() => { setShowAdd(true); setCourseForm(emptyCourseForm) }} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
          <Plus size={15} /> New Course
        </button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total Courses', value: courses.length, icon: <BookOpen size={16} />, color: '#e84040' },
          { label: 'Active', value: courses.filter(c => c.status === 'Active').length, icon: <CheckCircle2 size={16} />, color: '#22c55e' },
          { label: 'Draft', value: courses.filter(c => c.status === 'Draft').length, icon: <FileText size={16} />, color: '#f59e0b' },
          { label: 'Total Enrolled', value: courses.reduce((s, c) => s + (c.enrolled_count || 0), 0), icon: <Users size={16} />, color: '#2d7dd2' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} style={{ background: '#fff', borderRadius: '10px', padding: '16px', border: '1px solid #ececef', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#6e6e73', fontWeight: '500' }}>{label}</span>
              <span style={{ color, display: 'flex', alignItems: 'center' }}>{icon}</span>
            </div>
            <div style={{ fontSize: '22px', fontWeight: '600', color: '#1d1d1f', lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Cards */}
      {courses.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #ececef', padding: '56px', textAlign: 'center', color: '#9ca3af' }}>
          <BookOpen size={36} style={{ margin: '0 auto 16px', display: 'block', color: '#d1d5db' }} strokeWidth={1.5} />
          <p style={{ fontSize: '15px', fontWeight: '600', color: '#6e6e73' }}>No courses yet</p>
          <p style={{ fontSize: '13px', marginTop: '6px' }}>Click &ldquo;New Course&rdquo; to create your first JLPT course</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {courses.map(course => (
            <div key={course.id}
              style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #ececef', transition: 'border-color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#d1d5db')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#ececef')}>
              <div style={{ padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ background: (levelColor[course.jlpt_level] || '#e84040') + '20', color: levelColor[course.jlpt_level] || '#e84040', fontSize: '11px', fontWeight: '700', padding: '2px 10px', borderRadius: '20px' }}>{course.jlpt_level}</span>
                    <span style={{ background: (statusColor[course.status] || '#9ca3af') + '20', color: statusColor[course.status] || '#9ca3af', fontSize: '11px', fontWeight: '600', padding: '2px 10px', borderRadius: '20px' }}>{course.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => setEditCourse({ ...course })} style={{ padding: '4px 9px', background: '#eff6ff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', color: '#2d7dd2' }}>Edit</button>
                    <button onClick={() => deleteCourse(course.id)} style={{ padding: '4px 9px', background: '#fef2f2', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', color: '#e84040' }}>×</button>
                  </div>
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1d1d1f', marginBottom: '6px', letterSpacing: '-0.01em' }}>{course.title}</h3>
                {course.description && (
                  <p style={{ fontSize: '12px', color: '#6e6e73', marginBottom: '12px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {course.description}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#9ca3af' }}><Clock size={13} /> {course.duration_weeks} weeks</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#9ca3af' }}><Users size={13} /> {course.enrolled_count || 0} enrolled</span>
                </div>
                <button onClick={() => openCourse(course)}
                  style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#1d1d1f', transition: 'all 0.15s', fontFamily: 'inherit' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#1a1f3c'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#1a1f3c' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#1d1d1f'; e.currentTarget.style.borderColor = '#e5e7eb' }}>
                  <FolderOpen size={14} /> Manage Content
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Course Modal */}
      {showAdd && (
        <Modal title="Create New Course" onClose={() => setShowAdd(false)} wide>
          <form onSubmit={addCourse}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: '14px' }}>
              <Field label="Course Title">
                <input style={inputStyle} autoFocus required value={courseForm.title} onChange={e => setCourseForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. N4 Complete Japanese Course" />
              </Field>
              <Field label="Level">
                <select style={inputStyle} value={courseForm.jlpt_level} onChange={e => setCourseForm(f => ({ ...f, jlpt_level: e.target.value }))}>
                  {LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Description (optional)">
              <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' as const, lineHeight: '1.5' }} value={courseForm.description} onChange={e => setCourseForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief overview of what students will learn…" />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <Field label="Duration (weeks)">
                <input style={inputStyle} type="number" min={1} max={104} value={courseForm.duration_weeks} onChange={e => setCourseForm(f => ({ ...f, duration_weeks: Number(e.target.value) }))} />
              </Field>
              <Field label="Status">
                <select style={inputStyle} value={courseForm.status} onChange={e => setCourseForm(f => ({ ...f, status: e.target.value }))}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="button" onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Cancel</button>
              <button type="submit" disabled={loading} style={{ flex: 2, padding: '12px', background: 'var(--red)', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', color: '#fff' }}>{loading ? 'Creating…' : 'Create Course'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Course Modal */}
      {editCourse && (
        <Modal title="Edit Course" onClose={() => setEditCourse(null)} wide>
          <form onSubmit={updateCourse}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: '14px' }}>
              <Field label="Course Title">
                <input style={inputStyle} autoFocus required value={editCourse.title} onChange={e => setEditCourse(c => c ? { ...c, title: e.target.value } : c)} />
              </Field>
              <Field label="Level">
                <select style={inputStyle} value={editCourse.jlpt_level} onChange={e => setEditCourse(c => c ? { ...c, jlpt_level: e.target.value } : c)}>
                  {LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Description">
              <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' as const, lineHeight: '1.5' }} value={editCourse.description || ''} onChange={e => setEditCourse(c => c ? { ...c, description: e.target.value } : c)} />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <Field label="Duration (weeks)">
                <input style={inputStyle} type="number" min={1} max={104} value={editCourse.duration_weeks} onChange={e => setEditCourse(c => c ? { ...c, duration_weeks: Number(e.target.value) } : c)} />
              </Field>
              <Field label="Status">
                <select style={inputStyle} value={editCourse.status} onChange={e => setEditCourse(c => c ? { ...c, status: e.target.value } : c)}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="button" onClick={() => setEditCourse(null)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Cancel</button>
              <button type="submit" disabled={loading} style={{ flex: 2, padding: '12px', background: '#2d7dd2', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', color: '#fff' }}>{loading ? 'Saving…' : 'Save Changes'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
