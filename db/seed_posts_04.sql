-- Blog seed — Batch 4 (kanji & writing). Idempotent. Auto-applied on deploy.
INSERT INTO posts (slug, title, excerpt, body_html, meta_title, meta_description, tags, status, published_at) VALUES
(
  'how-to-learn-kanji-strategy',
  'How to Learn Kanji: A Strategy That Actually Works',
  'Kanji feels overwhelming, but a smart strategy makes it manageable. Here''s how to learn them without burning out.',
  $body$
  <p>There are around 2,000 everyday kanji, which scares many learners into quitting. The secret is not raw memorisation — it''s a system.</p>
  <h2>Learn kanji in context, not in isolation</h2>
  <p>Memorising a character alone rarely sticks. Learn each kanji inside real words and sentences so you absorb its meaning, reading and usage together.</p>
  <h2>Use radicals as building blocks</h2>
  <p>Most kanji are combinations of smaller parts (radicals). Once you know common radicals, new kanji become “combinations you recognise” rather than random strokes.</p>
  <h2>Space your reviews (SRS)</h2>
  <p>Spaced repetition — reviewing just before you''d forget — is the single most efficient way to retain kanji long-term. A little every day beats cramming.</p>
  <h2>Prioritise by frequency</h2>
  <p>Learn the most common kanji first (they map to JLPT levels). High-frequency characters give you the most reading power per hour of study.</p>
  <h2>Read, read, read</h2>
  <p>Nothing cements kanji like meeting them repeatedly in real text — graded readers, manga with furigana, and simple articles.</p>
  <p>Steady daily practice with these principles turns kanji from a wall into a climbable staircase.</p>
  $body$,
  'How to Learn Kanji: A Strategy That Actually Works',
  'A practical strategy for learning kanji — study in context, use radicals, apply spaced repetition, prioritise by frequency, and read daily.',
  ARRAY['Kanji','Study Tips','JLPT'],
  'published', now() - interval '39 days'
),
(
  'kanji-radicals-explained',
  'Kanji Radicals: The Building Blocks Explained',
  'Radicals are the components that make up every kanji. Learning them turns memorisation into recognition.',
  $body$
  <p>A <strong>radical</strong> is a recurring component inside kanji. Learning the common ones is the biggest shortcut in your kanji journey.</p>
  <h2>Why radicals help</h2>
  <p>Instead of seeing 20 random strokes, you start seeing familiar parts. 休 (rest) is 人 (person) + 木 (tree) — a person resting by a tree. Meaning becomes memorable.</p>
  <h2>Common radicals to know</h2>
  <ul>
    <li>氵(water) — appears in 海 (sea), 河 (river), 泳 (swim)</li>
    <li>木 (tree/wood) — 林 (woods), 森 (forest)</li>
    <li>人 / 亻 (person) — 休 (rest), 体 (body)</li>
    <li>口 (mouth) — 話 (speak), 歌 (song)</li>
    <li>心 / 忄 (heart) — 思 (think), 感 (feel)</li>
  </ul>
  <h2>Radicals and the dictionary</h2>
  <p>Traditional dictionaries organise kanji by radical, so knowing them also helps you look up unfamiliar characters.</p>
  <p>Learn a few radicals each week and watch new kanji start to “make sense” instead of looking random.</p>
  $body$,
  'Kanji Radicals: The Building Blocks Explained',
  'Learn how kanji radicals work — the recurring components that make characters memorable, with common examples every learner should know.',
  ARRAY['Kanji','Study Tips','JLPT'],
  'published', now() - interval '37 days'
),
(
  'onyomi-vs-kunyomi',
  'Onyomi vs Kunyomi: Kanji Readings Explained',
  'Most kanji have more than one reading. Here''s what onyomi and kunyomi are and when each is used.',
  $body$
  <p>One of the first kanji surprises: a single character can be read several ways. These readings fall into two families.</p>
  <h2>Onyomi (音読み) — the “sound” reading</h2>
  <p>Derived from the original Chinese pronunciation, onyomi is usually used when a kanji appears in a <strong>compound</strong> with other kanji. Example: 学 is read <em>gaku</em> in 学校 (gakkō, school).</p>
  <h2>Kunyomi (訓読み) — the “meaning” reading</h2>
  <p>The native Japanese reading, usually used when the kanji stands <strong>alone</strong> or with hiragana okurigana. Example: 学 is read <em>mana(bu)</em> in 学ぶ (manabu, to learn).</p>
  <h2>A rule of thumb</h2>
  <ul>
    <li><strong>Kanji + kanji compound</strong> → often onyomi.</li>
    <li><strong>Kanji + hiragana (verb/adjective)</strong> → often kunyomi.</li>
  </ul>
  <h2>Don''t over-drill readings alone</h2>
  <p>Rather than memorising every reading in isolation, learn the common words each kanji appears in. The right reading comes naturally with vocabulary.</p>
  $body$,
  'Onyomi vs Kunyomi: Kanji Readings Explained',
  'Understand onyomi and kunyomi — the two families of kanji readings, when each is used, and how to learn them without frustration.',
  ARRAY['Kanji','Study Tips','JLPT'],
  'published', now() - interval '35 days'
),
(
  'kanji-stroke-order-rules',
  'Kanji Stroke Order Rules (and Why They Matter)',
  'Correct stroke order isn''t just tradition — it makes your writing faster, neater and easier to read.',
  $body$
  <p>Every kanji has a defined stroke order. Following it has real, practical benefits.</p>
  <h2>Why stroke order matters</h2>
  <ul>
    <li><strong>Legibility</strong> — correct order produces balanced, readable characters.</li>
    <li><strong>Speed</strong> — the order is optimised for smooth, fast handwriting.</li>
    <li><strong>Memory</strong> — a consistent motion helps your hand and brain remember the character.</li>
    <li><strong>Dictionaries & handwriting recognition</strong> rely on it.</li>
  </ul>
  <h2>The core rules</h2>
  <ol>
    <li>Top to bottom.</li>
    <li>Left to right.</li>
    <li>Horizontal strokes before vertical when they cross (十: horizontal, then vertical).</li>
    <li>Outside before inside, then close the box (国).</li>
    <li>Centre before symmetric wings (小).</li>
  </ol>
  <h2>How to practise</h2>
  <p>Use grid paper and trace with animated stroke-order guides at first. After a few dozen characters, the rules become intuitive and you''ll apply them to new kanji automatically.</p>
  $body$,
  'Kanji Stroke Order Rules (and Why They Matter)',
  'The rules of kanji stroke order — top-to-bottom, left-to-right and more — and why correct order improves legibility, speed and memory.',
  ARRAY['Kanji','Writing','Beginners'],
  'published', now() - interval '33 days'
),
(
  '50-most-common-kanji-for-beginners',
  'The 50 Most Common Kanji for Beginners',
  'Start your kanji journey with the highest-value characters you''ll see everywhere.',
  $body$
  <p>These high-frequency kanji appear constantly. Learning them first gives you the most reading power for your effort.</p>
  <h2>Numbers & basics</h2>
  <p>一 二 三 四 五 六 七 八 九 十 (1–10), 百 (hundred), 千 (thousand), 円 (yen), 年 (year).</p>
  <h2>Time & days</h2>
  <p>日 (day/sun), 月 (month/moon), 火 水 木 金 土 (weekday elements), 時 (time), 今 (now), 上 (up), 下 (down).</p>
  <h2>People & places</h2>
  <p>人 (person), 男 (man), 女 (woman), 子 (child), 学 (study), 校 (school), 先 (previous), 生 (life), 国 (country), 山 (mountain), 川 (river).</p>
  <h2>Everyday actions & things</h2>
  <p>大 (big), 小 (small), 中 (middle/inside), 本 (book/origin), 車 (car), 食 (eat), 飲 (drink), 見 (see), 行 (go), 来 (come), 話 (talk), 家 (house), 手 (hand), 目 (eye), 口 (mouth), 何 (what).</p>
  <p>Learn these 50 in context and you''ll suddenly recognise pieces of signs, menus and textbooks everywhere.</p>
  $body$,
  'The 50 Most Common Kanji for Beginners',
  'The 50 highest-frequency kanji to learn first — numbers, time, people, places and everyday actions — for maximum reading power.',
  ARRAY['Kanji','JLPT N5','Vocabulary'],
  'published', now() - interval '31 days'
),
(
  'how-to-write-japanese-kana-practice',
  'How to Write Japanese: A Beginner''s Guide to Kana Practice',
  'Handwriting cements the kana in memory. Here''s how to practise writing hiragana and katakana effectively.',
  $body$
  <p>Typing is convenient, but writing kana by hand builds far stronger memory — especially early on.</p>
  <h2>Start with grid paper</h2>
  <p>Use squared (genkō yōshi style) paper so each character is balanced. Proportion matters as much as shape.</p>
  <h2>Follow stroke order</h2>
  <p>Kana have stroke orders too. Correct order makes characters look natural and helps them stick.</p>
  <h2>A simple routine</h2>
  <ol>
    <li>Trace each character a few times following an animated guide.</li>
    <li>Write it from memory in a row.</li>
    <li>Write simple words that use it (かさ, ねこ, すし).</li>
    <li>Review yesterday''s characters before adding new ones.</li>
  </ol>
  <h2>Watch the look-alikes</h2>
  <p>Some kana are easily confused — さ/ち, ぬ/め, は/ほ, シ/ツ, ソ/ン. Practise these pairs side by side.</p>
  <p>Twenty minutes of handwriting a day for two weeks will lock in both kana sets for good.</p>
  $body$,
  'How to Write Japanese: A Beginner''s Guide to Kana Practice',
  'How to practise writing hiragana and katakana — grid paper, stroke order, a daily routine, and the look-alike characters to watch.',
  ARRAY['Hiragana','Katakana','Writing','Beginners'],
  'published', now() - interval '29 days'
),
(
  'best-ways-to-memorize-kanji',
  'Best Ways to Memorize Kanji (Mnemonics, SRS and Reading)',
  'Three proven techniques that make kanji stick — and how to combine them.',
  $body$
  <p>Different techniques suit different learners. The best results come from combining these three.</p>
  <h2>1. Mnemonics (stories)</h2>
  <p>Turn a kanji''s components into a memorable mini-story. 明 (bright) = 日 (sun) + 月 (moon) — both sources of light make brightness. Silly stories stick best.</p>
  <h2>2. Spaced repetition (SRS)</h2>
  <p>Flashcard apps schedule reviews right before you forget, which is scientifically the most efficient way to move kanji into long-term memory. Keep daily reviews short and consistent.</p>
  <h2>3. Reading in context</h2>
  <p>Meeting kanji repeatedly in real sentences reinforces meaning and reading naturally. Graded readers and furigana texts are ideal.</p>
  <h2>How to combine them</h2>
  <ol>
    <li>Use a mnemonic to learn a new kanji.</li>
    <li>Add it to your SRS deck with an example word.</li>
    <li>Reinforce it by reading material that uses it.</li>
  </ol>
  <p>This loop — learn, review, read — is how learners retain thousands of kanji over time.</p>
  $body$,
  'Best Ways to Memorize Kanji (Mnemonics, SRS and Reading)',
  'Three proven techniques to memorise kanji — mnemonics, spaced repetition and reading in context — and how to combine them.',
  ARRAY['Kanji','Study Tips','Memory'],
  'published', now() - interval '27 days'
),
(
  'furigana-explained',
  'Furigana Explained: Reading Aids in Japanese',
  'Those tiny kana above kanji have a name — furigana. Here''s what they are and how to use them to learn faster.',
  $body$
  <p><strong>Furigana</strong> are small hiragana printed above or beside kanji to show how they''re read. They''re a learner''s best friend.</p>
  <h2>Where you''ll see them</h2>
  <p>Children''s books, manga, textbooks, and content aimed at learners all use furigana so readers can pronounce kanji they don''t yet know.</p>
  <h2>How they help you learn</h2>
  <ul>
    <li>You can read real Japanese before mastering kanji.</li>
    <li>You absorb readings passively as you read.</li>
    <li>They let you enjoy authentic material sooner, which keeps motivation high.</li>
  </ul>
  <h2>Use them wisely</h2>
  <p>Furigana are a bridge, not a crutch. Try reading the kanji first and glance at the furigana only to check. Over time you''ll rely on them less and less.</p>
  <p>Seek out furigana material at your level — it''s one of the most enjoyable ways to build reading ability.</p>
  $body$,
  'Furigana Explained: Reading Aids in Japanese',
  'What furigana are — the small kana above kanji — where you''ll find them, and how to use them to read real Japanese and learn faster.',
  ARRAY['Kanji','Reading','Beginners'],
  'published', now() - interval '25 days'
)
ON CONFLICT (slug) DO NOTHING;
