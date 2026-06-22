import type { SupabaseClient } from '@supabase/supabase-js'

export type StudentWorkItem = {
  id: string; title: string; description: string | null; instructions: string | null
  jlpt_level: string | null; type: string; max_points: number
  due_date: string | null; batch_name: string
  // submission (null if not yet submitted)
  submission_id: string | null; sub_status: string | null
  content: string; points: number | null; feedback: string
  submitted_at: string | null
}

export async function loadStudentWork(
  supabase: SupabaseClient, studentId: string, kind: 'Assignment' | 'Test',
): Promise<StudentWorkItem[]> {
  // batches the student is enrolled in
  const { data: enrollments } = await supabase
    .from('student_batches')
    .select('batch_id')
    .eq('student_id', studentId)
  const batchIds = (enrollments || []).map(e => e.batch_id)
  if (batchIds.length === 0) return []

  const { data: assignments } = await supabase
    .from('assignments')
    .select('id, title, description, instructions, batch_id, jlpt_level, type, max_points, due_date, status')
    .in('batch_id', batchIds)
    .eq('type', kind)
    .eq('status', 'Published')
    .order('due_date', { ascending: true })
  if (!assignments || assignments.length === 0) return []

  // batch names
  const { data: batches } = await supabase
    .from('batches')
    .select('id, name')
    .in('id', batchIds)
  const batchMap = new Map((batches || []).map(b => [b.id, b.name]))

  // this student's submissions
  const assignmentIds = assignments.map(a => a.id)
  const { data: subs } = await supabase
    .from('assignment_submissions')
    .select('id, assignment_id, content, status, points, feedback, submitted_at')
    .eq('student_id', studentId)
    .in('assignment_id', assignmentIds)
  const subMap = new Map((subs || []).map(s => [s.assignment_id, s]))

  return assignments.map(a => {
    const s = subMap.get(a.id)
    return {
      id: a.id, title: a.title, description: a.description, instructions: a.instructions,
      jlpt_level: a.jlpt_level, type: a.type, max_points: a.max_points,
      due_date: a.due_date, batch_name: batchMap.get(a.batch_id) || '—',
      submission_id: s?.id || null,
      sub_status: s?.status || null,
      content: s?.content || '',
      points: s?.points ?? null,
      feedback: s?.feedback || '',
      submitted_at: s?.submitted_at || null,
    }
  })
}
