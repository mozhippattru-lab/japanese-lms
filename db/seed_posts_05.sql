-- Blog seed — Batch 5 (speaking & listening). Idempotent. Auto-applied on deploy.
INSERT INTO posts (slug, title, excerpt, body_html, meta_title, meta_description, tags, status, published_at) VALUES
(
  'how-to-introduce-yourself-in-japanese',
  'How to Introduce Yourself in Japanese (自己紹介)',
  'A self-introduction (jikoshoukai) is often your first real conversation. Here''s a simple, natural template.',
  $body$
  <p>The <strong>自己紹介 (jikoshoukai)</strong> — self-introduction — is a Japanese social ritual. A clear, polite one makes a great first impression.</p>
  <h2>A simple template</h2>
  <ul>
    <li><em>はじめまして。</em> — Nice to meet you.</li>
    <li><em>[名前]です。</em> — I''m [name].</li>
    <li><em>[国]から来ました。</em> — I''m from [country].</li>
    <li><em>[趣味]が好きです。</em> — I like [hobby].</li>
    <li><em>よろしくお願いします。</em> — Please treat me kindly.</li>
  </ul>
  <h2>Example</h2>
  <p><em>はじめまして。ラジュです。インドから来ました。アニメが好きです。よろしくお願いします。</em></p>
  <h2>Tips</h2>
  <ul>
    <li>Keep it short — brevity is polite.</li>
    <li>A slight bow at はじめまして and よろしく is natural.</li>
    <li>Practise until it flows without thinking.</li>
  </ul>
  <p>Memorise this template and you''ll always have a confident opening line ready.</p>
  $body$,
  'How to Introduce Yourself in Japanese (自己紹介)',
  'A simple template for a Japanese self-introduction (jikoshoukai) — name, origin, hobby and the polite closing, with an example.',
  ARRAY['Speaking','Beginners','JLPT N5'],
  'published', now() - interval '41 days'
),
(
  '30-japanese-phrases-everyday-conversation',
  '30 Japanese Phrases for Everyday Conversation',
  'Practical phrases you''ll actually use — for greetings, shopping, restaurants and getting help.',
  $body$
  <p>These everyday phrases cover most common situations. Learn them and you can handle daily life in Japanese.</p>
  <h2>Getting by</h2>
  <ul>
    <li><em>すみません</em> — excuse me / sorry</li>
    <li><em>大丈夫です</em> — I''m okay / it''s fine</li>
    <li><em>わかりました / わかりません</em> — I understand / I don''t understand</li>
    <li><em>もう一度お願いします</em> — once more, please</li>
    <li><em>ゆっくり話してください</em> — please speak slowly</li>
  </ul>
  <h2>Shopping & eating</h2>
  <ul>
    <li><em>いくらですか</em> — how much is it?</li>
    <li><em>これをください</em> — I''ll take this</li>
    <li><em>おすすめは何ですか</em> — what do you recommend?</li>
    <li><em>お会計をお願いします</em> — the bill, please</li>
  </ul>
  <h2>Getting help</h2>
  <ul>
    <li><em>トイレはどこですか</em> — where is the toilet?</li>
    <li><em>助けてください</em> — please help</li>
    <li><em>英語を話せますか</em> — can you speak English?</li>
  </ul>
  <p>Keep a short list on your phone and use a few each day — they become automatic fast.</p>
  $body$,
  '30 Japanese Phrases for Everyday Conversation',
  'Thirty practical Japanese phrases for daily life — greetings, shopping, restaurants and asking for help — with readings and meanings.',
  ARRAY['Speaking','Phrases','Travel'],
  'published', now() - interval '40 days'
),
(
  'how-to-improve-japanese-listening',
  'How to Improve Your Japanese Listening Skills',
  'Listening is where many learners struggle most. Here''s how to train your ear efficiently.',
  $body$
  <p>Listening often lags behind reading because natural speech is fast and full of contractions. The fix is targeted, daily exposure.</p>
  <h2>Start at your level</h2>
  <p>Use graded listening — podcasts and videos made for learners — so you understand most of what you hear. Comprehensible input beats overwhelming native speed.</p>
  <h2>Listen actively</h2>
  <ul>
    <li><strong>Intensive:</strong> replay short clips, catch every word, check a transcript.</li>
    <li><strong>Extensive:</strong> listen to lots of easy content for general understanding.</li>
  </ul>
  <h2>Use transcripts and subtitles</h2>
  <p>Listen first, then read along, then listen again. Japanese subtitles help more than English ones for building real comprehension.</p>
  <h2>Make it daily</h2>
  <p>Even 15 minutes a day of focused listening compounds quickly. Turn commutes and chores into listening time.</p>
  <p>Consistency, not marathon sessions, is what trains your ear.</p>
  $body$,
  'How to Improve Your Japanese Listening Skills',
  'Practical ways to improve Japanese listening — graded input, intensive vs extensive listening, using transcripts, and daily practice.',
  ARRAY['Listening','Study Tips','JLPT'],
  'published', now() - interval '39 days'
),
(
  'japanese-pronunciation-guide',
  'Japanese Pronunciation Guide for Beginners',
  'Good news: Japanese pronunciation is simple and consistent. Here''s how to sound clear from day one.',
  $body$
  <p>Japanese has a small, regular sound system, so clear pronunciation is very achievable for beginners.</p>
  <h2>The five vowels</h2>
  <p>あ (a), い (i), う (u), え (e), お (o) — always pronounced the same way. Master these and most words fall into place.</p>
  <h2>Even rhythm (mora)</h2>
  <p>Japanese is <strong>mora-timed</strong>: each kana gets roughly equal length. This gives Japanese its steady, even rhythm — unlike the stress-timed bounce of English.</p>
  <h2>Long vowels matter</h2>
  <p>Vowel length changes meaning: おばさん (aunt) vs おばあさん (grandmother). Hold long vowels for two beats.</p>
  <h2>Small tricky sounds</h2>
  <ul>
    <li>The Japanese ら-row is between English R and L — a light tap.</li>
    <li>ふ is a soft “fu” with no strong F.</li>
    <li>Double consonants (っ) create a short pause: きって (kitte).</li>
  </ul>
  <p>Copy native audio closely and record yourself. Your pronunciation will sound natural surprisingly quickly.</p>
  $body$,
  'Japanese Pronunciation Guide for Beginners',
  'A beginner''s guide to Japanese pronunciation — the five vowels, mora rhythm, long vowels, and the few tricky sounds to master.',
  ARRAY['Speaking','Pronunciation','Beginners'],
  'published', now() - interval '38 days'
),
(
  'shadowing-technique-japanese',
  'Shadowing: The Best Technique for Japanese Fluency',
  'Shadowing trains listening, pronunciation and rhythm at once. Here''s how to do it right.',
  $body$
  <p><strong>Shadowing</strong> means listening to native audio and repeating it out loud almost simultaneously, like an echo. It''s one of the most powerful fluency techniques.</p>
  <h2>Why it works</h2>
  <p>Shadowing trains your ears and mouth together, building natural rhythm, intonation and speed that silent study can''t.</p>
  <h2>How to shadow</h2>
  <ol>
    <li>Pick short audio at your level, with a transcript.</li>
    <li>Listen a few times to understand it.</li>
    <li>Play it again and speak along, matching the speaker''s rhythm and sounds.</li>
    <li>Repeat the same clip until it feels smooth.</li>
  </ol>
  <h2>Tips</h2>
  <ul>
    <li>Don''t worry about perfection — mimicry improves with reps.</li>
    <li>Use material you enjoy so you''ll keep doing it.</li>
    <li>10–15 minutes daily beats occasional long sessions.</li>
  </ul>
  <p>Stick with shadowing and your speaking will start to sound genuinely Japanese, not translated.</p>
  $body$,
  'Shadowing: The Best Technique for Japanese Fluency',
  'What shadowing is and how to do it — repeating native Japanese audio to train listening, pronunciation and natural rhythm.',
  ARRAY['Speaking','Listening','Study Tips'],
  'published', now() - interval '37 days'
),
(
  'first-japanese-conversation',
  'How to Have Your First Japanese Conversation',
  'You know some words — now use them. Here''s how to survive and enjoy your first real conversation.',
  $body$
  <p>The leap from studying to speaking is scary but essential. Here''s how to make your first conversation a success.</p>
  <h2>Prepare a few building blocks</h2>
  <ul>
    <li>A self-introduction you can say without thinking.</li>
    <li>Rescue phrases: <em>もう一度お願いします</em>, <em>ゆっくりお願いします</em>, <em>わかりません</em>.</li>
    <li>Simple questions: <em>お名前は？</em>, <em>趣味は何ですか？</em></li>
  </ul>
  <h2>Embrace mistakes</h2>
  <p>Native speakers appreciate the effort far more than they mind errors. Every mistake is data that speeds up your learning.</p>
  <h2>Keep it simple</h2>
  <p>Use short sentences you''re confident in. You don''t need advanced grammar to have a friendly chat.</p>
  <h2>Where to practise</h2>
  <p>Language exchange partners, tutors, and classmates are ideal because they''re patient and encouraging.</p>
  <p>The first conversation is the hardest. After it, speaking gets easier every single time.</p>
  $body$,
  'How to Have Your First Japanese Conversation',
  'Tips for your first Japanese conversation — building blocks to prepare, rescue phrases, embracing mistakes, and where to practise.',
  ARRAY['Speaking','Beginners','Motivation'],
  'published', now() - interval '36 days'
),
(
  'japanese-pitch-accent-explained',
  'Japanese Pitch Accent Explained (Simply)',
  'Japanese uses pitch, not stress. Understanding pitch accent helps you sound natural and avoid confusion.',
  $body$
  <p>English stresses syllables louder; Japanese instead raises and lowers <strong>pitch</strong>. It''s subtle but worth understanding.</p>
  <h2>What pitch accent is</h2>
  <p>Each word has a pattern of high and low pitch across its mora. For example, 橋 (bridge) and 箸 (chopsticks) are written はし but differ in pitch.</p>
  <h2>Do beginners need to master it?</h2>
  <p>No — you''ll be understood without perfect pitch. But being aware of it helps your ear and gradually improves how natural you sound.</p>
  <h2>How to improve it naturally</h2>
  <ul>
    <li>Listen closely and imitate native audio (shadowing helps).</li>
    <li>Notice the rise and fall rather than memorising rules.</li>
    <li>Use a dictionary that marks pitch when you want to check a word.</li>
  </ul>
  <p>Treat pitch accent as polish, not a prerequisite. Awareness plus imitation gets you most of the way there.</p>
  $body$,
  'Japanese Pitch Accent Explained (Simply)',
  'A simple explanation of Japanese pitch accent — how pitch (not stress) shapes words, whether beginners need it, and how to improve.',
  ARRAY['Pronunciation','Speaking','Advanced'],
  'published', now() - interval '35 days'
),
(
  'japanese-aizuchi-filler-words',
  'Aizuchi: The Japanese Habit of Active Listening',
  'Those little “うん”, “そうですね” and nods aren''t interruptions — they''re essential to natural Japanese conversation.',
  $body$
  <p><strong>Aizuchi (相槌)</strong> are the short reactions listeners give to show they''re paying attention. Using them makes you sound far more natural.</p>
  <h2>Common aizuchi</h2>
  <ul>
    <li><em>うん / はい</em> — yes / mm-hm</li>
    <li><em>そうですね</em> — that''s right / I see</li>
    <li><em>本当ですか</em> — really?</li>
    <li><em>なるほど</em> — I see / makes sense</li>
    <li><em>へえ〜</em> — wow / interesting</li>
  </ul>
  <h2>Why they matter</h2>
  <p>In Japanese, staying silent while someone talks can feel like you''re not listening. Frequent, gentle aizuchi keep the conversation flowing and friendly.</p>
  <h2>How to use them</h2>
  <p>Sprinkle them naturally as the other person speaks — a nod plus a short そうですね goes a long way. Watch native conversations and copy the timing.</p>
  <p>Master aizuchi and even simple conversations will feel warm and authentically Japanese.</p>
  $body$,
  'Aizuchi: The Japanese Habit of Active Listening',
  'What aizuchi are — the short reactions (うん, そうですね, なるほど) that show you''re listening — and how to use them naturally.',
  ARRAY['Speaking','Culture','Conversation'],
  'published', now() - interval '34 days'
),
(
  'how-to-sound-more-natural-in-japanese',
  'How to Sound More Natural in Japanese',
  'Move beyond textbook Japanese with these habits that make your speech sound real.',
  $body$
  <p>Correct Japanese and <em>natural</em> Japanese aren''t always the same. These habits close the gap.</p>
  <h2>Drop what natives drop</h2>
  <p>Japanese often omits the subject and even particles in casual speech. You don''t need to say 私は every sentence.</p>
  <h2>Use aizuchi and fillers</h2>
  <p>えーと (um), あの (well), and reactions like なるほど make you sound like a real speaker, not a textbook.</p>
  <h2>Learn set phrases</h2>
  <p>Fixed expressions — <em>お疲れさま</em>, <em>よろしく</em>, <em>助かりました</em> — do a lot of social work and sound instantly natural.</p>
  <h2>Match the register</h2>
  <p>Use polite です/ます with strangers and casual forms with friends. Mismatched politeness is a common giveaway.</p>
  <h2>Imitate real speech</h2>
  <p>Shadow native audio and copy rhythm and intonation. Sounding natural is mostly a matter of imitation and exposure.</p>
  <p>Focus on these and your Japanese will feel alive, not scripted.</p>
  $body$,
  'How to Sound More Natural in Japanese',
  'Habits that make your Japanese sound natural — dropping subjects, using fillers and aizuchi, set phrases, and matching politeness.',
  ARRAY['Speaking','Study Tips','Conversation'],
  'published', now() - interval '33 days'
),
(
  'ordering-shopping-directions-japanese',
  'Ordering, Shopping and Asking Directions in Japanese',
  'The three survival situations every traveller and new resident needs — with ready-to-use phrases.',
  $body$
  <p>Master these three everyday scenarios and you can navigate Japan confidently.</p>
  <h2>At a restaurant</h2>
  <ul>
    <li><em>メニューをお願いします</em> — menu, please.</li>
    <li><em>これをください</em> — this one, please.</li>
    <li><em>お水をください</em> — water, please.</li>
    <li><em>お会計をお願いします</em> — the bill, please.</li>
  </ul>
  <h2>Shopping</h2>
  <ul>
    <li><em>これはいくらですか</em> — how much is this?</li>
    <li><em>試着してもいいですか</em> — may I try this on?</li>
    <li><em>カードで払えますか</em> — can I pay by card?</li>
    <li><em>袋をください</em> — a bag, please.</li>
  </ul>
  <h2>Asking directions</h2>
  <ul>
    <li><em>駅はどこですか</em> — where is the station?</li>
    <li><em>まっすぐですか</em> — is it straight ahead?</li>
    <li><em>近いですか</em> — is it close?</li>
  </ul>
  <p>Keep these handy and daily errands become smooth and even enjoyable.</p>
  $body$,
  'Ordering, Shopping and Asking Directions in Japanese',
  'Ready-to-use Japanese phrases for restaurants, shopping and asking directions — everything a traveller or new resident needs.',
  ARRAY['Speaking','Travel','Phrases'],
  'published', now() - interval '32 days'
),
(
  'english-words-in-japanese-katakana',
  'English Words in Japanese: Understanding Katakana Loanwords',
  'Thousands of Japanese words come from English — but they''re pronounced the Japanese way. Here''s how to decode them.',
  $body$
  <p>Japanese has borrowed thousands of words (<strong>gairaigo</strong>), mostly written in katakana. Once you learn the sound rules, you get vocabulary almost for free.</p>
  <h2>Common examples</h2>
  <ul>
    <li>コーヒー (kōhī) — coffee</li>
    <li>テレビ (terebi) — television</li>
    <li>コンビニ (konbini) — convenience store</li>
    <li>アイス (aisu) — ice cream</li>
    <li>パソコン (pasokon) — personal computer</li>
  </ul>
  <h2>How the sounds change</h2>
  <ul>
    <li>Extra vowels get added (milk → ミルク miruku).</li>
    <li>L and R both become the ら-row (light → ライト).</li>
    <li>Long words get shortened (smartphone → スマホ sumaho).</li>
  </ul>
  <h2>A word of caution</h2>
  <p>Some loanwords have shifted meaning — マンション (manshon) means an apartment, not a mansion. So confirm rather than assume.</p>
  <p>Learn to read katakana fluently and you''ll recognise hundreds of familiar words instantly.</p>
  $body$,
  'English Words in Japanese: Understanding Katakana Loanwords',
  'How Japanese katakana loanwords (gairaigo) work — common examples, the sound-change rules, and false-friend meanings to watch.',
  ARRAY['Katakana','Vocabulary','Beginners'],
  'published', now() - interval '31 days'
)
ON CONFLICT (slug) DO NOTHING;
