-- Blog seed — Batch 3 (vocabulary). Idempotent. Auto-applied on deploy.
INSERT INTO posts (slug, title, excerpt, body_html, meta_title, meta_description, tags, status, published_at) VALUES
(
  'japanese-numbers-1-to-100',
  'Japanese Numbers 1 to 100 (and How Counting Works)',
  'Learn to count in Japanese — the numbers 1–10, how to build up to 100, and the pronunciation traps to watch for.',
  $body$
  <p>Numbers are one of the first things worth memorising — they appear in prices, times, dates and phone numbers every day.</p>
  <h2>1 to 10</h2>
  <p>一 (ichi), 二 (ni), 三 (san), 四 (shi/yon), 五 (go), 六 (roku), 七 (shichi/nana), 八 (hachi), 九 (kyū/ku), 十 (jū).</p>
  <h2>Building bigger numbers</h2>
  <p>Japanese counting is wonderfully logical. 11 is 十一 (jū-ichi, “ten-one”), 20 is 二十 (ni-jū, “two-ten”), 25 is 二十五 (ni-jū-go). 100 is 百 (hyaku).</p>
  <h2>Watch the sound changes</h2>
  <ul>
    <li>300 is <strong>sanbyaku</strong>, 600 is <strong>roppyaku</strong>, 800 is <strong>happyaku</strong> — the sounds shift.</li>
    <li>4, 7 and 9 have two readings; which one is used depends on context and counters.</li>
  </ul>
  <h2>Practice tip</h2>
  <p>Say prices and times out loud in Japanese as you go about your day. Numbers become automatic surprisingly quickly with daily use.</p>
  $body$,
  'Japanese Numbers 1 to 100 — Counting Made Simple',
  'Learn Japanese numbers 1–100: the core digits, how to build larger numbers, and the pronunciation changes to watch for.',
  ARRAY['Vocabulary','Numbers','JLPT N5'],
  'published', now() - interval '10 days'
),
(
  'japanese-counters-explained',
  'Japanese Counters Explained (つ, 個, 人, 枚 and more)',
  'Japanese uses different counter words depending on what you''re counting. Here''s how the main counters work.',
  $body$
  <p>In Japanese you can''t just say “three” — you add a <strong>counter</strong> that matches the object. It feels odd at first, then becomes natural.</p>
  <h2>The most useful counters</h2>
  <ul>
    <li><strong>〜つ</strong> — general things (ひとつ, ふたつ, みっつ…). The safe fallback for many objects.</li>
    <li><strong>〜個 (ko)</strong> — small round objects (apples, eggs).</li>
    <li><strong>〜人 (nin)</strong> — people (though 1 and 2 are irregular: ひとり, ふたり).</li>
    <li><strong>〜枚 (mai)</strong> — flat things (paper, tickets, shirts).</li>
    <li><strong>〜本 (hon)</strong> — long thin things (pens, bottles). Sounds shift: いっぽん, さんぼん.</li>
    <li><strong>〜台 (dai)</strong> — machines and vehicles.</li>
    <li><strong>〜匹 (hiki)</strong> — small animals.</li>
  </ul>
  <h2>How to start</h2>
  <p>Beginners can lean on the general 〜つ counter for many objects while learning the specific ones. Learn 人, 枚, 本 and 個 first — they cover most everyday situations.</p>
  <p>Exposure is key: notice which counter native speakers use and copy it.</p>
  $body$,
  'Japanese Counters Explained (つ, 個, 人, 枚 and more)',
  'A beginner''s guide to Japanese counter words — つ, 個, 人, 枚, 本 and more — with the sound changes and irregulars.',
  ARRAY['Vocabulary','Counters','JLPT N5'],
  'published', now() - interval '9 days'
),
(
  'days-of-week-months-japanese',
  'Days of the Week and Months in Japanese',
  'Learn the days, months and how to say dates in Japanese — with the logic that makes them easy to remember.',
  $body$
  <p>Days and months follow neat patterns once you learn the elements behind them.</p>
  <h2>Days of the week</h2>
  <p>Each day pairs an element with 曜日 (yōbi):</p>
  <ul>
    <li>月曜日 (getsu) — Monday (moon)</li>
    <li>火曜日 (ka) — Tuesday (fire)</li>
    <li>水曜日 (sui) — Wednesday (water)</li>
    <li>木曜日 (moku) — Thursday (wood)</li>
    <li>金曜日 (kin) — Friday (gold)</li>
    <li>土曜日 (do) — Saturday (earth)</li>
    <li>日曜日 (nichi) — Sunday (sun)</li>
  </ul>
  <h2>Months</h2>
  <p>Months are simply number + 月 (gatsu): 一月 (January), 二月 (February)… 十二月 (December). Watch the irregulars: April is 四月 (<strong>shi</strong>gatsu), July is 七月 (<strong>shichi</strong>gatsu), September is 九月 (<strong>ku</strong>gatsu).</p>
  <h2>Dates</h2>
  <p>Days of the month 1–10 (and a few others) have special readings — 一日 (tsuitachi), 二日 (futsuka), 三日 (mikka). These are worth memorising as a set.</p>
  <p>Once the pattern clicks, you can say any day, month and date with confidence.</p>
  $body$,
  'Days of the Week and Months in Japanese',
  'Learn the days of the week, months and dates in Japanese — with the elemental logic and irregular readings to remember.',
  ARRAY['Vocabulary','JLPT N5','Beginners'],
  'published', now() - interval '8 days'
),
(
  'telling-time-in-japanese',
  'Telling Time in Japanese',
  'How to say hours, minutes and everyday time expressions in Japanese.',
  $body$
  <p>Telling time combines numbers with two words: 時 (ji, o''clock) and 分 (fun/pun, minutes).</p>
  <h2>Hours</h2>
  <p>Number + 時: 1時 (ichi-ji), 3時 (san-ji), 9時 (ku-ji). Note 4時 is <strong>yo</strong>-ji and 7時 is <strong>shichi</strong>-ji.</p>
  <h2>Minutes</h2>
  <p>Number + 分, with sound changes: 1分 (ippun), 3分 (sanpun), 4分 (yonpun), 6分 (roppun), 10分 (juppun). So 3:15 is 三時十五分 (san-ji jū-go-fun).</p>
  <h2>Useful time words</h2>
  <ul>
    <li>午前 (gozen) — a.m. · 午後 (gogo) — p.m.</li>
    <li>半 (han) — half past (2時半 = 2:30)</li>
    <li>今 (ima) — now · 何時 (nanji) — what time?</li>
  </ul>
  <h2>Example</h2>
  <p><em>今何時ですか。</em> (What time is it now?) → <em>午後3時半です。</em> (It''s 3:30 p.m.)</p>
  <p>Practise reading clocks aloud in Japanese and time expressions quickly stick.</p>
  $body$,
  'Telling Time in Japanese — Hours, Minutes and Phrases',
  'Learn to tell time in Japanese: hours with 時, minutes with 分 (and their sound changes), plus everyday time expressions.',
  ARRAY['Vocabulary','JLPT N5','Beginners'],
  'published', now() - interval '7 days'
),
(
  'japanese-family-words',
  'Japanese Family Words (家族) — Your Family vs Others',
  'Japanese has two sets of family words: humble ones for your own family and polite ones for others''.',
  $body$
  <p>Family vocabulary in Japanese has a twist: you use different words for <em>your own</em> family versus <em>someone else''s</em>.</p>
  <h2>Talking about your own family (humble)</h2>
  <ul>
    <li>父 (chichi) — my father · 母 (haha) — my mother</li>
    <li>兄 (ani) — my older brother · 姉 (ane) — my older sister</li>
    <li>弟 (otōto) — younger brother · 妹 (imōto) — younger sister</li>
  </ul>
  <h2>Talking about someone else''s family (polite)</h2>
  <ul>
    <li>お父さん (otōsan) — (your) father · お母さん (okāsan) — mother</li>
    <li>お兄さん (onīsan) — older brother · お姉さん (onēsan) — older sister</li>
    <li>弟さん / 妹さん — younger siblings</li>
  </ul>
  <h2>Why two sets?</h2>
  <p>It reflects Japanese humility — you lower your own family and elevate others''. Children also address their own parents as お父さん/お母さん directly.</p>
  <p>Learn both columns together and you''ll navigate family conversations politely.</p>
  $body$,
  'Japanese Family Words (家族) — Your Family vs Others',
  'Learn Japanese family vocabulary — the humble words for your own family and the polite words for others'', with examples.',
  ARRAY['Vocabulary','Culture','JLPT N5'],
  'published', now() - interval '6 days'
),
(
  'japanese-food-restaurant-vocabulary',
  'Essential Japanese Food & Restaurant Vocabulary',
  'Order confidently in Japan — key food words and the phrases you''ll use in any restaurant.',
  $body$
  <p>Few things make travel more fun than ordering food in Japanese. Here are the essentials.</p>
  <h2>Common foods</h2>
  <p>ご飯 (gohan, rice/meal), 寿司 (sushi), ラーメン (rāmen), 肉 (niku, meat), 魚 (sakana, fish), 野菜 (yasai, vegetables), 水 (mizu, water), お茶 (ocha, tea).</p>
  <h2>Restaurant phrases</h2>
  <ul>
    <li><em>メニューをください</em> — the menu, please.</li>
    <li><em>これをください</em> — I''ll have this, please.</li>
    <li><em>おすすめは何ですか</em> — what do you recommend?</li>
    <li><em>お会計をお願いします</em> — the bill, please.</li>
    <li><em>いただきます / ごちそうさまでした</em> — said before and after eating.</li>
  </ul>
  <h2>Good to know</h2>
  <p>Tipping is not customary in Japan. Many restaurants have ticket machines or picture menus, making ordering easy even for beginners.</p>
  <p>Learn ten food words and five phrases and you''ll eat well anywhere in Japan.</p>
  $body$,
  'Essential Japanese Food & Restaurant Vocabulary',
  'Key Japanese food words and restaurant phrases — how to order, ask for recommendations, and pay, plus dining etiquette.',
  ARRAY['Vocabulary','Travel','Culture'],
  'published', now() - interval '5 days'
),
(
  'japanese-colors-vocabulary',
  'Colors in Japanese — Vocabulary and a Grammar Quirk',
  'Learn Japanese colors, and the interesting reason some behave like adjectives and others like nouns.',
  $body$
  <p>Colours are easy vocabulary — with one fun grammar quirk worth knowing.</p>
  <h2>Basic colors</h2>
  <ul>
    <li>赤 (aka) — red · 青 (ao) — blue · 黄色 (kiiro) — yellow</li>
    <li>緑 (midori) — green · 黒 (kuro) — black · 白 (shiro) — white</li>
    <li>茶色 (chairo) — brown · 紫 (murasaki) — purple · ピンク (pinku) — pink</li>
  </ul>
  <h2>The adjective quirk</h2>
  <p>A few colours are true <strong>い-adjectives</strong>: 赤い (red), 青い (blue), 黄色い (yellow), 黒い (black), 白い (white). Others (green, brown, purple) are nouns and need な or の to describe things: 緑の車 (a green car).</p>
  <h2>Examples</h2>
  <p><em>赤いりんご</em> (a red apple — adjective) vs <em>紫の花</em> (a purple flower — noun + の).</p>
  <p>Learn which colours are adjectives and which are nouns, and you''ll describe anything accurately.</p>
  $body$,
  'Colors in Japanese — Vocabulary and Grammar',
  'Learn Japanese colours and the grammar quirk that makes some (赤い, 青い) adjectives and others (緑, 紫) nouns.',
  ARRAY['Vocabulary','Grammar','JLPT N5'],
  'published', now() - interval '4 days'
),
(
  'japanese-greetings-essential-phrases',
  'Japanese Greetings: 20 Essential Phrases',
  'The everyday greetings and polite expressions that make a great first impression in Japanese.',
  $body$
  <p>Greetings are the fastest way to sound friendly and respectful. Master these and you can navigate most social situations.</p>
  <h2>Everyday greetings</h2>
  <ul>
    <li>おはようございます — good morning</li>
    <li>こんにちは — hello / good afternoon</li>
    <li>こんばんは — good evening</li>
    <li>おやすみなさい — good night</li>
    <li>さようなら — goodbye · またね — see you</li>
  </ul>
  <h2>Politeness essentials</h2>
  <ul>
    <li>ありがとうございます — thank you</li>
    <li>すみません — excuse me / sorry</li>
    <li>お願いします — please</li>
    <li>はじめまして — nice to meet you</li>
    <li>よろしくお願いします — please treat me well (said on meeting)</li>
  </ul>
  <h2>Handy daily phrases</h2>
  <ul>
    <li>いってきます / いってらっしゃい — leaving / see you off</li>
    <li>ただいま / おかえりなさい — I''m home / welcome back</li>
    <li>いただきます / ごちそうさま — before / after eating</li>
    <li>お疲れさまです — good work (a workplace staple)</li>
  </ul>
  <p>Use these naturally and Japanese speakers will warm to you instantly.</p>
  $body$,
  'Japanese Greetings: 20 Essential Everyday Phrases',
  'Twenty essential Japanese greetings and polite phrases — from おはようございます to よろしくお願いします — for daily life.',
  ARRAY['Vocabulary','Speaking','Beginners'],
  'published', now() - interval '3 days'
),
(
  'japanese-weather-seasons-vocabulary',
  'Japanese Weather & Seasons Vocabulary',
  'Talk about the weather and Japan''s four seasons — small talk that''s useful every single day.',
  $body$
  <p>Weather is universal small talk. These words let you chat naturally about the day and the seasons.</p>
  <h2>The four seasons</h2>
  <p>春 (haru, spring), 夏 (natsu, summer), 秋 (aki, autumn), 冬 (fuyu, winter). Japan takes its seasons seriously — each has its own foods, festivals and phrases.</p>
  <h2>Weather words</h2>
  <ul>
    <li>晴れ (hare) — sunny · 曇り (kumori) — cloudy</li>
    <li>雨 (ame) — rain · 雪 (yuki) — snow · 風 (kaze) — wind</li>
    <li>暑い (atsui) — hot · 寒い (samui) — cold · 暖かい (atatakai) — warm · 涼しい (suzushii) — cool</li>
  </ul>
  <h2>Useful phrases</h2>
  <ul>
    <li><em>今日はいい天気ですね。</em> — nice weather today, isn''t it?</li>
    <li><em>暑いですね。</em> — it''s hot, isn''t it?</li>
    <li><em>雨が降っています。</em> — it''s raining.</li>
  </ul>
  <p>Weather talk is the perfect low-pressure way to start conversations in Japanese.</p>
  $body$,
  'Japanese Weather & Seasons Vocabulary',
  'Learn Japanese weather and seasons vocabulary — 春夏秋冬, sunny/rainy/cold words, and natural small-talk phrases.',
  ARRAY['Vocabulary','Speaking','Culture'],
  'published', now() - interval '2 days'
),
(
  '50-must-know-japanese-verbs',
  '50 Must-Know Japanese Verbs for Beginners',
  'The everyday verbs that appear constantly in JLPT N5–N4 and daily conversation.',
  $body$
  <p>A handful of verbs power most everyday sentences. Learn these and you''ll express a huge range of ideas.</p>
  <h2>Daily actions</h2>
  <p>行く (go), 来る (come), 帰る (return), 食べる (eat), 飲む (drink), 見る (see/watch), 聞く (listen/ask), 話す (speak), 読む (read), 書く (write).</p>
  <h2>Around the home</h2>
  <p>起きる (wake up), 寝る (sleep), 作る (make), 買う (buy), 使う (use), 洗う (wash), 開ける (open), 閉める (close), 立つ (stand), 座る (sit).</p>
  <h2>Study & work</h2>
  <p>勉強する (study), 働く (work), 教える (teach), 習う (learn), 覚える (memorise), 忘れる (forget), 分かる (understand), 知る (know), 考える (think), 待つ (wait).</p>
  <h2>Social & feelings</h2>
  <p>会う (meet), 遊ぶ (play/hang out), 手伝う (help), 借りる (borrow), 貸す (lend), 好き (like — na-adj), 欲しい (want — adj), 泣く (cry), 笑う (laugh), 頑張る (do one''s best).</p>
  <h2>How to learn them</h2>
  <p>Study each verb with its group (う/る/irregular) and an example sentence, then drill the te-form and past tense. These 50 verbs will carry you through countless conversations.</p>
  $body$,
  '50 Must-Know Japanese Verbs for Beginners',
  'The 50 most useful Japanese verbs for beginners and JLPT N5–N4 — daily actions, home, study and social verbs, with readings.',
  ARRAY['Vocabulary','Verbs','JLPT N5'],
  'published', now() - interval '1 days'
)
ON CONFLICT (slug) DO NOTHING;
