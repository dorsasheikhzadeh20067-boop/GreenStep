// games.js — مینی‌گیم‌های GreenStep + سبزک (راهنمای بازیکن). قبل از script.js بارگذاری می‌شود.
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
    moves: ["حرکت", "Moves"], time: ["زمان", "Time"], pairs: ["جفت", "Pairs"],
    sz: ["سبزک", "Sabzak"], beaten: ["بحران شکست خورد:", "Crisis defeated:"],
    sortStart: ["هر زباله را به سطل درستش بینداز. اگر اشتباه کنی، دلیلش را می‌گویم!", "Drop each item in the right bin. If you slip up, I'll explain why!"],
    sortWrong: ["نه! «{i}» باید در سطل «{b}» برود. {w}", "Not quite! \"{i}\" goes in the \"{b}\" bin. {w}"],
    sortStreak: ["🔥 {n} درست پشت‌سرهم! ادامه بده!", "🔥 {n} in a row! Keep going!"],
    sortOk: ["آفرین! بعدی را هم بزن.", "Nice! On to the next one."],
    sortEndGood: ["عالی جدا کردی! در خانه هم دو سطل جدا بگذار تا تفکیک عادت شود.", "Great sorting! At home, keep two separate bins so sorting becomes a habit."],
    sortEndWeak: ["بیشتر اشتباه‌هایت سر سطل «{b}» بود. یک دور دیگر امتحان کن؛ یادگیری همین است!", "Most of your slips were with the \"{b}\" bin. Try another round, that's how we learn!"],
    sortEndNone: ["هنوز زباله‌ای جدا نکردی؛ یک دور دیگر بازی کن!", "You haven't sorted anything yet, try another round!"],
    quizStart: ["سؤال را بخوان و سریع جواب بده؛ جواب سریع‌تر پاداش بیشتری دارد!", "Read the question and answer fast; quicker answers earn a bigger bonus!"],
    quizOk: ["✅ درسته! ", "✅ Correct! "], quizBad: ["❌ جواب درست: «{a}». ", "❌ The right answer: \"{a}\". "],
    quizEndGood: ["عالی بودی! این نکته‌ها را به یک دوست هم بگو؛ عادت‌ها مسری‌اند.", "Excellent! Share these tips with a friend; habits spread."],
    quizEndWeak: ["نکته‌های بالا را یک بار دیگر بخوان و دوباره امتحان کن؛ دفعهٔ بعد بهتر می‌شود.", "Read the tips above once more and try again; you'll do better next time."],
    memStart: ["کارت‌ها را بچرخان و جفت‌ها را پیدا کن؛ با هر جفت یک نکتهٔ سبز یاد می‌گیری!", "Flip the cards and find the pairs; every pair teaches you a green tip!"],
    memPreview: ["پیش‌نمایش! جای کارت‌ها را حفظ کن.", "Preview! Memorise where the cards are."],
    memMiss: ["جای این دو کارت را یادت بماند و دوباره تلاش کن.", "Remember where these two are and try again."],
    memEnd: ["۸ نکتهٔ سبز یاد گرفتی! با همین نکته‌ها در زندگی روزمره هم قهرمان باش.", "You learned 8 green tips! Use them in daily life too."]
  };
  const u = k => p(UI[k]);
  const fill = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k]);

  const META = [
    { id: "sort", icon: "♻️", tone: "lime", title: ["جدا کردن زباله", "Waste sorting"], desc: ["هر زباله را در سطل درست بینداز", "Drop each item in the right bin"], info: ["۶۰ ثانیه · تا ۹۰ XP", "60 s · up to 90 XP"] },
    { id: "quiz", icon: "🧠", tone: "amber", title: ["کوییز سریع", "Quick quiz"], desc: ["چند سؤال، چند ثانیه، چند امتیاز", "A few questions, a few seconds, a few points"], info: ["۸ سؤال · تا ۸۰ XP", "8 questions · up to 80 XP"] },
    { id: "memory", icon: "🃏", tone: "cyan", title: ["جفتیابی سبز", "Green match"], desc: ["جفت‌های هم‌شکل را پیدا کن", "Find the matching pairs"], info: ["۱۶ کارت · تا ۷۰ XP", "16 cards · up to 70 XP"] }
  ];
  const meta = id => META.find(m => m.id === id);

  const head = (title, chip) => `<div class="g-head"><button class="g-back" data-gback type="button" aria-label="${u("back")}">${lg() ? "←" : "→"}</button><h1>${title}</h1><span class="g-chip">${chip}</span></div>`;

  // ---------- سبزک ----------
  const coach = msg => `<div class="sz-coach" id="szCoach"><img class="sz-img" src="sabzak.jpg" alt="${u("sz")}"><div class="sz-bubble"><b class="sz-name">${u("sz")}</b><p id="szText">${msg}</p></div></div>`;
  const say = (root, msg) => { const el = root.querySelector("#szText"); if (el) el.textContent = msg; };

  function result(root, id, r, lines, lesson, ctx) {
    const step = ctx.next ? ctx.next() : "";
    root.innerHTML = `<div class="g-result"><div class="g-big">${meta(id).icon}</div><h2>${u("done")}</h2>
      <p class="g-xp">+${nf(r.gain)} XP</p>
      ${r.coins ? `<p class="g-tag">🪙 +${nf(r.coins)}</p>` : ""}
      ${r.doubled && !r.practice ? `<p class="g-tag">⚡ ${u("doubled")}</p>` : ""}
      ${r.beatenTitle ? `<p class="g-tag">🏆 ${u("beaten")} «${r.beatenTitle}»</p>` : ""}
      ${r.practice ? `<p class="note">${u("practice")}</p>` : ""}
      <div class="stat-grid">${lines.map(([k, v]) => `<div class="stat-tile"><b>${v}</b><small>${k}</small></div>`).join("")}</div>
      <div class="sz-coach"><img class="sz-img" src="sabzak.jpg" alt="${u("sz")}"><div class="sz-bubble"><b class="sz-name">${u("sz")}</b><p>${lesson}</p>${step ? `<p class="sz-step">${step}</p>` : ""}</div></div>
      <button class="primary-button" data-gagain type="button">${u("again")}</button>
      <button class="text-button" data-gback type="button">${u("home")}</button></div>`;
  }

  // ---------- 1) جدا کردن زباله ----------
  function sortGame(root, ctx) {
    const lv = ctx.level || 1;
    const BINS = [
      { id: "plastic", icon: "🧴", t: ["پلاستیک", "Plastic"], s: ["بسته‌بندی و ظرف", "Packaging & containers"] },
      { id: "paper", icon: "📄", t: ["کاغذ", "Paper"], s: ["کاغذ و مقوا", "Paper & cardboard"] },
      { id: "organic", icon: "🍃", t: ["آلی", "Organic"], s: ["پسماند تر", "Wet waste"] },
      { id: "glass", icon: "🍾", t: ["شیشه", "Glass"], s: ["شیشه و بلور", "Glass & crystal"] }
    ];
    const binName = id => p(BINS.find(b => b.id === id).t);
    // [emoji, [name], bin, [why]]
    const ITEMS = [
      ["🍌", ["پوست میوه", "Fruit peel"], "organic", ["پوست میوه پسماند تر است؛ در سطل آلی می‌رود و کمپوست می‌شود.", "Fruit peel is wet waste; it can be composted."]],
      ["🍎", ["هستهٔ سیب", "Apple core"], "organic", ["باقی‌ماندهٔ میوه آلی است و در طبیعت تجزیه می‌شود.", "Fruit leftovers are organic and break down naturally."]],
      ["🥚", ["پوست تخم‌مرغ", "Eggshell"], "organic", ["پوست تخم‌مرغ آلی است و برای خاک مفید است.", "Eggshell is organic and good for soil."]],
      ["🥬", ["سبزی خراب", "Spoiled greens"], "organic", ["سبزی خراب پسماند تر است؛ نباید با زبالهٔ خشک قاطی شود.", "Spoiled greens are wet waste; don't mix them with dry waste."]],
      ["🍂", ["برگ خشک", "Dry leaves"], "organic", ["برگ خشک آلی است و کود خوبی می‌شود.", "Dry leaves are organic and make good compost."]],
      ["🍊", ["پوست پرتقال", "Orange peel"], "organic", ["پوست پرتقال آلی است و در کمپوست تجزیه می‌شود.", "Orange peel is organic and breaks down in compost."]],
      ["🧴", ["بطری شامپو", "Shampoo bottle"], "plastic", ["بطری پلاستیکی بسته‌بندی است؛ خالی و شسته در سطل پلاستیک بینداز.", "A plastic bottle is packaging; rinse it and put it in the plastic bin."]],
      ["🛍️", ["کیسهٔ پلاستیکی", "Plastic bag"], "plastic", ["کیسهٔ پلاستیکی دیر تجزیه می‌شود؛ کمتر مصرفش کن و بازیافتش کن.", "Plastic bags break down very slowly; use fewer and recycle them."]],
      ["🥡", ["ظرف یک‌بارمصرف", "Takeaway box"], "plastic", ["ظرف یک‌بارمصرف پلاستیکی است؛ بعد از شستن بازیافت می‌شود.", "A takeaway box is plastic; rinse it before recycling."]],
      ["🥤", ["لیوان پلاستیکی", "Plastic cup"], "plastic", ["لیوان پلاستیکی از پلاستیک است و باید جدا بازیافت شود.", "A plastic cup is plastic and should be recycled separately."]],
      ["📰", ["روزنامه", "Newspaper"], "paper", ["روزنامه کاغذ است و کاملاً قابل بازیافت است.", "Newspaper is paper and fully recyclable."]],
      ["📦", ["جعبهٔ مقوایی", "Cardboard box"], "paper", ["مقوا هم مثل کاغذ بازیافت می‌شود؛ آن را تا کن تا جا کم بگیرد.", "Cardboard is recycled like paper; flatten it to save space."]],
      ["📄", ["برگهٔ باطله", "Scrap paper"], "paper", ["برگهٔ باطله را خشک نگه دار و در سطل کاغذ بینداز.", "Keep scrap paper dry and put it in the paper bin."]],
      ["✉️", ["پاکت نامه", "Envelope"], "paper", ["پاکت نامه کاغذی است و در سطل کاغذ می‌رود.", "An envelope is paper and goes in the paper bin."]],
      ["🍾", ["بطری شیشه‌ای", "Glass bottle"], "glass", ["شیشه را بارها و بارها می‌شود بازیافت کرد، بدون اینکه کیفیتش افت کند.", "Glass can be recycled again and again without losing quality."]],
      ["🍷", ["جام شیشه‌ای", "Wine glass"], "glass", ["ظرف شیشه‌ای در سطل شیشه می‌رود؛ با احتیاط جابه‌جایش کن.", "Glassware goes in the glass bin; handle it carefully."]],
      ["🫙", ["شیشهٔ مربا", "Jam jar"], "glass", ["شیشهٔ خالی را بشوی و بینداز؛ یا دوباره استفاده‌اش کن.", "Rinse an empty jar and recycle it, or reuse it."]],
      ["🥃", ["لیوان شیشه‌ای", "Glass tumbler"], "glass", ["لیوان شیشه‌ای هم شیشه است و در سطل شیشه می‌رود.", "A glass tumbler is glass and goes in the glass bin."]]
    ];
    const DUR = (60 + 10 * (lv - 1)) * 1000, MAXXP = 90 + 15 * (lv - 1);
    let queue = [], cur, correct = 0, wrong = 0, streak = 0, msg = u("sortStart"), ended = false, tm;
    const miss = {};
    const end = Date.now() + DUR, left = () => Math.max(0, end - Date.now());
    const score = () => Math.min(MAXXP, correct * 3);
    const acc = () => { const n = correct + wrong; return n ? Math.round(correct / n * 100) : 0; };
    const next = () => { if (!queue.length) queue = shuffle(ITEMS); cur = queue.pop(); };

    function paint() {
      root.innerHTML = head(p(["جدا کردن زباله", "Waste sorting"]), `<span id="sScore">${nf(score())}</span> 🎯`) +
        `<div class="g-timer"><b id="sSec">${nf(Math.ceil(left() / 1000))}</b><div class="g-bar"><i id="sBar" style="width:${left() / DUR * 100}%"></i></div></div>
        <div class="g-card" id="sCard"><div class="g-emoji">${cur[0]}</div><h2>${p(cur[1])}</h2><p>${p(["این زباله کجا می‌رود؟", "Where does this go?"])}</p></div>
        <div class="g-bins">${BINS.map(b => `<button class="g-bin bin-${b.id}" data-gbin="${b.id}" type="button"><span>${b.icon}</span><b>${p(b.t)}</b><small>${p(b.s)}</small></button>`).join("")}</div>
        <div class="g-foot"><span>${u("mistakes")}: ${nf(wrong)}</span><span>${nf(acc())}${p(["٪ این دور", "% this round"])}</span></div>` + coach(msg);
    }
    function finish() {
      if (ended) return; ended = true; clearInterval(tm);
      const r = ctx.finish({ xp: score(), stats: { correct, wrong } });
      const worst = Object.keys(miss).sort((a, b) => miss[b] - miss[a])[0];
      const lesson = !(correct + wrong) ? u("sortEndNone") : acc() >= 80 || !worst ? u("sortEndGood") : fill(u("sortEndWeak"), { b: binName(worst) });
      result(root, "sort", r, [[u("correct"), nf(correct)], [u("mistakes"), nf(wrong)], [u("acc"), nf(acc()) + (lg() ? "%" : "٪")]], lesson, ctx);
    }
    const onClick = e => {
      const b = e.target.closest("[data-gbin]"); if (!b || ended) return;
      const ok = b.dataset.gbin === cur[2], prev = cur;
      if (ok) { correct++; streak++; msg = streak >= 3 ? fill(u("sortStreak"), { n: nf(streak) }) : u("sortOk"); }
      else { wrong++; streak = 0; miss[prev[2]] = (miss[prev[2]] || 0) + 1; msg = fill(u("sortWrong"), { i: p(prev[1]), b: binName(prev[2]), w: p(prev[3]) }); }
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
    { q: ["برای شستن دست‌ها کدام روش بهینه است؟", "Which is the best way to wash your hands?"], a: ["بستن شیر هنگام مالش صابون", "Turn off the tap while lathering"], w: [["شیر آب باز و صابون", "Tap running while soaping"], ["شستن با آب گرم طولانی", "Long washes with hot water"], ["آبکشی چندباره اضافه", "Rinsing several extra times"]], x: ["وقتی صابون می‌مالی شیر را ببند؛ آب در آن لحظه به هیچ کاری نمی‌آید.", "Turn the tap off while you lather; the water does nothing useful then."] },
    { q: ["کدام لامپ انرژی کمتری مصرف می‌کند؟", "Which bulb uses the least energy?"], a: ["LED", "LED"], w: [["رشته‌ای", "Incandescent"], ["هالوژن", "Halogen"], ["هر سه مثل هم", "All the same"]], x: ["LED برای همان روشنایی انرژی خیلی کمتری مصرف می‌کند و عمر بیشتری هم دارد.", "An LED gives the same light with far less energy and lasts longer."] },
    { q: ["کدام یک دیرتر از همه در طبیعت تجزیه می‌شود؟", "Which takes longest to break down in nature?"], a: ["بطری پلاستیکی", "Plastic bottle"], w: [["پوست موز", "Banana peel"], ["برگ درخت", "A leaf"], ["کاغذ روزنامه", "Newspaper"]], x: ["پلاستیک صدها سال طول می‌کشد تا تجزیه شود؛ پوست موز و برگ خیلی زودتر.", "Plastic takes hundreds of years to break down; peels and leaves take far less."] },
    { q: ["باتری‌های مصرف‌شده را کجا ببریم؟", "Where should used batteries go?"], a: ["نقطهٔ جمع‌آوری باتری", "A battery collection point"], w: [["سطل زبالهٔ معمولی", "The regular bin"], ["توالت", "Down the toilet"], ["باغچه", "The garden"]], x: ["باتری فلزات سمی دارد؛ در سطل معمولی خاک و آب را آلوده می‌کند.", "Batteries contain toxic metals that can pollute soil and water if binned."] },
    { q: ["بهترین زمان آبیاری گیاهان چه موقع است؟", "When is the best time to water plants?"], a: ["صبح زود یا غروب", "Early morning or dusk"], w: [["ظهر تابستان", "Midday in summer"], ["اوج گرمای بعدازظهر", "The hottest part of the afternoon"], ["فرقی ندارد", "It makes no difference"]], x: ["صبح زود و غروب هوا خنک‌تر است و آب کمتر تبخیر می‌شود.", "Mornings and evenings are cooler, so less water evaporates."] },
    { q: ["برای یک مسیر کوتاه کدام گزینه کمترین آلودگی را دارد؟", "For a short trip, which causes the least pollution?"], a: ["پیاده‌روی یا دوچرخه", "Walking or cycling"], w: [["خودروی شخصی", "Private car"], ["موتورسیکلت", "Motorbike"], ["تاکسی اینترنتی", "Ride-hailing taxi"]], x: ["پیاده‌روی و دوچرخه دود تولید نمی‌کنند و برای سلامتی هم خوب‌اند.", "Walking and cycling make no exhaust and are good for your health too."] },
    { q: ["دستگاه‌های برقی در حالت آماده‌باش چه می‌کنند؟", "What do devices on standby do?"], a: ["همچنان کمی برق مصرف می‌کنند", "They still use some power"], w: [["هیچ برقی مصرف نمی‌کنند", "Use no power at all"], ["برق تولید می‌کنند", "Produce power"], ["فقط شب برق می‌گیرند", "Only draw power at night"]], x: ["دستگاه‌ها در حالت آماده‌باش هم برق می‌کشند؛ بهتر است کامل خاموش یا از برق جدا شوند.", "Standby devices still draw power; switch them off fully or unplug them."] },
    { q: ["کمپوست‌کردن پسماند میوه و سبزی چه چیزی می‌سازد؟", "What does composting fruit and veg scraps make?"], a: ["خاک و کود طبیعی", "Natural soil and fertiliser"], w: [["پلاستیک تازه", "New plastic"], ["شیشه", "Glass"], ["سوخت خودرو", "Car fuel"]], x: ["کمپوست پسماند میوه و سبزی را به خاک غنی و کود طبیعی تبدیل می‌کند.", "Composting turns fruit and veg scraps into rich soil and natural fertiliser."] },
    { q: ["کدام منبع انرژی تجدیدپذیر است؟", "Which energy source is renewable?"], a: ["خورشید", "The sun"], w: [["زغال‌سنگ", "Coal"], ["نفت", "Oil"], ["گاز طبیعی", "Natural gas"]], x: ["خورشید تمام‌نشدنی است؛ زغال‌سنگ، نفت و گاز سوخت‌های فسیلی‌اند و تمام می‌شوند.", "The sun won't run out; coal, oil and gas are fossil fuels and will."] },
    { q: ["یک شیر چکه‌کن در طول زمان چه می‌کند؟", "What does a dripping tap do over time?"], a: ["مقدار زیادی آب هدر می‌دهد", "Wastes a lot of water"], w: [["آب را تمیز می‌کند", "Cleans the water"], ["فشار آب را بیشتر می‌کند", "Raises water pressure"], ["اثری ندارد", "Has no effect"]], x: ["یک شیر چکه‌کن در طول سال هزاران لیتر آب هدر می‌دهد؛ تعمیرش ساده است.", "A dripping tap wastes thousands of litres a year; fixing it is easy."] }
  ];
  function quizGame(root, ctx) {
    const lv = ctx.level || 1, W1 = 4 + 2 * (lv - 1), W2 = 8 + 2 * (lv - 1);
    const N = 8, qs = shuffle(Q).slice(0, N);
    let i = 0, score = 0, correct = 0, t0 = 0, locked = false, ended = false, opts = [], to;
    function show() {
      const q = qs[i]; opts = shuffle([{ s: p(q.a), ok: true }, ...q.w.map(w => ({ s: p(w), ok: false }))]);
      root.innerHTML = head(p(["کوییز سریع", "Quick quiz"]), `${nf(i + 1)}/${nf(N)}`) +
        `<div class="g-bar"><i style="width:${(i + 1) / N * 100}%"></i></div><div class="g-card"><h2>${p(q.q)}</h2></div>` +
        opts.map((o, k) => `<button class="g-opt" data-gopt="${k}" type="button">${o.s}</button>`).join("") + coach(u("quizStart"));
      t0 = Date.now(); locked = false;
    }
    function finish() {
      ended = true;
      const r = ctx.finish({ xp: score, stats: { correct } });
      result(root, "quiz", r, [[u("correct"), nf(correct) + "/" + nf(N)], [u("mistakes"), nf(N - correct)], [u("acc"), nf(Math.round(correct / N * 100)) + (lg() ? "%" : "٪")]], correct >= 6 ? u("quizEndGood") : u("quizEndWeak"), ctx);
    }
    const onClick = e => {
      const b = e.target.closest("[data-gopt]"); if (!b || locked || ended) return; locked = true;
      const q = qs[i], o = opts[+b.dataset.gopt], sec = (Date.now() - t0) / 1000, btns = root.querySelectorAll("[data-gopt]");
      if (o.ok) { correct++; score += 8 + (sec <= W1 ? 2 : sec <= W2 ? 1 : 0); b.classList.add("ok"); say(root, u("quizOk") + p(q.x)); }
      else { b.classList.add("bad"); btns[opts.findIndex(x => x.ok)].classList.add("ok"); say(root, fill(u("quizBad"), { a: p(q.a) }) + p(q.x)); }
      to = setTimeout(() => { i++; i >= N ? finish() : show(); }, 2600);
    };
    root.addEventListener("click", onClick); show();
    return () => { clearTimeout(to); root.removeEventListener("click", onClick); };
  }

  // ---------- 3) جفتیابی سبز ----------
  const FACTS = {
    "🌱": ["یک نهال کوچک امروز، یک درخت سایه‌دار فردا می‌شود.", "A tiny sapling today is a shady tree tomorrow."],
    "🌍": ["زمین تنها خانهٔ ماست؛ هر کار کوچک به حساب می‌آید.", "Earth is our only home; every small action counts."],
    "♻️": ["بازیافت آلومینیوم بیشترِ انرژی ساخت یک قوطی تازه را صرفه‌جویی می‌کند.", "Recycling aluminium saves most of the energy needed to make a new can."],
    "💧": ["بستن شیر هنگام مسواک زدن هر بار چند لیتر آب صرفه‌جویی می‌کند.", "Turning off the tap while brushing saves several litres each time."],
    "☀️": ["پنل خورشیدی از نور خورشید برق تمیز می‌سازد.", "Solar panels turn sunlight into clean electricity."],
    "🌳": ["درخت‌ها دی‌اکسید کربن جذب می‌کنند و هوا را خنک‌تر می‌کنند.", "Trees absorb carbon dioxide and cool the air."],
    "🦋": ["پروانه‌ها گرده‌افشانی می‌کنند و نشانهٔ سلامت طبیعت‌اند.", "Butterflies pollinate flowers and signal a healthy nature."],
    "🐝": ["زنبورها گرده‌افشانی می‌کنند؛ بخش بزرگی از غذای ما به آن‌ها وابسته است.", "Bees pollinate plants; a big part of our food depends on them."]
  };
  function memoryGame(root, ctx) {
    const lv = ctx.level || 1;
    const EM = Object.keys(FACTS), deck = shuffle([...EM, ...EM]);
    let open = [], found = 0, moves = 0, locked = true, ended = false, tm, to, t0 = Date.now();
    const secs = () => Math.floor((Date.now() - t0) / 1000);
    root.innerHTML = head(p(["جفتیابی سبز", "Green match"]), `<span id="mTime">⏱ ${nf(0)}</span>`) +
      `<p class="g-sub" id="mSub"></p><div class="g-grid">${deck.map((e, k) => `<button class="g-mem" data-gcard="${k}" type="button" aria-label="card"><span>${e}</span></button>`).join("")}</div>` + coach(u("memStart"));
    const cards = [...root.querySelectorAll(".g-mem")];
    const sub = () => { root.querySelector("#mSub").textContent = lg() ? `${found} of 8 pairs found · ${moves} moves` : `${nf(found)} از ${nf(8)} جفت پیدا شد · ${nf(moves)} حرکت`; };
    const prev = (lv - 1) * 1500; // سطح ۲ و ۳: پیش‌نمایش کارت‌ها در شروع
    if (prev) {
      cards.forEach(c => c.classList.add("open")); say(root, u("memPreview"));
      to = setTimeout(() => { cards.forEach(c => c.classList.remove("open")); locked = false; t0 = Date.now(); say(root, u("memStart")); }, prev);
    } else locked = false;
    function finish() {
      ended = true; clearInterval(tm);
      const e = secs(), bonus = Math.max(0, 6 - Math.floor(e / 10));
      const r = ctx.finish({ xp: 64 + bonus, stats: { moves, time: e } });
      result(root, "memory", r, [[u("moves"), nf(moves)], [u("time"), nf(e) + p(["ث", "s"])], [u("pairs"), nf(8) + "/" + nf(8)]], u("memEnd"), ctx);
    }
    const onClick = e => {
      const b = e.target.closest("[data-gcard]");
      if (!b || locked || ended || b.classList.contains("open") || b.classList.contains("done")) return;
      b.classList.add("open"); open.push(b);
      if (open.length < 2) return;
      moves++; const [a, c] = open; open = [];
      if (deck[+a.dataset.gcard] === deck[+c.dataset.gcard]) {
        a.classList.replace("open", "done"); c.classList.replace("open", "done"); found++; sub();
        say(root, p(FACTS[deck[+a.dataset.gcard]]));
        if (found === 8) finish();
      } else {
        locked = true; sub(); say(root, u("memMiss"));
        to = setTimeout(() => { a.classList.remove("open"); c.classList.remove("open"); locked = false; }, 700);
      }
    };
    root.addEventListener("click", onClick); sub();
    tm = setInterval(() => { const el = root.querySelector("#mTime"); if (el) el.textContent = "⏱ " + nf(Math.max(0, secs())); }, 1000);
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