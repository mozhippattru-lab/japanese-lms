// Shared schedule helpers for live-class timing.
// Class times (time_slot) and weekdays (days) are stored in IST, so all
// "is the class live now?" logic is computed in Asia/Kolkata time.

const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** "7:00 AM" -> minutes since midnight, or null if unparseable. */
export function timeToMin(t?: string | null): number | null {
  if (!t) return null
  const m = t.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!m) return null
  let h = parseInt(m[1], 10) % 12
  if (/pm/i.test(m[3])) h += 12
  return h * 60 + parseInt(m[2], 10)
}

/** "7:00 AM - 9:00 AM" (hyphen or en-dash) -> { startMin, endMin } | null. */
export function parseSlot(slot?: string | null): { startMin: number; endMin: number } | null {
  if (!slot) return null
  const parts = slot.split(/[–-]/).map(s => s.trim()).filter(Boolean)
  if (parts.length !== 2) return null
  const a = timeToMin(parts[0]), b = timeToMin(parts[1])
  return a != null && b != null ? { startMin: a, endMin: b } : null
}

/** Normalise the `days` field (string "Mon, Wed" or array) to a Set of abbreviations. */
export function daySet(days?: string | string[] | null): Set<string> {
  const list = Array.isArray(days) ? days : String(days || '').split(',')
  return new Set(list.map(x => x.trim()).filter(Boolean))
}

/** Current { weekday, minutes-since-midnight } in Asia/Kolkata, regardless of viewer timezone. */
export function nowInIST(base: Date = new Date()): { day: string; min: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(base)
  const get = (t: string) => parts.find(p => p.type === t)?.value || ''
  const day = get('weekday') // e.g. "Mon"
  let hour = parseInt(get('hour'), 10)
  if (hour === 24) hour = 0 // some runtimes emit "24" for midnight
  const min = hour * 60 + parseInt(get('minute'), 10)
  return { day, min }
}

export type ClassState = 'live' | 'soon' | 'upcoming' | 'ended' | 'off-day'

// A class is joinable from JOIN_GRACE_BEFORE minutes before start until the end time.
const JOIN_GRACE_BEFORE = 15

/**
 * Where the class sits relative to "now" (IST):
 *  - 'live'     : within [start, end] -> join now
 *  - 'soon'     : within [start-15min, start) -> join now
 *  - 'upcoming' : scheduled today but more than 15min away
 *  - 'ended'    : scheduled today but already finished
 *  - 'off-day'  : not scheduled today
 */
export function getClassState(
  timeSlot?: string | null,
  days?: string | string[] | null,
  base: Date = new Date(),
): ClassState {
  const now = nowInIST(base)
  if (!daySet(days).has(now.day)) return 'off-day'
  const range = parseSlot(timeSlot)
  if (!range) return 'off-day'
  if (now.min >= range.startMin && now.min <= range.endMin) return 'live'
  if (now.min >= range.startMin - JOIN_GRACE_BEFORE && now.min < range.startMin) return 'soon'
  if (now.min < range.startMin - JOIN_GRACE_BEFORE) return 'upcoming'
  return 'ended'
}

export const isJoinable = (s: ClassState) => s === 'live' || s === 'soon'

/** Short label like "Mon" for the IST weekday. */
export const istWeekday = (base: Date = new Date()) => nowInIST(base).day
export { DAY_ABBR }
