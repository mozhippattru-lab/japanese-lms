-- Blog seed — Batch 2 (grammar). Idempotent. Auto-applied on deploy.
INSERT INTO posts (slug, title, excerpt, body_html, meta_title, meta_description, tags, status, published_at) VALUES
(
  'japanese-te-form-made-easy',
  'The Japanese Te-form Made Easy',
  'The te-form unlocks a huge amount of Japanese grammar. Here''s how to make it and why it matters.',
  $body$
  <p>If there is one conjugation to master early, it is the <strong>te-form</strong>. It connects sentences, makes requests, forms the present continuous, and much more.</p>
  <h2>Why the te-form matters</h2>
  <p>The te-form is the gateway to dozens of grammar patterns: <em>〜てください</em> (please do), <em>〜ている</em> (is doing), <em>〜てもいい</em> (may I), and joining actions in sequence.</p>
  <h2>How to form it</h2>
  <p>The te-form depends on the verb''s ending:</p>
  <ul>
    <li><strong>う, つ, る</strong> → って (買う → 買って)</li>
    <li><strong>む, ぶ, ぬ</strong> → んで (飲む → 飲んで)</li>
    <li><strong>く</strong> → いて (書く → 書いて) · <strong>ぐ</strong> → いで (泳ぐ → 泳いで)</li>
    <li><strong>す</strong> → して (話す → 話して)</li>
    <li><strong>る-verbs</strong> → replace る with て (食べる → 食べて)</li>
    <li><strong>Irregulars</strong>: する → して, 来る → 来て</li>
  </ul>
  <h2>Remember the exception</h2>
  <p>行く (to go) is irregular: it becomes 行って, not 行いて. Memorise this one separately.</p>
  <h2>Practice</h2>
  <p>Drill the groups until conversion is automatic. Once the te-form is second nature, a large slice of everyday Japanese grammar opens up.</p>
  $body$,
  'The Japanese Te-form Made Easy — Rules and Examples',
  'Learn the Japanese te-form: how to conjugate every verb group, the key exceptions, and why it unlocks so much grammar.',
  ARRAY['Grammar','Te-form','JLPT N5'],
  'published', now() - interval '21 days'
),
(
  'japanese-verb-groups-explained',
  'Japanese Verb Groups Explained (う-verbs, る-verbs, Irregulars)',
  'All Japanese verbs fall into three groups. Knowing which is which is the key to every conjugation.',
  $body$
  <p>Japanese conjugation looks scary until you learn the three verb groups. Almost every rule depends on knowing a verb''s group.</p>
  <h2>Group 1: う-verbs (godan)</h2>
  <p>These end in a “u” sound: 飲む (nomu), 書く (kaku), 話す (hanasu). They are the largest group and their endings shift across the whole “u-row” when conjugated.</p>
  <h2>Group 2: る-verbs (ichidan)</h2>
  <p>These end in <strong>いる</strong> or <strong>える</strong>: 食べる (taberu), 見る (miru). To conjugate, you usually just drop る and add the ending — the easy group.</p>
  <h2>Group 3: Irregulars</h2>
  <p>Only two matter: <strong>する</strong> (to do) and <strong>来る</strong> (to come). Learn their forms individually.</p>
  <h2>The tricky part</h2>
  <p>Some verbs look like る-verbs but are actually う-verbs — such as 帰る (kaeru, to return) and 入る (hairu, to enter). These must be memorised as exceptions.</p>
  <h2>Why it matters</h2>
  <p>Once you can instantly identify a verb''s group, forming the te-form, past tense, negative and polite forms becomes a simple, reliable process.</p>
  $body$,
  'Japanese Verb Groups Explained (う-verbs, る-verbs, Irregulars)',
  'The three Japanese verb groups explained — godan (う), ichidan (る) and irregulars — plus the exceptions every learner must memorise.',
  ARRAY['Grammar','Verbs','JLPT N5'],
  'published', now() - interval '20 days'
),
(
  'japanese-i-adjectives-vs-na-adjectives',
  'Japanese Adjectives: い-adjectives vs な-adjectives',
  'Japanese has two kinds of adjectives that behave differently. Here''s how to tell them apart and use each correctly.',
  $body$
  <p>Japanese adjectives come in two types, and they conjugate differently. Getting this right makes your Japanese sound natural.</p>
  <h2>い-adjectives</h2>
  <p>These end in い: 高い (expensive), 楽しい (fun), 新しい (new). They change form themselves — past tense is 〜かった (楽しかった = was fun), negative is 〜くない (高くない = not expensive).</p>
  <h2>な-adjectives</h2>
  <p>These need な when placed before a noun: 静かな部屋 (a quiet room), きれいな花 (a pretty flower). They behave more like nouns and use です/でした to change tense.</p>
  <h2>The tricky exceptions</h2>
  <p>きれい (pretty) and 嫌い (dislike) end in い but are actually <strong>な-adjectives</strong>. Memorise them so you don''t conjugate them like い-adjectives.</p>
  <h2>Quick rule</h2>
  <p>If it ends in い and is a native adjective, conjugate the adjective itself. If it needs な before a noun, treat it like a noun with です. Practise with real sentences and the pattern sticks fast.</p>
  $body$,
  'Japanese Adjectives: い-adjectives vs な-adjectives',
  'Learn the two types of Japanese adjectives — い-adjectives and な-adjectives — how each conjugates, and the key exceptions.',
  ARRAY['Grammar','Adjectives','JLPT N5'],
  'published', now() - interval '19 days'
),
(
  'japanese-desu-da-copula',
  'Mastering です and だ: The Japanese Copula',
  'です and だ both mean “to be” — but knowing when to use each shapes how polite you sound.',
  $body$
  <p><strong>です</strong> and <strong>だ</strong> are the Japanese equivalents of “is/am/are”. Choosing between them sets the tone of your speech.</p>
  <h2>です — the polite form</h2>
  <p>Use です in most everyday and formal situations: <em>学生です</em> (I am a student). Its past form is <strong>でした</strong>, and its negative is <strong>ではありません / じゃないです</strong>.</p>
  <h2>だ — the casual form</h2>
  <p>だ is used in casual speech and writing: <em>学生だ</em>. Among friends, だ is often dropped entirely. Its negative is <strong>じゃない</strong> and past is <strong>だった</strong>.</p>
  <h2>When to use which</h2>
  <ul>
    <li><strong>です</strong> — with teachers, strangers, customers, and in the workplace.</li>
    <li><strong>だ / plain form</strong> — with close friends and family.</li>
  </ul>
  <h2>A beginner tip</h2>
  <p>When in doubt, use です. It is always safe and polite. As you gain exposure, you will learn when casual speech is appropriate.</p>
  $body$,
  'Mastering です and だ: The Japanese Copula Explained',
  'Understand the Japanese copula です and だ — polite vs casual, their past and negative forms, and when to use each.',
  ARRAY['Grammar','Politeness','JLPT N5'],
  'published', now() - interval '18 days'
),
(
  'japanese-particle-ni-vs-de',
  'Japanese Particles に vs で: When to Use Each',
  'に and で both can translate as “at” or “in”, which confuses beginners. Here''s the simple rule.',
  $body$
  <p>Few things trip up beginners like choosing between <strong>に</strong> and <strong>で</strong>. Both can mean “at” or “in”, but they mark different things.</p>
  <h2>に — destination, time, existence</h2>
  <ul>
    <li><strong>Destination:</strong> 学校に行く (go <em>to</em> school)</li>
    <li><strong>Point in time:</strong> 7時に起きる (wake up <em>at</em> 7)</li>
    <li><strong>Location of existence:</strong> 部屋に猫がいる (there is a cat <em>in</em> the room)</li>
  </ul>
  <h2>で — where an action happens</h2>
  <ul>
    <li><strong>Place of action:</strong> 学校で勉強する (study <em>at</em> school)</li>
    <li><strong>Means/tool:</strong> 電車で行く (go <em>by</em> train)</li>
  </ul>
  <h2>The key distinction</h2>
  <p>Use <strong>に</strong> for a destination or where something simply <em>exists</em>; use <strong>で</strong> for where an <em>action takes place</em>. Compare: 家にいる (I am <em>at</em> home — existence) vs 家で食べる (I eat <em>at</em> home — action).</p>
  <p>Read many examples and the difference becomes intuitive.</p>
  $body$,
  'Japanese Particles に vs で: When to Use Each',
  'The simple rule for choosing between the Japanese particles に and で, with clear examples of destination, time, location and action.',
  ARRAY['Grammar','Particles','JLPT N5'],
  'published', now() - interval '17 days'
),
(
  'japanese-particles-e-to-kara-made',
  'Japanese Particles へ, と, から and まで Explained',
  'Four more essential particles that show direction, connection, and starting/ending points.',
  $body$
  <p>After は, が, を, に and で, these four particles round out the essentials for building clear sentences.</p>
  <h2>へ (e) — direction</h2>
  <p>Marks the direction of movement, similar to に for destinations: <em>東京へ行く</em> (head toward Tokyo). As a particle, へ is pronounced “e”.</p>
  <h2>と (to) — “and” / “with”</h2>
  <p>Joins nouns (“and”) and marks a companion (“with”): <em>パンと卵</em> (bread and eggs), <em>友達と行く</em> (go with a friend).</p>
  <h2>から (kara) — “from” / “because”</h2>
  <p>Marks a starting point in time or place, and also means “because”: <em>9時から</em> (from 9 o''clock), <em>寒いから</em> (because it''s cold).</p>
  <h2>まで (made) — “until” / “to”</h2>
  <p>Marks an end point: <em>5時まで</em> (until 5 o''clock), <em>駅まで歩く</em> (walk to the station). から and まで pair naturally: <em>月曜から金曜まで</em> (from Monday to Friday).</p>
  <p>Practise combining these and your sentences immediately gain range and precision.</p>
  $body$,
  'Japanese Particles へ, と, から and まで Explained',
  'Learn four essential Japanese particles — へ (direction), と (and/with), から (from/because) and まで (until/to) — with examples.',
  ARRAY['Grammar','Particles','JLPT N5'],
  'published', now() - interval '16 days'
),
(
  'how-to-make-questions-in-japanese',
  'How to Make Questions in Japanese (the か Particle)',
  'Asking questions in Japanese is refreshingly simple. Here''s how the か particle works.',
  $body$
  <p>Forming questions in Japanese is one of the easiest things you''ll learn — no word-order changes needed.</p>
  <h2>Add か to make a question</h2>
  <p>Take a statement and add <strong>か</strong> at the end: <em>学生です</em> (I am a student) → <em>学生ですか</em> (Are you a student?). The word order stays exactly the same.</p>
  <h2>Question words</h2>
  <ul>
    <li><strong>何 (nani/nan)</strong> — what</li>
    <li><strong>誰 (dare)</strong> — who</li>
    <li><strong>どこ (doko)</strong> — where</li>
    <li><strong>いつ (itsu)</strong> — when</li>
    <li><strong>どうして / なぜ</strong> — why</li>
    <li><strong>いくら (ikura)</strong> — how much</li>
  </ul>
  <p>Example: <em>これは何ですか</em> (What is this?), <em>トイレはどこですか</em> (Where is the toilet?).</p>
  <h2>Casual questions</h2>
  <p>In casual speech, か is often dropped and you simply raise your intonation: <em>行く？</em> (Going?). </p>
  <p>With just か and a handful of question words, you can ask about almost anything.</p>
  $body$,
  'How to Make Questions in Japanese (the か Particle)',
  'Learn how to ask questions in Japanese using the か particle and essential question words like 何, どこ, いつ and 誰.',
  ARRAY['Grammar','Particles','JLPT N5'],
  'published', now() - interval '15 days'
),
(
  'japanese-past-tense',
  'Past Tense in Japanese (ました and the た-form)',
  'How to talk about the past in Japanese, in both polite and casual speech.',
  $body$
  <p>Talking about the past in Japanese follows clear, regular patterns once you know the verb groups.</p>
  <h2>Polite past: 〜ました</h2>
  <p>Change the polite 〜ます to <strong>〜ました</strong>: <em>食べます → 食べました</em> (ate), <em>行きます → 行きました</em> (went). The negative past is <strong>〜ませんでした</strong>.</p>
  <h2>Casual past: the た-form</h2>
  <p>The plain past (た-form) follows the same sound rules as the te-form — just swap て/で for た/だ: <em>食べて → 食べた</em>, <em>飲んで → 飲んだ</em>, <em>行って → 行った</em>.</p>
  <h2>Adjectives in the past</h2>
  <ul>
    <li><strong>い-adjectives:</strong> 楽しい → 楽しかった (was fun)</li>
    <li><strong>な-adjectives / nouns:</strong> 静かでした / 学生でした</li>
  </ul>
  <h2>Practice</h2>
  <p>Because the た-form mirrors the te-form, mastering one gives you the other almost for free. Drill both together.</p>
  $body$,
  'Past Tense in Japanese (ました and the た-form)',
  'Learn the Japanese past tense — polite 〜ました, the casual た-form, negatives, and past-tense adjectives — with examples.',
  ARRAY['Grammar','Verbs','JLPT N5'],
  'published', now() - interval '14 days'
),
(
  'japanese-negative-forms',
  'Negative Forms in Japanese (ません and ない)',
  'How to say “not” in Japanese — polite and casual negatives for verbs, adjectives and nouns.',
  $body$
  <p>Expressing “not” in Japanese is systematic. Here are the negative forms you''ll use every day.</p>
  <h2>Polite negative: 〜ません</h2>
  <p>Change 〜ます to <strong>〜ません</strong>: <em>飲みます → 飲みません</em> (do not drink). Simple and always polite.</p>
  <h2>Casual negative: the ない-form</h2>
  <ul>
    <li><strong>る-verbs:</strong> drop る, add ない — 食べる → 食べない</li>
    <li><strong>う-verbs:</strong> change the final “u” to “a” + ない — 飲む → 飲まない (note: 〜う becomes 〜わない, e.g. 買う → 買わない)</li>
    <li><strong>Irregulars:</strong> する → しない, 来る → 来ない</li>
  </ul>
  <h2>Adjectives and nouns</h2>
  <ul>
    <li><strong>い-adjectives:</strong> 高い → 高くない (not expensive)</li>
    <li><strong>な-adjectives / nouns:</strong> 静かじゃない / 学生じゃない</li>
  </ul>
  <p>Learn the polite 〜ません first for safe everyday use, then add the casual ない-form as you progress.</p>
  $body$,
  'Negative Forms in Japanese (ません and the ない-form)',
  'Learn how to say “not” in Japanese — polite 〜ません and the casual ない-form for verbs, plus negative adjectives and nouns.',
  ARRAY['Grammar','Verbs','JLPT N5'],
  'published', now() - interval '13 days'
),
(
  'japanese-keigo-basics',
  'Keigo Basics: Polite Japanese for Beginners',
  'Keigo (honorific language) is central to Japanese culture. Here''s a gentle introduction to the three levels.',
  $body$
  <p><strong>Keigo (敬語)</strong> is the system of polite and honorific language that shows respect in Japanese. It sounds intimidating, but beginners only need the basics.</p>
  <h2>The three levels</h2>
  <ul>
    <li><strong>Teineigo (丁寧語)</strong> — polite language (です/ます). This is what beginners use everywhere and it is perfectly respectful.</li>
    <li><strong>Sonkeigo (尊敬語)</strong> — honorific language that elevates the person you''re speaking about (a customer, a boss).</li>
    <li><strong>Kenjougo (謙譲語)</strong> — humble language that lowers yourself to show respect.</li>
  </ul>
  <h2>Where beginners start</h2>
  <p>Master です/ます first — it covers nearly all everyday polite situations. You don''t need sonkeigo or kenjougo to be respectful as a learner.</p>
  <h2>A few useful set phrases</h2>
  <ul>
    <li><em>よろしくお願いします</em> — a polite “please/nice to meet you”.</li>
    <li><em>ありがとうございます</em> — thank you (polite).</li>
    <li><em>すみません</em> — excuse me / sorry.</li>
  </ul>
  <p>Learn keigo gradually. As you advance toward business Japanese, sonkeigo and kenjougo become important — but at the start, polite です/ます is all you need.</p>
  $body$,
  'Keigo Basics: Polite Japanese for Beginners',
  'A beginner''s guide to Japanese keigo — the three levels of polite and honorific language, and which one to focus on first.',
  ARRAY['Grammar','Politeness','Culture'],
  'published', now() - interval '12 days'
),
(
  'common-japanese-grammar-mistakes',
  '10 Common Japanese Grammar Mistakes (and How to Fix Them)',
  'Avoid the errors nearly every beginner makes — from mixing up は and が to forgetting particles.',
  $body$
  <p>Some mistakes are so common they''re almost a rite of passage. Spotting them early saves you months of bad habits.</p>
  <ol>
    <li><strong>Confusing は and が.</strong> Use は for the topic, が to specify the subject.</li>
    <li><strong>Dropping particles.</strong> Beginners omit を or に; keep them until casual speech feels natural.</li>
    <li><strong>Misusing に vs で.</strong> に for destination/existence, で for where an action happens.</li>
    <li><strong>Reading は as “ha” instead of “wa”</strong> when it''s a particle.</li>
    <li><strong>Treating きれい like an い-adjective.</strong> It''s a な-adjective.</li>
    <li><strong>Forgetting 行く is irregular</strong> in the te-form (行って).</li>
    <li><strong>Overusing あなた (you).</strong> Japanese usually drops or uses the name instead.</li>
    <li><strong>Wrong word order.</strong> The verb goes at the end.</li>
    <li><strong>Literal translation from English.</strong> Learn Japanese patterns, don''t map word-for-word.</li>
    <li><strong>Ignoring pitch and rhythm.</strong> Copy native audio to sound natural.</li>
  </ol>
  <p>Awareness is half the fix. Review this list occasionally and your Japanese will sound noticeably more natural.</p>
  $body$,
  '10 Common Japanese Grammar Mistakes (and How to Fix Them)',
  'The ten grammar mistakes almost every Japanese beginner makes — は vs が, particles, に vs で and more — and how to fix each.',
  ARRAY['Grammar','Study Tips','Beginners'],
  'published', now() - interval '11 days'
)
ON CONFLICT (slug) DO NOTHING;
