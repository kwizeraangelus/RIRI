module.exports=[77767,a=>{"use strict";var b=a.i(87924),c=a.i(71987),d=a.i(38246),e=a.i(72131);let f=[{title:"AI in Healthcare Diagnostics",author:"Dr. Amina Uwase",supervisor:"Prof. Jean Habimana",category:"Technology",field:"Artificial Intelligence",year:"2024",pages:"142 pages"},{title:"Sustainable Farming in Rwanda",author:"Erick Nshimiyimana",supervisor:"Prof. Grace Mukamana",category:"Agriculture",field:"Agronomy & Food Security",year:"2024",pages:"98 pages"},{title:"Medicinal Plants of Central Africa",author:"Claudine Ingabire",supervisor:"Dr. Patrick Rugira",category:"Medication",field:"Pharmacology",year:"2023",pages:"210 pages"},{title:"Urban Green Space & Mental Health",author:"Samuel Bizimana",supervisor:"Prof. Yvette Dusabe",category:"Environment",field:"Environmental Science",year:"2024",pages:"117 pages"}],g=[{title:"Research Showcase 2025",date:"Mar 12, 2025",location:"Kigali Innovation City",tag:"Showcase",description:"Authors and researchers from across the platform present their published dissertations and receive live feedback from academic panels."},{title:"Academic Writing Bootcamp",date:"Apr 8, 2025",location:"University of Rwanda — Huye",tag:"Workshop",description:"A two-day intensive workshop helping graduate students structure, write, and publish dissertation-quality research on RIRI."},{title:"Innovation & Knowledge Forum",date:"May 20, 2025",location:"Kigali Convention Center",tag:"Forum",description:"Bringing together institutions, supervisors, and emerging researchers to explore how RIRI is transforming knowledge sharing in Rwanda."}],h=[{value:"1,500+",label:"Research Uploads"},{value:"12,000+",label:"Active Readers"},{value:"40+",label:"Partner Institutions"},{value:"120+",label:"Community Events"}],i=[{number:"01",title:"Upload & Publish",description:"Researchers and creators submit quality work to share verified knowledge with a broader academic and creative audience."},{number:"02",title:"Discover & Learn",description:"Readers explore books, research papers, and innovations using clear categories and powerful searchable content."},{number:"03",title:"Connect & Grow",description:"Communities engage through events, workshops, and partnerships that turn ideas into real-world impact."}],j=["Technology Research","Agricultural Studies","Medical Dissertations","Environmental Science","Academic Publishing","Knowledge Sharing","Rwanda Innovations","Global Voices"],k=[{name:"Facebook",href:"#"},{name:"WhatsApp",href:"#"},{name:"Instagram",href:"#"},{name:"TikTok",href:"#"}];function l(){let a=(0,e.useRef)(null),[b,c]=(0,e.useState)(!1);return(0,e.useEffect)(()=>{let b=a.current;if(!b)return;let d=new IntersectionObserver(([a])=>{a.isIntersecting&&(c(!0),d.disconnect())},{threshold:.12});return d.observe(b),()=>d.disconnect()},[]),{ref:a,visible:b}}function m(){let a=[...j,...j];return(0,b.jsx)("div",{className:"riri-ticker",children:(0,b.jsx)("div",{className:"riri-ticker__track",children:a.map((a,c)=>(0,b.jsxs)("span",{className:"riri-ticker__item",children:[(0,b.jsx)("span",{className:"riri-ticker__dot"}),a]},c))})})}function n({value:a,label:c,delay:d}){let{ref:e,visible:f}=l();return(0,b.jsxs)("div",{ref:e,className:`riri-stat ${f?"riri-stat--visible":""}`,style:{transitionDelay:`${d}ms`},children:[(0,b.jsx)("div",{className:"riri-stat__value",children:a}),(0,b.jsx)("div",{className:"riri-stat__label",children:c})]})}function o({work:a}){return(0,b.jsxs)("div",{className:"riri-book-card",children:[(0,b.jsxs)("div",{className:"riri-book-card__cover",children:[(0,b.jsx)("div",{className:"riri-book-card__img-wrap",children:(0,b.jsx)(c.default,{src:"/old.jpg",fill:!0,alt:a.title,className:"riri-book-card__img",unoptimized:!0})}),(0,b.jsx)("div",{className:"riri-book-card__overlay"}),(0,b.jsx)("span",{className:"riri-book-card__category",children:a.category}),(0,b.jsx)("span",{className:"riri-book-card__year",children:a.year})]}),(0,b.jsxs)("div",{className:"riri-book-card__body",children:[(0,b.jsx)("p",{className:"riri-book-card__field",children:a.field}),(0,b.jsx)("h3",{className:"riri-book-card__title",children:a.title}),(0,b.jsx)("p",{className:"riri-book-card__author",children:a.author}),(0,b.jsxs)("div",{className:"riri-book-card__footer",children:[(0,b.jsxs)("span",{className:"riri-book-card__supervisor",children:[a.pages," · Supervised by ",a.supervisor]}),(0,b.jsx)("button",{className:"riri-book-card__btn",children:"Read →"})]})]})]})}function p({children:a,className:c="",delay:d=0}){let{ref:e,visible:f}=l();return(0,b.jsx)("div",{ref:e,className:`riri-reveal ${f?"riri-reveal--in":""} ${c}`,style:{transitionDelay:`${d}ms`},children:a})}let q=`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --gold:   #FFD700;
    --black:  #050A14;
    --dark:   #0a1120;
    --card:   #0f1a2e;
    --border: rgba(255,255,255,0.08);
    --white:  #f5f2ee;
    --muted:  rgba(245,242,238,0.52);
    --muted2: rgba(245,242,238,0.22);
    --r:      14px;
    --serif:  'Playfair Display', Georgia, serif;
    --sans:   'DM Sans', system-ui, sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--black); color: var(--white); font-family: var(--sans); overflow-x: hidden; }

  /* ── WRAP — matches original max-w-6xl mx-auto px-4 sm:px-6 exactly ── */
  .riri-wrap {
    max-width: 72rem;   /* 1152px = Tailwind max-w-6xl */
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
    width: 100%;
  }
  @media (min-width: 640px) {
    .riri-wrap { padding-left: 1.5rem; padding-right: 1.5rem; }
  }

  /* ── SCROLL REVEAL ── */
  .riri-reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.65s ease, transform 0.65s ease;
  }
  .riri-reveal--in { opacity: 1; transform: translateY(0); }

  /* ── HERO BAND — dark strip that nav sits on top of (same as EventsPage h-32 bg) ── */
  .riri-hero-band {
    height: 0;           /* nav handles its own height — zero here so no gap */
    background: var(--black);
  }

  /* ── HERO — full screen, same as original min-h-screen ── */
  .riri-hero {
    position: relative;
    display: flex; flex-direction: column;
    min-height: 100vh;
    overflow: hidden;
    background: linear-gradient(to bottom, var(--black) 0%, #0a1f3d 100%);
  }

  .riri-hero__bg {
    position: absolute; inset: 0;
    background-size: cover; background-position: center 30%;
    transform: scale(1.03); transition: transform 14s ease;
    filter: brightness(0.38) saturate(0.65);
  }
  .riri-hero:hover .riri-hero__bg { transform: scale(1.0); }

  .riri-hero__grain {
    position: absolute; inset: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    background-size: 180px; opacity: 0.45;
  }

  .riri-hero__vignette {
    position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse at center, transparent 30%, rgba(5,10,20,0.75) 100%);
  }

  .riri-hero__body {
    position: relative; z-index: 5; flex: 1;
    display: flex; align-items: center; padding: 4rem 0;
  }

  .riri-hero__layout {
    display: grid; grid-template-columns: 1fr auto;
    gap: 3rem; align-items: center; width: 100%;
  }

  .riri-hero__left {
    display: flex; flex-direction: column; gap: 1.5rem;
    max-width: 480px;
  }

  .riri-hero__badge {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 0.68rem; font-weight: 600;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--gold);
    opacity: 0; animation: heroFadeUp 0.6s ease 0.15s forwards;
  }

  .riri-hero__badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--gold); flex-shrink: 0;
    animation: pulse 2.2s infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.5)} }

  .riri-hero__sub {
    font-size: 1.02rem; line-height: 1.78;
    color: var(--muted); font-weight: 300;
    opacity: 0; animation: heroFadeUp 0.6s ease 0.3s forwards;
  }

  .riri-hero__actions {
    display: flex; flex-wrap: wrap; gap: 0.85rem;
    opacity: 0; animation: heroFadeUp 0.6s ease 0.45s forwards;
  }

  @keyframes heroFadeUp {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* Card slides in from the right */
  .riri-hero__right {
    opacity: 0; transform: translateX(70px);
    animation: heroSlideRight 0.75s cubic-bezier(0.22,1,0.36,1) 0.2s forwards;
  }
  @keyframes heroSlideRight {
    from { opacity:0; transform:translateX(70px); }
    to   { opacity:1; transform:translateX(0); }
  }

  .riri-hero__card {
    background: rgba(135,206,235,0.1);
    border: 1px solid rgba(135,206,235,0.22);
    backdrop-filter: blur(18px);
    border-radius: 20px;
    padding: 2.25rem 2rem;
    min-width: 270px; max-width: 310px;
    display: flex; flex-direction: column; gap: 0.85rem;
  }

  .riri-hero__card-label {
    font-size: 0.62rem; font-weight: 600;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(135,206,235,0.65);
  }

  .riri-hero__card-title {
    font-family: var(--serif);
    font-size: 1.65rem; font-weight: 700; line-height: 1.22;
    color: var(--white);
  }
  .riri-hero__card-title em { font-style: italic; color: var(--gold); }

  /* Proof bar */
  .riri-hero__proof-bar {
    position: relative; z-index: 5;
    background: rgba(5,10,20,0.65); backdrop-filter: blur(12px);
    border-top: 1px solid var(--border);
    padding: 0.95rem 0;
    opacity: 0; animation: heroFadeUp 0.6s ease 0.65s forwards;
  }
  .riri-hero__proof-inner { display: flex; align-items: center; flex-wrap: wrap; gap: 1.25rem; }
  .riri-hero__proof-item { font-size: 0.8rem; color: var(--muted); }
  .riri-hero__proof-item strong { color: var(--white); font-weight: 600; }
  .riri-hero__proof-sep { width: 1px; height: 14px; background: var(--border); flex-shrink: 0; }

  /* ── TICKER ── */
  .riri-ticker { background: var(--gold); overflow: hidden; padding: 0.58rem 0; }
  .riri-ticker__track { display:flex; white-space:nowrap; animation: tickerScroll 26s linear infinite; }
  @keyframes tickerScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  .riri-ticker__item {
    display:inline-flex; align-items:center; gap:0.5rem;
    font-size:0.7rem; font-weight:600; letter-spacing:0.1em;
    text-transform:uppercase; color:var(--black); padding:0 1.75rem;
  }
  .riri-ticker__dot { width:4px; height:4px; border-radius:50%; background:var(--black); opacity:0.3; flex-shrink:0; }

  /* ── MAIN ── */
  .riri-main { background: var(--black); }
  .riri-section { padding: 5rem 0; }

  .riri-section__overline {
    font-size:0.67rem; font-weight:600; letter-spacing:0.17em;
    text-transform:uppercase; color:var(--gold); margin-bottom:0.55rem;
  }
  .riri-section__title {
    font-family:var(--serif); font-size:clamp(1.7rem,2.7vw,2.45rem);
    font-weight:700; line-height:1.18; color:var(--white);
  }
  .riri-section__desc {
    font-size:0.9rem; color:var(--muted); line-height:1.8;
    max-width:370px; font-weight:300; align-self:flex-end;
  }
  .riri-section__header { margin-bottom:2.75rem; }
  .riri-section__header--split { display:flex; justify-content:space-between; align-items:flex-end; gap:2rem; }
  .riri-section__view-all { flex-shrink:0; }

  /* ── STATS ── */
  .riri-stats-section { position:relative; border-bottom:1px solid var(--border); }

  .riri-stats-bg {
    position:absolute; inset:0;
    background-size:cover; background-position:center;
    /* Barely dimmed — image is clearly visible */
    filter: brightness(0.55) saturate(0.85);
  }

  /* Soft warm-dark gradient — very light touch, not a blue wall */
  .riri-stats-overlay {
    position:absolute; inset:0;
    background: linear-gradient(
      to bottom,
      rgba(5,10,20,0.35) 0%,
      rgba(5,10,20,0.18) 40%,
      rgba(5,10,20,0.55) 100%
    );
  }

  .riri-stats-inner { position:relative; z-index:2; }

  .riri-stats-grid {
    display:grid; grid-template-columns:repeat(4,1fr);
    gap:1px; background:rgba(255,255,255,0.06);
    border:1px solid rgba(255,255,255,0.1);
    border-radius:var(--r); overflow:hidden;
  }

  .riri-stat {
    background:rgba(5,10,20,0.55); backdrop-filter:blur(12px);
    padding:2.25rem 1.75rem; text-align:center;
    opacity:0; transform:translateY(16px);
    transition:opacity 0.55s ease, transform 0.55s ease;
  }
  .riri-stat--visible { opacity:1; transform:translateY(0); }
  .riri-stat__value {
    font-family:var(--serif); font-size:2.4rem; font-weight:700;
    color:var(--white); line-height:1; margin-bottom:0.35rem;
  }
  .riri-stat__label { font-size:0.7rem; color:var(--muted); letter-spacing:0.08em; text-transform:uppercase; }

  /* ── BOOKS ── */
  .riri-books-section { border-bottom:1px solid var(--border); }
  .riri-books-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1.25rem; margin-bottom:2.75rem; }

  .riri-book-card {
    background:var(--card); border-radius:var(--r);
    border:1px solid var(--border); overflow:hidden;
    transition:transform 0.3s ease, box-shadow 0.3s ease;
    cursor:pointer; height:100%;
  }
  .riri-book-card:hover { transform:translateY(-5px); box-shadow:0 18px 48px rgba(0,0,0,0.45); }

  .riri-book-card__cover { position:relative; aspect-ratio:3/4; overflow:hidden; }
  .riri-book-card__img-wrap { position:absolute; inset:0; }
  .riri-book-card__img { object-fit:cover; transition:transform 0.5s ease; }
  .riri-book-card:hover .riri-book-card__img { transform:scale(1.06); }

  .riri-book-card__overlay {
    position:absolute; inset:0;
    background:linear-gradient(to bottom, transparent 45%, rgba(5,10,20,0.88) 100%);
  }
  .riri-book-card__category {
    position:absolute; top:0.6rem; left:0.6rem; z-index:2;
    font-size:0.58rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase;
    color:var(--gold); background:rgba(5,10,20,0.78);
    padding:0.22rem 0.5rem; border-radius:100px; backdrop-filter:blur(4px);
  }
  .riri-book-card__year {
    position:absolute; top:0.6rem; right:0.6rem; z-index:2;
    font-size:0.58rem; color:var(--muted); background:rgba(5,10,20,0.65);
    padding:0.22rem 0.5rem; border-radius:100px;
  }

  .riri-book-card__body { padding:1rem; }
  .riri-book-card__field { font-size:0.62rem; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:var(--gold); margin-bottom:0.28rem; }
  .riri-book-card__title { font-family:var(--serif); font-size:0.95rem; font-weight:700; color:var(--white); line-height:1.25; margin-bottom:0.22rem; }
  .riri-book-card__author { font-size:0.74rem; color:var(--muted); margin-bottom:0.8rem; }
  .riri-book-card__footer { display:flex; align-items:center; justify-content:space-between; gap:0.5rem; padding-top:0.65rem; border-top:1px solid var(--border); }
  .riri-book-card__supervisor { font-size:0.6rem; color:var(--muted2); line-height:1.4; }
  .riri-book-card__btn { font-size:0.68rem; color:var(--gold); background:none; border:none; cursor:pointer; font-weight:600; white-space:nowrap; font-family:var(--sans); transition:letter-spacing 0.2s; flex-shrink:0; }
  .riri-book-card:hover .riri-book-card__btn { letter-spacing:0.04em; }

  .riri-books-footer { display:flex; align-items:center; justify-content:space-between; padding-top:1.75rem; border-top:1px solid var(--border); }
  .riri-books-footer__quote { font-family:var(--serif); font-style:italic; font-size:1rem; color:var(--muted); }

  /* ── MEDIA ── */
  .riri-media-section { border-bottom:1px solid var(--border); }
  .riri-media-card { display:grid; grid-template-columns:1fr 1fr; border-radius:calc(var(--r)*1.5); overflow:hidden; border:1px solid var(--border); min-height:420px; }
  .riri-media-card__image { position:relative; overflow:hidden; }
  .riri-media-card__img { object-fit:cover; transition:transform 0.6s ease; }
  .riri-media-card:hover .riri-media-card__img { transform:scale(1.04); }
  .riri-media-card__overlay { position:absolute; inset:0; background:linear-gradient(to right, transparent 60%, var(--card) 100%); }
  .riri-media-card__content { background:var(--card); padding:3rem; display:flex; flex-direction:column; justify-content:center; gap:1.2rem; }
  .riri-media-card__tag { font-size:0.66rem; font-weight:600; letter-spacing:0.13em; text-transform:uppercase; color:var(--gold); }
  .riri-media-card__title { font-family:var(--serif); font-size:1.95rem; font-weight:700; line-height:1.12; color:var(--white); }
  .riri-media-card__body { font-size:0.88rem; color:var(--muted); line-height:1.8; font-weight:300; }

  /* ── HOW ── */
  .riri-how-section { border-bottom:1px solid var(--border); }
  .riri-how-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--border); border:1px solid var(--border); border-radius:var(--r); overflow:hidden; }
  .riri-how-card { background:var(--dark); padding:2.5rem 2rem; transition:background 0.3s; }
  .riri-how-card:hover { background:var(--card); }
  .riri-how-card__number { font-family:var(--serif); font-size:2.8rem; font-weight:700; line-height:1; margin-bottom:0.9rem; -webkit-text-stroke:1px var(--gold); color:transparent; }
  .riri-how-card__divider { width:26px; height:1px; background:var(--gold); margin-bottom:0.9rem; }
  .riri-how-card__title { font-family:var(--serif); font-size:1.18rem; font-weight:700; color:var(--white); margin-bottom:0.6rem; }
  .riri-how-card__desc { font-size:0.84rem; color:var(--muted); line-height:1.75; font-weight:300; }

  /* ── QUOTE ── */
  .riri-quote-section { border-bottom:1px solid var(--border); }
  .riri-quote-card { background:var(--dark); border:1px solid var(--border); border-radius:calc(var(--r)*1.5); padding:3.5rem 4rem; position:relative; overflow:hidden; }
  .riri-quote-card::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 15% 50%, rgba(255,215,0,0.04), transparent 55%); pointer-events:none; }
  .riri-quote-card__mark { font-family:var(--serif); font-size:6.5rem; line-height:0.7; color:var(--gold); opacity:0.16; margin-bottom:1.25rem; font-weight:700; }
  .riri-quote-card__text { font-family:var(--serif); font-size:clamp(1.08rem,1.9vw,1.45rem); font-style:italic; line-height:1.62; color:var(--white); margin-bottom:2rem; max-width:740px; }
  .riri-quote-card__author { display:flex; align-items:center; gap:0.8rem; }
  .riri-quote-card__avatar { width:42px; height:42px; border-radius:50%; background:var(--gold); color:var(--black); display:flex; align-items:center; justify-content:center; font-size:0.7rem; font-weight:700; flex-shrink:0; }
  .riri-quote-card__name { font-weight:600; font-size:0.88rem; color:var(--white); }
  .riri-quote-card__role { font-size:0.74rem; color:var(--muted); }

  /* ── EVENTS ── */
  .riri-events-section { border-bottom:1px solid var(--border); }
  .riri-events-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; }
  .riri-event-card { background:var(--card); border:1px solid var(--border); border-radius:var(--r); padding:1.75rem; display:flex; flex-direction:column; gap:0.78rem; transition:border-color 0.25s, transform 0.25s; height:100%; }
  .riri-event-card:hover { border-color:rgba(255,215,0,0.28); transform:translateY(-4px); }
  .riri-event-card__header { display:flex; justify-content:space-between; align-items:center; }
  .riri-event-card__tag { font-size:0.58rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:var(--gold); background:rgba(255,215,0,0.1); padding:0.22rem 0.58rem; border-radius:100px; }
  .riri-event-card__num { font-family:var(--serif); font-size:1.15rem; color:rgba(255,255,255,0.06); font-weight:700; }
  .riri-event-card__title { font-family:var(--serif); font-size:1.18rem; font-weight:700; color:var(--white); line-height:1.2; }
  .riri-event-card__desc { font-size:0.79rem; color:var(--muted); line-height:1.72; font-weight:300; flex:1; }
  .riri-event-card__meta { display:flex; flex-direction:column; gap:0.26rem; font-size:0.74rem; color:var(--muted); padding-top:0.55rem; border-top:1px solid var(--border); }
  .riri-event-card__btn { display:inline-block; font-size:0.76rem; font-weight:600; color:var(--gold); text-decoration:none; transition:letter-spacing 0.2s; }
  .riri-event-card:hover .riri-event-card__btn { letter-spacing:0.04em; }

  /* ── CTA ── */
  .riri-cta-section { padding-bottom:6rem; }
  .riri-cta-card { background:var(--dark); border:1px solid var(--border); border-radius:calc(var(--r)*2); overflow:hidden; position:relative; }
  .riri-cta-card::after { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 80% 20%, rgba(255,215,0,0.055), transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(59,130,246,0.03), transparent 50%); pointer-events:none; }
  .riri-cta-card__inner { padding:4.5rem; position:relative; z-index:1; }
  .riri-cta-card__title { font-family:var(--serif); font-size:clamp(1.6rem,2.5vw,2.2rem); font-weight:700; line-height:1.15; color:var(--white); margin-bottom:1.75rem; }
  .riri-cta-list { list-style:none; display:flex; flex-direction:column; gap:0.72rem; margin-bottom:2.25rem; }
  .riri-cta-list li { display:flex; align-items:center; gap:0.7rem; font-size:0.88rem; color:var(--muted); font-weight:300; }
  .riri-cta-list li::before { content:''; width:5px; height:5px; border-radius:50%; background:var(--gold); flex-shrink:0; }
  .riri-cta-actions { display:flex; flex-wrap:wrap; gap:0.85rem; }

  /* ── BUTTONS ── */
  .riri-btn { display:inline-flex; align-items:center; padding:0.65rem 1.5rem; border-radius:100px; font-size:0.83rem; font-weight:600; text-decoration:none; transition:all 0.2s; cursor:pointer; font-family:var(--sans); border:none; letter-spacing:0.02em; }
  .riri-btn--white { background:var(--white); color:var(--black); }
  .riri-btn--white:hover { background:#dedad4; }
  .riri-btn--ghost { background:rgba(255,255,255,0.09); color:var(--white); border:1px solid var(--border); backdrop-filter:blur(4px); }
  .riri-btn--ghost:hover { background:rgba(255,255,255,0.15); }
  .riri-btn--outline { background:transparent; color:var(--white); border:1px solid var(--border); }
  .riri-btn--outline:hover { border-color:rgba(255,255,255,0.28); }
  .riri-btn--gold { background:var(--gold); color:var(--black); }
  .riri-btn--gold:hover { background:#e6c200; }

  /* ── FOOTER ── */
  .riri-footer { background:var(--black); border-top:1px solid var(--border); padding:4.5rem 0 2.25rem; }
  .riri-footer__top { display:grid; grid-template-columns:1fr 2fr; gap:4rem; padding-bottom:3rem; border-bottom:1px solid var(--border); margin-bottom:2rem; }
  .riri-footer__logo { font-family:var(--serif); font-size:2rem; font-weight:700; color:var(--white); letter-spacing:0.08em; margin-bottom:0.55rem; }
  .riri-footer__tagline { font-size:0.84rem; color:var(--muted); font-style:italic; font-family:var(--serif); }
  .riri-footer__cols { display:grid; grid-template-columns:repeat(3,1fr); gap:2rem; }
  .riri-footer__col { display:flex; flex-direction:column; gap:0.52rem; }
  .riri-footer__col-title { font-size:0.63rem; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:var(--muted2); margin-bottom:0.38rem; }
  .riri-footer__link, .riri-footer__text { font-size:0.83rem; color:var(--muted); text-decoration:none; font-weight:300; transition:color 0.2s; }
  .riri-footer__link:hover { color:var(--white); }
  .riri-footer__bottom { display:flex; justify-content:space-between; align-items:center; font-size:0.73rem; color:var(--muted2); }

  /* ── RESPONSIVE ── */
  @media (max-width:1024px) {
    .riri-books-grid { grid-template-columns:repeat(2,1fr); }
    .riri-stats-grid { grid-template-columns:repeat(2,1fr); }
  }
  @media (max-width:768px) {
    .riri-wrap { padding-left:1.25rem; padding-right:1.25rem; }
    .riri-hero__layout { grid-template-columns:1fr; gap:2rem; }
    .riri-hero__card { max-width:100%; min-width:0; }
    .riri-section { padding:3.5rem 0; }
    .riri-section__header--split { flex-direction:column; align-items:flex-start; }
    .riri-books-grid { grid-template-columns:1fr 1fr; }
    .riri-media-card { grid-template-columns:1fr; }
    .riri-media-card__image { min-height:200px; }
    .riri-how-grid { grid-template-columns:1fr; gap:1px; }
    .riri-events-grid { grid-template-columns:1fr; }
    .riri-footer__top { grid-template-columns:1fr; gap:2rem; }
    .riri-footer__cols { grid-template-columns:1fr 1fr; }
    .riri-quote-card { padding:2.5rem 1.75rem; }
    .riri-cta-card__inner { padding:2.5rem; }
    .riri-books-footer { flex-direction:column; gap:1.25rem; align-items:flex-start; }
  }
  @media (max-width:480px) {
    .riri-books-grid { grid-template-columns:1fr; }
    .riri-stats-grid { grid-template-columns:1fr 1fr; }
    .riri-footer__cols { grid-template-columns:1fr; }
  }
`;a.s(["default",0,function(){return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("style",{children:q}),(0,b.jsx)("div",{className:"riri-hero-band","aria-hidden":"true"}),(0,b.jsxs)("header",{className:"riri-hero",children:[(0,b.jsx)("div",{className:"riri-hero__bg",style:{backgroundImage:"url('/home.jpg')"},"aria-hidden":"true"}),(0,b.jsx)("div",{className:"riri-hero__grain","aria-hidden":"true"}),(0,b.jsx)("div",{className:"riri-hero__vignette","aria-hidden":"true"}),(0,b.jsx)("div",{className:"riri-hero__body",children:(0,b.jsx)("div",{className:"riri-wrap",children:(0,b.jsxs)("div",{className:"riri-hero__layout",children:[(0,b.jsxs)("div",{className:"riri-hero__left",children:[(0,b.jsxs)("div",{className:"riri-hero__badge",children:[(0,b.jsx)("span",{className:"riri-hero__badge-dot"}),"Rwanda's Academic & Literary Platform"]}),(0,b.jsx)("p",{className:"riri-hero__sub",children:"A trusted home for research, creative writing, and academic excellence — built for the curious minds of Rwanda and beyond."}),(0,b.jsxs)("div",{className:"riri-hero__actions",children:[(0,b.jsx)(d.default,{href:"/publications",className:"riri-btn riri-btn--white",children:"Explore Publications"}),(0,b.jsx)(d.default,{href:"/events",className:"riri-btn riri-btn--ghost",children:"Upcoming Events ↗"})]})]}),(0,b.jsx)("div",{className:"riri-hero__right",children:(0,b.jsxs)("div",{className:"riri-hero__card",children:[(0,b.jsx)("p",{className:"riri-hero__card-label",children:"Est. 2024"}),(0,b.jsxs)("h1",{className:"riri-hero__card-title",children:["Discover a",(0,b.jsx)("br",{}),"New Era of",(0,b.jsx)("br",{}),(0,b.jsxs)("em",{children:["Books,",(0,b.jsx)("br",{}),"Creativity"]}),(0,b.jsx)("br",{}),"& Innovation"]})]})})]})})}),(0,b.jsx)("div",{className:"riri-hero__proof-bar",children:(0,b.jsxs)("div",{className:"riri-wrap riri-hero__proof-inner",children:[(0,b.jsxs)("span",{className:"riri-hero__proof-item",children:["Joined by ",(0,b.jsx)("strong",{children:"12,000+"})," readers & researchers"]}),(0,b.jsx)("span",{className:"riri-hero__proof-sep"}),(0,b.jsx)("span",{className:"riri-hero__proof-item",children:"1,500+ published works"}),(0,b.jsx)("span",{className:"riri-hero__proof-sep"}),(0,b.jsx)("span",{className:"riri-hero__proof-item",children:"40+ partner institutions"})]})})]}),(0,b.jsx)(m,{}),(0,b.jsxs)("main",{className:"riri-main",children:[(0,b.jsxs)("section",{className:"riri-section riri-stats-section",children:[(0,b.jsx)("div",{className:"riri-stats-bg",style:{backgroundImage:"url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1600&q=80')"},"aria-hidden":"true"}),(0,b.jsx)("div",{className:"riri-stats-overlay","aria-hidden":"true"}),(0,b.jsxs)("div",{className:"riri-wrap riri-stats-inner",children:[(0,b.jsx)(p,{children:(0,b.jsxs)("div",{className:"riri-section__header riri-section__header--split",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"riri-section__overline",children:"Our Impact"}),(0,b.jsxs)("h2",{className:"riri-section__title",children:["Built for real academic",(0,b.jsx)("br",{}),"and creative impact"]})]}),(0,b.jsx)("p",{className:"riri-section__desc",children:"From compelling dissertations to groundbreaking research, RIRI drives innovation and knowledge sharing across Rwanda and the continent."})]})}),(0,b.jsx)("div",{className:"riri-stats-grid",children:h.map((a,c)=>(0,b.jsx)(n,{value:a.value,label:a.label,delay:100*c},a.label))})]})]}),(0,b.jsx)("section",{className:"riri-section riri-books-section",children:(0,b.jsxs)("div",{className:"riri-wrap",children:[(0,b.jsx)(p,{children:(0,b.jsxs)("div",{className:"riri-section__header",children:[(0,b.jsx)("p",{className:"riri-section__overline",children:"Latest Works"}),(0,b.jsxs)("h2",{className:"riri-section__title",children:["Explore the latest dissertations",(0,b.jsx)("br",{}),"and research publications"]})]})}),(0,b.jsx)("div",{className:"riri-books-grid",children:f.map((a,c)=>(0,b.jsx)(p,{delay:80*c,children:(0,b.jsx)(o,{work:a})},a.title))}),(0,b.jsx)(p,{children:(0,b.jsxs)("div",{className:"riri-books-footer",children:[(0,b.jsx)("p",{className:"riri-books-footer__quote",children:'"We believe in the power of every story."'}),(0,b.jsx)(d.default,{href:"/publications",className:"riri-btn riri-btn--outline",children:"View all publications →"})]})})]})}),(0,b.jsx)("section",{className:"riri-section riri-media-section",children:(0,b.jsx)("div",{className:"riri-wrap",children:(0,b.jsx)(p,{children:(0,b.jsxs)("div",{className:"riri-media-card",children:[(0,b.jsxs)("div",{className:"riri-media-card__image",children:[(0,b.jsx)(c.default,{src:"/thesis.jpg",fill:!0,alt:"RIRI Creative Community",className:"riri-media-card__img",unoptimized:!0}),(0,b.jsx)("div",{className:"riri-media-card__overlay"})]}),(0,b.jsxs)("div",{className:"riri-media-card__content",children:[(0,b.jsx)("span",{className:"riri-media-card__tag",children:"Community Spotlight"}),(0,b.jsxs)("h2",{className:"riri-media-card__title",children:["A glimpse into our",(0,b.jsx)("br",{}),"Creative Community"]}),(0,b.jsx)("p",{className:"riri-media-card__body",children:"Where stories transcend the written word. Dive into our latest multimedia features and discover the voices shaping Rwanda's literary future."}),(0,b.jsx)(d.default,{href:"/community",className:"riri-btn riri-btn--white",children:"Meet the community →"})]})]})})})}),(0,b.jsx)("section",{className:"riri-section riri-how-section",children:(0,b.jsxs)("div",{className:"riri-wrap",children:[(0,b.jsx)(p,{children:(0,b.jsxs)("div",{className:"riri-section__header",children:[(0,b.jsx)("p",{className:"riri-section__overline",children:"The Process"}),(0,b.jsx)("h2",{className:"riri-section__title",children:"How RIRI works"})]})}),(0,b.jsx)("div",{className:"riri-how-grid",children:i.map((a,c)=>(0,b.jsx)(p,{delay:120*c,children:(0,b.jsxs)("div",{className:"riri-how-card",children:[(0,b.jsx)("div",{className:"riri-how-card__number",children:a.number}),(0,b.jsx)("div",{className:"riri-how-card__divider"}),(0,b.jsx)("h3",{className:"riri-how-card__title",children:a.title}),(0,b.jsx)("p",{className:"riri-how-card__desc",children:a.description})]})},a.number))})]})}),(0,b.jsx)("section",{className:"riri-section riri-quote-section",children:(0,b.jsx)("div",{className:"riri-wrap",children:(0,b.jsx)(p,{children:(0,b.jsxs)("div",{className:"riri-quote-card",children:[(0,b.jsx)("div",{className:"riri-quote-card__mark",children:'"'}),(0,b.jsx)("blockquote",{className:"riri-quote-card__text",children:"The future of literature lies in the intersection of technology and creativity. At RIRI, we are pioneering new ways to experience stories, connect authors with readers, and foster innovation in the literary world."}),(0,b.jsxs)("div",{className:"riri-quote-card__author",children:[(0,b.jsx)("div",{className:"riri-quote-card__avatar",children:"DI"}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"riri-quote-card__name",children:"Dr. Mungwarakarama Irene"}),(0,b.jsx)("p",{className:"riri-quote-card__role",children:"Founder, RIRI Platform"})]})]})]})})})}),(0,b.jsx)("section",{className:"riri-section riri-events-section",children:(0,b.jsxs)("div",{className:"riri-wrap",children:[(0,b.jsx)(p,{children:(0,b.jsxs)("div",{className:"riri-section__header riri-section__header--split",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"riri-section__overline",children:"Community"}),(0,b.jsxs)("h2",{className:"riri-section__title",children:["Join our upcoming",(0,b.jsx)("br",{}),"events & workshops"]})]}),(0,b.jsx)(d.default,{href:"/events",className:"riri-btn riri-btn--outline riri-section__view-all",children:"View all events →"})]})}),(0,b.jsx)("div",{className:"riri-events-grid",children:g.map((a,c)=>(0,b.jsx)(p,{delay:100*c,children:(0,b.jsxs)("div",{className:"riri-event-card",children:[(0,b.jsxs)("div",{className:"riri-event-card__header",children:[(0,b.jsx)("span",{className:"riri-event-card__tag",children:a.tag}),(0,b.jsxs)("span",{className:"riri-event-card__num",children:["0",c+1]})]}),(0,b.jsx)("h3",{className:"riri-event-card__title",children:a.title}),(0,b.jsx)("p",{className:"riri-event-card__desc",children:a.description}),(0,b.jsxs)("div",{className:"riri-event-card__meta",children:[(0,b.jsxs)("span",{children:["📅 ",a.date]}),(0,b.jsxs)("span",{children:["📍 ",a.location]})]}),(0,b.jsx)(d.default,{href:"/events",className:"riri-event-card__btn",children:"Register now →"})]})},a.title))})]})}),(0,b.jsx)("section",{className:"riri-section riri-cta-section",children:(0,b.jsx)("div",{className:"riri-wrap",children:(0,b.jsx)(p,{children:(0,b.jsx)("div",{className:"riri-cta-card",children:(0,b.jsxs)("div",{className:"riri-cta-card__inner",children:[(0,b.jsx)("p",{className:"riri-section__overline",children:"Why RIRI"}),(0,b.jsxs)("h2",{className:"riri-cta-card__title",children:["The home for Rwanda's best",(0,b.jsx)("br",{}),"academic and creative voices"]}),(0,b.jsxs)("ul",{className:"riri-cta-list",children:[(0,b.jsx)("li",{children:"A trusted home for academic and creative excellence"}),(0,b.jsx)("li",{children:"Clear categories for research, innovation, and events"}),(0,b.jsx)("li",{children:"Opportunities for institutions, authors, and readers to collaborate"})]}),(0,b.jsxs)("div",{className:"riri-cta-actions",children:[(0,b.jsx)(d.default,{href:"/publications",className:"riri-btn riri-btn--white",children:"Explore Publications"}),(0,b.jsx)(d.default,{href:"/innovation",className:"riri-btn riri-btn--gold",children:"Discover Innovations"})]})]})})})})})]}),(0,b.jsx)("footer",{className:"riri-footer",children:(0,b.jsxs)("div",{className:"riri-wrap",children:[(0,b.jsxs)("div",{className:"riri-footer__top",children:[(0,b.jsxs)("div",{className:"riri-footer__brand",children:[(0,b.jsx)("div",{className:"riri-footer__logo",children:"RIRI"}),(0,b.jsx)("p",{className:"riri-footer__tagline",children:"Discover. Create. Inspire."})]}),(0,b.jsxs)("div",{className:"riri-footer__cols",children:[(0,b.jsxs)("div",{className:"riri-footer__col",children:[(0,b.jsx)("h4",{className:"riri-footer__col-title",children:"Platform"}),(0,b.jsx)(d.default,{href:"/publications",className:"riri-footer__link",children:"Publications"}),(0,b.jsx)(d.default,{href:"/innovation",className:"riri-footer__link",children:"Innovation"}),(0,b.jsx)(d.default,{href:"/events",className:"riri-footer__link",children:"Events"}),(0,b.jsx)(d.default,{href:"/community",className:"riri-footer__link",children:"Community"})]}),(0,b.jsxs)("div",{className:"riri-footer__col",children:[(0,b.jsx)("h4",{className:"riri-footer__col-title",children:"Contact"}),(0,b.jsx)("a",{href:"mailto:hello@riri.com",className:"riri-footer__link",children:"hello@riri.com"}),(0,b.jsx)("span",{className:"riri-footer__text",children:"Kigali, Rwanda"})]}),(0,b.jsxs)("div",{className:"riri-footer__col",children:[(0,b.jsx)("h4",{className:"riri-footer__col-title",children:"Follow Us"}),k.map(a=>(0,b.jsx)("a",{href:a.href,className:"riri-footer__link",children:a.name},a.name))]})]})]}),(0,b.jsxs)("div",{className:"riri-footer__bottom",children:[(0,b.jsxs)("p",{children:["© ",new Date().getFullYear()," RIRI. All rights reserved."]}),(0,b.jsx)("p",{children:"Made with care in Kigali 🇷🇼"})]})]})})]})}])}];

//# sourceMappingURL=src_app_%28main%29_page_tsx_0jz8anj._.js.map