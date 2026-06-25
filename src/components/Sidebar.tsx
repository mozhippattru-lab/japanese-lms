'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, Calendar,
  ClipboardList, DollarSign, Target, BarChart2, Settings,
  Video, FileText, ClipboardCheck, TrendingUp, Award, MessageSquare,
  LogOut, School, UserCircle, Menu, X,
} from 'lucide-react'

type NavItem = { label: string; href: string; icon: React.ReactNode }

const studentNav: NavItem[] = [
  { label: 'Dashboard',      href: '/dashboard/student',              icon: <LayoutDashboard size={16} /> },
  { label: 'My Courses',     href: '/dashboard/student/courses',      icon: <BookOpen        size={16} /> },
  { label: 'Live Classes',   href: '/dashboard/student/classes',      icon: <Video           size={16} /> },
  { label: 'Assignments',    href: '/dashboard/student/assignments',  icon: <FileText        size={16} /> },
  { label: 'Practice Tests', href: '/dashboard/student/tests',        icon: <ClipboardCheck  size={16} /> },
  { label: 'Attendance',     href: '/dashboard/student/attendance',   icon: <Calendar        size={16} /> },
  { label: 'Progress',       href: '/dashboard/student/progress',     icon: <TrendingUp      size={16} /> },
  { label: 'Certificates',   href: '/dashboard/student/certificates', icon: <Award           size={16} /> },
  { label: 'Messages',       href: '/dashboard/student/messages',     icon: <MessageSquare   size={16} /> },
  { label: 'My Profile',     href: '/dashboard/student/profile',      icon: <UserCircle      size={16} /> },
]

const teacherNav: NavItem[] = [
  { label: 'Dashboard',       href: '/dashboard/teacher',              icon: <LayoutDashboard size={16} /> },
  { label: 'My Classes',      href: '/dashboard/teacher/classes',      icon: <GraduationCap   size={16} /> },
  { label: 'Students',        href: '/dashboard/teacher/students',     icon: <Users           size={16} /> },
  { label: 'Attendance',      href: '/dashboard/teacher/attendance',   icon: <Calendar        size={16} /> },
  { label: 'Assignments',     href: '/dashboard/teacher/assignments',  icon: <FileText        size={16} /> },
  { label: 'Grading',         href: '/dashboard/teacher/grading',      icon: <ClipboardCheck  size={16} /> },
  { label: 'Content Library', href: '/dashboard/teacher/content',      icon: <BookOpen        size={16} /> },
  { label: 'Messages',        href: '/dashboard/teacher/messages',     icon: <MessageSquare   size={16} /> },
  { label: 'My Profile',      href: '/dashboard/teacher/profile',      icon: <UserCircle      size={16} /> },
]

const adminNav: NavItem[] = [
  { label: 'Dashboard',  href: '/dashboard/admin',           icon: <LayoutDashboard size={16} /> },
  { label: 'Students',   href: '/dashboard/admin/students',  icon: <Users           size={16} /> },
  { label: 'Teachers',   href: '/dashboard/admin/teachers',  icon: <GraduationCap   size={16} /> },
  { label: 'Courses',    href: '/dashboard/admin/courses',   icon: <BookOpen        size={16} /> },
  { label: 'Batches',    href: '/dashboard/admin/batches',   icon: <Calendar        size={16} /> },
  { label: 'Colleges',   href: '/dashboard/admin/colleges',  icon: <School          size={16} /> },
  { label: 'Attendance', href: '/dashboard/admin/attendance',icon: <ClipboardList   size={16} /> },
  { label: 'Finance',    href: '/dashboard/admin/finance',   icon: <DollarSign      size={16} /> },
  { label: 'CRM / Leads',href: '/dashboard/admin/crm',       icon: <Target          size={16} /> },
  { label: 'Reports',    href: '/dashboard/admin/reports',   icon: <BarChart2       size={16} /> },
  { label: 'Settings',   href: '/dashboard/admin/settings',  icon: <Settings        size={16} /> },
]

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 20px',
        margin: '1px 8px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: active ? '600' : '400',
        color: active ? '#ff8080' : '#9ca3af',
        background: active ? 'rgba(232,64,64,0.15)' : 'transparent',
        borderLeft: `3px solid ${active ? 'var(--red)' : 'transparent'}`,
        transition: 'background 150ms ease, color 150ms ease',
      }}
      onMouseEnter={e => {
        if (!active) {
          (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)'
          ;(e.currentTarget as HTMLAnchorElement).style.color = '#d1d5db'
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
          ;(e.currentTarget as HTMLAnchorElement).style.color = '#9ca3af'
        }
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {item.icon}
      </span>
      {item.label}
    </Link>
  )
}

export default function Sidebar({ role, userName }: { role: string; userName: string }) {
  const pathname = usePathname()
  const router   = useRouter()
  const nav      = role === 'admin' ? adminNav : role === 'teacher' ? teacherNav : studentNav

  const roleLabel      = role === 'admin' ? 'Admin' : role === 'teacher' ? 'Teacher' : 'Student'
  const roleBadgeColor = role === 'admin' ? '#8b5cf6' : role === 'teacher' ? '#2d7dd2' : '#22c55e'

  const [open, setOpen] = useState(false)
  // Close the mobile drawer whenever the route changes
  useEffect(() => { setOpen(false) }, [pathname])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      {/* Mobile hamburger (hidden on desktop via CSS) */}
      <button className="sidebar-toggle" aria-label="Open menu" onClick={() => setOpen(true)}>
        <Menu size={20} />
      </button>
      {/* Dim overlay behind the drawer on mobile */}
      <div className={`sidebar-overlay${open ? ' show' : ''}`} onClick={() => setOpen(false)} />

    <aside className={`app-sidebar${open ? ' open' : ''}`} style={{
      width: '260px', background: 'var(--navy)', position: 'fixed',
      top: 0, left: 0, bottom: 0, display: 'flex', flexDirection: 'column',
      overflowY: 'auto', zIndex: 60,
    }}>
      {/* Mobile close button */}
      <button className="sidebar-close" aria-label="Close menu" onClick={() => setOpen(false)}>
        <X size={20} />
      </button>
      {/* Brand */}
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid var(--navy-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
          <div style={{
            width: '42px', height: '42px', background: 'var(--red)', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: '0 6px 16px rgba(232,64,64,0.35)',
            fontFamily: 'var(--display)', fontWeight: 700, fontSize: '23px', color: '#fff',
          }}>
            本
          </div>
          <div>
            <div style={{ color: '#fff', fontFamily: 'var(--display)', fontSize: '17px', fontWeight: '600', lineHeight: 1.3 }}>மொழிப்பற்று</div>
            <div style={{ color: 'var(--gold-soft)', fontSize: '9.5px', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '1px' }}>ஜப்பானிய மொழிப் பள்ளி</div>
          </div>
        </div>
      </div>

      {/* User info */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--navy-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', background: roleBadgeColor, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '15px', fontWeight: '700', color: '#fff', flexShrink: 0,
          }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ color: '#fff', fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userName || 'User'}
            </div>
            <div style={{
              display: 'inline-block', marginTop: '2px',
              background: roleBadgeColor + '28', color: roleBadgeColor,
              fontSize: '10px', fontWeight: '700', padding: '1px 8px', borderRadius: '99px',
            }}>
              {roleLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '10px 0' }} aria-label="Main navigation">
        {nav.map(item => {
          const isExact = item.href === '/dashboard/admin' || item.href === '/dashboard/teacher' || item.href === '/dashboard/student'
          const active  = isExact ? pathname === item.href : pathname.startsWith(item.href)
          return <NavLink key={item.href} item={item} active={active} />
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid var(--navy-border)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', background: 'transparent',
            border: '1px solid var(--navy-border)', borderRadius: '8px',
            color: '#9ca3af', fontSize: '13px', cursor: 'pointer',
            transition: 'all 150ms ease', fontFamily: 'inherit',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#d1d5db'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#9ca3af'
          }}
          aria-label="Sign out"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
    </>
  )
}
