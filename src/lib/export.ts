// Reusable Print / Excel(CSV) / Share helpers used across admin data views.

export type Column = { key: string; label: string }
export type Row = Record<string, string | number | null | undefined>

const cell = (v: unknown) => (v === null || v === undefined) ? '' : String(v)

// ── Excel (CSV, opens directly in Excel) ─────────────────────────────
export function downloadCSV(filename: string, columns: Column[], rows: Row[]) {
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`
  const header = columns.map(c => esc(c.label)).join(',')
  const body = rows.map(r => columns.map(c => esc(cell(r[c.key]))).join(',')).join('\r\n')
  const csv = '﻿' + header + '\r\n' + body // BOM → correct UTF-8 in Excel
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// ── Print (styled window) ────────────────────────────────────────────
export function printData(title: string, columns: Column[], rows: Row[], subtitle?: string) {
  const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const when = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
  const thead = columns.map(c => `<th>${esc(c.label)}</th>`).join('')
  const tbody = rows.map(r =>
    `<tr>${columns.map(c => `<td>${esc(cell(r[c.key]))}</td>`).join('')}</tr>`
  ).join('')

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title>
  <style>
    *{box-sizing:border-box}
    body{font-family:'Inter',-apple-system,'Segoe UI',sans-serif;color:#1a1f3c;margin:32px}
    .head{display:flex;align-items:center;gap:12px;border-bottom:2px solid #e84040;padding-bottom:14px;margin-bottom:6px}
    .badge{width:38px;height:38px;border-radius:9px;background:#e84040;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800}
    h1{font-size:18px;margin:0}
    .sub{color:#6b7280;font-size:12px;margin:2px 0 18px}
    table{width:100%;border-collapse:collapse;font-size:12px}
    th{text-align:left;background:#1a1f3c;color:#fff;padding:8px 10px;font-size:11px;text-transform:uppercase;letter-spacing:.04em}
    td{padding:7px 10px;border-bottom:1px solid #eee}
    tr:nth-child(even) td{background:#fafafa}
    .foot{margin-top:16px;color:#9ca3af;font-size:11px}
    @media print{body{margin:12px}}
  </style></head><body>
    <div class="head"><div class="badge">日</div><div><h1>${esc(title)}</h1></div></div>
    <div class="sub">${subtitle ? esc(subtitle) + ' · ' : ''}Generated ${esc(when)} · ${rows.length} record(s)</div>
    <table><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table>
    <div class="foot">日本語スクール — Japanese Language School</div>
    <script>window.onload=function(){window.print()}</script>
  </body></html>`

  const w = window.open('', '_blank', 'width=1000,height=700')
  if (!w) { alert('Please allow pop-ups to print.'); return }
  w.document.open()
  w.document.write(html)
  w.document.close()
}

// ── Share (Web Share API, clipboard fallback) ────────────────────────
export async function shareData(opts: { title: string; text?: string; url?: string }): Promise<'shared' | 'copied' | 'failed'> {
  const url = opts.url || (typeof window !== 'undefined' ? window.location.href : '')
  try {
    if (navigator.share) {
      await navigator.share({ title: opts.title, text: opts.text, url })
      return 'shared'
    }
  } catch {
    return 'failed' // user cancelled or error
  }
  try {
    await navigator.clipboard.writeText(`${opts.title}\n${opts.text || ''}\n${url}`.trim())
    return 'copied'
  } catch {
    return 'failed'
  }
}
