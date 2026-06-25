// Branded, printable finance documents: a cheque-style fee receipt and a
// bank-statement-style ledger. Opens a styled print window (no dependencies).

const TAMIL = 'மொழிப்பற்று'
const ENG = 'Mozhippattru'
const SUB = 'Japanese Language School · 日本語スクール'

const rupee = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN')

// ── Indian-system amount in words ──────────────────────────────────────
const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
function twoDigit(n: number): string {
  if (n < 20) return ONES[n]
  return TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : '')
}
function threeDigit(n: number): string {
  const h = Math.floor(n / 100), r = n % 100
  return (h ? ONES[h] + ' Hundred' + (r ? ' ' : '') : '') + (r ? twoDigit(r) : '')
}
export function amountInWords(num: number): string {
  num = Math.floor(Math.abs(num))
  if (num === 0) return 'Rupees Zero Only'
  const crore = Math.floor(num / 10000000); num %= 10000000
  const lakh = Math.floor(num / 100000); num %= 100000
  const thousand = Math.floor(num / 1000); num %= 1000
  const rest = num
  let s = ''
  if (crore) s += threeDigit(crore) + ' Crore '
  if (lakh) s += twoDigit(lakh) + ' Lakh '
  if (thousand) s += twoDigit(thousand) + ' Thousand '
  if (rest) s += threeDigit(rest)
  return 'Rupees ' + s.trim().replace(/\s+/g, ' ') + ' Only'
}

const brandHead = `
  <div class="brand">
    <div class="logo">日</div>
    <div>
      <div class="ta">${TAMIL}</div>
      <div class="en">${ENG}</div>
      <div class="sub">${SUB}</div>
    </div>
  </div>`

function open(html: string) {
  const w = window.open('', '_blank', 'width=900,height=700')
  if (!w) { alert('Please allow pop-ups to print.'); return }
  w.document.write(html)
  w.document.close()
  w.focus()
  setTimeout(() => w.print(), 350)
}

export type ReceiptData = {
  receiptNo: string
  date: string
  studentName: string
  level?: string | null
  batch?: string | null
  description: string
  amount: number
  method: string
  reference?: string | null
}

export function printReceipt(r: ReceiptData) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Receipt ${r.receiptNo}</title>
  <style>
    @page { size: A5 landscape; margin: 12mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { font-family: -apple-system, 'Segoe UI', Roboto, sans-serif; color:#1a1f3c; margin:0; }
    .sheet { border:2px solid #1a1f3c; border-radius:10px; padding:22px 26px; position:relative; overflow:hidden; }
    .sheet::after { content:'${TAMIL}'; position:absolute; right:-10px; bottom:-22px; font-size:120px; color:#1a1f3c; opacity:0.04; font-weight:800; }
    .brand { display:flex; align-items:center; gap:12px; }
    .logo { width:46px; height:46px; border-radius:10px; background:#e84040; color:#fff; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:700; }
    .ta { font-size:22px; font-weight:800; letter-spacing:-0.5px; }
    .en { font-size:12px; font-weight:600; color:#e84040; margin-top:-2px; }
    .sub { font-size:10px; color:#6b7280; }
    .top { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1px dashed #cbd5e1; padding-bottom:14px; }
    .rcpt { text-align:right; }
    .rcpt .t { font-size:13px; font-weight:800; letter-spacing:1px; color:#e84040; text-transform:uppercase; }
    .rcpt .no { font-size:12px; color:#374151; margin-top:3px; }
    .row { display:flex; gap:8px; margin-top:14px; font-size:13px; }
    .row .l { color:#6b7280; width:130px; flex-shrink:0; }
    .row .v { font-weight:600; }
    .words { margin-top:14px; font-size:13px; }
    .words .l { color:#6b7280; }
    .words .v { font-weight:700; font-style:italic; }
    .amtbox { margin-top:16px; display:flex; justify-content:space-between; align-items:center; }
    .amt { border:2px solid #1a1f3c; border-radius:8px; padding:8px 18px; font-size:22px; font-weight:800; }
    .sign { text-align:center; font-size:11px; color:#6b7280; }
    .sign .line { width:150px; border-top:1px solid #9ca3af; margin-bottom:4px; }
    .ftr { margin-top:14px; font-size:10px; color:#9ca3af; text-align:center; }
  </style></head><body>
    <div class="sheet">
      <div class="top">
        ${brandHead}
        <div class="rcpt"><div class="t">Fee Receipt</div><div class="no">No. ${r.receiptNo}</div><div class="no">${r.date}</div></div>
      </div>
      <div class="row"><div class="l">Received with thanks from</div><div class="v">${r.studentName}${r.level ? ` &nbsp;(${r.level})` : ''}</div></div>
      ${r.batch ? `<div class="row"><div class="l">Batch</div><div class="v">${r.batch}</div></div>` : ''}
      <div class="row"><div class="l">Towards</div><div class="v">${r.description}</div></div>
      <div class="row"><div class="l">Payment mode</div><div class="v">${r.method}${r.reference ? ` &nbsp;·&nbsp; Ref: ${r.reference}` : ''}</div></div>
      <div class="words"><span class="l">In words: </span><span class="v">${amountInWords(r.amount)}</span></div>
      <div class="amtbox">
        <div class="amt">${rupee(r.amount)}</div>
        <div class="sign"><div class="line"></div>Authorised Signatory</div>
      </div>
      <div class="ftr">This is a computer-generated receipt. ${ENG} — ${TAMIL}.</div>
    </div>
  </body></html>`
  open(html)
}

export type StatementRow = { date: string; ref: string; desc: string; party: string; method: string; credit: number; balance: number }
export type StatementData = {
  from: string; to: string
  rows: StatementRow[]
  opening: number; closing: number; totalCredit: number; count: number
}

export function printBankStatement(s: StatementData) {
  const body = s.rows.map(r => `
    <tr>
      <td>${r.date}</td>
      <td>${r.ref || '—'}</td>
      <td>${r.desc}<div class="muted">${r.party}</div></td>
      <td>${r.method || '—'}</td>
      <td class="num cr">${rupee(r.credit)}</td>
      <td class="num">${rupee(r.balance)}</td>
    </tr>`).join('')
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Statement ${s.from} to ${s.to}</title>
  <style>
    @page { size: A4; margin: 14mm; }
    * { box-sizing:border-box; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    body { font-family:-apple-system,'Segoe UI',Roboto,sans-serif; color:#1a1f3c; margin:0; }
    .brand { display:flex; align-items:center; gap:12px; }
    .logo { width:42px; height:42px; border-radius:9px; background:#e84040; color:#fff; display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:700; }
    .ta { font-size:20px; font-weight:800; } .en { font-size:11px; font-weight:600; color:#e84040; margin-top:-2px; } .sub { font-size:9px; color:#6b7280; }
    .head { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #1a1f3c; padding-bottom:12px; }
    .title { text-align:right; } .title .t { font-size:13px; font-weight:800; letter-spacing:1px; text-transform:uppercase; color:#e84040; } .title .p { font-size:12px; color:#374151; margin-top:3px; }
    .sum { display:flex; gap:10px; margin:16px 0; }
    .card { flex:1; border:1px solid #e5e7eb; border-radius:9px; padding:10px 12px; } .card .l { font-size:10px; color:#6b7280; text-transform:uppercase; letter-spacing:.5px; } .card .v { font-size:17px; font-weight:800; margin-top:3px; }
    table { width:100%; border-collapse:collapse; font-size:12px; }
    th { text-align:left; background:#1a1f3c; color:#fff; padding:8px 10px; font-size:10px; text-transform:uppercase; letter-spacing:.5px; }
    th.num, td.num { text-align:right; }
    td { padding:8px 10px; border-bottom:1px solid #eef0f3; vertical-align:top; }
    .muted { font-size:10px; color:#9ca3af; }
    .cr { color:#16a34a; font-weight:700; }
    tfoot td { font-weight:800; border-top:2px solid #1a1f3c; }
    .ftr { margin-top:14px; font-size:10px; color:#9ca3af; text-align:center; }
  </style></head><body>
    <div class="head">
      ${brandHead}
      <div class="title"><div class="t">Account Statement</div><div class="p">${s.from} &nbsp;to&nbsp; ${s.to}</div></div>
    </div>
    <div class="sum">
      <div class="card"><div class="l">Opening Balance</div><div class="v">${rupee(s.opening)}</div></div>
      <div class="card"><div class="l">Total Credited</div><div class="v" style="color:#16a34a">${rupee(s.totalCredit)}</div></div>
      <div class="card"><div class="l">Transactions</div><div class="v">${s.count}</div></div>
      <div class="card"><div class="l">Closing Balance</div><div class="v">${rupee(s.closing)}</div></div>
    </div>
    <table>
      <thead><tr><th>Date</th><th>Reference</th><th>Description</th><th>Mode</th><th class="num">Credit</th><th class="num">Balance</th></tr></thead>
      <tbody>${body || '<tr><td colspan="6" style="text-align:center;color:#9ca3af;padding:24px">No transactions in this period.</td></tr>'}</tbody>
      <tfoot><tr><td colspan="4">Closing Balance</td><td class="num cr">${rupee(s.totalCredit)}</td><td class="num">${rupee(s.closing)}</td></tr></tfoot>
    </table>
    <div class="ftr">Computer-generated statement · ${ENG} (${TAMIL}) · generated ${new Date().toLocaleString('en-IN')}</div>
  </body></html>`
  open(html)
}
