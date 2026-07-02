-- Blog seed — Batch 6 (study tips). Idempotent. Auto-applied on deploy.
INSERT INTO posts (slug, title, excerpt, body_html, meta_title, meta_description, tags, status, published_at) VALUES
(
  'how-to-make-a-japanese-study-plan',
  'How to Make a Japanese Study Plan That Sticks',
  'A clear plan turns vague motivation into steady progress. Here''s how to build one you''ll actually follow.',
  $body$
  <p>Random studying leads to random results. A simple plan keeps you moving and shows you how far you''ve come.</p>
  <h2>1. Set a concrete goal</h2>
  <p>“Learn Japanese” is too vague. “Pass JLPT N5 in six months” or “hold a 5-minute conversation” gives you direction and a deadline.</p>
  <h2>2. Break it into skills</h2>
  <p>Split your time across kana/kanji, vocabulary, grammar, listening and speaking. Neglect none — the JLPT and real life test all of them.</p>
  <h2>3. Schedule small daily sessions</h2>
  <p>30–60 focused minutes daily beats a weekend cram. Consistency is what actually builds a language.</p>
  <h2>4. Track and review</h2>
  <p>Keep a simple log. Review weekly, and adjust what isn''t working. Seeing progress keeps motivation high.</p>
  <h2>A sample beginner week</h2>
  <p>Vocabulary (SRS) daily · grammar 3× · listening 3× · writing/kanji 2× · one speaking session. Adjust to your life.</p>
  <p>The best plan is the one you''ll follow — keep it realistic and steady.</p>
  $body$,
  'How to Make a Japanese Study Plan That Sticks',
  'Build a Japanese study plan that works — set a concrete goal, split by skill, schedule daily sessions, and track progress.',
  ARRAY['Study Tips','Study Plan','Motivation'],
  'published', now() - interval '41 days'
),
(
  'best-apps-to-learn-japanese',
  'Best Apps to Learn Japanese (and How to Use Them)',
  'Apps are great tools when used well. Here''s what each type is good for — and their limits.',
  $body$
  <p>No app replaces real study, but the right ones make practice convenient and consistent. Here''s how to use each type effectively.</p>
  <h2>Spaced-repetition flashcards</h2>
  <p>Ideal for vocabulary and kanji retention. Review daily and keep decks small and relevant to what you''re currently learning.</p>
  <h2>Kana & kanji trainers</h2>
  <p>Great for the first weeks — drilling hiragana, katakana and stroke order until they''re automatic.</p>
  <h2>Grammar & lesson apps</h2>
  <p>Good for structured introductions to grammar points, but pair them with real reading and listening to make the grammar stick.</p>
  <h2>Dictionaries</h2>
  <p>A good Japanese-English dictionary app (with example sentences and kanji lookup) is essential for every learner.</p>
  <h2>The limit of apps</h2>
  <p>Apps rarely build real speaking ability. Combine them with conversation practice and a teacher or class for feedback.</p>
  <p>Use apps as daily reinforcement, not your whole method.</p>
  $body$,
  'Best Apps to Learn Japanese (and How to Use Them)',
  'How to use Japanese learning apps effectively — SRS flashcards, kana/kanji trainers, grammar apps and dictionaries — plus their limits.',
  ARRAY['Study Tips','Apps','Beginners'],
  'published', now() - interval '40 days'
),
(
  'how-to-stay-motivated-learning-japanese',
  'How to Stay Motivated Learning Japanese',
  'Motivation fades — systems and small wins keep you going. Here''s how to stay on track for the long haul.',
  $body$
  <p>Everyone starts motivated; few finish. The trick is not willpower but smart habits.</p>
  <h2>Make it a habit, not a decision</h2>
  <p>Attach study to an existing routine (after breakfast, on the commute). Habits survive low-motivation days.</p>
  <h2>Celebrate small wins</h2>
  <p>Finished hiragana? Understood a sentence in an anime? Acknowledge it. Small wins compound into momentum.</p>
  <h2>Connect to why you started</h2>
  <p>Keep your real reason visible — travel, career, anime, family. Purpose outlasts novelty.</p>
  <h2>Use content you love</h2>
  <p>Study with shows, music and topics you enjoy. Learning stops feeling like a chore.</p>
  <h2>Find community</h2>
  <p>Classmates, language partners or a teacher add accountability and make the journey social and fun.</p>
  <p>Lower the daily bar, keep showing up, and progress takes care of itself.</p>
  $body$,
  'How to Stay Motivated Learning Japanese',
  'Stay motivated learning Japanese with habits over willpower — routines, small wins, purpose, enjoyable content and community.',
  ARRAY['Study Tips','Motivation','Beginners'],
  'published', now() - interval '39 days'
),
(
  'japanese-immersion-at-home',
  'Immersion: How to Surround Yourself with Japanese',
  'You don''t need to live in Japan to immerse. Here''s how to build a Japanese environment anywhere.',
  $body$
  <p><strong>Immersion</strong> — lots of exposure to real Japanese — accelerates learning. You can create it from home.</p>
  <h2>Change your inputs</h2>
  <ul>
    <li>Switch your phone or a game to Japanese.</li>
    <li>Follow Japanese creators on social media.</li>
    <li>Listen to Japanese music and podcasts during chores.</li>
  </ul>
  <h2>Watch with intent</h2>
  <p>Use Japanese subtitles rather than English. Rewatch favourites you already understand to absorb natural phrasing.</p>
  <h2>Label your world</h2>
  <p>Sticky notes on household items build passive vocabulary you see all day.</p>
  <h2>Balance is key</h2>
  <p>Pair immersion with structured study — immersion builds intuition; study gives you the framework to understand it.</p>
  <p>A little Japanese in every part of your day adds up to enormous exposure over months.</p>
  $body$,
  'Immersion: How to Surround Yourself with Japanese',
  'How to create Japanese immersion at home — change your inputs, watch with Japanese subtitles, label your world, and balance with study.',
  ARRAY['Study Tips','Immersion','Listening'],
  'published', now() - interval '38 days'
),
(
  'learn-japanese-with-anime',
  'How to Learn Japanese with Anime (the Right Way)',
  'Anime can genuinely help — if you use it as a study tool, not just entertainment. Here''s how.',
  $body$
  <p>Anime is a fun source of real Japanese, but passive watching with English subs teaches little. Here''s how to learn from it.</p>
  <h2>Choose the right shows</h2>
  <p>Slice-of-life and everyday-setting anime use realistic, useful language. Action and fantasy often use dramatic or archaic speech you won''t need early on.</p>
  <h2>Watch actively</h2>
  <ol>
    <li>Watch once for enjoyment.</li>
    <li>Rewatch a scene with Japanese subtitles.</li>
    <li>Look up a few key words and note them.</li>
    <li>Shadow a line or two out loud.</li>
  </ol>
  <h2>Mind the speech style</h2>
  <p>Anime often uses very casual or rough speech (おれ, 〜ぞ, 〜な). Great for listening, but don''t copy it in polite situations.</p>
  <p>Used intentionally, anime is a motivating way to train listening and pick up natural phrases.</p>
  $body$,
  'How to Learn Japanese with Anime (the Right Way)',
  'Learn Japanese with anime effectively — choosing realistic shows, active watching with Japanese subtitles, and avoiding rough speech.',
  ARRAY['Study Tips','Listening','Culture'],
  'published', now() - interval '37 days'
),
(
  'best-books-textbooks-learn-japanese',
  'Best Books and Textbooks for Learning Japanese',
  'A guide to the types of resources worth your money — and how to use them together.',
  $body$
  <p>A good textbook gives your study a backbone. Here''s how to choose and combine resources.</p>
  <h2>A core textbook series</h2>
  <p>Pick one well-structured beginner series and work through it in order rather than jumping between many. Consistency of method matters.</p>
  <h2>A grammar reference</h2>
  <p>A dictionary-style grammar reference is invaluable for looking up patterns you meet while reading.</p>
  <h2>Graded readers</h2>
  <p>Level-appropriate reading builds fluency and confidence far better than struggling through native text too early.</p>
  <h2>Kanji and vocab resources</h2>
  <p>Use a structured kanji resource plus an SRS deck for retention.</p>
  <h2>How to combine them</h2>
  <p>Textbook for structure, reader for reading, SRS for memory, and real content for immersion. Together they cover every skill.</p>
  <p>Fewer resources used consistently beat a shelf of half-finished books.</p>
  $body$,
  'Best Books and Textbooks for Learning Japanese',
  'How to choose Japanese learning resources — a core textbook, a grammar reference, graded readers and kanji/vocab tools — and combine them.',
  ARRAY['Study Tips','Resources','Beginners'],
  'published', now() - interval '36 days'
),
(
  'how-much-time-to-study-japanese-daily',
  'How Much Time Should You Study Japanese Each Day?',
  'The honest answer about daily study time — and why consistency beats intensity.',
  $body$
  <p>“How long should I study?” matters less than “how often?”. Here''s a realistic take.</p>
  <h2>The sweet spot</h2>
  <p>For most learners, <strong>30–60 minutes a day</strong> is ideal — enough to progress, sustainable enough to keep up for months.</p>
  <h2>Why daily beats weekend cramming</h2>
  <p>Languages are built through repeated exposure. Five 30-minute sessions teach far more than one 3-hour weekend session, because memory strengthens with spacing.</p>
  <h2>If you''re short on time</h2>
  <p>Even 15 minutes counts. Do SRS on your commute, listen while cooking, review a grammar point before bed. Small daily bites compound.</p>
  <h2>Quality matters too</h2>
  <p>Focused, active practice (recalling, speaking, writing) beats passive re-reading. Protect your study time from distractions.</p>
  <p>Pick a daily amount you can sustain and guard the streak — that''s the real secret.</p>
  $body$,
  'How Much Time Should You Study Japanese Each Day?',
  'How long to study Japanese daily — why 30–60 focused minutes and daily consistency beat weekend cramming, plus tips for busy learners.',
  ARRAY['Study Tips','Study Plan','Motivation'],
  'published', now() - interval '35 days'
),
(
  'spaced-repetition-japanese-vocabulary',
  'Spaced Repetition: The Science of Remembering Vocabulary',
  'Why you forget words — and how spaced repetition (SRS) makes them stick for good.',
  $body$
  <p>Learners forget most new words within days. <strong>Spaced repetition</strong> is the proven fix.</p>
  <h2>The forgetting curve</h2>
  <p>Memory fades predictably over time. Each review resets the curve and makes the memory last longer before the next fade.</p>
  <h2>How SRS works</h2>
  <p>An SRS shows you a card right before you''re likely to forget it. Easy cards appear less often; hard ones more often. This is the most time-efficient way to memorise.</p>
  <h2>How to use it well</h2>
  <ul>
    <li>Review <strong>daily</strong> — skipping days lets the queue pile up.</li>
    <li>Learn words in <strong>context</strong>, with example sentences, not bare translations.</li>
    <li>Keep new cards modest (10–20/day) so reviews stay manageable.</li>
    <li>Be honest when grading recall.</li>
  </ul>
  <p>A few consistent minutes of SRS a day will hold thousands of words in memory over time.</p>
  $body$,
  'Spaced Repetition: The Science of Remembering Vocabulary',
  'How spaced repetition (SRS) beats the forgetting curve — the science behind it and how to use it to remember Japanese vocabulary.',
  ARRAY['Study Tips','Memory','Vocabulary'],
  'published', now() - interval '34 days'
),
(
  'self-study-vs-japanese-class',
  'Self-Study vs Taking a Japanese Class: Which Is Better?',
  'Both work — but they suit different learners. Here''s an honest comparison to help you decide.',
  $body$
  <p>Should you learn Japanese alone or in a class? Each has real strengths.</p>
  <h2>Self-study strengths</h2>
  <ul>
    <li>Flexible schedule and pace.</li>
    <li>Low or no cost.</li>
    <li>You choose your own materials.</li>
  </ul>
  <h2>Self-study challenges</h2>
  <ul>
    <li>No feedback on speaking or mistakes.</li>
    <li>Easy to plateau or lose motivation.</li>
    <li>Hard to know if you''re studying the right things.</li>
  </ul>
  <h2>Class strengths</h2>
  <ul>
    <li>Structured curriculum and clear progression.</li>
    <li>Speaking practice and instant correction.</li>
    <li>Accountability and a learning community.</li>
    <li>Expert guidance toward exams like the JLPT.</li>
  </ul>
  <h2>The best of both</h2>
  <p>Many successful learners combine them: a class for structure, feedback and speaking, plus daily self-study for vocabulary and immersion.</p>
  <p>Choose based on your discipline, budget and goals — and consider blending the two.</p>
  $body$,
  'Self-Study vs Taking a Japanese Class: Which Is Better?',
  'An honest comparison of self-studying Japanese vs taking a class — the strengths and drawbacks of each, and how to combine them.',
  ARRAY['Study Tips','Beginners','Classes'],
  'published', now() - interval '33 days'
),
(
  'learning-japanese-as-a-busy-adult',
  'Learning Japanese as a Busy Adult',
  'No time isn''t a dealbreaker. Here''s how working adults make real progress with limited hours.',
  $body$
  <p>Between work and life, finding study time is hard. But busy adults succeed all the time with the right approach.</p>
  <h2>Use dead time</h2>
  <p>Commutes, queues, lunch breaks and chores are perfect for SRS reviews and listening. These minutes add up to hours weekly.</p>
  <h2>Shrink the daily goal</h2>
  <p>Commit to something tiny you can''t skip — 10 minutes of flashcards. On good days you''ll do more; on bad days you keep the streak.</p>
  <h2>Batch the harder work</h2>
  <p>Save focused grammar or writing for one or two calmer slots a week, and keep daily practice light and portable.</p>
  <h2>Get accountability</h2>
  <p>A weekly class or tutor gives structure and a deadline, so your limited time is spent on the right things.</p>
  <p>Consistency, not free time, is what determines progress. Small daily effort wins.</p>
  $body$,
  'Learning Japanese as a Busy Adult',
  'How busy working adults learn Japanese with limited time — using dead time, tiny daily goals, batching hard work, and accountability.',
  ARRAY['Study Tips','Motivation','Study Plan'],
  'published', now() - interval '32 days'
)
ON CONFLICT (slug) DO NOTHING;
