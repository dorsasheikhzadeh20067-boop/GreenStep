// games.js — مینی‌گیم‌های GreenStep (قبل از script.js بارگذاری می‌شود)
(() => {
  "use strict";
  const lg = () => (document.documentElement.lang === "en" ? 1 : 0);
  const p = a => a[lg()];
  const nf = n => new Intl.NumberFormat(lg() ? "en-US" : "fa-IR").format(n);
  const shuffle = a => { const x = [...a]; for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; };

  const UI = {
    back: ["بازگشت", "Back"], again: ["بازی دوباره", "Play again"], home: ["بازگشت به خانه", "Back home"],
    done: ["تمام شد!", "Finished!"], doubled: ["جایزهٔ دوبرابر ×۲", "Double reward ×2"],
    practice: ["سقف پاداش امروز این بازی پر شده؛ این دور فقط تمرین است.", "Today's reward limit for this game is reached; this round is practice only."],
    mistakes: ["اشتباه", "Mistakes"], correct: ["درست", "Correct"], acc: ["دقت", "Accuracy"],
    moves: ["حرکت", "Moves"], time: ["زمان", "Time"], pairs: ["جفت", "Pairs"]
  };
  const u = k => p(UI[k]);

  const META = [
    { id: "sort", icon: "♻️", tone: "lime", title: ["جدا کردن زباله", "Waste sorting"], desc: ["هر زباله را در سطل درست بینداز", "Drop each item in the right bin"], info: ["۶۰ ثانیه · تا ۹۰ XP", "60 s · up to 90 XP"] },
    { id: "quiz", icon: "🧠", tone: "amber", title: ["کوییز سریع", "Quick quiz"], desc: ["چند سؤال، چند ثانیه، چند امتیاز", "A few questions, a few seconds, a few points"], info: ["۸ سؤال · تا ۸۰ XP", "8 questions · up to 80 XP"] },
    { id: "memory", icon: "🃏", tone: "cyan", title: ["جفتیابی سبز", "Green match"], desc: ["جفت‌های هم‌شکل را پیدا کن", "Find the matching pairs"], info: ["۱۶ کارت · تا ۷۰ XP", "16 cards · up to 70 XP"] }
  ];
  const meta = id => META.find(m => m.id === id);

  const head = (title, chip) => `<div class="g-head"><button class="g-back" data-gback type="button" aria-label="${u("back")}">${lg() ? "←" : "→"}</button><h1>${title}</h1><span class="g-chip">${chip}</span></div>`;

  function result(root, id, r, lines) {
    root.innerHTML = `<div class="g-result"><div class="g-big">${meta(id).icon}</div><h2>${u("done")}</h2>
      <p class="g-xp">+${nf(r.gain)} XP</p>
      ${r.doubled && !r.practice ? `<p class="g-tag">⚡ ${u("doubled")}</p>` : ""}
      ${r.practice ? `<p class="note">${u("practice")}</p>` : ""}
      <div class="stat-grid">${lines.map(([k, v]) => `<div class="stat-tile"><b>${v}</b><small>${k}</small></div>`).join("")}</div>
      <button class="primary-button" data-gagain type="button">${u("again")}</button>
      <button class="text-button" data-gback type="button">${u("home")}</button></div>`;
  }

  // ---------- 1) جدا کردن زباله ----------
  function sortGame(root, ctx) {
    const BINS = [
      { id: "plastic", icon: "🧴", t: ["پلاستیک", "Plastic"], s: ["بسته‌بندی و ظرف", "Packaging & containers"] },
      { id: "paper", icon: "📄", t: ["کاغذ", "Paper"], s: ["کاغذ و مقوا", "Paper & cardboard"] },
      { id: "organic", icon: "🍃", t: ["آلی", "Organic"], s: ["پسماند تر", "Wet waste"] },
      { id: "glass", icon: "🍾", t: ["شیشه", "Glass"], s: ["شیشه و بلور", "Glass & crystal"] }
    ];
    const ITEMS = [
      ["🍌", ["پوست میوه", "Fruit peel"], "organic"], ["🍎", ["هستهٔ سیب", "Apple core"], "organic"], ["🥚", ["پوست تخم‌مرغ", "Eggshell"], "organic"],
      ["🥬", ["سبزی خراب", "Spoiled greens"], "organic"], ["🍂", ["برگ خشک", "Dry leaves"], "organic"], ["🍊", ["پوست پرتقال", "Orange peel"], "organic"],
      ["🧴", ["بطری شامپو", "Shampoo bottle"], "plastic"], ["🛍️", ["کیسهٔ پلاستیکی", "Plastic bag"], "plastic"], ["🥡", ["ظرف یک‌بارمصرف", "Takeaway box"], "plastic"], ["🥤", ["لیوان پلاستیکی", "Plastic cup"], "plastic"],
      ["📰", ["روزنامه", "Newspaper"], "paper"], ["📦", ["جعبهٔ مقوایی", "Cardboard box"], "paper"], ["📄", ["برگهٔ باطله", "Scrap paper"], "paper"], ["✉️", ["پاکت نامه", "Envelope"], "paper"],
      ["🍾", ["بطری شیشه‌ای", "Glass bottle"], "glass"], ["🍷", ["جام شیشه‌ای", "Wine glass"], "glass"], ["🫙", ["شیشهٔ مربا", "Jam jar"], "glass"], ["🥃", ["لیوان شیشه‌ای", "Glass tumbler"], "glass"]
    ];
    const DUR = 60000, MAXXP = 90;
    let queue = [], cur, correct = 0, wrong = 0, ended = false, tm;
    const end = Date.now() + DUR, left = () => Math.max(0, end - Date.now());
    const score = () => Math.min(MAXXP, correct * 3);
    const acc = () => { const n = correct + wrong; return n ? Math.round(correct / n * 100) : 0; };
    const next = () => { if (!queue.length) queue = shuffle(ITEMS); cur = queue.pop(); };

    function paint() {
      root.innerHTML = head(p(["جدا کردن زباله", "Waste sorting"]), `<span id="sScore">${nf(score())}</span> 🎯`) +
        `<div class="g-timer"><b id="sSec">${nf(Math.ceil(left() / 1000))}</b><div class="g-bar"><i id="sBar" style="width:${left() / DUR * 100}%"></i></div></div>
        <div class="g-card" id="sCard"><div class="g-emoji">${cur[0]}</div><h2>${p(cur[1])}</h2><p>${p(["این زباله کجا می‌رود؟", "Where does this go?"])}</p></div>
        <div class="g-bins">${BINS.map(b => `<button class="g-bin bin-${b.id}" data-gbin="${b.id}" type="button"><span>${b.icon}</span><b>${p(b.t)}</b><small>${p(b.s)}</small></button>`).join("")}</div>
        <div class="g-foot"><span>${u("mistakes")}: ${nf(wrong)}</span><span>${nf(acc())}${p(["٪ این دور", "% this round"])}</span></div>`;
    }
    function finish() {
      if (ended) return; ended = true; clearInterval(tm);
      const r = ctx.finish({ xp: score(), stats: { correct, wrong } });
      result(root, "sort", r, [[u("correct"), nf(correct)], [u("mistakes"), nf(wrong)], [u("acc"), nf(acc()) + (lg() ? "%" : "٪")]]);
    }
    const onClick = e => {
      const b = e.target.closest("[data-gbin]"); if (!b || ended) return;
      const ok = b.dataset.gbin === cur[2]; ok ? correct++ : wrong++;
      next(); paint();
      const c = root.querySelector("#sCard"); if (c) { c.classList.add(ok ? "ok" : "bad"); setTimeout(() => c.classList.remove("ok", "bad"), 250); }
    };
    root.addEventListener("click", onClick);
    next(); paint();
    tm = setInterval(() => {
      const l = left(), s = root.querySelector("#sSec"), b = root.querySelector("#sBar");
      if (s) s.textContent = nf(Math.ceil(l / 1000)); if (b) b.style.width = (l / DUR * 100) + "%";
      if (l <= 0) finish();
    }, 200);
    return () => { clearInterval(tm); root.removeEventListener("click", onClick); };
  }

  // ---------- 2) کوییز سریع ----------
  const Q = [
    { q: ["برای شستن دست‌ها کدام روش بهینه است؟", "Which is the best way to wash your hands?"], a: ["بستن شیر هنگام مالش صابون", "Turn off the tap while lathering"], w: [["شیر آب باز و صابون", "Tap running while soaping"], ["شستن با آب گرم طولانی", "Long washes with hot water"], ["آبکشی چندباره اضافه", "Rinsing several extra times"]] },
    { q: ["کدام لامپ انرژی کمتری مصرف می‌کند؟", "Which bulb uses the least energy?"], a: ["LED", "LED"], w: [["رشته‌ای", "Incandescent"], ["هالوژن", "Halogen"], ["هر سه مثل هم", "All the same"]] },
    { q: ["کدام یک دیرتر از همه در طبیعت تجزیه می‌شود؟", "Which takes longest to break down in nature?"], a: ["بطری پلاستیکی", "Plastic bottle"], w: [["پوست موز", "Banana peel"], ["برگ درخت", "A leaf"], ["کاغذ روزنامه", "Newspaper"]] },
    { q: ["باتری‌های مصرف‌شده را کجا ببریم؟", "Where should used batteries go?"], a: ["نقطهٔ جمع‌آوری باتری", "A battery collection point"], w: [["سطل زبالهٔ معمولی", "The regular bin"], ["توالت", "Down the toilet"], ["باغچه", "The garden"]] },
    { q: ["بهترین زمان آبیاری گیاهان چه موقع است؟", "When is the best time to water plants?"], a: ["صبح زود یا غروب", "Early morning or dusk"], w: [["ظهر تابستان", "Midday in summer"], ["اوج گرمای بعدازظهر", "The hottest part of the afternoon"], ["فرقی ندارد", "It makes no difference"]] },
    { q: ["برای یک مسیر کوتاه کدام گزینه کمترین آلودگی را دارد؟", "For a short trip, which causes the least pollution?"], a: ["پیاده‌روی یا دوچرخه", "Walking or cycling"], w: [["خودروی شخصی", "Private car"], ["موتورسیکلت", "Motorbike"], ["تاکسی اینترنتی", "Ride-hailing taxi"]] },
    { q: ["دستگاه‌های برقی در حالت آماده‌باش چه می‌کنند؟", "What do devices on standby do?"], a: ["همچنان کمی برق مصرف می‌کنند", "They still use some power"], w: [["هیچ برقی مصرف نمی‌کنند", "Use no power at all"], ["برق تولید می‌کنند", "Produce power"], ["فقط شب برق می‌گیرند", "Only draw power at night"]] },
    { q: ["کمپوست‌کردن پسماند میوه و سبزی چه چیزی می‌سازد؟", "What does composting fruit and veg scraps make?"], a: ["خاک و کود طبیعی", "Natural soil and fertiliser"], w: [["پلاستیک تازه", "New plastic"], ["شیشه", "Glass"], ["سوخت خودرو", "Car fuel"]] },
    { q: ["کدام منبع انرژی تجدیدپذیر است؟", "Which energy source is renewable?"], a: ["خورشید", "The sun"], w: [["زغال‌سنگ", "Coal"], ["نفت", "Oil"], ["گاز طبیعی", "Natural gas"]] },
    { q: ["یک شیر چکه‌کن در طول زمان چه می‌کند؟", "What does a dripping tap do over time?"], a: ["مقدار زیادی آب هدر می‌دهد", "Wastes a lot of water"], w: [["آب را تمیز می‌کند", "Cleans the water"], ["فشار آب را بیشتر می‌کند", "Raises water pressure"], ["اثری ندارد", "Has no effect"]] }
  ];
  function quizGame(root, ctx) {
    const N = 8, qs = shuffle(Q).slice(0, N);
    let i = 0, score = 0, correct = 0, t0 = 0, locked = false, ended = false, opts = [], to;
    function show() {
      const q = qs[i]; opts = shuffle([{ s: p(q.a), ok: true }, ...q.w.map(w => ({ s: p(w), ok: false }))]);
      root.innerHTML = head(p(["کوییز سریع", "Quick quiz"]), `${nf(i + 1)}/${nf(N)}`) +
        `<div class="g-bar"><i style="width:${(i + 1) / N * 100}%"></i></div><div class="g-card"><h2>${p(q.q)}</h2></div>` +
        opts.map((o, k) => `<button class="g-opt" data-gopt="${k}" type="button">${o.s}</button>`).join("");
      t0 = Date.now(); locked = false;
    }
    function finish() {
      ended = true;
      const r = ctx.finish({ xp: score, stats: { correct } });
      result(root, "quiz", r, [[u("correct"), nf(correct) + "/" + nf(N)], [u("mistakes"), nf(N - correct)], [u("acc"), nf(Math.round(correct / N * 100)) + (lg() ? "%" : "٪")]]);
    }
    const onClick = e => {
      const b = e.target.closest("[data-gopt]"); if (!b || locked || ended) return; locked = true;
      const o = opts[+b.dataset.gopt], sec = (Date.now() - t0) / 1000, btns = root.querySelectorAll("[data-gopt]");
      if (o.ok) { correct++; score += 8 + (sec <= 4 ? 2 : sec <= 8 ? 1 : 0); b.classList.add("ok"); }
      else { b.classList.add("bad"); btns[opts.findIndex(x => x.ok)].classList.add("ok"); }
      to = setTimeout(() => { i++; i >= N ? finish() : show(); }, 800);
    };
    root.addEventListener("click", onClick); show();
    return () => { clearTimeout(to); root.removeEventListener("click", onClick); };
  }

  // ---------- 3) جفتیابی سبز ----------
  function memoryGame(root, ctx) {
    const EM = ["🌱", "🌍", "♻️", "💧", "☀️", "🌳", "🦋", "🐝"], deck = shuffle([...EM, ...EM]);
    let open = [], found = 0, moves = 0, locked = false, ended = false, tm, to;
    const t0 = Date.now(), secs = () => Math.floor((Date.now() - t0) / 1000);
    root.innerHTML = head(p(["جفتیابی سبز", "Green match"]), `<span id="mTime">⏱ ${nf(0)}</span>`) +
      `<p class="g-sub" id="mSub"></p><div class="g-grid">${deck.map((e, k) => `<button class="g-mem" data-gcard="${k}" type="button" aria-label="card"><span>${e}</span></button>`).join("")}</div>
      <div class="how-card"><p>${p(["هر جفت درست ۸ امتیاز دارد. هر چه سریع‌تر تمام کنی، پاداش زمان بیشتری می‌گیری.", "Each pair is worth 8 points. The faster you finish, the bigger your time bonus."])}</p></div>`;
    const sub = () => { root.querySelector("#mSub").textContent = lg() ? `${found} of 8 pairs found · ${moves} moves` : `${nf(found)} از ${nf(8)} جفت پیدا شد · ${nf(moves)} حرکت`; };
    function finish() {
      ended = true; clearInterval(tm);
      const e = secs(), bonus = Math.max(0, 6 - Math.floor(e / 10));
      const r = ctx.finish({ xp: 64 + bonus, stats: { moves, time: e } });
      result(root, "memory", r, [[u("moves"), nf(moves)], [u("time"), nf(e) + p(["ث", "s"])], [u("pairs"), nf(8) + "/" + nf(8)]]);
    }
    const onClick = e => {
      const b = e.target.closest("[data-gcard]");
      if (!b || locked || ended || b.classList.contains("open") || b.classList.contains("done")) return;
      b.classList.add("open"); open.push(b);
      if (open.length < 2) return;
      moves++; const [a, c] = open; open = [];
      if (deck[+a.dataset.gcard] === deck[+c.dataset.gcard]) {
        a.classList.replace("open", "done"); c.classList.replace("open", "done"); found++; sub();
        if (found === 8) finish();
      } else {
        locked = true; sub();
        to = setTimeout(() => { a.classList.remove("open"); c.classList.remove("open"); locked = false; }, 700);
      }
    };
    root.addEventListener("click", onClick); sub();
    tm = setInterval(() => { const el = root.querySelector("#mTime"); if (el) el.textContent = "⏱ " + nf(secs()); }, 1000);
    return () => { clearInterval(tm); clearTimeout(to); root.removeEventListener("click", onClick); };
  }

  // ---------- API برای script.js ----------
  let cleanup = null, common = null, rootEl = null;
  function stop() {
    if (cleanup) cleanup(); if (rootEl && common) rootEl.removeEventListener("click", common);
    cleanup = common = rootEl = null;
  }
  function mount(id, root, ctx) {
    stop(); rootEl = root;
    common = e => { if (e.target.closest("[data-gback]")) ctx.exit(); else if (e.target.closest("[data-gagain]")) ctx.replay(); };
    root.addEventListener("click", common);
    cleanup = ({ sort: sortGame, quiz: quizGame, memory: memoryGame })[id](root, ctx);
  }
  window.GreenGames = { META, mount, stop };
})();