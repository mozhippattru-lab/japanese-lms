-- Blog seed — Batch 1 (foundational articles). Idempotent (ON CONFLICT slug).
-- Apply via the "Apply DB schema file" Action with file = seed_posts_01.sql
-- (run 003_posts.sql first so the table exists).
-- Body uses dollar-quoting ($body$…$body$) so HTML apostrophes need no escaping.

INSERT INTO posts (slug, title, excerpt, body_html, meta_title, meta_description, tags, status, published_at) VALUES
(
  'why-learn-japanese',
  'Why Learn Japanese? 7 Real Reasons It''s Worth It',
  'From career opportunities to a richer travel and cultural experience — here are seven genuine reasons learning Japanese pays off.',
  $body$
  <p>Japanese is spoken by over 125 million people and opens doors that few other languages can. Whether you are drawn by anime, career prospects, or the culture, here are seven real reasons to start.</p>
  <h2>1. Strong career opportunities</h2>
  <p>Japan is one of the world''s largest economies, and Japanese companies operate globally. Bilingual professionals are in demand for roles in engineering, IT, manufacturing, translation, tourism and teaching. A recognised JLPT certificate on your résumé signals a concrete, verifiable skill.</p>
  <h2>2. Work and study in Japan</h2>
  <p>Japan actively welcomes skilled foreign workers and students. Programmes such as the Specified Skilled Worker (SSW) visa and countless university scholarships favour applicants who can communicate in Japanese — often requiring JLPT N4 or N3 as a minimum.</p>
  <h2>3. Enjoy anime, manga and games in the original</h2>
  <p>Subtitles and translations lose nuance. Understanding Japanese lets you enjoy your favourite stories the way they were written — including the jokes, wordplay and emotion that rarely survive translation.</p>
  <h2>4. Travel with confidence</h2>
  <p>Outside major tourist areas, English is limited. Even basic Japanese transforms a trip — ordering food, asking directions and chatting with locals become genuine, memorable experiences.</p>
  <h2>5. It trains your brain</h2>
  <p>Learning a writing system as different as Japanese builds memory, focus and pattern recognition. Many learners find it improves how they study everything else.</p>
  <h2>6. A gateway to a deep culture</h2>
  <p>Language and culture are inseparable. Studying Japanese naturally teaches you about etiquette, history, food and the values that shape daily life in Japan.</p>
  <h2>7. It is more achievable than you think</h2>
  <p>Japanese pronunciation is simple and consistent, and its grammar is logical once you learn the patterns. With a clear plan and steady practice, real progress comes faster than most people expect.</p>
  <h3>Ready to begin?</h3>
  <p>The best time to start is now. A structured beginner course takes you from your first <em>あ</em> to holding real conversations — one confident step at a time.</p>
  $body$,
  'Why Learn Japanese? 7 Real Reasons It''s Worth It',
  'Seven genuine reasons to learn Japanese — career opportunities, working in Japan, enjoying anime in the original, travel, and more.',
  ARRAY['Learning Japanese','Motivation','Beginners'],
  'published',
  now() - interval '40 days'
),
(
  'is-japanese-hard-to-learn',
  'Is Japanese Hard to Learn? An Honest Answer',
  'Japanese has a reputation for being difficult. The truth is more encouraging — some parts are genuinely easy, and the hard parts are very learnable.',
  $body$
  <p>“Is Japanese hard?” is the first question almost every learner asks. The honest answer: some parts are surprisingly easy, and the challenging parts are completely manageable with the right approach.</p>
  <h2>What makes Japanese easier than you expect</h2>
  <ul>
    <li><strong>Pronunciation is simple.</strong> Japanese uses a small, consistent set of sounds. There are no tones (unlike Chinese) and very few tricky sounds for most learners.</li>
    <li><strong>Spelling is phonetic.</strong> Once you know the kana, you can read a word exactly as it is written — no silent letters or surprises.</li>
    <li><strong>No genders or plurals.</strong> Nouns do not change for gender or number, which removes a whole layer of memorisation.</li>
  </ul>
  <h2>What takes real effort</h2>
  <ul>
    <li><strong>Three writing systems.</strong> Hiragana, katakana and kanji. The two kana sets are quick to learn; kanji is a long-term, steady project.</li>
    <li><strong>Different word order.</strong> Japanese puts the verb at the end and uses particles to mark grammar. It feels strange at first, then becomes second nature.</li>
    <li><strong>Politeness levels.</strong> Choosing casual vs. polite speech takes exposure and practice.</li>
  </ul>
  <h2>How long until it clicks?</h2>
  <p>Most learners can read hiragana within two weeks and hold simple conversations within a few months of consistent study. The key word is <em>consistent</em> — 30 focused minutes a day beats a rushed weekend.</p>
  <h2>The bottom line</h2>
  <p>Japanese is not harder than other languages — it is simply <em>different</em>. Learn the patterns in the right order, practise a little every day, and it stops feeling difficult and starts feeling fun.</p>
  $body$,
  'Is Japanese Hard to Learn? An Honest Answer',
  'Is Japanese difficult? An honest breakdown of what''s easy (pronunciation, phonetic spelling) and what takes effort (kanji, word order).',
  ARRAY['Learning Japanese','Beginners','FAQ'],
  'published',
  now() - interval '38 days'
),
(
  'how-long-to-learn-japanese',
  'How Long Does It Take to Learn Japanese?',
  'A realistic timeline from absolute beginner to conversational and JLPT-ready, based on steady daily practice.',
  $body$
  <p>How long it takes depends on your goal, your study time and your consistency. Here is a realistic timeline based on steady, daily practice.</p>
  <h2>The first 2 weeks: reading kana</h2>
  <p>With focused practice you can learn all of hiragana in about a week and katakana in the next. This alone lets you read menus, signs and beginner textbooks.</p>
  <h2>3–6 months: survival Japanese (JLPT N5)</h2>
  <p>Greetings, self-introductions, numbers, shopping and simple daily conversations. This maps roughly to JLPT N5 — around 150 hours of study for most learners.</p>
  <h2>6–12 months: everyday conversations (JLPT N4)</h2>
  <p>You can handle everyday situations, read simple written Japanese and follow slow, clear speech. Expect another 150 or so hours beyond N5.</p>
  <h2>1.5–3 years: comfortable fluency (JLPT N3–N2)</h2>
  <p>Reading newspapers, working in Japanese and expressing opinions become realistic. N3 is often the level employers look for.</p>
  <h2>What speeds it up</h2>
  <ul>
    <li><strong>Daily consistency</strong> — 30–60 minutes every day beats occasional long sessions.</li>
    <li><strong>Speaking early</strong> — practising output, not just input, builds real fluency.</li>
    <li><strong>Structured guidance</strong> — a good teacher removes guesswork and keeps you on track.</li>
  </ul>
  <p>Set a clear target level, study a little every day, and the months add up faster than you think.</p>
  $body$,
  'How Long Does It Take to Learn Japanese? A Realistic Timeline',
  'A realistic timeline for learning Japanese — from reading kana in 2 weeks to JLPT N5, N4 and N3 fluency with daily practice.',
  ARRAY['Learning Japanese','Study Plan','JLPT'],
  'published',
  now() - interval '36 days'
),
(
  'what-is-jlpt',
  'What Is the JLPT? A Complete Beginner''s Guide',
  'The JLPT is the world''s most recognised Japanese proficiency test. Here''s what it is, how the levels work, and why it matters.',
  $body$
  <p>The <strong>JLPT (Japanese-Language Proficiency Test)</strong> is the most widely recognised certification of Japanese ability for non-native speakers. It is held twice a year at test centres around the world.</p>
  <h2>The five levels</h2>
  <ul>
    <li><strong>N5</strong> — basic Japanese for everyday situations (the entry level).</li>
    <li><strong>N4</strong> — elementary; everyday conversation and simple reading.</li>
    <li><strong>N3</strong> — intermediate; the bridge to advanced Japanese.</li>
    <li><strong>N2</strong> — upper-intermediate; used for many jobs and universities.</li>
    <li><strong>N1</strong> — advanced; near-native comprehension.</li>
  </ul>
  <h2>What the test measures</h2>
  <p>Each level tests three areas: <strong>vocabulary and grammar</strong>, <strong>reading</strong>, and <strong>listening</strong>. There is no speaking or writing section — it is entirely multiple choice.</p>
  <h2>How scoring works</h2>
  <p>You need both a total passing score and a minimum in each section, so balanced preparation matters. You cannot pass by acing one area and ignoring another.</p>
  <h2>Why the JLPT matters</h2>
  <ul>
    <li>It is a clear, internationally accepted proof of your level.</li>
    <li>Employers and universities in Japan frequently require N3, N2 or N1.</li>
    <li>It gives your studies a concrete goal and a deadline to work toward.</li>
  </ul>
  <p>Most learners start at N5 and climb one level at a time. Whatever your goal, the JLPT gives your Japanese journey a clear structure.</p>
  $body$,
  'What Is the JLPT? A Complete Beginner''s Guide',
  'A beginner''s guide to the JLPT — the five levels (N5–N1), what the test measures, how scoring works, and why it matters.',
  ARRAY['JLPT','Exam Guide','Beginners'],
  'published',
  now() - interval '34 days'
),
(
  'jlpt-n5-guide',
  'JLPT N5 Explained: Syllabus, Format and How to Prepare',
  'Everything a beginner needs to know about JLPT N5 — the vocabulary, kanji and grammar it covers, the exam format, and a simple study plan.',
  $body$
  <p>JLPT N5 is the entry point of the Japanese-Language Proficiency Test. Passing it proves you can understand basic Japanese used in everyday situations.</p>
  <h2>What N5 covers</h2>
  <ul>
    <li><strong>~800 vocabulary words</strong> and <strong>~100 basic kanji</strong>.</li>
    <li><strong>Hiragana and katakana</strong> — you must read both fluently.</li>
    <li><strong>Core grammar</strong> — basic particles, present/past tense, simple adjectives and everyday sentence patterns.</li>
  </ul>
  <h2>Exam format</h2>
  <p>N5 has three scored parts: <em>Language Knowledge (vocabulary)</em>, <em>Language Knowledge (grammar) &amp; Reading</em>, and <em>Listening</em>. It is all multiple choice and takes about 90 minutes of testing time.</p>
  <h2>A simple study plan</h2>
  <ol>
    <li><strong>Weeks 1–2:</strong> master hiragana and katakana.</li>
    <li><strong>Weeks 3–8:</strong> learn core grammar and the first 400 words.</li>
    <li><strong>Weeks 9–14:</strong> finish the N5 vocabulary and kanji; start listening practice.</li>
    <li><strong>Final weeks:</strong> take timed mock tests to build exam stamina.</li>
  </ol>
  <h2>Tips to pass comfortably</h2>
  <ul>
    <li>Do a little listening every day — it is the section learners underestimate.</li>
    <li>Learn vocabulary in example sentences, not as isolated words.</li>
    <li>Practise with real past-paper-style questions before the exam.</li>
  </ul>
  <p>N5 is very achievable in a few months of steady study — and it sets the foundation for everything above it.</p>
  $body$,
  'JLPT N5 Guide: Syllabus, Format and How to Prepare',
  'JLPT N5 explained for beginners — vocabulary, kanji and grammar covered, the exam format, and a step-by-step study plan to pass.',
  ARRAY['JLPT','JLPT N5','Exam Guide'],
  'published',
  now() - interval '32 days'
),
(
  'jlpt-n4-guide',
  'JLPT N4 Explained: What to Expect and How to Prepare',
  'JLPT N4 takes you from survival Japanese to handling everyday conversations. Here''s the syllabus, format and a preparation plan.',
  $body$
  <p>JLPT N4 is the second level of the exam. It shows you can understand basic Japanese across everyday situations — a real step up from N5.</p>
  <h2>What N4 covers</h2>
  <ul>
    <li><strong>~1,500 vocabulary words</strong> and <strong>~300 kanji</strong> (including the N5 kanji).</li>
    <li><strong>Expanded grammar</strong> — the te-form, plain form, conditional patterns, giving/receiving, and more connectors.</li>
    <li><strong>Reading</strong> short everyday texts and <strong>listening</strong> to natural, slightly faster speech.</li>
  </ul>
  <h2>Exam format</h2>
  <p>Like all JLPT levels, N4 is multiple choice across vocabulary, grammar &amp; reading, and listening, with a minimum score required in each section.</p>
  <h2>How to prepare</h2>
  <ol>
    <li><strong>Solidify N5 first</strong> — N4 assumes you know it cold.</li>
    <li><strong>Master the te-form</strong> — it unlocks a huge amount of N4 grammar.</li>
    <li><strong>Read short passages daily</strong> to build speed and comprehension.</li>
    <li><strong>Level up your listening</strong> with everyday dialogues, not just textbook audio.</li>
  </ol>
  <h2>Common N4 challenges</h2>
  <p>Learners often struggle with verb conjugation patterns and with listening at natural speed. Both improve quickly with daily, focused practice.</p>
  <p>N4 is where Japanese starts to feel genuinely useful — you can hold real conversations and read simple written Japanese.</p>
  $body$,
  'JLPT N4 Guide: Syllabus, Format and Study Plan',
  'JLPT N4 explained — the vocabulary, kanji and grammar it covers, the exam format, and how to prepare and pass.',
  ARRAY['JLPT','JLPT N4','Exam Guide'],
  'published',
  now() - interval '30 days'
),
(
  'jlpt-n3-guide',
  'JLPT N3 Explained: The Bridge to Advanced Japanese',
  'JLPT N3 is the intermediate level many employers look for. Here''s what it covers and how to make the jump from N4.',
  $body$
  <p>JLPT N3 sits between elementary and advanced Japanese. It is often the level that opens real doors — many jobs and programmes in Japan ask for N3 as a minimum.</p>
  <h2>What N3 covers</h2>
  <ul>
    <li><strong>~3,700 vocabulary words</strong> and <strong>~650 kanji</strong>.</li>
    <li><strong>Intermediate grammar</strong> — nuanced expressions, keigo basics, and connecting complex ideas.</li>
    <li><strong>Reading</strong> newspapers and everyday articles, and <strong>listening</strong> to near-natural speech.</li>
  </ul>
  <h2>Why N3 is a big jump</h2>
  <p>The gap between N4 and N3 is the largest most learners feel. Vocabulary and kanji roughly double, and reading passages get longer and less predictable. Plan for more study time than N4 required.</p>
  <h2>How to prepare</h2>
  <ol>
    <li><strong>Build reading stamina</strong> — practise longer passages under time pressure.</li>
    <li><strong>Study kanji in context</strong>, grouped by meaning and reading.</li>
    <li><strong>Immerse daily</strong> — podcasts, news for learners, and shows with Japanese subtitles.</li>
    <li><strong>Learn set expressions</strong> — N3 grammar is often about fixed phrases and nuance.</li>
  </ol>
  <p>Reach N3 and you can genuinely study, work and live in Japan. It is a milestone worth aiming for.</p>
  $body$,
  'JLPT N3 Guide: The Bridge to Advanced Japanese',
  'JLPT N3 explained — vocabulary, kanji and grammar covered, why it''s a big jump from N4, and how to prepare for it.',
  ARRAY['JLPT','JLPT N3','Exam Guide'],
  'published',
  now() - interval '28 days'
),
(
  'how-to-learn-hiragana-fast',
  'How to Learn Hiragana Fast (A 7-Day Plan)',
  'Hiragana is the first thing every Japanese learner masters. Here''s a simple, proven 7-day plan to read it fluently.',
  $body$
  <p>Hiragana is the foundation of written Japanese. The good news: with the right method you can learn all 46 basic characters in about a week.</p>
  <h2>Why learn hiragana first</h2>
  <p>Hiragana lets you read textbook sentences, grammar endings and furigana (the small reading aids above kanji). Skipping it and relying on romaji slows every learner down — so start here.</p>
  <h2>The 7-day plan</h2>
  <ol>
    <li><strong>Days 1–2:</strong> learn the vowels (あ い う え お) and the K and S rows.</li>
    <li><strong>Days 3–4:</strong> add the T, N and H rows.</li>
    <li><strong>Days 5–6:</strong> finish the M, Y, R and W rows plus ん.</li>
    <li><strong>Day 7:</strong> review everything and add the dakuten (が, ざ, だ, ば) and combos (きゃ, しゅ, ちょ).</li>
  </ol>
  <h2>Techniques that work</h2>
  <ul>
    <li><strong>Mnemonics</strong> — link each shape to a picture (お looks like someone doing a cartwheel).</li>
    <li><strong>Write by hand</strong> — tracing builds memory far faster than reading alone.</li>
    <li><strong>Spaced repetition</strong> — review with flashcards so characters stick long-term.</li>
    <li><strong>Read simple words daily</strong> — apply what you learn immediately.</li>
  </ul>
  <p>Stay consistent for one week and you will read hiragana for life. It is the fastest, most satisfying win in your whole Japanese journey.</p>
  $body$,
  'How to Learn Hiragana Fast — A 7-Day Plan',
  'Learn all 46 hiragana characters in a week with this simple day-by-day plan, plus mnemonics and spaced-repetition tips.',
  ARRAY['Hiragana','Beginners','Study Tips'],
  'published',
  now() - interval '26 days'
),
(
  'hiragana-katakana-kanji-difference',
  'Hiragana, Katakana and Kanji: What''s the Difference?',
  'Japanese uses three writing systems together. Here''s what each one is for and why you need all three.',
  $body$
  <p>New learners are often surprised that Japanese uses <strong>three</strong> writing systems at the same time. Each has a clear job, and together they make written Japanese work.</p>
  <h2>Hiragana (ひらがな)</h2>
  <p>A phonetic alphabet of 46 basic characters used for native Japanese words, grammar endings and particles. It is the first system every learner masters.</p>
  <h2>Katakana (カタカナ)</h2>
  <p>The same set of sounds as hiragana but different shapes, used mainly for <strong>foreign loanwords</strong> (コーヒー = coffee), names, and emphasis. Learn it right after hiragana.</p>
  <h2>Kanji (漢字)</h2>
  <p>Characters borrowed from Chinese that represent whole words or ideas (山 = mountain, 学 = study). There are thousands, but everyday literacy needs around 2,000. You learn them steadily over time.</p>
  <h2>How they work together</h2>
  <p>A single sentence typically mixes all three: kanji for the main words, hiragana for the grammar around them, and katakana for any borrowed words. For example: <em>私はコーヒーを飲みます。</em> (I drink coffee.) — kanji (私・飲), hiragana (は・を・みます), katakana (コーヒー).</p>
  <h2>The learning order</h2>
  <ol>
    <li>Hiragana first (about a week).</li>
    <li>Katakana next (another week).</li>
    <li>Kanji gradually, alongside your grammar and vocabulary.</li>
  </ol>
  <p>Once you understand the roles, the mix stops looking intimidating and starts making sense.</p>
  $body$,
  'Hiragana, Katakana and Kanji: What''s the Difference?',
  'Understand Japan''s three writing systems — hiragana, katakana and kanji — what each is for, and the best order to learn them.',
  ARRAY['Hiragana','Katakana','Kanji','Beginners'],
  'published',
  now() - interval '24 days'
),
(
  'japanese-particles-wa-ga-wo',
  'Japanese Particles は, が and を Explained Simply',
  'Particles are the glue of Japanese grammar. Here''s a beginner-friendly explanation of the three most important ones.',
  $body$
  <p>Particles are small words that show the role each part of a sentence plays. Master these three and Japanese grammar suddenly makes far more sense.</p>
  <h2>は (wa) — the topic marker</h2>
  <p>は marks what the sentence is <em>about</em>. (Note: as a particle it is pronounced “wa”, not “ha”.) Example: <em>私は学生です。</em> — “As for me, (I) am a student.”</p>
  <h2>が (ga) — the subject marker</h2>
  <p>が points to the specific subject doing or being something, often to introduce new information or answer “who/what?”. Example: <em>猫がいます。</em> — “There is a cat.”</p>
  <h2>を (wo/o) — the object marker</h2>
  <p>を marks the direct object — the thing an action is done to. Example: <em>水を飲みます。</em> — “(I) drink water.”</p>
  <h2>は vs が: the classic confusion</h2>
  <p>A simple rule of thumb: use <strong>は</strong> to set the topic or contrast, and <strong>が</strong> to highlight or specify the subject. “<em>象は鼻が長い。</em>” (As for elephants, the nose is long) shows both working together — は sets the topic (elephants), が marks the specific subject (nose).</p>
  <h2>Practice tip</h2>
  <p>Read simple sentences aloud and ask yourself what each particle is doing. With exposure, the right choice starts to feel natural rather than rule-based.</p>
  $body$,
  'Japanese Particles は, が and を Explained Simply',
  'A beginner-friendly guide to the three most important Japanese particles — は (topic), が (subject) and を (object) — with clear examples.',
  ARRAY['Grammar','Particles','JLPT N5'],
  'published',
  now() - interval '22 days'
)
ON CONFLICT (slug) DO NOTHING;
