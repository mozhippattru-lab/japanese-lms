-- Blog seed — Batch 7 (JLPT exam strategy). Idempotent. Auto-applied on deploy.
INSERT INTO posts (slug, title, excerpt, body_html, meta_title, meta_description, tags, status, published_at) VALUES
(
  'how-to-register-for-the-jlpt',
  'How to Register for the JLPT',
  'A step-by-step overview of signing up for the Japanese-Language Proficiency Test.',
  $body$
  <p>The JLPT is held twice a year (typically July and December). Registration opens months ahead and closes early, so plan around the deadlines.</p>
  <h2>Steps to register</h2>
  <ol>
    <li><strong>Find your local test site.</strong> Each country has official host institutions that run the exam.</li>
    <li><strong>Choose your level (N5–N1)</strong> honestly — you can only sit one level per session.</li>
    <li><strong>Apply during the registration window</strong> and pay the fee.</li>
    <li><strong>Receive your test voucher</strong> with your seat and venue details before exam day.</li>
  </ol>
  <h2>Tips</h2>
  <ul>
    <li>Note deadlines early — they close weeks before the exam and don''t extend.</li>
    <li>Pick the level you can pass now; you can climb next session.</li>
    <li>Keep your voucher and ID safe for exam day.</li>
  </ul>
  <p>Check your country''s official JLPT page for exact dates and fees, and register as soon as the window opens.</p>
  $body$,
  'How to Register for the JLPT — Step by Step',
  'A step-by-step guide to registering for the JLPT — finding a test site, choosing your level, the deadlines and what to prepare.',
  ARRAY['JLPT','Exam Guide'],
  'published', now() - interval '41 days'
),
(
  'jlpt-exam-day-what-to-expect',
  'JLPT Exam Day: What to Expect and What to Bring',
  'Walk in prepared. Here''s how the day runs and the essentials to carry.',
  $body$
  <p>Knowing the routine removes exam-day stress so you can focus on the test.</p>
  <h2>What to bring</h2>
  <ul>
    <li>Your test voucher and photo ID.</li>
    <li>HB pencils and a good eraser (it''s a mark-sheet exam).</li>
    <li>A watch is often not allowed — there''s a clock in the room; check the rules.</li>
  </ul>
  <h2>How the day runs</h2>
  <p>You''ll be seated by number. The test comes in sections — vocabulary/grammar &amp; reading, then listening — with a break in between. The listening section is played once, so stay focused.</p>
  <h2>On-the-day tips</h2>
  <ul>
    <li>Arrive early; latecomers may be refused entry.</li>
    <li>Fill the answer sheet carefully — mismark rows are a common, avoidable loss.</li>
    <li>Don''t leave blanks; there''s no penalty for guessing.</li>
  </ul>
  <p>Prepare your bag the night before and get good sleep — calm and rested beats last-minute cramming.</p>
  $body$,
  'JLPT Exam Day: What to Expect and What to Bring',
  'What to expect on JLPT exam day — what to bring, how the sections run, and practical tips to avoid common mistakes.',
  ARRAY['JLPT','Exam Guide','Tips'],
  'published', now() - interval '40 days'
),
(
  'how-to-manage-time-in-the-jlpt',
  'How to Manage Your Time in the JLPT',
  'Many capable candidates run out of time. Here''s how to pace each section.',
  $body$
  <p>The JLPT is as much a time-management test as a language test — especially the reading section.</p>
  <h2>Reading is the time trap</h2>
  <p>Long passages eat minutes. Don''t over-invest in one hard question — mark it, move on, and return if time allows.</p>
  <h2>Pace by question count</h2>
  <p>Before the exam, know roughly how many minutes you can spend per question, and check the clock at checkpoints.</p>
  <h2>Vocabulary & grammar: go fast</h2>
  <p>These are quick-recall questions. Answer them briskly to bank time for reading.</p>
  <h2>Listening: it plays once</h2>
  <p>Read the options while audio loads, answer immediately, and let go of a missed question so you don''t miss the next.</p>
  <h2>Practise with a timer</h2>
  <p>Do full timed mock tests so exam pace feels familiar, not shocking.</p>
  <p>Good pacing can be the difference between passing and just missing the mark.</p>
  $body$,
  'How to Manage Your Time in the JLPT',
  'JLPT time-management strategy — pacing the reading trap, moving fast on vocabulary/grammar, and handling the single-play listening.',
  ARRAY['JLPT','Exam Guide','Tips'],
  'published', now() - interval '39 days'
),
(
  'how-to-pass-jlpt-listening',
  'How to Pass the JLPT Listening Section',
  'Listening is where scores are won or lost. Here''s how to prepare and perform.',
  $body$
  <p>Listening trips up many candidates because the audio plays only once. Preparation and technique make the difference.</p>
  <h2>Preparation</h2>
  <ul>
    <li>Do daily listening at your level for months before the exam.</li>
    <li>Practise with official-style questions to learn the formats.</li>
    <li>Train your ear to catch key details — who, what, when, where.</li>
  </ul>
  <h2>In the exam</h2>
  <ul>
    <li>Read the answer choices while the audio loads — they hint at what to listen for.</li>
    <li>Focus on the question being asked, not every word.</li>
    <li>If you miss one, answer your best guess and immediately refocus for the next.</li>
  </ul>
  <h2>Common formats</h2>
  <p>Expect task-based questions (what should the person do next?), gist questions, and quick responses. Familiarity removes surprise.</p>
  <p>Consistent daily listening is the single best investment for this section.</p>
  $body$,
  'How to Pass the JLPT Listening Section',
  'Prepare for and ace the JLPT listening section — daily practice, reading options early, focusing on the question, and staying calm.',
  ARRAY['JLPT','Listening','Exam Guide'],
  'published', now() - interval '38 days'
),
(
  'how-to-pass-jlpt-reading',
  'How to Pass the JLPT Reading Section',
  'Reading tests speed and comprehension under pressure. Here''s how to build both.',
  $body$
  <p>The reading section challenges even strong candidates because of its length and time limit.</p>
  <h2>Build reading speed</h2>
  <p>Read Japanese daily at your level — graded readers, news for learners, and past-paper passages. Speed comes only from volume.</p>
  <h2>Read the question first</h2>
  <p>Knowing what''s being asked lets you scan the passage for the answer instead of reading every line closely.</p>
  <h2>Don''t panic at unknown words</h2>
  <p>You don''t need to understand everything — use context to grasp the overall meaning and answer the question.</p>
  <h2>Manage time ruthlessly</h2>
  <p>Budget minutes per passage and move on from anything that stalls you. A blank costs the same as a wrong answer, so always answer.</p>
  <h2>Learn grammar in context</h2>
  <p>Reading and grammar reinforce each other — the more you read, the more grammar patterns you recognise instantly.</p>
  <p>Volume plus smart technique is how you conquer JLPT reading.</p>
  $body$,
  'How to Pass the JLPT Reading Section',
  'How to prepare for the JLPT reading section — build speed with daily reading, read the question first, use context, and manage time.',
  ARRAY['JLPT','Reading','Exam Guide'],
  'published', now() - interval '37 days'
),
(
  'how-to-study-jlpt-grammar',
  'How to Study JLPT Grammar Effectively',
  'JLPT grammar is largely about set patterns and nuance. Here''s the efficient way to master it.',
  $body$
  <p>Each JLPT level has a defined list of grammar points. Studying them systematically pays off directly on the test.</p>
  <h2>Work from a level list</h2>
  <p>Use a grammar list for your target level and work through it point by point, so you cover exactly what''s tested.</p>
  <h2>Learn patterns in example sentences</h2>
  <p>Grammar points are often fixed structures (〜ながら, 〜たほうがいい). Memorise them inside natural example sentences, not as abstract rules.</p>
  <h2>Focus on nuance and connection</h2>
  <p>Higher levels test subtle differences between similar patterns. Compare look-alikes side by side.</p>
  <h2>Test yourself</h2>
  <p>Do practice questions to see how grammar appears in the exam, then review the ones you miss.</p>
  <h2>Reinforce by reading</h2>
  <p>You''ll meet these patterns in real text, which cements them far better than drilling alone.</p>
  <p>Systematic, example-based study is the fastest route through JLPT grammar.</p>
  $body$,
  'How to Study JLPT Grammar Effectively',
  'Study JLPT grammar the efficient way — work from a level list, learn patterns in example sentences, compare nuances, and test yourself.',
  ARRAY['JLPT','Grammar','Exam Guide'],
  'published', now() - interval '36 days'
),
(
  'jlpt-vs-nat-test-vs-jtest',
  'JLPT vs NAT-Test vs J.TEST: Which Japanese Exam?',
  'The JLPT isn''t the only Japanese proficiency test. Here''s how the main options compare.',
  $body$
  <p>Several exams certify Japanese ability. The JLPT is the most recognised, but alternatives can suit specific needs.</p>
  <h2>JLPT</h2>
  <p>The global standard, held twice a year, with five levels (N5–N1). Most widely accepted by employers and universities. No speaking/writing section.</p>
  <h2>NAT-Test</h2>
  <p>Similar in format to the JLPT but offered more frequently through the year — useful when you need a certificate sooner or want extra practice attempts.</p>
  <h2>J.TEST</h2>
  <p>A single test that places you on a scale rather than pass/fail levels, offered several times a year. Popular for employment screening in some contexts.</p>
  <h2>Which should you take?</h2>
  <p>For most learners and for maximum recognition, the <strong>JLPT</strong> is the safe choice. Consider the others mainly for their frequency if timing matters.</p>
  <p>Whatever you pick, the study skills transfer — so focus on building real ability.</p>
  $body$,
  'JLPT vs NAT-Test vs J.TEST: Which Japanese Exam?',
  'Compare the main Japanese proficiency exams — JLPT, NAT-Test and J.TEST — their formats, frequency and recognition, and which to choose.',
  ARRAY['JLPT','Exam Guide'],
  'published', now() - interval '35 days'
),
(
  'how-long-to-prepare-for-jlpt-levels',
  'How Long to Prepare for Each JLPT Level',
  'Rough study-hour estimates for N5 through N1, and what affects your timeline.',
  $body$
  <p>Preparation time varies by person, but these estimates help you plan realistically.</p>
  <h2>Rough study-hour guides</h2>
  <ul>
    <li><strong>N5:</strong> ~150 hours (a few months of daily study).</li>
    <li><strong>N4:</strong> ~300 hours total.</li>
    <li><strong>N3:</strong> ~450–600 hours total — the biggest jump.</li>
    <li><strong>N2:</strong> ~600–1,000 hours.</li>
    <li><strong>N1:</strong> ~900–1,800+ hours.</li>
  </ul>
  <h2>What changes your timeline</h2>
  <ul>
    <li><strong>Prior kanji knowledge</strong> (learners familiar with Chinese characters progress faster).</li>
    <li><strong>Daily consistency</strong> — steady study is far more efficient.</li>
    <li><strong>Study quality</strong> — active practice beats passive reading.</li>
    <li><strong>Immersion</strong> — exposure outside study accelerates everything.</li>
  </ul>
  <p>Set a target level, count backwards from the exam date, and build a daily plan that fits the hours.</p>
  $body$,
  'How Long to Prepare for Each JLPT Level (N5–N1)',
  'Realistic study-hour estimates to prepare for JLPT N5, N4, N3, N2 and N1, plus the factors that speed up or slow down your timeline.',
  ARRAY['JLPT','Study Plan','Exam Guide'],
  'published', now() - interval '34 days'
),
(
  'best-resources-to-prepare-for-jlpt',
  'Best Resources to Prepare for the JLPT',
  'The types of materials that map directly to the exam — and how to use them together.',
  $body$
  <p>Targeted resources make JLPT prep efficient. Here''s what to gather for any level.</p>
  <h2>Level-specific prep books</h2>
  <p>Series organised by JLPT level cover exactly the vocabulary, kanji and grammar tested. Work through the one for your target level.</p>
  <h2>Grammar and vocab lists</h2>
  <p>A grammar-point list and a vocabulary list for your level tell you precisely what to study — no guessing.</p>
  <h2>Past-paper-style practice tests</h2>
  <p>Official workbooks and mock tests are essential for learning the question formats and building exam stamina.</p>
  <h2>Listening practice</h2>
  <p>Use level-appropriate listening drills, since the section format is specific and time-pressured.</p>
  <h2>SRS for retention</h2>
  <p>Load level vocabulary and kanji into a spaced-repetition deck and review daily.</p>
  <p>Combine a prep book, lists, mock tests and daily SRS, and you''ll cover everything the exam throws at you.</p>
  $body$,
  'Best Resources to Prepare for the JLPT',
  'The best types of JLPT prep resources — level-specific books, grammar/vocab lists, mock tests, listening drills and SRS — and how to combine them.',
  ARRAY['JLPT','Resources','Exam Guide'],
  'published', now() - interval '33 days'
),
(
  'common-jlpt-mistakes-to-avoid',
  'Common JLPT Mistakes and How to Avoid Them',
  'Don''t lose easy marks. Here are the errors that cost candidates a pass — and how to dodge them.',
  $body$
  <p>Many failed attempts come down to avoidable mistakes rather than lack of knowledge.</p>
  <ol>
    <li><strong>Ignoring the sectional minimum.</strong> You must pass each section, not just the total — so don''t neglect listening or reading.</li>
    <li><strong>Under-practising listening.</strong> It''s the section learners most often leave until too late.</li>
    <li><strong>No timed practice.</strong> Running out of time in reading is common; simulate exam conditions beforehand.</li>
    <li><strong>Leaving blanks.</strong> There''s no penalty for guessing — always fill an answer.</li>
    <li><strong>Mismarking the answer sheet.</strong> Keep your row aligned, especially after skipping a question.</li>
    <li><strong>Choosing too high a level.</strong> Sit the level you can actually pass, then climb.</li>
    <li><strong>Cramming the night before.</strong> Rest and steady prep beat last-minute panic.</li>
  </ol>
  <p>Avoid these and you''ll walk in giving yourself the best possible chance.</p>
  $body$,
  'Common JLPT Mistakes and How to Avoid Them',
  'The common JLPT mistakes that cost a pass — ignoring section minimums, skipping listening, no timed practice, blanks — and how to avoid them.',
  ARRAY['JLPT','Exam Guide','Tips'],
  'published', now() - interval '32 days'
)
ON CONFLICT (slug) DO NOTHING;
