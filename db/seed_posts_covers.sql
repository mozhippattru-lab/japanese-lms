-- Assign themed free stock cover images to blog posts (idempotent).
-- Uses LoremFlickr (free CC photos by keyword). A per-post lock derived from the
-- slug keeps each image stable and distinct. Only fills posts without a cover,
-- so any image set manually in the editor is preserved.
-- Runs after the seed_posts_NN batches (sorts last), auto-applied on deploy.
UPDATE posts SET cover_image =
  'https://loremflickr.com/1200/600/' ||
  CASE
    WHEN tags && ARRAY['Kanji','Writing']                                             THEN 'calligraphy,japan'
    WHEN tags && ARRAY['JLPT','JLPT N5','JLPT N4','JLPT N3','Exam Guide']              THEN 'study,books'
    WHEN tags && ARRAY['Grammar','Particles','Verbs','Adjectives']                    THEN 'books,japanese'
    WHEN tags && ARRAY['Vocabulary','Numbers','Counters']                             THEN 'notebook,study'
    WHEN tags && ARRAY['Culture','Festivals','Etiquette','Holidays','Food']           THEN 'kyoto,japan'
    WHEN tags && ARRAY['Speaking','Listening','Pronunciation','Conversation','Phrases'] THEN 'tokyo,people'
    WHEN tags && ARRAY['Careers','Visa','India','Study Abroad','Business','Japan']     THEN 'tokyo,city'
    WHEN tags && ARRAY['Study Tips','Study Plan','Memory','Apps','Motivation','Resources','Roadmap','Classes'] THEN 'desk,study'
    WHEN tags && ARRAY['Kids']                                                        THEN 'children,study'
    ELSE 'japan,japanese'
  END
  || '?lock=' || (abs(hashtext(slug)) % 100000)::text
WHERE status = 'published' AND (cover_image IS NULL OR cover_image = '');
