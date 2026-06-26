-- Online-class meeting link per batch (Zoom / Google Meet / Teams URL).
-- Pasted by admin/teacher; reused for every session of that batch.
ALTER TABLE public.batches ADD COLUMN IF NOT EXISTS meeting_link TEXT;
