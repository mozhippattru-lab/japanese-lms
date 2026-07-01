(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,88155,e=>{"use strict";var a=e.i(43476),i=e.i(71645),r=e.i(22016),l=e.i(93583),n=e.i(63676),s=e.i(56420);let t=(0,s.default)("arrow-right",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]),o=(0,s.default)("arrow-up-right",[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]]);var p=e.i(89664),c=e.i(75387),d=e.i(96315),x=e.i(20865),h=e.i(51757),m=e.i(99847);let g=(0,s.default)("volume-2",[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["path",{d:"M16 9a5 5 0 0 1 0 6",key:"1q6k2b"}],["path",{d:"M19.364 18.364a9 9 0 0 0 0-12.728",key:"ijwkga"}]]),f=(0,s.default)("volume-x",[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["line",{x1:"22",x2:"16",y1:"9",y2:"15",key:"1ewh16"}],["line",{x1:"16",x2:"22",y1:"9",y2:"15",key:"5ykzw1"}]]),u=[{tamil:"அ",kana:"あ",romaji:"a",note:"short a"},{tamil:"ஆ",kana:"ああ",romaji:"ā",note:"long a"},{tamil:"இ",kana:"い",romaji:"i",note:"short i"},{tamil:"ஈ",kana:"いい",romaji:"ī",note:"long i"},{tamil:"உ",kana:"う",romaji:"u",note:"short u"},{tamil:"ஊ",kana:"うう",romaji:"ū",note:"long u"},{tamil:"எ",kana:"え",romaji:"e",note:"short e"},{tamil:"ஏ",kana:"ええ",romaji:"ē",note:"long e"},{tamil:"ஐ",kana:"あい",romaji:"ai",note:"diphthong"},{tamil:"ஒ",kana:"お",romaji:"o",note:"short o"},{tamil:"ஓ",kana:"おお",romaji:"ō",note:"long o"},{tamil:"ஔ",kana:"あう",romaji:"au",note:"diphthong"}],b=[0,2,4,7,9];function v(){let[e,r]=(0,i.useState)(0),[l,n]=(0,i.useState)(!1),[s,t]=(0,i.useState)(!1),o=(0,i.useRef)(null),p=(0,i.useRef)(!1);p.current=s;let c=(0,i.useRef)(!0);function d(e){let a=o.current;if(!a)return;let i=a.currentTime,r=233.08*Math.pow(2,(b[e%b.length]+12*Math.floor(e/b.length))/12),l=a.createGain();l.gain.value=1;let n=a.createBiquadFilter();for(let[e,s,t]of(n.type="lowpass",n.frequency.value=5e3,n.connect(l),l.connect(a.destination),[[1,.34,1.9],[2,.14,1.1],[3,.05,.6]])){let l=a.createOscillator();l.type="sine",l.frequency.value=r*e;let o=a.createGain();o.gain.setValueAtTime(1e-4,i),o.gain.exponentialRampToValueAtTime(s,i+.018),o.gain.exponentialRampToValueAtTime(1e-4,i+t),l.connect(o),o.connect(n),l.start(i),l.stop(i+t+.1)}}async function x(){if(s)t(!1);else{try{o.current||(o.current=new(window.AudioContext||window.webkitAudioContext)),await o.current.resume(),d(e)}catch{}t(!0)}}(0,i.useEffect)(()=>{if(l)return;let e=setInterval(()=>r(e=>(e+1)%u.length),1600);return()=>clearInterval(e)},[l]),(0,i.useEffect)(()=>{if(c.current){c.current=!1;return}p.current&&d(e)},[e]);let h=u[e],m=30*e;return(0,a.jsxs)("div",{className:"kc-wrap",onMouseEnter:()=>n(!0),onMouseLeave:()=>n(!1),children:[(0,a.jsxs)("div",{className:"kc-face",role:"img","aria-label":`Tamil vowel ${h.tamil} maps to Japanese ${h.kana} (${h.romaji})`,children:[(0,a.jsx)("div",{className:"kc-ring"}),u.map((i,l)=>(0,a.jsx)("button",{className:`kc-mark ${l===e?"on":""}`,style:{transform:`rotate(${30*l}deg) translateY(calc(var(--kc-r) * -1)) rotate(${-(30*l)}deg)`},onClick:()=>{r(l),n(!0),p.current&&d(l)},"aria-label":`${i.tamil} — ${i.romaji}`,children:i.tamil},i.tamil)),(0,a.jsxs)("div",{className:"kc-hand",style:{transform:`rotate(${m}deg)`},children:[(0,a.jsx)("span",{className:"kc-hand-line"}),(0,a.jsx)("span",{className:"kc-hand-dot"})]}),(0,a.jsx)("div",{className:"kc-stage",children:(0,a.jsxs)("div",{className:"kc-card",children:[(0,a.jsx)("div",{className:"kc-kana",children:h.kana}),(0,a.jsx)("div",{className:"kc-bridge",children:(0,a.jsx)("span",{className:"kc-romaji",children:h.romaji})}),(0,a.jsx)("div",{className:"kc-tamil",children:h.tamil})]},e)})]}),(0,a.jsxs)("div",{className:"kc-footer",children:[(0,a.jsxs)("p",{className:"kc-caption",children:[(0,a.jsx)("span",{children:"தமிழ் உயிர் எழுத்துக்கள்"})," ↔ ",(0,a.jsx)("span",{children:"日本語の母音"})]}),(0,a.jsxs)("button",{className:`kc-sound ${s?"on":""}`,onClick:x,"aria-pressed":s,"aria-label":s?"Turn tick sound off":"Turn tick sound on",children:[s?(0,a.jsx)(g,{size:15}):(0,a.jsx)(f,{size:15}),s?"Sound on":"Play sound"]})]})]})}let j="மொழிப்பற்று",k="Mozhippattru",y=[{level:"N5",jp:"初級",color:"#2f9e63",title:"Beginner Foundation",ta:"தொடக்கம்",price:8e3,hours:"150 hours",blurb:"Your first step. We build the script, the sound and the everyday phrases until reading kana feels natural.",points:["Hiragana & Katakana mastery","~100 kanji · ~800 words","Self-introduction & daily talk","Reading simple sentences"]},{level:"N4",jp:"初中級",color:"#2d6fb8",title:"Elementary",ta:"அடிப்படை",price:1e4,hours:"180 hours",blurb:"Words become conversations. You start handling everyday situations and reading written Japanese with ease.",points:["~300 kanji · ~1,500 words","Everyday conversation & polite forms","Reading familiar topics","Listening to natural speech"]},{level:"N3",jp:"中級",color:"#c98a2b",title:"Intermediate Bridge",ta:"இடைநிலை",price:15e3,hours:"200 hours",blurb:"The bridge to advanced Japanese — study, work and life in Japan move within reach.",points:["~650 kanji · ~3,750 words","Near-natural speed comprehension","Newspapers & notices","Expressing opinions & ideas"]}],w=["Basic speaking & listening","Hiragana reading & writing","Fun vocabulary & greetings","Interactive activities & games"],N=e=>"₹"+e.toLocaleString("en-IN");function z({children:e,ta:i,jp:r,light:l}){return(0,a.jsxs)("div",{className:`lp-tag ${l?"lp-tag-light":""}`,children:[i&&(0,a.jsx)("span",{className:"lp-tag-ta",children:i}),(0,a.jsx)("span",{className:"lp-tag-main",children:e}),r&&(0,a.jsx)("span",{className:"lp-tag-jp",children:r})]})}function C({n:e,t:i,d:r}){return(0,a.jsxs)("li",{className:"lp-why-item",children:[(0,a.jsx)("span",{className:"lp-why-num",children:e}),(0,a.jsxs)("div",{children:[(0,a.jsx)("h3",{className:"lp-why-title",children:i}),(0,a.jsx)("p",{className:"lp-why-desc",children:r})]})]})}function S(){return(0,a.jsxs)("div",{className:"lp-kids-card",children:[(0,a.jsx)("div",{className:"lp-kids-badge",children:"⭐ Special Course · குழந்தைகளுக்கான பாடநெறி"}),(0,a.jsxs)("div",{className:"lp-kids-inner",children:[(0,a.jsxs)("div",{className:"lp-kids-left",children:[(0,a.jsx)("div",{className:"lp-kids-emoji",children:"🎌"}),(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{className:"lp-kids-jp",children:"子ども向け · 초급"}),(0,a.jsx)("h3",{className:"lp-kids-title",children:"Japanese Basics for Kids"}),(0,a.jsx)("div",{className:"lp-kids-meta",children:"40 Hours · Ages 6–15 · Beginner Friendly"}),(0,a.jsx)("div",{className:"lp-kids-price-tag",children:N(3e3)})]})]}),(0,a.jsxs)("div",{className:"lp-kids-desc",children:[(0,a.jsx)("p",{children:"A beginner-friendly Japanese language course specially designed for school children. The course focuses on basic Japanese speaking, listening, reading, writing, vocabulary, greetings, and fun interactive activities."}),(0,a.jsx)("ul",{className:"lp-kids-points",children:w.map(e=>(0,a.jsxs)("li",{children:[(0,a.jsx)(p.Check,{size:14})," ",e]},e))})]}),(0,a.jsxs)("div",{className:"lp-kids-cta",children:[(0,a.jsxs)("a",{href:"#demo",className:"lp-btn lp-btn-primary",children:["Enquire now ",(0,a.jsx)(t,{size:16})]}),(0,a.jsx)("div",{className:"lp-kids-note",children:"Limited seats · Online & in-class"})]})]})]})}function T(){let[e,r]=(0,i.useState)({full_name:"",phone:"",email:"",level:"N5",mode:"Online",preferred:"",message:""}),[l,n]=(0,i.useState)("idle"),[s,o]=(0,i.useState)(""),p=(e,a)=>r(i=>({...i,[e]:a}));async function c(a){a.preventDefault(),n("loading"),o("");try{let a=await fetch("/api/demo-request",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),i=await a.json();if(!a.ok){o(i.error||"Something went wrong"),n("error");return}n("done")}catch{o("Network error. Please try again."),n("error")}}return"done"===l?(0,a.jsxs)("div",{className:"lp-form lp-form-done",children:[(0,a.jsx)("div",{className:"lp-done-icon",children:(0,a.jsx)(h.CheckCircle2,{size:38})}),(0,a.jsxs)("h3",{children:["ありがとう, ",e.full_name.split(" ")[0]||"there","!"]}),(0,a.jsxs)("p",{children:["Your free demo request is in. We'll call you on ",(0,a.jsx)("strong",{children:e.phone})," soon to set up your online demo class."]}),(0,a.jsx)("p",{className:"lp-done-jp",children:"またね — see you in class."})]}):(0,a.jsxs)("form",{className:"lp-form",onSubmit:c,children:[(0,a.jsx)("h3",{className:"lp-form-title",children:"Book your free demo"}),"error"===l&&(0,a.jsxs)("div",{className:"lp-form-error",children:[(0,a.jsx)(m.AlertCircle,{size:16})," ",s]}),(0,a.jsx)("label",{className:"lp-label",children:"Full name *"}),(0,a.jsx)("input",{className:"lp-input",required:!0,value:e.full_name,onChange:e=>p("full_name",e.target.value),placeholder:"Your name"}),(0,a.jsxs)("div",{className:"lp-form-row",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"lp-label",children:"Phone *"}),(0,a.jsx)("input",{className:"lp-input",required:!0,type:"tel",value:e.phone,onChange:e=>p("phone",e.target.value),placeholder:"Mobile number"})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"lp-label",children:"Email"}),(0,a.jsx)("input",{className:"lp-input",type:"email",value:e.email,onChange:e=>p("email",e.target.value),placeholder:"you@example.com"})]})]}),(0,a.jsxs)("div",{className:"lp-form-row",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"lp-label",children:"Interested level"}),(0,a.jsxs)("select",{className:"lp-input",value:e.level,onChange:e=>p("level",e.target.value),children:[(0,a.jsx)("option",{value:"N5",children:"JLPT N5 — Beginner"}),(0,a.jsx)("option",{value:"N4",children:"JLPT N4 — Elementary"}),(0,a.jsx)("option",{value:"N3",children:"JLPT N3 — Intermediate"}),(0,a.jsx)("option",{value:"Package",children:"Complete package (N5+N4+N3)"})]})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"lp-label",children:"Mode"}),(0,a.jsxs)("select",{className:"lp-input",value:e.mode,onChange:e=>p("mode",e.target.value),children:[(0,a.jsx)("option",{value:"Online",children:"Online"}),(0,a.jsx)("option",{value:"In-Class",children:"In-class"})]})]})]}),(0,a.jsx)("label",{className:"lp-label",children:"Preferred timing"}),(0,a.jsx)("input",{className:"lp-input",value:e.preferred,onChange:e=>p("preferred",e.target.value),placeholder:"e.g. weekday evenings, weekends…"}),(0,a.jsx)("label",{className:"lp-label",children:"Message (optional)"}),(0,a.jsx)("textarea",{className:"lp-input",rows:2,value:e.message,onChange:e=>p("message",e.target.value),placeholder:"Anything you'd like us to know?"}),(0,a.jsx)("button",{type:"submit",className:"lp-btn lp-btn-primary lp-full lp-btn-lg",disabled:"loading"===l,children:"loading"===l?"Sending…":(0,a.jsxs)(a.Fragment,{children:["Request free demo ",(0,a.jsx)(t,{size:18})]})}),(0,a.jsx)("p",{className:"lp-form-fine",children:"By submitting, you agree to be contacted about your demo class."})]})}function J(){return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("link",{rel:"preconnect",href:"https://fonts.googleapis.com"}),(0,a.jsx)("link",{rel:"preconnect",href:"https://fonts.gstatic.com",crossOrigin:"anonymous"}),(0,a.jsx)("link",{href:"https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;600;700;800&family=Noto+Serif+Tamil:wght@500;600;700&display=swap",rel:"stylesheet"})]})}function P(){return(0,a.jsx)("style",{children:`
      .lp {
        --navy: #161a33; --navy-2: #1f2547;
        --red: #e24138; --red-deep: #c5302a;
        --gold: #c2974b; --gold-soft: #d8b878;
        --paper: #f6f1e7; --paper-2: #efe7d8;
        --ink: #2a2724; --ink-soft: #5b564f;
        --line: rgba(40,32,20,0.12);
        --serif: 'Shippori Mincho', 'Noto Serif Tamil', serif;
        --ta: 'Noto Serif Tamil', serif;
        --jp: 'Shippori Mincho', 'Noto Sans JP', serif;
        background: var(--paper); color: var(--ink);
        font-family: Inter, sans-serif; overflow-x: clip;
      }
      .lp * { box-sizing: border-box; }
      .lp-container { max-width: 1180px; margin: 0 auto; padding: 0 28px; }
      .lp-on-dark { color: #fff !important; }

      /* Buttons */
      .lp-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        font-weight: 600; font-size: 14px; border-radius: 4px; padding: 11px 20px; cursor: pointer;
        text-decoration: none; border: none; transition: all 180ms ease; white-space: nowrap; font-family: inherit; }
      .lp-btn-lg { padding: 14px 26px; font-size: 15px; }
      .lp-full { width: 100%; }
      .lp-btn-primary { background: var(--red); color: #fff; box-shadow: 0 8px 22px rgba(226,65,56,0.28); }
      .lp-btn-primary:hover { background: var(--red-deep); transform: translateY(-2px); box-shadow: 0 12px 30px rgba(226,65,56,0.38); }
      .lp-btn-primary:disabled { opacity: .55; transform: none; cursor: not-allowed; }
      .lp-btn-ghost { background: transparent; color: var(--ink); border: 1px solid var(--line); }
      .lp-btn-ghost:hover { border-color: var(--ink); background: rgba(0,0,0,0.02); }
      .lp-btn-outline { background: transparent; color: var(--ink); border: 1px solid var(--line); }
      .lp-btn-outline:hover { border-color: var(--c, var(--ink)); color: var(--c, var(--ink)); }

      /* Nav */
      .lp-nav { position: sticky; top: 0; z-index: 50; background: rgba(246,241,231,0.82);
        backdrop-filter: saturate(160%) blur(12px); border-bottom: 1px solid var(--line); }
      .lp-nav-inner { display: flex; align-items: center; justify-content: space-between; height: 74px; }
      .lp-brand { display: flex; align-items: center; gap: 18px; text-decoration: none; }
      .lp-logo { width: 44px; height: 44px; border-radius: 8px; background: var(--red); color: #fff;
        font-family: var(--jp); font-weight: 700; font-size: 24px; display: flex; align-items: center;
        justify-content: center; box-shadow: 0 6px 16px rgba(226,65,56,0.3); flex-shrink: 0; }
      .lp-brand-text { display: flex; flex-direction: column; gap: 3px; }
      .lp-brand-ta { font-family: var(--ta); font-weight: 600; font-size: 19px; color: var(--ink); line-height: 1.45; }
      .lp-brand-en { font-size: 10.5px; color: var(--ink-soft); font-weight: 500; letter-spacing: .04em; text-transform: uppercase; line-height: 1.2; }
      .lp-links { display: flex; align-items: center; gap: 30px; }
      .lp-links > a { text-decoration: none; color: var(--ink); font-size: 14px; font-weight: 500; position: relative; }
      .lp-links > a:not(.lp-btn):not(.lp-nav-login)::after { content: ''; position: absolute; left: 0; bottom: -6px;
        width: 0; height: 2px; background: var(--gold); transition: width 220ms ease; }
      .lp-links > a:not(.lp-btn):not(.lp-nav-login):hover::after { width: 100%; }
      .lp-nav-login { text-decoration: none; color: var(--ink); font-size: 14px; font-weight: 600;
        padding: 9px 18px; border: 1px solid var(--line); border-radius: 4px; transition: all 160ms; }
      .lp-nav-login:hover { border-color: var(--ink); }
      .lp-burger { display: none; background: var(--navy); color: #fff; border: none; width: 44px; height: 44px;
        border-radius: 6px; cursor: pointer; align-items: center; justify-content: center; }

      /* Hero */
      .lp-hero { position: relative; padding: 18px 0 64px;
        background:
          radial-gradient(120% 90% at 88% 0%, rgba(226,65,56,0.06), transparent 55%),
          linear-gradient(180deg, var(--paper) 0%, var(--paper-2) 100%); }
      .lp-hero-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 56px; align-items: center;
        padding-top: 56px; }
      .lp-kicker { display: inline-flex; align-items: center; gap: 12px; font-family: var(--jp);
        font-size: 14px; color: var(--ink-soft); letter-spacing: .02em; margin-bottom: 26px; }
      .lp-kicker-ta { font-family: var(--ta); color: var(--red); font-weight: 600; }
      .lp-kicker-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--gold); }
      .lp-hero-title { font-family: var(--serif); font-weight: 700; font-size: clamp(30px, 5.2vw, 60px);
        line-height: 1.08; letter-spacing: -0.01em; margin: 0 0 24px; color: var(--ink); }
      .lp-hero-line { display: block; white-space: nowrap; }
      .lp-jp-accent { font-family: var(--jp); color: var(--red); font-weight: 700; }

      /* Thirukkural banner at the very top of the hero */
      .lp-kural { text-align: center; max-width: 760px; margin: 0 auto; padding: 26px 16px 22px;
        border-bottom: 1px solid var(--line); }
      .lp-kural-num { font-family: var(--ta); font-size: 12.5px; font-weight: 700; letter-spacing: .08em;
        text-transform: uppercase; color: var(--red); margin-bottom: 12px; }
      .lp-kural-ta { font-family: var(--ta); font-size: clamp(16px, 2.3vw, 21px); line-height: 1.85;
        font-weight: 600; color: var(--ink); margin: 0; }
      .lp-kural-en { font-size: 13.5px; font-style: italic; line-height: 1.6; color: var(--ink-soft); margin: 12px 0 0; }
      .lp-hero-sub { max-width: 520px; font-size: 17px; line-height: 1.72; color: var(--ink-soft); margin: 0 0 34px; }
      .lp-hero-sub strong { color: var(--ink); }
      .lp-hero-cta { display: flex; gap: 14px; flex-wrap: wrap; }
      .lp-cred { display: flex; align-items: center; gap: 16px; margin-top: 34px; flex-wrap: wrap;
        font-size: 12.5px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--ink-soft); }
      .lp-cred i { width: 5px; height: 5px; border-radius: 50%; background: var(--gold); }
      .lp-hero-clock { display: flex; justify-content: center; }

      /* ─── Kana clock ─────────────────────── */
      .kc-wrap { --kc-r: 142px; display: flex; flex-direction: column; align-items: center; gap: 20px; }
      .kc-face { position: relative; width: 360px; height: 360px; border-radius: 50%;
        background: radial-gradient(circle at 50% 38%, #fffdf8 0%, var(--paper) 62%, var(--paper-2) 100%);
        box-shadow: 0 2px 0 rgba(255,255,255,0.7) inset, 0 30px 60px -20px rgba(40,32,20,0.4),
          0 0 0 1px var(--line); }
      .kc-ring { position: absolute; inset: 26px; border-radius: 50%; border: 1px dashed rgba(194,151,75,0.4); }
      .kc-ring::after { content: ''; position: absolute; inset: 14px; border-radius: 50%; border: 1px solid var(--line); }
      .kc-mark { position: absolute; top: 50%; left: 50%; width: 40px; height: 40px; margin: -20px 0 0 -20px;
        display: flex; align-items: center; justify-content: center; background: transparent; border: none;
        cursor: pointer; font-family: var(--ta); font-size: 19px; font-weight: 600; color: var(--ink-soft);
        opacity: 0.5; transition: all 260ms ease; border-radius: 50%; }
      .kc-mark:hover { opacity: 0.9; }
      .kc-mark.on { opacity: 1; color: var(--red); transform: scale(1.18) !important;
        transform-origin: center; }
      .kc-hand { position: absolute; top: 50%; left: 50%; width: 0; height: 0; z-index: 3;
        transition: transform 700ms cubic-bezier(0.34, 1.45, 0.5, 1); }
      .kc-hand-line { position: absolute; left: -1.5px; top: -116px; width: 3px; height: 96px; border-radius: 3px;
        background: linear-gradient(var(--gold), var(--gold-soft)); }
      .kc-hand-dot { position: absolute; left: -5px; top: -120px; width: 10px; height: 10px; border-radius: 50%;
        background: var(--gold); box-shadow: 0 0 0 4px rgba(194,151,75,0.18); }
      .kc-stage { position: absolute; top: 50%; left: 50%; width: 172px; height: 172px; margin: -86px 0 0 -86px;
        border-radius: 50%; background: var(--navy); z-index: 2; perspective: 800px;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        box-shadow: 0 18px 40px -10px rgba(22,26,51,0.7), 0 0 0 6px rgba(255,255,255,0.5),
          0 0 0 7px var(--line); }
      .kc-card { display: flex; flex-direction: column; align-items: center; justify-content: center;
        transform-style: preserve-3d; animation: kcFlip 700ms cubic-bezier(0.2, 0.8, 0.2, 1) both; }
      @keyframes kcFlip {
        0%   { transform: rotateX(-90deg) translateY(8px); opacity: 0; }
        60%  { opacity: 1; }
        100% { transform: rotateX(0deg) translateY(0); opacity: 1; }
      }
      .kc-kana { font-family: var(--jp); font-weight: 700; font-size: 50px; line-height: 1; color: #fff; }
      .kc-bridge { display: flex; align-items: center; gap: 8px; margin: 7px 0; }
      .kc-bridge::before, .kc-bridge::after { content: ''; width: 16px; height: 1px; background: rgba(216,184,120,0.5); }
      .kc-romaji { font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-soft); font-weight: 600; }
      .kc-tamil { font-family: var(--ta); font-weight: 600; font-size: 34px; line-height: 1; color: var(--gold-soft); }
      .kc-footer { display: flex; flex-direction: column; align-items: center; gap: 14px; }
      .kc-caption { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--ink-soft); margin: 0; }
      .kc-caption span:first-child { font-family: var(--ta); }
      .kc-caption span:last-child { font-family: var(--jp); }
      .kc-sound { display: inline-flex; align-items: center; gap: 7px; font-family: inherit; font-size: 12px;
        font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--ink-soft);
        background: transparent; border: 1px solid var(--line); border-radius: 99px; padding: 7px 15px;
        cursor: pointer; transition: all 180ms ease; }
      .kc-sound:hover { border-color: var(--gold); color: var(--gold); }
      .kc-sound.on { background: var(--gold); border-color: var(--gold); color: #2a2410; }
      .kc-sound svg { flex-shrink: 0; }

      /* Sections */
      .lp-section { padding: 96px 0; }
      .lp-section-paper { background: linear-gradient(180deg, #fff 0%, #fcfaf4 100%); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
      .lp-section-head { max-width: 660px; margin: 0 auto 56px; text-align: center; }
      .lp-tag { display: inline-flex; align-items: center; gap: 12px; margin-bottom: 20px; font-size: 12px;
        font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--red); }
      .lp-tag-main { position: relative; }
      .lp-tag-ta { font-family: var(--ta); color: var(--gold); text-transform: none; letter-spacing: 0; font-weight: 600; font-size: 14px; }
      .lp-tag-jp { font-family: var(--jp); color: var(--ink-soft); text-transform: none; letter-spacing: 0; font-weight: 500; font-size: 13px; }
      .lp-tag-light { color: #ff9a8f; }
      .lp-tag-light .lp-tag-jp { color: rgba(255,255,255,0.6); }
      .lp-h2 { font-family: var(--serif); font-weight: 700; font-size: clamp(28px, 3.6vw, 42px);
        line-height: 1.16; letter-spacing: -0.01em; margin: 0 0 18px; color: var(--ink); }
      .lp-p { font-size: 16px; line-height: 1.8; color: var(--ink-soft); margin: 0 0 18px; }
      .lp-p em { font-style: italic; color: var(--ink); }
      .lp-p strong { color: var(--ink); }
      .lp-p-light { color: rgba(255,255,255,0.72); }
      .lp-lead { font-size: 17px; line-height: 1.7; color: var(--ink-soft); }

      /* About */
      .lp-about { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 60px; align-items: start; }
      .lp-future { background: var(--navy); border-radius: 8px; padding: 34px; color: #fff; position: relative; overflow: hidden; }
      .lp-future::before { content: '⛩'; position: absolute; right: -10px; bottom: -18px; font-size: 120px; color: rgba(255,255,255,0.04); }
      .lp-future-title { font-family: var(--jp); font-size: 17px; font-weight: 600; margin: 0 0 22px; color: #fff; }
      .lp-future-list { list-style: none; margin: 0; padding: 0; counter-reset: f; display: flex; flex-direction: column; gap: 17px; }
      .lp-future-list li { position: relative; padding-left: 30px; font-size: 14px; color: rgba(255,255,255,0.66); line-height: 1.55; counter-increment: f; }
      .lp-future-list li::before { content: counter(f, decimal-leading-zero); position: absolute; left: 0; top: 1px;
        font-family: var(--jp); font-size: 12px; color: var(--gold-soft); font-weight: 600; }
      .lp-future-list b { color: #fff; font-weight: 600; }

      /* Courses */
      .lp-course-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; }
      .lp-course { position: relative; background: #fff; border: 1px solid var(--line); border-radius: 8px;
        padding: 30px; overflow: hidden; display: flex; flex-direction: column;
        transition: transform 200ms, box-shadow 200ms, border-color 200ms; }
      .lp-course::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--c); }
      .lp-course:hover { transform: translateY(-6px); box-shadow: 0 28px 50px -22px rgba(40,32,20,0.4); border-color: transparent; }
      .lp-course-ghost { position: absolute; top: 8px; right: 16px; font-family: var(--serif); font-weight: 800;
        font-size: 96px; line-height: 1; color: var(--c); opacity: 0.08; pointer-events: none; }
      .lp-course-head { display: flex; align-items: baseline; gap: 12px; margin-bottom: 14px; }
      .lp-course-jp { font-family: var(--jp); font-size: 22px; color: var(--c); font-weight: 600; }
      .lp-course-ta { font-family: var(--ta); font-size: 15px; color: var(--ink-soft); }
      .lp-course-title { font-family: var(--serif); font-weight: 700; font-size: 27px; color: var(--ink); margin: 0; }
      .lp-course-sub { font-size: 13px; color: var(--ink-soft); margin: 4px 0 16px; font-weight: 500; }
      .lp-course-blurb { font-size: 14px; line-height: 1.65; color: var(--ink-soft); margin: 0 0 20px; }
      .lp-course-points { list-style: none; margin: 0 0 22px; padding: 0; display: flex; flex-direction: column; gap: 11px; flex: 1; }
      .lp-course-points li { display: flex; align-items: flex-start; gap: 9px; font-size: 13.5px; color: var(--ink); line-height: 1.45; }
      .lp-course-points li svg { flex-shrink: 0; margin-top: 2px; color: var(--c); }
      .lp-course-foot { display: flex; align-items: center; justify-content: space-between; padding-top: 20px; border-top: 1px solid var(--line); }
      .lp-course-fees { font-size: 13px; font-weight: 600; color: var(--ink-soft); text-decoration: none; transition: color 150ms; }
      .lp-course-fees:hover { color: var(--gold); }
      .lp-course-link { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 600;
        color: var(--c); text-decoration: none; }
      .lp-course-link:hover { gap: 7px; }

      /* Pricing */
      .lp-price-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; align-items: stretch; }
      .lp-price { position: relative; background: #fff; border: 1px solid var(--line); border-radius: 8px;
        padding: 30px 26px; display: flex; flex-direction: column; }
      .lp-price-level { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--c); margin-bottom: 14px; }
      .lp-price-amt { font-family: var(--serif); font-size: 36px; font-weight: 700; color: var(--ink); line-height: 1; margin-bottom: 8px; }
      .lp-price-amt s { display: block; font-family: Inter; font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.5); margin-top: 7px; }
      .lp-price-meta { font-size: 12.5px; color: var(--ink-soft); margin-bottom: 22px; }
      .lp-meta-gold { color: var(--gold-soft) !important; font-weight: 600; }
      .lp-price-list { list-style: none; margin: 0 0 24px; padding: 0; display: flex; flex-direction: column; gap: 10px; flex: 1; }
      .lp-price-list li { display: flex; align-items: flex-start; gap: 9px; font-size: 13px; color: var(--ink); line-height: 1.45; }
      .lp-price-list li svg { flex-shrink: 0; margin-top: 2px; color: var(--c, var(--red)); }
      .lp-list-dark li { color: rgba(255,255,255,0.78); }
      .lp-list-dark li svg { color: var(--gold-soft); }
      .lp-price-feature { background: var(--navy); border-color: transparent; box-shadow: 0 30px 60px -25px rgba(22,26,51,0.8); transform: translateY(-8px); }
      .lp-price-ribbon { position: absolute; top: -12px; left: 26px; background: var(--gold); color: #2a2410;
        font-size: 11px; font-weight: 700; padding: 5px 13px; border-radius: 3px; letter-spacing: .02em; }

      /* Why */
      .lp-why { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 56px; align-items: start; }
      .lp-why-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 32px 36px; }
      .lp-why-item { display: flex; gap: 18px; }
      .lp-why-num { font-family: var(--jp); font-size: 30px; font-weight: 700; color: var(--gold);
        line-height: 1; flex-shrink: 0; width: 38px; }
      .lp-why-title { font-family: var(--serif); font-size: 18px; font-weight: 700; color: var(--ink); margin: 0 0 8px; }
      .lp-why-desc { font-size: 14px; line-height: 1.65; color: var(--ink-soft); margin: 0; }

      /* Demo */
      .lp-demo { background:
          radial-gradient(100% 80% at 92% 8%, rgba(45,111,184,0.07), transparent 55%),
          linear-gradient(180deg, #fff 0%, #fcfaf4 100%);
        border-top: 1px solid var(--line); }
      .lp-demo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
      .lp-demo-points { list-style: none; margin: 30px 0 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
      .lp-demo-points li { display: flex; align-items: center; gap: 11px; color: var(--ink); font-size: 15px; font-weight: 500; }
      .lp-demo-points li svg { color: #2f9e63; flex-shrink: 0; }

      /* Form */
      .lp-form { background: #fff; border-radius: 10px; padding: 34px; box-shadow: 0 40px 80px -30px rgba(0,0,0,0.6); }
      .lp-form-title { font-family: var(--serif); font-size: 22px; font-weight: 700; color: var(--ink); margin: 0 0 22px; }
      .lp-label { display: block; font-size: 11.5px; font-weight: 600; color: var(--ink-soft); margin: 15px 0 6px;
        text-transform: uppercase; letter-spacing: .05em; }
      .lp-label:first-of-type { margin-top: 0; }
      .lp-input { width: 100%; padding: 11px 13px; border: 1px solid #e0dccf; border-radius: 5px;
        font-family: inherit; font-size: 14px; color: var(--ink); background: #fdfcf9; outline: none;
        transition: border-color 160ms, box-shadow 160ms; }
      .lp-input:focus { border-color: var(--red); box-shadow: 0 0 0 3px rgba(226,65,56,0.1); background: #fff; }
      textarea.lp-input { resize: vertical; }
      .lp-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
      .lp-form-row .lp-label { margin-top: 15px; }
      .lp-form button { margin-top: 24px; }
      .lp-form-fine { font-size: 11px; color: #a39e93; text-align: center; margin: 12px 0 0; }
      .lp-form-error { display: flex; align-items: center; gap: 8px; background: #fef2f2; color: #c5302a;
        padding: 11px 14px; border-radius: 6px; margin-bottom: 16px; font-size: 13px; }
      .lp-form-done { text-align: center; padding: 46px 30px; }
      .lp-done-icon { width: 72px; height: 72px; border-radius: 50%; background: #eefaf1; color: #2f9e63;
        display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
      .lp-form-done h3 { font-family: var(--serif); font-size: 23px; font-weight: 700; color: var(--ink); margin: 0 0 12px; }
      .lp-form-done p { font-size: 14.5px; line-height: 1.65; color: var(--ink-soft); margin: 0 auto; max-width: 320px; }
      .lp-done-jp { margin-top: 16px !important; font-family: var(--jp); color: var(--red) !important; }

      /* Footer */
      .lp-footer { background: #111425; color: rgba(255,255,255,0.62); padding: 60px 0 0; }
      .lp-footer-grid { display: grid; grid-template-columns: 1.6fr 0.9fr 0.9fr 1.5fr; gap: 32px; padding-bottom: 46px; }
      .lp-footer .lp-logo { box-shadow: none; }
      .lp-footer-about { font-size: 13.5px; line-height: 1.7; margin: 18px 0 0; color: rgba(255,255,255,0.45); max-width: 320px; }
      .lp-footer h4 { font-size: 12px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: .06em; margin: 0 0 18px; }
      .lp-footer a, .lp-fc { display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.55);
        text-decoration: none; font-size: 14px; margin-bottom: 12px; transition: color 150ms; }
      .lp-footer a:hover { color: var(--gold-soft); }
      .lp-footer-bar { border-top: 1px solid rgba(255,255,255,0.1); padding: 22px 28px; display: flex;
        justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; max-width: 1180px;
        margin: 0 auto; font-size: 12.5px; color: rgba(255,255,255,0.4); }
      .lp-footer-jp { font-family: var(--jp); color: var(--gold-soft); }
      .lp-fc-email { font-size: 12.5px; align-items: flex-start; line-height: 1.45; overflow-wrap: anywhere; }
      .lp-fc-email svg { flex-shrink: 0; margin-top: 3px; }
      .lp-footer-credit { border-top: 1px solid rgba(255,255,255,0.07); padding: 16px 28px; text-align: center;
        font-size: 12px; color: rgba(255,255,255,0.4); max-width: 1180px; margin: 0 auto; }
      .lp-footer-credit a { display: inline; margin: 0; font-size: 12px; color: rgba(255,255,255,0.62);
        text-decoration: none; }
      .lp-footer-credit a:hover { color: var(--gold-soft); }

      /* Kids course card */
      .lp-kids-card { margin-top: 36px; background: #fff; border: 1px solid var(--line);
        border-radius: 8px; overflow: hidden; position: relative;
        box-shadow: 0 4px 24px -8px rgba(40,32,20,0.12); }
      .lp-kids-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
        background: linear-gradient(90deg, var(--red), var(--gold)); }
      .lp-kids-badge { background: var(--navy); color: var(--gold-soft); font-size: 11.5px; font-weight: 700;
        letter-spacing: .04em; padding: 7px 22px; display: inline-block; font-family: var(--jp); }
      .lp-kids-inner { display: grid; grid-template-columns: 1fr 1.6fr auto; gap: 32px; padding: 28px 32px; align-items: center; }
      .lp-kids-left { display: flex; align-items: flex-start; gap: 18px; }
      .lp-kids-emoji { font-size: 52px; line-height: 1; flex-shrink: 0; }
      .lp-kids-jp { font-family: var(--jp); font-size: 13px; color: var(--gold); font-weight: 600; margin-bottom: 4px; }
      .lp-kids-title { font-family: var(--serif); font-size: 22px; font-weight: 700; color: var(--ink); margin: 0 0 6px; }
      .lp-kids-meta { font-size: 12.5px; color: var(--ink-soft); margin-bottom: 10px; }
      .lp-kids-price-tag { font-family: var(--serif); font-size: 28px; font-weight: 700; color: var(--red); }
      .lp-kids-desc p { font-size: 14px; line-height: 1.65; color: var(--ink-soft); margin: 0 0 14px; }
      .lp-kids-points { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; }
      .lp-kids-points li { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--ink); }
      .lp-kids-points li svg { color: var(--red); flex-shrink: 0; }
      .lp-kids-cta { display: flex; flex-direction: column; align-items: center; gap: 10px; }
      .lp-kids-note { font-size: 11px; color: var(--ink-soft); text-align: center; }

      /* Why Us special mission cards — editorial brand style */
      .lp-why-specials { display: grid; grid-template-columns: 1fr 1fr; gap: 26px; margin-top: 52px; }
      .lp-mission-card { position: relative; background: #fff; border: 1px solid var(--line);
        border-radius: 8px; overflow: hidden; display: flex; flex-direction: column;
        transition: transform 200ms, box-shadow 200ms, border-color 200ms; }
      .lp-mission-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--mc); }
      .lp-mission-card:hover { transform: translateY(-6px); box-shadow: 0 28px 50px -22px rgba(40,32,20,0.4); border-color: transparent; }
      .lp-mission-green { --mc: #2f9e63; --mc-ink: #2f9e63; }
      .lp-mission-blue { --mc: linear-gradient(90deg, var(--red), var(--gold)); --mc-ink: var(--red); }
      .lp-mission-icon { font-size: 46px; padding: 30px 30px 0; line-height: 1; }
      .lp-mission-body { padding: 16px 30px 30px; flex: 1; }
      .lp-mission-badge { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: .12em;
        text-transform: uppercase; color: var(--mc-ink); margin-bottom: 14px; }
      .lp-mission-title { font-family: var(--serif); font-size: 20px; font-weight: 700; color: var(--ink);
        margin: 0 0 12px; line-height: 1.3; }
      .lp-mission-desc { font-size: 14px; line-height: 1.7; color: var(--ink-soft); margin: 0 0 18px; }
      .lp-mission-desc strong { color: var(--ink); }
      .lp-mission-tree { display: flex; gap: 12px; background: var(--paper); border: 1px solid var(--line);
        border-radius: 6px; padding: 14px 16px; margin-bottom: 16px; align-items: flex-start; }
      .lp-mission-tree-icon { font-size: 24px; flex-shrink: 0; }
      .lp-mission-tree strong { font-size: 13.5px; font-weight: 700; color: var(--ink); display: block; margin-bottom: 4px; }
      .lp-mission-tree p { font-size: 13px; color: var(--ink-soft); margin: 0; line-height: 1.55; }
      .lp-mission-tagline { font-size: 13px; font-style: italic; color: var(--ink-soft); background: var(--paper);
        border-left: 3px solid var(--mc-ink); padding: 10px 14px; border-radius: 0 6px 6px 0; line-height: 1.55; }

      /* Annanin Parisu — free education program */
      .lp-annanin { background:
          radial-gradient(120% 90% at 12% 0%, rgba(194,151,75,0.10), transparent 55%),
          radial-gradient(100% 80% at 90% 100%, rgba(226,65,56,0.06), transparent 50%),
          linear-gradient(180deg, #fcfaf4 0%, var(--paper) 100%);
        border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
      .lp-annanin-head { max-width: 720px; margin: 0 auto 48px; text-align: center; }
      .lp-annanin-head .lp-tag { justify-content: center; }
      .lp-annanin-lead { margin: 0 auto; }
      .lp-annanin-lead em { font-family: var(--serif); font-style: italic; color: var(--red); font-weight: 600; }
      .lp-annanin-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
      .lp-ap-card { position: relative; background: #fff; border: 1px solid var(--line); border-radius: 8px;
        padding: 30px 28px; overflow: hidden; display: flex; flex-direction: column;
        transition: transform 200ms, box-shadow 200ms, border-color 200ms; }
      .lp-ap-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--c); }
      .lp-ap-card:hover { transform: translateY(-6px); box-shadow: 0 28px 50px -22px rgba(40,32,20,0.4); border-color: transparent; }
      .lp-ap-icon { width: 54px; height: 54px; border-radius: 12px; display: flex; align-items: center;
        justify-content: center; font-size: 28px; margin-bottom: 18px;
        background: color-mix(in srgb, var(--c) 12%, #fff); }
      .lp-ap-title { font-family: var(--serif); font-size: 19px; font-weight: 700; color: var(--ink); margin: 0 0 10px; line-height: 1.3; }
      .lp-ap-desc { font-size: 14px; line-height: 1.7; color: var(--ink-soft); margin: 0; }
      .lp-annanin-foot { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 14px;
        margin-top: 40px; }
      .lp-ap-chip { font-size: 12.5px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: var(--ink-soft); }
      .lp-ap-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--gold); }
      .lp-ap-apply { display: inline-flex; align-items: center; gap: 6px; font-size: 13.5px; font-weight: 600;
        color: var(--red); text-decoration: none; margin-left: 8px; transition: gap 150ms; }
      .lp-ap-apply:hover { gap: 10px; }

      /* Donation section */
      .lp-donate-section { background: var(--navy);
        background-image: radial-gradient(110% 80% at 85% 15%, rgba(226,65,56,0.14), transparent 55%),
          radial-gradient(80% 60% at 5% 90%, rgba(194,151,75,0.08), transparent 50%); }
      /* Donation impact card (right panel) */
      .lp-donate-impact-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
        border-radius: 16px; padding: 32px; display: flex; flex-direction: column; gap: 0; }
      .lp-dic-header { display: flex; align-items: center; gap: 18px; padding-bottom: 24px;
        border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 24px; }
      .lp-dic-icon { width: 56px; height: 56px; border-radius: 14px; background: linear-gradient(135deg, var(--red), #f97316);
        display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0;
        box-shadow: 0 8px 20px rgba(226,65,56,0.35); }
      .lp-dic-title { font-family: var(--serif); font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 4px; }
      .lp-dic-sub { font-size: 12.5px; color: rgba(255,255,255,0.5); line-height: 1.5; }
      .lp-dic-milestones { display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px; }
      .lp-dic-row { display: flex; align-items: center; gap: 12px; }
      .lp-dic-dot { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center;
        justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
      .lp-dic-done .lp-dic-dot { background: rgba(226,65,56,0.2); color: var(--red); border: 1.5px solid rgba(226,65,56,0.4); }
      .lp-dic-pending .lp-dic-dot { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.35); border: 1.5px solid rgba(255,255,255,0.15); }
      .lp-dic-item-label { font-size: 13.5px; color: rgba(255,255,255,0.72); flex: 1; line-height: 1.45; }
      .lp-dic-done .lp-dic-item-label { color: rgba(255,255,255,0.88); }
      .lp-dic-item-val { font-size: 12.5px; font-weight: 700; color: var(--gold-soft); white-space: nowrap; }
      .lp-dic-pending .lp-dic-item-val { color: rgba(255,255,255,0.45); }
      .lp-dic-cost { background: rgba(194,151,75,0.1); border: 1px solid rgba(194,151,75,0.25); border-radius: 10px;
        padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
      .lp-dic-cost-label { font-size: 12.5px; color: rgba(255,255,255,0.6); }
      .lp-dic-cost-val { font-family: var(--serif); font-size: 22px; font-weight: 700; color: var(--gold-soft); }
      .lp-dic-quote { font-size: 13px; font-style: italic; color: rgba(255,255,255,0.45); line-height: 1.65;
        border-left: 2px solid rgba(226,65,56,0.5); padding-left: 14px; }
      .lp-donate-actions { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
      .lp-donate-note { font-size: 12px; color: rgba(255,255,255,0.4); }
      .lp-donate-inner { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 60px; align-items: start; }
      .lp-donate-stats-row { display: flex; align-items: center; gap: 0; margin: 32px 0 24px;
        background: rgba(255,255,255,0.06); border-radius: 10px; overflow: hidden; }
      .lp-dstat { flex: 1; padding: 18px 20px; text-align: center; }
      .lp-dstat-val { font-family: var(--serif); font-size: 26px; font-weight: 700; color: #fff; line-height: 1; margin-bottom: 6px; }
      .lp-dstat-label { font-size: 11.5px; color: rgba(255,255,255,0.5); font-weight: 600; letter-spacing: .04em; text-transform: uppercase; }
      .lp-dstat-div { width: 1px; background: rgba(255,255,255,0.12); align-self: stretch; }
      .lp-donate-bar-wrap { margin-bottom: 32px; }
      .lp-donate-bar-track { height: 10px; background: rgba(255,255,255,0.12); border-radius: 99px; overflow: hidden; margin-bottom: 8px; }
      .lp-donate-bar-fill { height: 100%; background: linear-gradient(90deg, #e24138, #f472b6); border-radius: 99px;
        transition: width 1s ease; animation: barGrow 1.5s ease forwards; }
      @keyframes barGrow { from { width: 0 !important; } }
      .lp-donate-bar-labels { display: flex; justify-content: space-between; font-size: 12px; color: rgba(255,255,255,0.45); }
      .lp-btn-donate { background: var(--red); color: #fff;
        box-shadow: 0 6px 18px rgba(226,65,56,0.28); font-size: 15px; padding: 14px 28px; }
      .lp-btn-donate:hover { background: var(--red-deep); transform: translateY(-2px); box-shadow: 0 10px 26px rgba(226,65,56,0.38); }
      .lp-donate-recent { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px; padding: 26px; }
      .lp-donate-recent-title { font-family: var(--serif); font-size: 17px; font-weight: 700; color: #fff; margin: 0 0 20px; }
      .lp-donate-card { display: flex; gap: 12px; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.07); }
      .lp-donate-card:last-child { border-bottom: none; padding-bottom: 0; }
      .lp-donate-avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #7c3aed, #e24138);
        color: #fff; font-weight: 700; font-size: 15px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .lp-donate-name { font-size: 13.5px; font-weight: 600; color: rgba(255,255,255,0.9); margin-bottom: 4px; }
      .lp-donate-tag { font-size: 11.5px; font-weight: 700; color: #f9a8d4; margin-left: 8px; }
      .lp-donate-msg { font-size: 12.5px; color: rgba(255,255,255,0.45); font-style: italic; line-height: 1.5; }
      .lp-donate-info { flex: 1; min-width: 0; }

      /* Responsive */
      @media (max-width: 1000px) {
        .lp-hero-grid { grid-template-columns: 1fr; gap: 44px; }
        .lp-hero-copy { text-align: center; }
        .lp-hero-sub { margin-left: auto; margin-right: auto; }
        .lp-hero-cta, .lp-cred, .lp-kicker { justify-content: center; }
        .lp-about, .lp-why { grid-template-columns: 1fr; gap: 36px; }
        .lp-course-grid { grid-template-columns: repeat(2, 1fr); }
        .lp-price-grid { grid-template-columns: repeat(2, 1fr); }
        .lp-price-feature { transform: none; }
        .lp-demo-grid { grid-template-columns: 1fr; gap: 38px; }
        .lp-footer-grid { grid-template-columns: 1fr 1fr; gap: 30px; }
        .lp-kids-inner { grid-template-columns: 1fr 1fr; gap: 20px; }
        .lp-kids-cta { grid-column: 1 / -1; flex-direction: row; justify-content: flex-start; }
        .lp-why-specials { grid-template-columns: 1fr; }
        .lp-annanin-grid { grid-template-columns: 1fr; }
        .lp-donate-inner { grid-template-columns: 1fr; gap: 36px; }
        .lp-donate-stats-row { flex-wrap: wrap; }
      }
      @media (max-width: 820px) {
        .lp-burger { display: inline-flex; }
        .lp-links { position: fixed; top: 74px; left: 0; right: 0; background: var(--paper); flex-direction: column;
          gap: 0; padding: 8px 0 14px; border-bottom: 1px solid var(--line); box-shadow: 0 18px 40px rgba(0,0,0,0.12);
          transform: translateY(-12px); opacity: 0; pointer-events: none; transition: all 200ms ease; }
        .lp-links.open { transform: translateY(0); opacity: 1; pointer-events: all; }
        .lp-links > a, .lp-nav-login { width: calc(100% - 48px); margin: 4px 24px; padding: 13px 16px; text-align: center; }
        .lp-nav-login { border: 1px solid var(--line); }
      }
      @media (max-width: 560px) {
        .lp-section { padding: 64px 0; }
        .lp-container { padding: 0 20px; }
        .lp-hero-title { white-space: normal; }
        .lp-course-grid, .lp-price-grid, .lp-why-list, .lp-footer-grid { grid-template-columns: 1fr; }
        .lp-form-row { grid-template-columns: 1fr; }
        .lp-brand-en { display: none; }
        .lp-form { padding: 26px; }
        .kc-wrap { --kc-r: 118px; }
        .kc-face { width: 300px; height: 300px; }
        .kc-hand-line { top: -98px; height: 80px; }
        .kc-hand-dot { top: -102px; }
        .kc-kana { font-size: 42px; }
        .kc-tamil { font-size: 29px; }
        .lp-kids-inner { grid-template-columns: 1fr; }
        .lp-kids-left { flex-direction: column; gap: 10px; }
        .lp-kids-points { grid-template-columns: 1fr; }
        .lp-donate-stats-row { flex-direction: column; }
        .lp-dstat-div { width: 100%; height: 1px; }
      }
      @media (prefers-reduced-motion: reduce) {
        .kc-card { animation-duration: 0.01ms; }
        .kc-hand { transition-duration: 0.01ms; }
      }
    `})}e.s(["default",0,function(){let[e,s]=(0,i.useState)(!1);return(0,a.jsxs)("div",{className:"lp",children:[(0,a.jsx)(J,{}),(0,a.jsx)(P,{}),(0,a.jsx)("header",{className:"lp-nav",children:(0,a.jsxs)("div",{className:"lp-container lp-nav-inner",children:[(0,a.jsxs)("a",{href:"#top",className:"lp-brand",onClick:()=>s(!1),children:[(0,a.jsx)("span",{className:"lp-logo",children:"本"}),(0,a.jsxs)("span",{className:"lp-brand-text",children:[(0,a.jsx)("span",{className:"lp-brand-ta",children:j}),(0,a.jsxs)("span",{className:"lp-brand-en",children:[k," · Japanese Language School"]})]})]}),(0,a.jsxs)("nav",{className:`lp-links ${e?"open":""}`,children:[(0,a.jsx)("a",{href:"#about",onClick:()=>s(!1),children:"About"}),(0,a.jsx)("a",{href:"#courses",onClick:()=>s(!1),children:"Courses"}),(0,a.jsx)("a",{href:"#pricing",onClick:()=>s(!1),children:"Pricing"}),(0,a.jsx)("a",{href:"#why",onClick:()=>s(!1),children:"Why Us"}),(0,a.jsx)("a",{href:"#donate",onClick:()=>s(!1),children:"Donate"}),(0,a.jsx)(r.default,{href:"/login",className:"lp-nav-login",onClick:()=>s(!1),children:"Login"}),(0,a.jsx)("a",{href:"#demo",className:"lp-btn lp-btn-primary",onClick:()=>s(!1),children:"Free Demo"})]}),(0,a.jsx)("button",{className:"lp-burger","aria-label":"Menu",onClick:()=>s(e=>!e),children:e?(0,a.jsx)(n.X,{size:22}):(0,a.jsx)(l.Menu,{size:22})})]})}),(0,a.jsxs)("main",{id:"top",children:[(0,a.jsxs)("section",{className:"lp-hero",children:[(0,a.jsx)("div",{className:"lp-container",children:(0,a.jsxs)("div",{className:"lp-kural",children:[(0,a.jsx)("div",{className:"lp-kural-num",children:"திருக்குறள் · 392"}),(0,a.jsxs)("p",{className:"lp-kural-ta",children:["எண்ணென்ப ஏனை எழுத்தென்ப இவ்விரண்டும்",(0,a.jsx)("br",{}),"கண்ணென்ப வாழும் உயிர்க்கு."]}),(0,a.jsx)("p",{className:"lp-kural-en",children:"“Numeracy and literacy are the two eyes that guide human life.”"})]})}),(0,a.jsxs)("div",{className:"lp-container lp-hero-grid",children:[(0,a.jsxs)("div",{className:"lp-hero-copy",children:[(0,a.jsxs)("div",{className:"lp-kicker",children:[(0,a.jsx)("span",{className:"lp-kicker-ta",children:j}),(0,a.jsx)("span",{className:"lp-kicker-dot"}),"日本語学校"]}),(0,a.jsxs)("h1",{className:"lp-hero-title",children:[(0,a.jsxs)("span",{className:"lp-hero-line",children:["From your first ",(0,a.jsx)("span",{className:"lp-jp-accent",children:"あ"})]}),(0,a.jsxs)("span",{className:"lp-hero-line",children:["to fluent ",(0,a.jsx)("span",{className:"lp-jp-accent",children:"日本語"})]})]}),(0,a.jsxs)("p",{className:"lp-hero-sub",children:["A Japanese language school with a Tamil heart. We teach JLPT N5 to N3 the patient way — explained in your mother tongue, mastered in Japanese — guided by"," ",(0,a.jsx)("strong",{children:"N1-certified teachers"}),", online & in-class."]}),(0,a.jsxs)("div",{className:"lp-hero-cta",children:[(0,a.jsxs)("a",{href:"#demo",className:"lp-btn lp-btn-primary lp-btn-lg",children:["Book a free demo class ",(0,a.jsx)(t,{size:18})]}),(0,a.jsx)("a",{href:"#courses",className:"lp-btn lp-btn-ghost lp-btn-lg",children:"See courses & fees"})]}),(0,a.jsxs)("div",{className:"lp-cred",children:[(0,a.jsx)("span",{children:"N1-certified faculty"}),(0,a.jsx)("i",{}),(0,a.jsx)("span",{children:"150-hour foundation"}),(0,a.jsx)("i",{}),(0,a.jsx)("span",{children:"Online & in-class"})]})]}),(0,a.jsx)("div",{className:"lp-hero-clock",children:(0,a.jsx)(v,{})})]})]}),(0,a.jsx)("section",{id:"about",className:"lp-section",children:(0,a.jsxs)("div",{className:"lp-container lp-about",children:[(0,a.jsxs)("div",{className:"lp-about-main",children:[(0,a.jsx)(z,{ta:"எங்களைப் பற்றி",jp:"私たちについて",children:"About us"}),(0,a.jsx)("h2",{className:"lp-h2",children:"We teach the language, but we begin with the learner."}),(0,a.jsxs)("p",{className:"lp-p",children:[k," means ",(0,a.jsx)("em",{children:"devotion to language"})," — and that is exactly how we teach. Our courses are shaped by language experts and led by ",(0,a.jsx)("strong",{children:"N1-certified teachers"})," who have walked the JLPT path themselves. Every class weaves speaking, listening, reading and writing together, so you grow into someone who ",(0,a.jsx)("em",{children:"communicates"})," — not someone who merely passes a test."]}),(0,a.jsx)("p",{className:"lp-p",children:"Whether you dream of studying in Japan, working with a Japanese company, or simply love the language and its culture, we meet you exactly where you are — and take you further."})]}),(0,a.jsxs)("aside",{className:"lp-future",children:[(0,a.jsx)("h3",{className:"lp-future-title",children:"いま、そして これから — where we're heading"}),(0,a.jsxs)("ol",{className:"lp-future-list",children:[(0,a.jsxs)("li",{children:[(0,a.jsx)("b",{children:"N2 & N1 advanced batches"})," — the full JLPT ladder, all the way to fluency."]}),(0,a.jsxs)("li",{children:[(0,a.jsx)("b",{children:"Japan study & placement guidance"})," — visa, university and job-readiness support."]}),(0,a.jsxs)("li",{children:[(0,a.jsx)("b",{children:"Conversation & culture clubs"})," — weekly speaking circles and culture workshops."]}),(0,a.jsxs)("li",{children:[(0,a.jsx)("b",{children:"Campus & corporate programs"})," — Japanese delivered on-site, on campus."]}),(0,a.jsxs)("li",{children:[(0,a.jsx)("b",{children:"A richer learning platform"})," — mock tests, progress tracking and a mobile app."]})]})]})]})}),(0,a.jsx)("section",{id:"courses",className:"lp-section lp-section-paper",children:(0,a.jsxs)("div",{className:"lp-container",children:[(0,a.jsxs)("div",{className:"lp-section-head",children:[(0,a.jsx)(z,{ta:"பாடநெறிகள்",jp:"コース",children:"Courses"}),(0,a.jsx)("h2",{className:"lp-h2",children:"A clear path, one level at a time."}),(0,a.jsx)("p",{className:"lp-lead",children:"Structured coaching mapped to the official JLPT syllabus. Start fresh at N5, or join at the level that fits where you already are."})]}),(0,a.jsx)("div",{className:"lp-course-grid",children:y.map(e=>(0,a.jsxs)("article",{className:"lp-course",style:{"--c":e.color},children:[(0,a.jsx)("span",{className:"lp-course-ghost",children:e.level}),(0,a.jsxs)("header",{className:"lp-course-head",children:[(0,a.jsx)("span",{className:"lp-course-jp",children:e.jp}),(0,a.jsx)("span",{className:"lp-course-ta",children:e.ta})]}),(0,a.jsxs)("h3",{className:"lp-course-title",children:["JLPT ",e.level]}),(0,a.jsxs)("div",{className:"lp-course-sub",children:[e.title," · ",e.hours]}),(0,a.jsx)("p",{className:"lp-course-blurb",children:e.blurb}),(0,a.jsx)("ul",{className:"lp-course-points",children:e.points.map(e=>(0,a.jsxs)("li",{children:[(0,a.jsx)(p.Check,{size:15})," ",e]},e))}),(0,a.jsxs)("footer",{className:"lp-course-foot",children:[(0,a.jsx)("a",{href:"#pricing",className:"lp-course-fees",children:"See fees"}),(0,a.jsxs)("a",{href:"#demo",className:"lp-course-link",children:["Enquire ",(0,a.jsx)(o,{size:15})]})]})]},e.level))}),(0,a.jsx)(S,{})]})}),(0,a.jsx)("section",{id:"pricing",className:"lp-section",children:(0,a.jsxs)("div",{className:"lp-container",children:[(0,a.jsxs)("div",{className:"lp-section-head",children:[(0,a.jsx)(z,{ta:"கட்டணம்",jp:"料金",children:"Pricing"}),(0,a.jsx)("h2",{className:"lp-h2",children:"Honest, one-time fees."}),(0,a.jsxs)("p",{className:"lp-lead",children:["No hidden charges. Take all three levels together and save ",N(3e3),"."]})]}),(0,a.jsxs)("div",{className:"lp-price-grid",children:[y.map(e=>(0,a.jsxs)("div",{className:"lp-price",style:{"--c":e.color},children:[(0,a.jsxs)("div",{className:"lp-price-level",children:["JLPT ",e.level]}),(0,a.jsx)("div",{className:"lp-price-amt",children:N(e.price)}),(0,a.jsxs)("div",{className:"lp-price-meta",children:[e.hours," · ",e.title]}),(0,a.jsx)("ul",{className:"lp-price-list",children:e.points.slice(0,3).map(e=>(0,a.jsxs)("li",{children:[(0,a.jsx)(p.Check,{size:14})," ",e]},e))}),(0,a.jsx)("a",{href:"#demo",className:"lp-btn lp-btn-outline lp-full",children:"Get started"})]},e.level)),(0,a.jsxs)("div",{className:"lp-price lp-price-feature",children:[(0,a.jsx)("div",{className:"lp-price-ribbon",children:"Best value · சிறந்த தேர்வு"}),(0,a.jsx)("div",{className:"lp-price-level lp-on-dark",children:"Complete Package"}),(0,a.jsxs)("div",{className:"lp-price-amt lp-on-dark",children:[N(3e4),(0,a.jsx)("s",{children:N(33e3)})]}),(0,a.jsxs)("div",{className:"lp-price-meta lp-meta-gold",children:["N5 + N4 + N3 · 530+ hours · save ",N(3e3)]}),(0,a.jsxs)("ul",{className:"lp-price-list lp-list-dark",children:[(0,a.jsxs)("li",{children:[(0,a.jsx)(p.Check,{size:14})," All three levels — N5, N4 & N3"]}),(0,a.jsxs)("li",{children:[(0,a.jsx)(p.Check,{size:14})," Continuous N1-certified mentorship"]}),(0,a.jsxs)("li",{children:[(0,a.jsx)(p.Check,{size:14})," Priority demo & batch placement"]})]}),(0,a.jsx)("a",{href:"#demo",className:"lp-btn lp-btn-primary lp-full",children:"Enroll for the package"})]})]})]})}),(0,a.jsx)("section",{id:"why",className:"lp-section lp-section-paper",children:(0,a.jsxs)("div",{className:"lp-container",children:[(0,a.jsxs)("div",{className:"lp-why",children:[(0,a.jsxs)("div",{className:"lp-why-head",children:[(0,a.jsx)(z,{ta:"ஏன் நாங்கள்",jp:"選ばれる理由",children:"Why Mozhippattru"}),(0,a.jsx)("h2",{className:"lp-h2",children:"Small school. Serious results."}),(0,a.jsx)("p",{className:"lp-p",children:"We kept the things that actually move a learner forward, and left out the rest. Here's what you can count on with us."})]}),(0,a.jsxs)("ol",{className:"lp-why-list",children:[(0,a.jsx)(C,{n:"一",t:"N1-certified teachers",d:"Learn from the highest JLPT-qualified faculty who know precisely what each level demands of you."}),(0,a.jsx)(C,{n:"二",t:"Online & in-class",d:"Join live online from anywhere, or learn in person — whichever fits your week. Same teachers, same care."}),(0,a.jsx)(C,{n:"三",t:"Exam-aligned, life-ready",d:"Every lesson maps to the JLPT syllabus, but we drill for real speaking and listening — not just the paper."}),(0,a.jsx)(C,{n:"四",t:"A learning platform that follows you",d:"Track classes, attendance, assignments and progress on your own student portal, from day one."})]})]}),(0,a.jsxs)("div",{className:"lp-why-specials",children:[(0,a.jsxs)("div",{className:"lp-mission-card lp-mission-green",children:[(0,a.jsx)("div",{className:"lp-mission-icon",children:"🌳"}),(0,a.jsxs)("div",{className:"lp-mission-body",children:[(0,a.jsx)("div",{className:"lp-mission-badge",children:"Free Education Initiative"}),(0,a.jsx)("h3",{className:"lp-mission-title",children:"Free Japanese Education for Government School Students"}),(0,a.jsx)("p",{className:"lp-mission-desc",children:"We provide free Japanese language education to students studying in nearby government schools. Our mission is to create equal learning opportunities for every child regardless of their financial background."}),(0,a.jsxs)("div",{className:"lp-mission-tree",children:[(0,a.jsx)("span",{className:"lp-mission-tree-icon",children:"🌱"}),(0,a.jsxs)("div",{children:[(0,a.jsx)("strong",{children:"Tree Planting Initiative"}),(0,a.jsx)("p",{children:"Every student receiving free education must plant at least one tree near their home or school."})]})]}),(0,a.jsx)("div",{className:"lp-mission-tagline",children:"“We provide education. Our students give back to nature by planting trees and creating a greener future.”"})]})]}),(0,a.jsxs)("div",{className:"lp-mission-card lp-mission-blue",children:[(0,a.jsx)("div",{className:"lp-mission-icon",children:"♿"}),(0,a.jsxs)("div",{className:"lp-mission-body",children:[(0,a.jsx)("div",{className:"lp-mission-badge",children:"Learn & Donate"}),(0,a.jsx)("h3",{className:"lp-mission-title",children:"25% of Every Fee Goes to Our Wheelchair Donation Fund"}),(0,a.jsxs)("p",{className:"lp-mission-desc",children:["Education with a purpose. Whenever a student pays a course fee, ",(0,a.jsx)("strong",{children:"25% of the tuition fee"})," is automatically allocated to our Electric Wheelchair Donation Fund — helping people with physical disabilities regain independence and mobility."]}),(0,a.jsxs)("div",{className:"lp-mission-tree",children:[(0,a.jsx)("span",{className:"lp-mission-tree-icon",children:"💡"}),(0,a.jsxs)("div",{children:[(0,a.jsx)("strong",{children:"Did you know?"}),(0,a.jsx)("p",{children:"An electric wheelchair (≈ ₹37,500) can restore independent movement for years — turning everyday things like getting to class or work from impossible into ordinary."})]})]}),(0,a.jsx)("div",{className:"lp-mission-tagline",children:"“So far, students’ learning has gifted 8 electric wheelchairs — that’s 8 people back on the move.”"})]})]})]})]})}),(0,a.jsx)("section",{id:"annanin",className:"lp-section lp-annanin",children:(0,a.jsxs)("div",{className:"lp-container",children:[(0,a.jsxs)("div",{className:"lp-annanin-head",children:[(0,a.jsx)(z,{ta:"அண்ணனின் பரிசு",jp:"無償教育",children:"The Elder Brother's Gift"}),(0,a.jsx)("h2",{className:"lp-h2",children:"A gift of education for those who need it most"}),(0,a.jsxs)("p",{className:"lp-p lp-annanin-lead",children:["Some students carry far more than their share. Through ",(0,a.jsx)("em",{children:"Annanin Parisu"})," ","— the elder brother's gift — we open our Japanese classroom to them, completely free. Learning should never depend on what life has taken away."]})]}),(0,a.jsxs)("div",{className:"lp-annanin-grid",children:[(0,a.jsxs)("div",{className:"lp-ap-card",style:{"--c":"var(--gold)"},children:[(0,a.jsx)("div",{className:"lp-ap-icon",children:"🕊️"}),(0,a.jsx)("h3",{className:"lp-ap-title",children:"Children who lost a parent"}),(0,a.jsx)("p",{className:"lp-ap-desc",children:"Students who have lost one or both parents can learn Japanese with us at no cost. Each application is gently verified before we welcome them in."})]}),(0,a.jsxs)("div",{className:"lp-ap-card",style:{"--c":"var(--red)"},children:[(0,a.jsx)("div",{className:"lp-ap-icon",children:"♿"}),(0,a.jsx)("h3",{className:"lp-ap-title",children:"Persons with disabilities"}),(0,a.jsx)("p",{className:"lp-ap-desc",children:"UDID cardholders who wish to study Japanese are supported fully and taught free — online or in class, whichever serves them best."})]}),(0,a.jsxs)("div",{className:"lp-ap-card",style:{"--c":"var(--navy)"},children:[(0,a.jsx)("div",{className:"lp-ap-icon",children:"🌈"}),(0,a.jsx)("h3",{className:"lp-ap-title",children:"Thirunangai community"}),(0,a.jsx)("p",{className:"lp-ap-desc",children:"Transgender learners who want to study Japanese are warmly welcome to join and learn with us, free of charge."})]})]}),(0,a.jsxs)("div",{className:"lp-annanin-foot",children:[(0,a.jsx)("span",{className:"lp-ap-chip",children:"Verified with care"}),(0,a.jsx)("span",{className:"lp-ap-dot"}),(0,a.jsx)("span",{className:"lp-ap-chip",children:"Taught with dignity"}),(0,a.jsxs)("a",{href:"#demo",className:"lp-ap-apply",children:["Apply through our free demo ",(0,a.jsx)(t,{size:15})]})]})]})}),(0,a.jsx)("section",{id:"donate",className:"lp-section lp-donate-section",children:(0,a.jsx)("div",{className:"lp-container",children:(0,a.jsxs)("div",{className:"lp-donate-inner",children:[(0,a.jsxs)("div",{className:"lp-donate-copy",children:[(0,a.jsx)(z,{light:!0,ta:"கொடை",jp:"寄付・車椅子",children:"Support"}),(0,a.jsx)("h2",{className:"lp-h2 lp-on-dark",children:"Support Our Electric Wheelchair Mission"}),(0,a.jsxs)("p",{className:"lp-p lp-p-light",children:["Students, parents, alumni, and supporters can voluntarily contribute to our Electric Wheelchair Donation Fund. Every contribution helps someone with a disability regain independence. ",(0,a.jsx)("em",{style:{color:"rgba(255,255,255,0.55)",fontStyle:"normal"},children:"Donations are completely optional."})]}),(0,a.jsxs)("div",{className:"lp-donate-stats-row",children:[(0,a.jsxs)("div",{className:"lp-dstat",children:[(0,a.jsx)("div",{className:"lp-dstat-val",children:N(124e3)}),(0,a.jsx)("div",{className:"lp-dstat-label",children:"Total Raised"})]}),(0,a.jsx)("div",{className:"lp-dstat-div"}),(0,a.jsxs)("div",{className:"lp-dstat",children:[(0,a.jsx)("div",{className:"lp-dstat-val",children:8}),(0,a.jsx)("div",{className:"lp-dstat-label",children:"Wheelchairs Gifted"})]}),(0,a.jsx)("div",{className:"lp-dstat-div"}),(0,a.jsxs)("div",{className:"lp-dstat",children:[(0,a.jsxs)("div",{className:"lp-dstat-val",children:[Math.round(124e3/3e5*100),"%"]}),(0,a.jsx)("div",{className:"lp-dstat-label",children:"To Next Batch"})]})]}),(0,a.jsxs)("div",{className:"lp-donate-bar-wrap",children:[(0,a.jsx)("div",{className:"lp-donate-bar-track",children:(0,a.jsx)("div",{className:"lp-donate-bar-fill",style:{width:`${Math.min(100,Math.round(124e3/3e5*100))}%`}})}),(0,a.jsxs)("div",{className:"lp-donate-bar-labels",children:[(0,a.jsxs)("span",{children:[N(124e3)," raised"]}),(0,a.jsxs)("span",{children:["Goal: ",N(3e5)]})]})]}),(0,a.jsxs)("div",{className:"lp-donate-actions",children:[(0,a.jsx)("a",{href:"#demo",className:"lp-btn lp-btn-donate",children:"🤍 Donate Now"}),(0,a.jsx)("span",{className:"lp-donate-note",children:"Voluntary · No minimum amount"})]})]}),(0,a.jsxs)("div",{className:"lp-donate-impact-card",children:[(0,a.jsxs)("div",{className:"lp-dic-header",children:[(0,a.jsx)("div",{className:"lp-dic-icon",children:"♿"}),(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{className:"lp-dic-title",children:"Impact So Far"}),(0,a.jsx)("div",{className:"lp-dic-sub",children:"Every student who learns, gives back"})]})]}),(0,a.jsx)("div",{className:"lp-dic-milestones",children:[{label:"Electric wheelchairs gifted",val:"8 people",done:!0},{label:"Families regained mobility",val:"8 families",done:!0},{label:"Current batch fundraising",val:`${Math.round(124e3/3e5*100)}% funded`,done:!1}].map((e,i)=>(0,a.jsxs)("div",{className:`lp-dic-row ${e.done?"lp-dic-done":"lp-dic-pending"}`,children:[(0,a.jsx)("span",{className:"lp-dic-dot",children:e.done?"✓":"○"}),(0,a.jsx)("span",{className:"lp-dic-item-label",children:e.label}),(0,a.jsx)("span",{className:"lp-dic-item-val",children:e.val})]},i))}),(0,a.jsxs)("div",{className:"lp-dic-cost",children:[(0,a.jsx)("div",{className:"lp-dic-cost-label",children:"Cost of one electric wheelchair"}),(0,a.jsx)("div",{className:"lp-dic-cost-val",children:"≈ ₹37,500"})]}),(0,a.jsx)("div",{className:"lp-dic-quote",children:"“When you learn Japanese here, someone somewhere gains the freedom to move.”"})]})]})})}),(0,a.jsx)("section",{id:"demo",className:"lp-section lp-demo",children:(0,a.jsxs)("div",{className:"lp-container lp-demo-grid",children:[(0,a.jsxs)("div",{className:"lp-demo-copy",children:[(0,a.jsx)(z,{ta:"இலவச செயல்முறை விளக்கம்",jp:"無料体験",children:"Free demo"}),(0,a.jsx)("h2",{className:"lp-h2",children:"Sit in on a class. On us."}),(0,a.jsx)("p",{className:"lp-p",children:"Experience the teaching first-hand — no fees, no commitment. Tell us a little about yourself and our team will reach out to schedule your free online demo with an N1-certified teacher."}),(0,a.jsxs)("ul",{className:"lp-demo-points",children:[(0,a.jsxs)("li",{children:[(0,a.jsx)(h.CheckCircle2,{size:18})," 100% free online session"]}),(0,a.jsxs)("li",{children:[(0,a.jsx)(h.CheckCircle2,{size:18})," Personalised level guidance"]}),(0,a.jsxs)("li",{children:[(0,a.jsx)(h.CheckCircle2,{size:18})," Meet your future teacher"]})]})]}),(0,a.jsx)(T,{})]})})]}),(0,a.jsxs)("footer",{className:"lp-footer",children:[(0,a.jsxs)("div",{className:"lp-container lp-footer-grid",children:[(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{className:"lp-brand",children:[(0,a.jsx)("span",{className:"lp-logo",children:"本"}),(0,a.jsxs)("span",{className:"lp-brand-text",children:[(0,a.jsx)("span",{className:"lp-brand-ta lp-on-dark",children:j}),(0,a.jsx)("span",{className:"lp-brand-en",children:k})]})]}),(0,a.jsx)("p",{className:"lp-footer-about",children:"Japanese Language School · 日本語学校. JLPT N5–N3 coaching by N1-certified teachers, online & in-class."})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("h4",{children:"Explore"}),(0,a.jsx)("a",{href:"#about",children:"About us"}),(0,a.jsx)("a",{href:"#courses",children:"Courses"}),(0,a.jsx)("a",{href:"#pricing",children:"Pricing"}),(0,a.jsx)("a",{href:"#demo",children:"Free demo"})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("h4",{children:"Portal"}),(0,a.jsx)(r.default,{href:"/login",children:"Student login"}),(0,a.jsx)(r.default,{href:"/login",children:"Teacher login"}),(0,a.jsx)(r.default,{href:"/login",children:"Admin login"}),(0,a.jsx)(r.default,{href:"/register",children:"Register"})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("h4",{children:"Contact"}),(0,a.jsxs)("a",{className:"lp-fc",href:"tel:+919092882957",children:[(0,a.jsx)(c.Phone,{size:15})," +91 90928 82957"]}),(0,a.jsxs)("a",{className:"lp-fc lp-fc-email",href:"mailto:japanese.school@mozhippattru.org",children:[(0,a.jsx)(d.Mail,{size:15})," japanese.school@mozhippattru.org"]}),(0,a.jsxs)("span",{className:"lp-fc",children:[(0,a.jsx)(x.MapPin,{size:15})," Online & in-class · India"]})]})]}),(0,a.jsxs)("div",{className:"lp-footer-bar",children:[(0,a.jsxs)("span",{children:["© ",new Date().getFullYear()," ",k," — Japanese Language School. All rights reserved."]}),(0,a.jsx)("span",{className:"lp-footer-jp",children:"頑張ろう。Let's learn, together."})]}),(0,a.jsxs)("div",{className:"lp-footer-credit",children:["Developed & maintained by"," ",(0,a.jsx)("a",{href:"https://nexaex.in",target:"_blank",rel:"noopener noreferrer",children:"Nexaex Digital Services Pvt. Ltd."})," ","·"," ",(0,a.jsx)("a",{href:"https://nexaex.in",target:"_blank",rel:"noopener noreferrer",children:"nexaex.in"})]})]})]})}],88155)}]);