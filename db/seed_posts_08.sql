-- Blog seed — Batch 8 (culture). Idempotent. Auto-applied on deploy.
INSERT INTO posts (slug, title, excerpt, body_html, meta_title, meta_description, tags, status, published_at) VALUES
(
  'japanese-etiquette-dos-and-donts',
  'Japanese Etiquette: 15 Cultural Do''s and Don''ts',
  'Small courtesies matter a lot in Japan. Here are the essentials to fit in and show respect.',
  $body$
  <p>Japanese culture values consideration for others. These simple do''s and don''ts will help you show respect anywhere.</p>
  <h2>Do</h2>
  <ul>
    <li>Bow when greeting and thanking.</li>
    <li>Remove your shoes where required (homes, some restaurants).</li>
    <li>Be quiet on trains and take calls elsewhere.</li>
    <li>Queue neatly and wait your turn.</li>
    <li>Receive business cards and gifts with both hands.</li>
    <li>Say いただきます before eating and ごちそうさま after.</li>
  </ul>
  <h2>Don''t</h2>
  <ul>
    <li>Don''t tip — it can cause confusion.</li>
    <li>Don''t eat while walking in many places.</li>
    <li>Don''t stick chopsticks upright in rice (a funeral image).</li>
    <li>Don''t blow your nose loudly in public.</li>
    <li>Don''t be loud or overly physical in greetings.</li>
  </ul>
  <p>When unsure, observe what those around you do and follow along — attentiveness itself is appreciated.</p>
  $body$,
  'Japanese Etiquette: 15 Cultural Do''s and Don''ts',
  'Essential Japanese etiquette — the cultural do''s and don''ts around bowing, shoes, trains, chopsticks, tipping and more.',
  ARRAY['Culture','Etiquette','Travel'],
  'published', now() - interval '41 days'
),
(
  'japanese-festivals-matsuri',
  'Japanese Festivals (Matsuri) Through the Year',
  'From cherry blossoms to fireworks, Japan''s festivals reveal its seasons and spirit.',
  $body$
  <p>Festivals (<strong>matsuri</strong>) are woven into Japanese life. Each season brings its own celebrations.</p>
  <h2>Spring</h2>
  <p><strong>Hanami</strong> — cherry-blossom viewing — brings people to parks for picnics under the sakura. Spring also features Golden Week holidays.</p>
  <h2>Summer</h2>
  <p>Summer is festival season: fireworks (<strong>hanabi</strong>), lantern-lit street festivals, and <strong>Obon</strong>, when families honour ancestors and dance the bon-odori.</p>
  <h2>Autumn</h2>
  <p>Autumn brings harvest festivals and <strong>momiji</strong> — viewing the red and gold maple leaves.</p>
  <h2>Winter</h2>
  <p>Illuminations light up cities, and <strong>Ōmisoka</strong> (New Year''s Eve) leads into Japan''s most important holiday, Shōgatsu.</p>
  <h2>Why learners should care</h2>
  <p>Festivals are a joyful window into culture and a great source of seasonal vocabulary — and wonderful to experience if you visit.</p>
  <p>Following the festival calendar keeps your learning connected to real Japanese life.</p>
  $body$,
  'Japanese Festivals (Matsuri) Through the Year',
  'A tour of Japan''s festivals season by season — hanami, summer fireworks and Obon, autumn leaves, winter illuminations and New Year.',
  ARRAY['Culture','Festivals','Vocabulary'],
  'published', now() - interval '40 days'
),
(
  'understanding-japanese-business-culture',
  'Understanding Japanese Business Culture',
  'If you plan to work with or in Japan, these workplace norms will help you make a great impression.',
  $body$
  <p>Japanese business culture prizes respect, harmony and attention to detail. A little awareness goes a long way.</p>
  <h2>Hierarchy and respect</h2>
  <p>Seniority matters. Use polite language (keigo) with superiors and clients, and follow the lead of senior colleagues.</p>
  <h2>Business cards (meishi)</h2>
  <p>Exchange cards with both hands, read the card you receive, and treat it respectfully — it represents the person.</p>
  <h2>Group harmony (wa)</h2>
  <p>Decisions are often made by consensus. Avoid putting people on the spot; value is placed on team harmony over individual assertiveness.</p>
  <h2>Punctuality and preparation</h2>
  <p>Being early is being on time. Thorough preparation and follow-through build trust.</p>
  <h2>Everyday phrases</h2>
  <p><em>お疲れさまです</em> (good work), <em>よろしくお願いします</em> (I look forward to working with you) and <em>失礼します</em> (excuse me) are workplace staples.</p>
  <p>Respect, humility and reliability are the foundations of doing business well in Japan.</p>
  $body$,
  'Understanding Japanese Business Culture',
  'Key norms of Japanese business culture — hierarchy and keigo, exchanging meishi, group harmony, punctuality, and workplace phrases.',
  ARRAY['Culture','Business','Careers'],
  'published', now() - interval '39 days'
),
(
  'bowing-in-japan-guide',
  'Bowing in Japan: A Simple Guide',
  'Bowing (ojigi) is central to Japanese communication. Here''s when and how to do it.',
  $body$
  <p>Bowing (<strong>お辞儀 / ojigi</strong>) expresses greeting, thanks, apology and respect. You don''t need to be perfect — sincerity matters most.</p>
  <h2>The main types</h2>
  <ul>
    <li><strong>Eshaku (~15°)</strong> — a light bow for casual greetings and passing acquaintances.</li>
    <li><strong>Keirei (~30°)</strong> — a standard respectful bow for customers and business.</li>
    <li><strong>Saikeirei (~45°)</strong> — a deep bow for sincere apology or deep gratitude.</li>
  </ul>
  <h2>How to bow well</h2>
  <ul>
    <li>Bend from the waist with a straight back.</li>
    <li>Keep hands at your sides (men) or clasped in front (women), by common convention.</li>
    <li>Pause briefly at the bottom.</li>
  </ul>
  <h2>As a learner</h2>
  <p>A small, sincere bow paired with a polite phrase (ありがとうございます, よろしくお願いします) is always appropriate. When in doubt, mirror the other person.</p>
  <p>You''ll pick up the nuances naturally by observing and participating.</p>
  $body$,
  'Bowing in Japan: A Simple Guide (Ojigi)',
  'A simple guide to bowing in Japan — the main types of ojigi (eshaku, keirei, saikeirei), how to bow well, and what learners need to know.',
  ARRAY['Culture','Etiquette','Beginners'],
  'published', now() - interval '38 days'
),
(
  'japanese-table-manners',
  'Japanese Table Manners: A Beginner''s Guide',
  'Dining etiquette that will help you eat politely anywhere in Japan.',
  $body$
  <p>Good table manners show respect for the food and your hosts. Here are the essentials.</p>
  <h2>Before and after eating</h2>
  <p>Say <em>いただきます</em> before your meal and <em>ごちそうさまでした</em> after — gratitude for the food.</p>
  <h2>Chopstick etiquette</h2>
  <ul>
    <li>Never stick chopsticks upright in rice.</li>
    <li>Don''t pass food chopstick-to-chopstick.</li>
    <li>Use the opposite ends or a serving utensil for shared dishes.</li>
    <li>Rest chopsticks on the holder, not across the bowl.</li>
  </ul>
  <h2>Eating norms</h2>
  <ul>
    <li>Slurping noodles is fine — even a compliment.</li>
    <li>Lift small rice and soup bowls toward your mouth.</li>
    <li>Try not to leave rice behind.</li>
    <li>Pour drinks for others, not just yourself.</li>
  </ul>
  <p>Follow these and you''ll dine comfortably and respectfully at any Japanese table.</p>
  $body$,
  'Japanese Table Manners: A Beginner''s Guide',
  'Japanese dining etiquette — itadakimasu, chopstick do''s and don''ts, slurping noodles, holding bowls, and pouring for others.',
  ARRAY['Culture','Etiquette','Food'],
  'published', now() - interval '37 days'
),
(
  'gift-giving-culture-in-japan',
  'Gift-Giving Culture in Japan',
  'Gifts play a big social role in Japan. Here''s what to know so your gesture lands well.',
  $body$
  <p>Gift-giving (<strong>贈り物</strong>) is an important way to show gratitude and maintain relationships in Japan.</p>
  <h2>Key occasions</h2>
  <ul>
    <li><strong>Omiyage</strong> — souvenirs brought back from trips for colleagues and friends.</li>
    <li><strong>Ochūgen / oseibo</strong> — mid-year and year-end gifts to show appreciation.</li>
    <li><strong>Temiyage</strong> — a small gift when visiting someone''s home.</li>
  </ul>
  <h2>Etiquette</h2>
  <ul>
    <li>Presentation matters — nicely wrapped gifts are the norm.</li>
    <li>Offer and receive gifts with both hands.</li>
    <li>It''s polite to modestly downplay your gift when giving it.</li>
    <li>The recipient may not open it immediately — that''s normal.</li>
  </ul>
  <h2>What to avoid</h2>
  <p>Avoid sets of four (四 sounds like “death”) and overly extravagant gifts that could feel like pressure.</p>
  <p>A thoughtful, well-presented small gift is always appreciated.</p>
  $body$,
  'Gift-Giving Culture in Japan',
  'Understand Japanese gift-giving — omiyage, ochugen/oseibo, temiyage, presentation and etiquette, and what to avoid.',
  ARRAY['Culture','Etiquette'],
  'published', now() - interval '36 days'
),
(
  'japanese-honorifics-san-kun-chan-sama',
  'Japanese Honorifics: San, Kun, Chan and Sama Explained',
  'Those name suffixes carry real meaning. Here''s how to use them correctly.',
  $body$
  <p>Japanese adds <strong>honorific suffixes</strong> to names to signal respect and relationship. Using them right makes you sound natural and polite.</p>
  <h2>The main honorifics</h2>
  <ul>
    <li><strong>〜さん (san)</strong> — the safe, polite default for almost anyone (Mr./Ms.).</li>
    <li><strong>〜さま (sama)</strong> — very respectful, used for customers and in formal writing.</li>
    <li><strong>〜くん (kun)</strong> — for younger males, juniors, or close male friends.</li>
    <li><strong>〜ちゃん (chan)</strong> — affectionate, for children, close friends, or cute nicknames.</li>
    <li><strong>〜先生 (sensei)</strong> — for teachers, doctors and other experts.</li>
  </ul>
  <h2>Important rules</h2>
  <ul>
    <li><strong>Never</strong> add an honorific to your own name.</li>
    <li>Use さん until you''re invited to be more casual.</li>
    <li>Use family/first names less than in English — surnames + さん are standard.</li>
  </ul>
  <p>Default to さん and you''ll almost always be polite and correct.</p>
  $body$,
  'Japanese Honorifics: San, Kun, Chan and Sama Explained',
  'How to use Japanese name honorifics — san, sama, kun, chan and sensei — what each signals, and the key rules for using them.',
  ARRAY['Culture','Speaking','Beginners'],
  'published', now() - interval '35 days'
),
(
  'japanese-holidays-explained',
  'Japanese Holidays and What They Mean',
  'A guide to Japan''s public holidays — great for cultural context and vocabulary.',
  $body$
  <p>Japan has many public holidays, each reflecting its history, seasons or values.</p>
  <h2>Major holidays</h2>
  <ul>
    <li><strong>New Year (お正月)</strong> — the most important holiday; family, shrine visits and special food.</li>
    <li><strong>Golden Week (late April–early May)</strong> — a cluster of holidays and a big travel season.</li>
    <li><strong>Obon (mid-August)</strong> — honouring ancestors; many return to their hometowns.</li>
    <li><strong>Coming of Age Day</strong> — celebrating those turning 20.</li>
    <li><strong>Culture Day &amp; Labour Thanksgiving</strong> — autumn observances.</li>
  </ul>
  <h2>Seasonal observances</h2>
  <p>Beyond official holidays, events like Setsubun, Tanabata and Shichi-Go-San mark the year with rich traditions.</p>
  <h2>Why it helps learners</h2>
  <p>Knowing the holidays gives you conversation topics, seasonal vocabulary and insight into what matters in Japanese life.</p>
  <p>Follow the calendar and your cultural understanding deepens month by month.</p>
  $body$,
  'Japanese Holidays and What They Mean',
  'A guide to Japan''s public holidays — New Year, Golden Week, Obon, Coming of Age Day and more — with cultural context for learners.',
  ARRAY['Culture','Holidays','Vocabulary'],
  'published', now() - interval '34 days'
),
(
  'japanese-onomatopoeia-explained',
  'Onomatopoeia in Japanese (擬音語・擬態語)',
  'Japanese is packed with sound-and-feeling words. Learning them makes your speech vivid and natural.',
  $body$
  <p>Japanese uses an enormous number of <strong>onomatopoeia</strong> — words that mimic sounds or describe states. They appear constantly in daily speech, manga and advertising.</p>
  <h2>Two main types</h2>
  <ul>
    <li><strong>Giongo (擬音語)</strong> — imitate real sounds: ワンワン (dog bark), ザーザー (heavy rain).</li>
    <li><strong>Gitaigo (擬態語)</strong> — describe states or feelings: ドキドキ (heart pounding), ぺこぺこ (hungry), キラキラ (sparkling).</li>
  </ul>
  <h2>Everyday examples</h2>
  <ul>
    <li><em>お腹がぺこぺこ</em> — I''m starving.</li>
    <li><em>ドキドキする</em> — my heart is racing (nervous/excited).</li>
    <li><em>ぐっすり寝た</em> — I slept soundly.</li>
  </ul>
  <h2>Why learn them</h2>
  <p>These words carry nuance that''s hard to express otherwise, and using a few makes you sound genuinely fluent and expressive.</p>
  <p>Pick up a handful from real content and sprinkle them into your speech.</p>
  $body$,
  'Onomatopoeia in Japanese (擬音語・擬態語)',
  'A guide to Japanese onomatopoeia — giongo (sounds) and gitaigo (states) like ドキドキ and ぺこぺこ — with everyday examples.',
  ARRAY['Vocabulary','Culture','Speaking'],
  'published', now() - interval '33 days'
),
(
  'japanese-new-year-oshogatsu',
  'Japanese New Year (お正月) Traditions',
  'New Year is Japan''s most important holiday. Here are the customs and the vocabulary that come with it.',
  $body$
  <p><strong>お正月 (Oshōgatsu)</strong> is the heart of the Japanese year — a time for family, reflection and fresh starts.</p>
  <h2>Key customs</h2>
  <ul>
    <li><strong>Hatsumōde</strong> — the first shrine or temple visit of the year to pray for good fortune.</li>
    <li><strong>Osechi ryōri</strong> — beautiful boxed foods, each dish symbolising a wish (health, prosperity).</li>
    <li><strong>Otoshidama</strong> — money gifts given to children.</li>
    <li><strong>Nengajō</strong> — New Year postcards sent to friends and colleagues.</li>
  </ul>
  <h2>Greetings</h2>
  <ul>
    <li>Before the year ends: <em>よいお年を</em> — have a good New Year.</li>
    <li>After it begins: <em>あけましておめでとうございます</em> — Happy New Year.</li>
  </ul>
  <h2>The mood</h2>
  <p>Unlike the party atmosphere elsewhere, Japanese New Year is calm and family-centred, focused on gratitude and hope for the year ahead.</p>
  <p>Learn the greetings and customs and you''ll appreciate this special season all the more.</p>
  $body$,
  'Japanese New Year (お正月) Traditions',
  'Japanese New Year customs — hatsumode, osechi, otoshidama and nengajo — plus the essential New Year greetings.',
  ARRAY['Culture','Festivals','Vocabulary'],
  'published', now() - interval '32 days'
)
ON CONFLICT (slug) DO NOTHING;
