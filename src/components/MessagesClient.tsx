'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Avatar from '@/components/Avatar'
import { Search, Send, ArrowLeft, PenSquare, MessageSquare, X } from 'lucide-react'
import type { Contact, Message } from '@/lib/messages'

const levelColor: Record<string, string> = { N5: '#22c55e', N4: '#2d7dd2', N3: '#f59e0b', N2: '#e84040', N1: '#8b5cf6' }
const roleColor: Record<string, string> = { admin: '#8b5cf6', teacher: '#2d7dd2', student: '#22c55e' }

function timeLabel(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const sameDay = d.toDateString() === today.toDateString()
  return sameDay
    ? d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
    : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default function MessagesClient({
  me, contacts, messages: initialMessages, parties: initialParties,
}: {
  me: { id: string; role: string; name: string }
  contacts: Contact[]
  messages: Message[]
  parties: Record<string, Contact>
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [parties] = useState<Record<string, Contact>>(initialParties)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [search, setSearch] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const threadEnd = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)')
    const on = () => setIsMobile(mq.matches)
    on(); mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // Poll for new messages every 6s
  useEffect(() => {
    const sb = createClient()
    const id = setInterval(async () => {
      const { data } = await sb.from('messages')
        .select('id, sender_id, recipient_id, body, read_at, created_at')
        .or(`sender_id.eq.${me.id},recipient_id.eq.${me.id}`)
        .order('created_at', { ascending: true })
      if (data) setMessages(data as Message[])
    }, 6000)
    return () => clearInterval(id)
  }, [me.id])

  // Conversations grouped by the other party, newest first
  const conversations = useMemo(() => {
    const map = new Map<string, { otherId: string; last: Message; unread: number }>()
    for (const m of messages) {
      const other = m.sender_id === me.id ? m.recipient_id : m.sender_id
      const cur = map.get(other)
      const unreadInc = m.recipient_id === me.id && !m.read_at ? 1 : 0
      if (!cur) map.set(other, { otherId: other, last: m, unread: unreadInc })
      else { cur.last = m; cur.unread += unreadInc }
    }
    return [...map.values()].sort((a, b) => b.last.created_at.localeCompare(a.last.created_at))
  }, [messages, me.id])

  const thread = useMemo(
    () => messages.filter(m =>
      (m.sender_id === me.id && m.recipient_id === activeId) ||
      (m.sender_id === activeId && m.recipient_id === me.id)),
    [messages, activeId, me.id])

  useEffect(() => { threadEnd.current?.scrollIntoView({ behavior: 'smooth' }) }, [thread.length, activeId])

  // Mark incoming unread as read when opening a thread
  useEffect(() => {
    if (!activeId) return
    const unread = messages.filter(m => m.sender_id === activeId && m.recipient_id === me.id && !m.read_at)
    if (!unread.length) return
    const sb = createClient()
    const now = new Date().toISOString()
    sb.from('messages').update({ read_at: now }).in('id', unread.map(m => m.id)).then(() => {
      setMessages(prev => prev.map(m => unread.find(u => u.id === m.id) ? { ...m, read_at: now } : m))
    })
  }, [activeId, messages, me.id])

  async function send() {
    const body = text.trim()
    if (!body || !activeId) return
    setText('')
    const sb = createClient()
    const optimistic: Message = { id: `tmp-${Date.now()}`, sender_id: me.id, recipient_id: activeId, body, read_at: null, created_at: new Date().toISOString() }
    setMessages(prev => [...prev, optimistic])
    const { data, error } = await sb.from('messages')
      .insert({ sender_id: me.id, recipient_id: activeId, body })
      .select('id, sender_id, recipient_id, body, read_at, created_at').single()
    if (!error && data) setMessages(prev => prev.map(m => m.id === optimistic.id ? (data as Message) : m))
  }

  const partyOf = (id: string): Contact => parties[id] || contacts.find(c => c.id === id) || { id, full_name: 'User', email: null, avatar_url: null, jlpt_level: null, role: '' }
  const active = activeId ? partyOf(activeId) : null

  const filteredContacts = contacts.filter(c => (c.full_name || c.email || '').toLowerCase().includes(search.toLowerCase()))
  const showList = !isMobile || !activeId
  const showThread = !isMobile || !!activeId

  return (
    <>
      <div style={{ marginBottom: '18px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#1d1d1f', margin: 0, letterSpacing: '-0.02em' }}>Messages</h1>
        <p style={{ color: '#6e6e73', fontSize: '13px', marginTop: '3px' }}>Chat with your {me.role === 'student' ? 'teachers and the office' : me.role === 'teacher' ? 'students and the office' : 'students and teachers'}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '300px 1fr', gap: '14px', height: 'calc(100vh - 150px)', minHeight: '420px' }}>
        {/* ── Conversation list ── */}
        {showList && (
          <div style={{ background: '#fff', border: '1px solid #ececef', borderRadius: '14px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '14px', borderBottom: '1px solid #f3f4f6', display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search people…" style={{ width: '100%', padding: '9px 12px 9px 32px', border: '1px solid #e5e7eb', borderRadius: '9px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', color: '#1d1d1f' }} />
              </div>
              <button onClick={() => setShowNew(true)} title="New message" style={{ width: '38px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer' }}><PenSquare size={16} /></button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {conversations.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
                  <MessageSquare size={28} style={{ opacity: 0.5, marginBottom: '8px' }} />
                  <p>No conversations yet. Tap the pencil to start one.</p>
                </div>
              ) : conversations.filter(c => {
                const p = partyOf(c.otherId)
                return (p.full_name || p.email || '').toLowerCase().includes(search.toLowerCase())
              }).map(c => {
                const p = partyOf(c.otherId)
                const on = c.otherId === activeId
                return (
                  <button key={c.otherId} onClick={() => setActiveId(c.otherId)} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '11px', padding: '12px 14px', background: on ? '#f9fafb' : 'transparent', border: 'none', borderBottom: '1px solid #f7f7f8', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <Avatar url={p.avatar_url} name={p.full_name || p.email} size={40} bg={levelColor[p.jlpt_level || ''] || roleColor[p.role] || '#2d7dd2'} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px' }}>
                        <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#1d1d1f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.full_name || p.email || 'User'}</span>
                        <span style={{ fontSize: '11px', color: '#9ca3af', flexShrink: 0 }}>{timeLabel(c.last.created_at)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: c.unread ? '#1d1d1f' : '#9ca3af', fontWeight: c.unread ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.last.sender_id === me.id ? 'You: ' : ''}{c.last.body}</span>
                        {c.unread > 0 && <span style={{ flexShrink: 0, minWidth: '18px', height: '18px', padding: '0 5px', borderRadius: '9px', background: 'var(--red)', color: '#fff', fontSize: '11px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{c.unread}</span>}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Thread ── */}
        {showThread && (
          <div style={{ background: '#fff', border: '1px solid #ececef', borderRadius: '14px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {!active ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', gap: '10px' }}>
                <MessageSquare size={40} style={{ opacity: 0.4 }} />
                <p style={{ fontSize: '14px' }}>Select a conversation to start chatting</p>
              </div>
            ) : (
              <>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '11px' }}>
                  {isMobile && <button onClick={() => setActiveId(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex' }}><ArrowLeft size={20} /></button>}
                  <Avatar url={active.avatar_url} name={active.full_name || active.email} size={38} bg={levelColor[active.jlpt_level || ''] || roleColor[active.role] || '#2d7dd2'} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f' }}>{active.full_name || active.email || 'User'}</div>
                    <div style={{ fontSize: '11px', color: roleColor[active.role] || '#9ca3af', fontWeight: 600, textTransform: 'capitalize' }}>{active.role}{active.jlpt_level ? ` · ${active.jlpt_level}` : ''}</div>
                  </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', background: '#fafafa' }}>
                  {thread.map(m => {
                    const mine = m.sender_id === me.id
                    return (
                      <div key={m.id} style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '74%' }}>
                        <div style={{ padding: '9px 13px', borderRadius: mine ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: mine ? 'var(--red)' : '#fff', color: mine ? '#fff' : '#1d1d1f', border: mine ? 'none' : '1px solid #ececef', fontSize: '13.5px', lineHeight: 1.45, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{m.body}</div>
                        <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '3px', textAlign: mine ? 'right' : 'left' }}>{timeLabel(m.created_at)}</div>
                      </div>
                    )
                  })}
                  <div ref={threadEnd} />
                </div>

                <div style={{ padding: '12px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                  <textarea value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} rows={1} placeholder="Type a message…" style={{ flex: 1, resize: 'none', padding: '11px 14px', border: '1px solid #e5e7eb', borderRadius: '11px', fontSize: '13.5px', fontFamily: 'inherit', outline: 'none', color: '#1d1d1f', maxHeight: '120px' }} />
                  <button onClick={send} disabled={!text.trim()} style={{ width: '42px', height: '42px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: text.trim() ? 'var(--red)' : '#e5e7eb', color: '#fff', border: 'none', borderRadius: '11px', cursor: text.trim() ? 'pointer' : 'default' }}><Send size={17} /></button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* New-message contact picker */}
      {showNew && (
        <div onClick={() => setShowNew(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '420px', maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid #f3f4f6' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1d1d1f' }}>New message</h2>
              <button onClick={() => setShowNew(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9ca3af' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" autoFocus style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '9px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', color: '#1d1d1f' }} />
            </div>
            <div style={{ overflowY: 'auto' }}>
              {filteredContacts.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>No contacts found.</div>
              ) : filteredContacts.map(c => (
                <button key={c.id} onClick={() => { setActiveId(c.id); setShowNew(false); setSearch('') }} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '11px', padding: '11px 16px', background: 'transparent', border: 'none', borderBottom: '1px solid #f7f7f8', cursor: 'pointer', fontFamily: 'inherit' }}>
                  <Avatar url={c.avatar_url} name={c.full_name || c.email} size={38} bg={levelColor[c.jlpt_level || ''] || roleColor[c.role] || '#2d7dd2'} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1d1d1f' }}>{c.full_name || c.email || 'User'}</div>
                    <div style={{ fontSize: '11px', color: roleColor[c.role] || '#9ca3af', fontWeight: 600, textTransform: 'capitalize' }}>{c.role}{c.jlpt_level ? ` · ${c.jlpt_level}` : ''}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
