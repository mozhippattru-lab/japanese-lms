'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from 'react'
import { Plus, Pencil, Trash2, ArrowLeft, Eye, ExternalLink, Bold, Italic, List, ListOrdered, Link2, Quote, Heading, Undo } from 'lucide-react'
import ToastContainer, { useToast } from '@/components/Toast'
import { slugify } from '@/lib/slug'
import { getPost, savePost, deletePost, slugTaken } from './actions'

type PostRow = { id: string; title: string; slug: string; status: string; tags: string[]; published_at: string | null; updated_at: string }

const empty = {
  id: '' as string | null, title: '', slug: '', excerpt: '', cover_image: '',
  body_html: '', meta_title: '', meta_description: '', tags: '' as string,
  status: 'draft',
}

function fmt(d: string | null) {
  return d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
}

// ── Dependency-free WYSIWYG (contentEditable + execCommand) ──────────────────
function RichEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const seeded = useRef(false)

  useEffect(() => {
    if (ref.current && !seeded.current) { ref.current.innerHTML = value || ''; seeded.current = true }
  }, [value])

  function cmd(command: string, arg?: string) {
    document.execCommand(command, false, arg)
    ref.current?.focus()
    if (ref.current) onChange(ref.current.innerHTML)
  }

  const btn: React.CSSProperties = {
    width: '34px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    border: '1px solid #e5e7eb', background: '#fff', borderRadius: '7px', cursor: 'pointer', color: '#374151',
  }

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', padding: '8px', borderBottom: '1px solid #f0f0f2', background: '#fafafa' }}>
        <button type="button" title="Heading" style={btn} onClick={() => cmd('formatBlock', 'H2')}><Heading size={15} /></button>
        <button type="button" title="Subheading" style={{ ...btn, fontSize: '12px', fontWeight: 700 }} onClick={() => cmd('formatBlock', 'H3')}>H3</button>
        <button type="button" title="Bold" style={btn} onClick={() => cmd('bold')}><Bold size={15} /></button>
        <button type="button" title="Italic" style={btn} onClick={() => cmd('italic')}><Italic size={15} /></button>
        <button type="button" title="Bullet list" style={btn} onClick={() => cmd('insertUnorderedList')}><List size={15} /></button>
        <button type="button" title="Numbered list" style={btn} onClick={() => cmd('insertOrderedList')}><ListOrdered size={15} /></button>
        <button type="button" title="Quote" style={btn} onClick={() => cmd('formatBlock', 'BLOCKQUOTE')}><Quote size={15} /></button>
        <button type="button" title="Link" style={btn} onClick={() => { const u = prompt('Link URL'); if (u) cmd('createLink', u) }}><Link2 size={15} /></button>
        <button type="button" title="Clear formatting" style={btn} onClick={() => { cmd('removeFormat'); cmd('formatBlock', 'P') }}><Undo size={15} /></button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => ref.current && onChange(ref.current.innerHTML)}
        className="blog-editor"
        style={{ minHeight: '320px', padding: '16px 18px', fontSize: '15px', lineHeight: 1.7, color: '#1d1d1f', outline: 'none' }}
      />
      <style>{`
        .blog-editor h2 { font-size: 22px; font-weight: 800; margin: 18px 0 8px; color: #1a1f3c; }
        .blog-editor h3 { font-size: 18px; font-weight: 700; margin: 16px 0 6px; color: #1a1f3c; }
        .blog-editor p { margin: 0 0 12px; }
        .blog-editor ul, .blog-editor ol { margin: 0 0 12px 22px; }
        .blog-editor blockquote { border-left: 3px solid #e84040; margin: 12px 0; padding: 4px 14px; color: #6b7280; font-style: italic; }
        .blog-editor a { color: #2d7dd2; text-decoration: underline; }
        .blog-editor:empty:before { content: 'Write your post…'; color: #9ca3af; }
      `}</style>
    </div>
  )
}

export default function BlogClient({ initialPosts, tableMissing }: { initialPosts: PostRow[]; tableMissing: boolean }) {
  const { toasts, toast, remove } = useToast()
  const [posts, setPosts] = useState<PostRow[]>(initialPosts)
  const [view, setView] = useState<'list' | 'edit'>('list')
  const [form, setForm] = useState<typeof empty>(empty)
  const [saving, setSaving] = useState(false)
  const [slugLocked, setSlugLocked] = useState(false)

  const SITE = 'https://mozhippattru.org'

  function openNew() {
    setForm({ ...empty }); setSlugLocked(false); setView('edit')
  }
  async function openEdit(p: PostRow) {
    const full = await getPost(p.id)
    if (!full) { toast('Could not load post', 'error'); return }
    setForm({
      id: full.id, title: full.title || '', slug: full.slug || '', excerpt: full.excerpt || '',
      cover_image: full.cover_image || '', body_html: full.body_html || '',
      meta_title: full.meta_title || '', meta_description: full.meta_description || '',
      tags: (full.tags || []).join(', '), status: full.status || 'draft',
    })
    setSlugLocked(true); setView('edit')
  }

  function setTitle(t: string) {
    setForm(f => ({ ...f, title: t, slug: slugLocked ? f.slug : slugify(t) }))
  }

  async function save(publish?: boolean) {
    if (!form.title.trim()) { toast('Add a title', 'error'); return }
    const slug = form.slug.trim() || slugify(form.title)
    setSaving(true)
    if (await slugTaken(slug, form.id || null)) { toast('That slug is already used', 'error'); setSaving(false); return }
    const status = publish === undefined ? form.status : publish ? 'published' : 'draft'
    const payload = {
      id: form.id || undefined, title: form.title.trim(), slug,
      excerpt: form.excerpt.trim() || null, cover_image: form.cover_image.trim() || null,
      body_html: form.body_html, meta_title: form.meta_title.trim() || null,
      meta_description: form.meta_description.trim() || null,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      status,
    }
    const { post, error } = await savePost(payload)
    setSaving(false)
    if (error || !post) { toast(error || 'Save failed', 'error'); return }
    setPosts(prev => {
      const row: PostRow = { id: post.id, title: post.title, slug: post.slug, status: post.status, tags: post.tags || [], published_at: post.published_at, updated_at: post.updated_at }
      const i = prev.findIndex(x => x.id === post.id)
      return i >= 0 ? prev.map(x => x.id === post.id ? row : x) : [row, ...prev]
    })
    setForm(f => ({ ...f, id: post.id, slug: post.slug, status: post.status }))
    setSlugLocked(true)
    toast(status === 'published' ? 'Published' : 'Saved as draft', 'success')
  }

  async function remove_(p: PostRow) {
    if (!confirm(`Delete "${p.title}"?`)) return
    const { error } = await deletePost(p.id, p.slug)
    if (error) { toast(error, 'error'); return }
    setPosts(prev => prev.filter(x => x.id !== p.id))
    toast('Post deleted', 'info')
  }

  const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '9px', fontSize: '14px', fontFamily: 'inherit', color: '#1d1d1f', background: '#fff', outline: 'none', boxSizing: 'border-box' }
  const lbl: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }

  // ── List view ──
  if (view === 'list') {
    return (
      <>
        <ToastContainer toasts={toasts} onRemove={remove} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <p style={{ fontFamily: 'var(--display)', fontSize: '12px', color: 'var(--gold)', letterSpacing: '0.04em', margin: '0 0 6px' }}>ブログ · Blog</p>
            <h1 style={{ fontFamily: 'var(--display)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>Blog</h1>
            <p style={{ color: 'var(--ink-soft)', fontSize: '13px', marginTop: '6px' }}>Write SEO articles — published posts appear at <a href="/blog" style={{ color: 'var(--red)' }}>/blog</a></p>
          </div>
          <button onClick={openNew} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '11px 20px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}><Plus size={16} /> New post</button>
        </div>

        {tableMissing && (
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '14px 16px', marginBottom: '16px', fontSize: '13px', color: '#92400e' }}>
            📌 The <strong>posts</strong> table isn’t created yet. Run the <strong>“Apply DB schema file”</strong> GitHub Action (file <code>003_posts.sql</code>) once, then reload this page.
          </div>
        )}

        {posts.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #ececef', borderRadius: '14px', padding: '56px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>No posts yet. Click “New post”.</div>
        ) : (
          <div style={{ background: '#fff', border: '1px solid #ececef', borderRadius: '14px', overflow: 'hidden' }}>
            {posts.map((p, i) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', borderTop: i === 0 ? 'none' : '1px solid #f3f4f6' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#1d1d1f' }}>{p.title}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>/{p.slug} · updated {fmt(p.updated_at)}</div>
                </div>
                <span className="badge" style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: p.status === 'published' ? '#dcfce7' : '#f3f4f6', color: p.status === 'published' ? '#166534' : '#6b7280' }}>{p.status}</span>
                {p.status === 'published' && <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" title="View" style={{ display: 'flex', color: '#9ca3af', padding: '6px' }}><ExternalLink size={15} /></a>}
                <button onClick={() => openEdit(p)} title="Edit" style={{ border: '1px solid #e5e7eb', background: '#fff', borderRadius: '8px', width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#2d7dd2' }}><Pencil size={14} /></button>
                <button onClick={() => remove_(p)} title="Delete" style={{ border: '1px solid #e5e7eb', background: '#fff', borderRadius: '8px', width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#e84040' }}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </>
    )
  }

  // ── Editor view ──
  return (
    <>
      <ToastContainer toasts={toasts} onRemove={remove} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={() => setView('list')} style={{ background: '#f3f4f6', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', color: '#374151' }}><ArrowLeft size={16} /></button>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)', margin: 0, flex: 1 }}>{form.id ? 'Edit post' : 'New post'}</h1>
        {form.id && form.status === 'published' && <a href={`/blog/${form.slug}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#2d7dd2', textDecoration: 'none' }}><Eye size={14} /> View</a>}
        <button onClick={() => save(false)} disabled={saving} style={{ padding: '10px 18px', background: '#fff', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{saving ? 'Saving…' : 'Save draft'}</button>
        <button onClick={() => save(true)} disabled={saving} style={{ padding: '10px 20px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{saving ? 'Saving…' : 'Publish'}</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '18px', alignItems: 'start' }}>
        {/* Main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input value={form.title} onChange={e => setTitle(e.target.value)} placeholder="Post title" style={{ ...inp, fontSize: '20px', fontWeight: 700, padding: '12px 14px' }} />
          <RichEditor value={form.body_html} onChange={html => setForm(f => ({ ...f, body_html: html }))} />
        </div>

        {/* Sidebar meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: '#fff', border: '1px solid #ececef', borderRadius: '12px', padding: '16px' }}>
          <div>
            <label style={lbl}>URL slug</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>/blog/</span>
              <input value={form.slug} onChange={e => { setSlugLocked(true); setForm(f => ({ ...f, slug: slugify(e.target.value) })) }} style={{ ...inp, fontSize: '13px' }} />
            </div>
          </div>
          <div>
            <label style={lbl}>Excerpt (list + meta fallback)</label>
            <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={3} style={{ ...inp, resize: 'vertical' }} placeholder="Short summary shown in listings and search results" />
          </div>
          <div>
            <label style={lbl}>Cover image URL</label>
            <input value={form.cover_image} onChange={e => setForm(f => ({ ...f, cover_image: e.target.value }))} style={inp} placeholder="https://…" />
          </div>
          <div>
            <label style={lbl}>Tags (comma-separated)</label>
            <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} style={inp} placeholder="JLPT, N5, grammar" />
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #f0f0f2', margin: '2px 0' }} />
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SEO</div>
          <div>
            <label style={lbl}>Meta title <span style={{ color: '#9ca3af', fontWeight: 400 }}>(defaults to title)</span></label>
            <input value={form.meta_title} onChange={e => setForm(f => ({ ...f, meta_title: e.target.value }))} style={inp} />
          </div>
          <div>
            <label style={lbl}>Meta description</label>
            <textarea value={form.meta_description} onChange={e => setForm(f => ({ ...f, meta_description: e.target.value }))} rows={3} style={{ ...inp, resize: 'vertical' }} placeholder="~155 chars for search snippets" />
          </div>
          {form.id && form.status === 'published' && (
            <a href={`${SITE}/blog/${form.slug}`} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#2d7dd2', wordBreak: 'break-all' }}>{SITE}/blog/{form.slug}</a>
          )}
        </div>
      </div>
    </>
  )
}
