-- Blog seed — Batch 9 (careers & Japan). Idempotent. Auto-applied on deploy.
INSERT INTO posts (slug, title, excerpt, body_html, meta_title, meta_description, tags, status, published_at) VALUES
(
  'how-to-get-a-job-in-japan',
  'How to Get a Job in Japan as a Foreigner',
  'Working in Japan is more accessible than ever. Here''s a practical overview of the pathways.',
  $body$
  <p>Japan faces a labour shortage and is actively hiring skilled foreigners. With the right preparation, a job in Japan is a realistic goal.</p>
  <h2>Build your Japanese</h2>
  <p>Most roles expect at least conversational Japanese. <strong>JLPT N3</strong> is a common minimum; N2 opens far more doors, especially in offices.</p>
  <h2>Common routes in</h2>
  <ul>
    <li><strong>Specified Skilled Worker (SSW) visa</strong> — for specific in-demand sectors.</li>
    <li><strong>Engineer/Specialist visa</strong> — for IT, engineering and specialist roles.</li>
    <li><strong>Study-then-work</strong> — study in Japan, then transition to employment.</li>
    <li><strong>Recruitment agencies</strong> that specialise in placing foreign talent.</li>
  </ul>
  <h2>Prepare your application</h2>
  <p>A Japanese-style résumé (rirekisho), a JLPT certificate, and awareness of business etiquette all strengthen your candidacy.</p>
  <h2>Start early</h2>
  <p>Begin building Japanese now — language ability is the single biggest factor in your options and salary.</p>
  <p>With steady study and the right visa route, working in Japan is well within reach.</p>
  $body$,
  'How to Get a Job in Japan as a Foreigner',
  'A practical overview of getting a job in Japan — the Japanese level you need, common visa routes, and how to prepare your application.',
  ARRAY['Careers','Japan','Visa'],
  'published', now() - interval '41 days'
),
(
  'specified-skilled-worker-ssw-visa',
  'The Specified Skilled Worker (SSW) Visa Explained',
  'Japan''s SSW visa opened new doors for foreign workers. Here''s how it works in plain terms.',
  $body$
  <p>The <strong>Specified Skilled Worker (SSW / 特定技能)</strong> visa was created to bring skilled foreign workers into sectors facing labour shortages.</p>
  <h2>What it covers</h2>
  <p>The SSW visa spans industries such as caregiving, food service, construction, manufacturing, agriculture and hospitality, among others.</p>
  <h2>The requirements</h2>
  <ul>
    <li><strong>A skills test</strong> for your chosen industry.</li>
    <li><strong>A Japanese-language test</strong> — typically the JFT-Basic or JLPT N4-level ability.</li>
  </ul>
  <h2>The two tiers</h2>
  <ul>
    <li><strong>SSW (i):</strong> renewable up to a few years; the common entry route.</li>
    <li><strong>SSW (ii):</strong> for higher-skilled workers, with longer-term prospects and family accompaniment in eligible fields.</li>
  </ul>
  <h2>Why Japanese matters</h2>
  <p>Passing the language requirement is essential, and stronger Japanese means better roles and smoother daily life. Building toward N4 and beyond is the smart move.</p>
  <p>Check official sources for the latest sector lists and test details before applying.</p>
  $body$,
  'The Specified Skilled Worker (SSW) Visa Explained',
  'A plain-English guide to Japan''s Specified Skilled Worker (SSW) visa — the sectors it covers, the tests required, and its two tiers.',
  ARRAY['Careers','Japan','Visa'],
  'published', now() - interval '40 days'
),
(
  'how-to-study-abroad-in-japan',
  'How to Study Abroad in Japan',
  'Studying in Japan is a life-changing path. Here''s how students get there.',
  $body$
  <p>Japan hosts thousands of international students at language schools and universities. Here''s the typical route.</p>
  <h2>Choose your path</h2>
  <ul>
    <li><strong>Japanese language schools</strong> — ideal to build fluency before university or work.</li>
    <li><strong>Universities &amp; vocational schools</strong> — degree and diploma programmes, some taught in English but most in Japanese.</li>
  </ul>
  <h2>What you''ll need</h2>
  <ul>
    <li>A <strong>student visa</strong>, sponsored by your school.</li>
    <li>Proof of Japanese ability (often JLPT N5–N2 depending on the programme).</li>
    <li>Financial documents showing you can support your studies.</li>
  </ul>
  <h2>Scholarships</h2>
  <p>Government (MEXT) and private scholarships can cover tuition and living costs — competitive but worth pursuing.</p>
  <h2>Start with the language</h2>
  <p>Even English-taught programmes value Japanese for daily life and part-time work. Building your level early widens your choices.</p>
  <p>Plan a year ahead, meet the language requirement, and studying in Japan becomes achievable.</p>
  $body$,
  'How to Study Abroad in Japan',
  'How to study abroad in Japan — language schools vs universities, the student visa, language requirements, and scholarships.',
  ARRAY['Careers','Japan','Study Abroad'],
  'published', now() - interval '39 days'
),
(
  'careers-that-use-japanese',
  'Careers That Use Japanese',
  'Japanese opens doors across many fields. Here are the career paths where it pays off.',
  $body$
  <p>Japanese is a valuable, differentiating skill in a surprising range of careers.</p>
  <h2>Language-focused careers</h2>
  <ul>
    <li>Translation and interpreting.</li>
    <li>Japanese language teaching.</li>
    <li>Localisation for games, apps and media.</li>
  </ul>
  <h2>Business & tech</h2>
  <ul>
    <li>IT and engineering roles at Japanese firms.</li>
    <li>International trade, logistics and manufacturing.</li>
    <li>Sales and customer support for Japanese markets.</li>
  </ul>
  <h2>Hospitality & tourism</h2>
  <p>With tourism to Japan booming, guides, hotel staff and travel companies value Japanese-speaking talent.</p>
  <h2>Culture & creative</h2>
  <p>Anime, manga, publishing and cultural exchange organisations all need people who understand the language.</p>
  <h2>The common thread</h2>
  <p>In most of these, higher Japanese (N2–N1) means better roles and pay. Japanese rarely stands alone — it multiplies the value of your other skills.</p>
  <p>Pair Japanese with a field you love, and you create a rare, in-demand profile.</p>
  $body$,
  'Careers That Use Japanese',
  'Career paths where Japanese pays off — translation, teaching, IT, trade, tourism and creative fields — and why higher levels mean better roles.',
  ARRAY['Careers','Japan','Motivation'],
  'published', now() - interval '38 days'
),
(
  'japanese-interpreter-translator-career',
  'Working as a Japanese Interpreter or Translator',
  'Turning language skill into a profession — what these roles involve and how to get started.',
  $body$
  <p>Translation and interpreting are the most direct ways to build a career on your Japanese. They''re related but distinct skills.</p>
  <h2>Translation vs interpreting</h2>
  <ul>
    <li><strong>Translators</strong> work with written text — documents, media, localisation — and can polish their output.</li>
    <li><strong>Interpreters</strong> convert speech in real time, needing quick thinking and strong listening.</li>
  </ul>
  <h2>What you need</h2>
  <ul>
    <li>High Japanese proficiency (typically N1, or very strong N2).</li>
    <li>Excellent command of your other language too.</li>
    <li>Subject expertise (legal, medical, technical, entertainment) adds huge value.</li>
  </ul>
  <h2>How to start</h2>
  <ul>
    <li>Build your level to N2/N1 and practise translating real texts.</li>
    <li>Specialise in a field where you have knowledge.</li>
    <li>Build a portfolio and take on small freelance jobs to gain experience.</li>
  </ul>
  <p>It''s competitive but rewarding — and demand is steady thanks to Japan''s global business ties.</p>
  $body$,
  'Working as a Japanese Interpreter or Translator',
  'How to build a career in Japanese translation or interpreting — the difference between them, the level required, and how to get started.',
  ARRAY['Careers','Japan'],
  'published', now() - interval '37 days'
),
(
  'japanese-level-requirements-for-jobs',
  'Japanese Language Requirements for Jobs in Japan',
  'How much Japanese do you really need to work in Japan? It depends on the role — here''s a guide.',
  $body$
  <p>The Japanese level employers expect varies widely by industry and role. Here''s a realistic map.</p>
  <h2>By level</h2>
  <ul>
    <li><strong>N5–N4:</strong> enough for some entry-level SSW roles in labour-focused sectors, with on-the-job support.</li>
    <li><strong>N3:</strong> a common minimum for many jobs; you can handle daily work communication.</li>
    <li><strong>N2:</strong> the sweet spot for office and professional roles — widely requested.</li>
    <li><strong>N1:</strong> expected for language-heavy work (translation, negotiation, client-facing roles).</li>
  </ul>
  <h2>Some roles differ</h2>
  <p>Certain IT and engineering positions at global firms may accept strong English with basic Japanese — but Japanese still helps daily life and advancement.</p>
  <h2>The takeaway</h2>
  <p>Aim for at least N3 to open real options, and N2 to be genuinely competitive for professional roles. Every level up widens your choices and raises your ceiling.</p>
  <p>Set your target level to match the career you want, and build steadily toward it.</p>
  $body$,
  'Japanese Language Requirements for Jobs in Japan',
  'How much Japanese you need to work in Japan — a guide to JLPT level expectations by role, from SSW jobs to professional office positions.',
  ARRAY['Careers','Japan','JLPT'],
  'published', now() - interval '36 days'
),
(
  'teaching-english-in-japan',
  'Teaching English in Japan: What to Know',
  'One of the most popular ways to live in Japan. Here''s how it works and where Japanese fits in.',
  $body$
  <p>Teaching English is a well-trodden path to living in Japan, open to many graduates.</p>
  <h2>Common routes</h2>
  <ul>
    <li><strong>JET Programme</strong> — a government scheme placing assistant language teachers in schools.</li>
    <li><strong>Eikaiwa</strong> — private conversation schools that hire year-round.</li>
    <li><strong>Direct-hire and international schools</strong> — often needing teaching qualifications.</li>
  </ul>
  <h2>Typical requirements</h2>
  <ul>
    <li>A bachelor''s degree (for the work visa).</li>
    <li>Native or fluent English.</li>
    <li>A TEFL/TESOL certificate helps for many roles.</li>
  </ul>
  <h2>Do you need Japanese?</h2>
  <p>Many teaching jobs don''t require Japanese to start — but learning it transforms your daily life, relationships and long-term options in Japan. Most teachers wish they''d studied more, sooner.</p>
  <p>Teaching can be a great entry point; use the time in Japan to build your Japanese and open future doors.</p>
  $body$,
  'Teaching English in Japan: What to Know',
  'How teaching English in Japan works — JET, eikaiwa and other routes, typical requirements, and why learning Japanese still matters.',
  ARRAY['Careers','Japan'],
  'published', now() - interval '35 days'
),
(
  'japanese-work-culture-what-to-expect',
  'Japanese Work Culture: What to Expect',
  'From teamwork to communication style, here''s what working in a Japanese company is really like.',
  $body$
  <p>Japanese workplaces have their own rhythm and values. Understanding them helps you thrive.</p>
  <h2>Teamwork and harmony</h2>
  <p>Group cohesion (<em>wa</em>) is valued highly. Decisions often build consensus, and individual credit is downplayed in favour of team results.</p>
  <h2>Communication style</h2>
  <p>Communication can be indirect to preserve harmony. Reading context and unspoken cues (<em>kuuki wo yomu</em>) is an important skill.</p>
  <h2>Etiquette and hierarchy</h2>
  <p>Respect for seniority, polite language and workplace rituals (greetings, after-work courtesy) matter more than in many Western offices.</p>
  <h2>Changing times</h2>
  <p>Long hours were once the norm, but many companies now embrace better work-life balance and welcome diverse, international teams.</p>
  <h2>How to adapt</h2>
  <p>Be punctual, reliable, humble and attentive to others. Strong Japanese makes all of this far easier.</p>
  <p>Come in with awareness and openness, and you''ll integrate smoothly.</p>
  $body$,
  'Japanese Work Culture: What to Expect',
  'What working in a Japanese company is like — teamwork and harmony, indirect communication, hierarchy and etiquette, and how to adapt.',
  ARRAY['Careers','Japan','Culture'],
  'published', now() - interval '34 days'
),
(
  'it-engineering-jobs-in-japan-for-indians',
  'IT and Engineering Jobs in Japan for Indian Professionals',
  'Japan actively recruits Indian tech talent. Here''s how to position yourself.',
  $body$
  <p>Japan''s tech sector faces a talent shortage and increasingly recruits skilled Indian engineers and IT professionals.</p>
  <h2>Why Japan wants Indian tech talent</h2>
  <p>Strong engineering education, English ability and a large talent pool make Indian professionals attractive to Japanese firms modernising their tech.</p>
  <h2>The Japanese question</h2>
  <p>Some global-facing roles accept strong English with basic Japanese, but most positions — and career growth — improve dramatically with <strong>N3–N2</strong> Japanese for team communication.</p>
  <h2>How to prepare</h2>
  <ul>
    <li>Keep sharpening your core tech skills and build a solid portfolio.</li>
    <li>Start Japanese early — even N4 signals commitment and helps daily life.</li>
    <li>Explore the Engineer/Specialist visa route and firms that sponsor it.</li>
  </ul>
  <h2>The advantage</h2>
  <p>Combining tech expertise with Japanese makes you a standout candidate and unlocks better roles and pay.</p>
  <p>Begin building your Japanese now, alongside your technical growth, to make the move smoother.</p>
  $body$,
  'IT and Engineering Jobs in Japan for Indian Professionals',
  'How Indian IT and engineering professionals can work in Japan — why Japan recruits them, the Japanese level that helps, and how to prepare.',
  ARRAY['Careers','Japan','India'],
  'published', now() - interval '33 days'
),
(
  'how-jlpt-level-affects-your-career',
  'How Your JLPT Level Affects Your Career in Japan',
  'Each JLPT level unlocks different opportunities. Here''s what N5 to N1 can do for your career.',
  $body$
  <p>Your JLPT level is more than a certificate — it directly shapes the jobs, salary and life available to you in Japan.</p>
  <h2>Level by level</h2>
  <ul>
    <li><strong>N5–N4:</strong> basic daily communication; some entry-level and SSW roles with support.</li>
    <li><strong>N3:</strong> the practical threshold — you can handle everyday work communication, opening many jobs.</li>
    <li><strong>N2:</strong> the level most professional and office roles look for; a major career unlocker.</li>
    <li><strong>N1:</strong> near-native comprehension; needed for language-heavy, client-facing and leadership roles.</li>
  </ul>
  <h2>Beyond employment</h2>
  <p>Higher levels also ease university admission, daily life, relationships and integration — the whole experience of living in Japan improves.</p>
  <h2>The strategy</h2>
  <p>Aim for at least N3 to enter, then keep climbing to N2 for real career mobility. Each level is a concrete return on your study time.</p>
  <p>Treat the JLPT as a career ladder — every rung widens your future.</p>
  $body$,
  'How Your JLPT Level Affects Your Career in Japan',
  'How each JLPT level (N5–N1) shapes your career in Japan — the jobs, salary and opportunities each unlocks, and the smart target to aim for.',
  ARRAY['Careers','JLPT','Japan'],
  'published', now() - interval '32 days'
)
ON CONFLICT (slug) DO NOTHING;
