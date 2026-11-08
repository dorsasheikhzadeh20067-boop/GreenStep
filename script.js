import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, doc, getDoc, setDoc, collection, query, orderBy, limit, onSnapshot, addDoc, getDocs, deleteDoc, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "./firebase-config.js";
// =====================================
// GREENSTEP 2.0 - Missions, levels, badges, profile, PWA
// Data is stored in this browser only (localStorage).
// =====================================
(() => {
  "use strict";

  const KEYS = { language: "greenstep-language", users: "greenstep-users", currentUser: "greenstep-current-user" };

  const translations = {
    fa: {
      welcome: "سلام، {name}!", todayQuestion: "امروز برای زمین چه کاری انجام می‌دهی؟",
      myPoints: "امتیاز کل من", level: "سطح", nextLevel: "پیشرفت تا سطح بعدی", maxLevel: "به بالاترین سطح رسیدی",
      dailyPlan: "برنامه امروز", todayMissions: "مأموریت‌های امروز", seeAll: "مشاهده همه ←",
      greenTip: "نکته سبز امروز", tipText: "قبل از انداختن زباله در سطل بازیافت، آن را از باقی‌مانده مواد غذایی خالی کن.",
      home: "خانه", missions: "مأموریت‌ها", leaderboard: "رتبه‌بندی", profile: "پروفایل",
      missionsTitle: "مأموریت‌های سبز", missionsDescription: "با انجام کارهای کوچک، امتیاز جمع کن.",
      leaderboardTitle: "جدول رتبه‌بندی", leaderboardDescription: "فعال‌ترین کاربران GreenStep",
      profileTitle: "پروفایل من", totalPoints: "مجموع امتیازها", currentLevel: "سطح فعلی",
      language: "زبان برنامه", changeLanguage: "English", startMission: "انجام مأموریت", completed: "انجام‌شده",
      demoNote: "رتبه‌بندی این نسخه فقط نمایشی است و کاربران واقعی را نشان نمی‌دهد.",
      noMissions: "همه مأموریت‌ها انجام شده‌اند.", noResults: "مأموریتی با این فیلتر پیدا نشد.",
      authEyebrow: "به GreenStep خوش آمدی", loginTitle: "ورود به حساب", loginSubtitle: "نام کاربری خود را وارد کن تا ادامه دهی.",
      registerTitle: "ساخت حساب کاربری", registerSubtitle: "یک نام کاربری انتخاب کن تا حساب آزمایشی‌ات ساخته شود.",
      usernameLabel: "نام کاربری", loginButton: "ورود", registerButton: "ثبت‌نام",
      noAccount: "حساب نداری؟", hasAccount: "قبلاً حساب ساخته‌ای؟", switchRegister: "ثبت‌نام", switchLogin: "ورود",
      localStorageNotice: "این نسخه آزمایشی اطلاعات را فقط در همین مرورگر ذخیره می‌کند.",
      usernameShort: "نام کاربری باید حداقل ۳ حرف یا عدد داشته باشد.", usernameInvalid: "فقط حروف انگلیسی، عدد و زیرخط مجاز است.",
      userExists: "این نام کاربری قبلاً ثبت شده است. وارد حساب شو.", userMissing: "این نام کاربری پیدا نشد. ابتدا ثبت‌نام کن.",
      loginSuccess: "ورود انجام شد.", registerSuccess: "حساب ساخته شد.",
      logout: "خروج از حساب", accountName: "نام کاربری", joined: "حساب آزمایشی GreenStep", confirmLogout: "از حساب خارج می‌شوی؟",
      all: "همه", todo: "در انتظار", doneFilter: "انجام‌شده", progressTitle: "داشبورد پیشرفت",
      doneCount: "مأموریت انجام‌شده", badgesCount: "نشان", levelStat: "سطح",
      badgesTitle: "نشان‌های افتخار", newBadge: "نشان جدید:", levelUp: "ارتقا به سطح {n}!",
      editProfile: "ویرایش پروفایل", displayName: "نام نمایشی", avatarLabel: "آواتار", save: "ذخیره", saved: "پروفایل ذخیره شد.",
      install: "نصب برنامه", installed: "برنامه روی دستگاه نصب شد.", offlineReady: "قابل استفاده آفلاین",
      cat_waste: "پسماند", cat_water: "آب", cat_energy: "انرژی", cat_transport: "حمل‌ونقل", cat_nature: "طبیعت", cat_food: "غذا",
      lvl1: "جوانه", lvl2: "دوستدار طبیعت", lvl3: "نگهبان سبز", lvl4: "قهرمان محیط‌زیست", lvl5: "پیشوای زمین",
      b_first: "اولین قدم", b_five: "پنج مأموریت", b_ten: "ده مأموریت", b_twenty: "بیست مأموریت", b_all: "همه ۳۰ مأموریت",
      b_xp300: "۳۰۰ امتیاز", b_xp600: "۶۰۰ امتیاز", b_lvl3: "رسیدن به سطح ۳", b_lvl5: "رسیدن به سطح ۵", b_cat: "استاد {c}"
    },
    en: {
      welcome: "Hello, {name}!", todayQuestion: "What will you do for the planet today?",
      myPoints: "My total points", level: "Level", nextLevel: "Progress to the next level", maxLevel: "You reached the top level",
      dailyPlan: "Today's plan", todayMissions: "Today's missions", seeAll: "See all →",
      greenTip: "Today's green tip", tipText: "Remove food leftovers before putting waste into the recycling bin.",
      home: "Home", missions: "Missions", leaderboard: "Leaderboard", profile: "Profile",
      missionsTitle: "Green Missions", missionsDescription: "Complete small actions and earn points.",
      leaderboardTitle: "Leaderboard", leaderboardDescription: "The most active GreenStep users",
      profileTitle: "My Profile", totalPoints: "Total points", currentLevel: "Current level",
      language: "App language", changeLanguage: "فارسی", startMission: "Complete mission", completed: "Completed",
      demoNote: "This leaderboard is for demonstration only; it does not show real users.",
      noMissions: "All missions have been completed.", noResults: "No missions match this filter.",
      authEyebrow: "Welcome to GreenStep", loginTitle: "Sign in", loginSubtitle: "Enter your username to continue.",
      registerTitle: "Create an account", registerSubtitle: "Choose a username to create your demo account.",
      usernameLabel: "Username", loginButton: "Sign in", registerButton: "Sign up",
      noAccount: "Don't have an account?", hasAccount: "Already have an account?", switchRegister: "Sign up", switchLogin: "Sign in",
      localStorageNotice: "This demo stores information only in this browser.",
      usernameShort: "Username must contain at least 3 characters.", usernameInvalid: "Use English letters, numbers, and underscores only.",
      userExists: "This username already exists. Please sign in.", userMissing: "Username not found. Please sign up first.",
      loginSuccess: "Signed in.", registerSuccess: "Account created.",
      logout: "Sign out", accountName: "Username", joined: "GreenStep demo account", confirmLogout: "Do you want to sign out?",
      all: "All", todo: "To do", doneFilter: "Completed", progressTitle: "Progress dashboard",
      doneCount: "missions done", badgesCount: "badges", levelStat: "Level",
      badgesTitle: "Badges", newBadge: "New badge:", levelUp: "Level {n} reached!",
      editProfile: "Edit profile", displayName: "Display name", avatarLabel: "Avatar", save: "Save", saved: "Profile saved.",
      install: "Install app", installed: "App installed.", offlineReady: "Works offline",
      cat_waste: "Waste", cat_water: "Water", cat_energy: "Energy", cat_transport: "Transport", cat_nature: "Nature", cat_food: "Food",
      lvl1: "Sprout", lvl2: "Nature Lover", lvl3: "Green Guardian", lvl4: "Eco Hero", lvl5: "Earth Champion",
      b_first: "First step", b_five: "5 missions", b_ten: "10 missions", b_twenty: "20 missions", b_all: "All 30 missions",
      b_xp300: "300 XP", b_xp600: "600 XP", b_lvl3: "Reach level 3", b_lvl5: "Reach level 5", b_cat: "{c} master"
    }
  };

  Object.assign(translations.fa, {
    passwordLabel: "گذرواژه", passwordShort: "گذرواژه باید حداقل ۶ کاراکتر باشد.", wrongCredentials: "نام کاربری یا گذرواژه درست نیست.",
    networkError: "اتصال اینترنت برقرار نیست.", genericError: "مشکلی پیش آمد. دوباره تلاش کن.", loading: "در حال بارگذاری…", noRanks: "هنوز کسی امتیاز نگرفته است.",
    localStorageNotice: "حساب و امتیاز تو آنلاین ذخیره می‌شود و روی همهٔ دستگاه‌ها همگام است.", joined: "حساب GreenStep",
    demoNote: "فقط نام نمایشی و امتیاز تو برای کاربران دیگر دیده می‌شود.", registerSubtitle: "یک نام کاربری و گذرواژه انتخاب کن."
  });
  Object.assign(translations.en, {
    passwordLabel: "Password", passwordShort: "Password must be at least 6 characters.", wrongCredentials: "Username or password is incorrect.",
    networkError: "No internet connection.", genericError: "Something went wrong. Try again.", loading: "Loading…", noRanks: "Nobody has earned points yet.",
    localStorageNotice: "Your account and points are saved online and synced across devices.", joined: "GreenStep account",
    demoNote: "Other users only see your display name and points.", registerSubtitle: "Choose a username and password."
  });
  Object.assign(translations.fa, {
    b_all: "همهٔ مأموریت‌ها", b_forty: "چهل مأموریت",
    networkError: "اتصال به سرور برقرار نشد. اینترنت یا VPN خود را بررسی کن.",
    vpnNotice: "توجه: برای ثبت‌نام و ورود، VPN خود را روشن کن. سرویس حساب کاربری GreenStep روی Firebase اجرا می‌شود و ممکن است بدون VPN در دسترس نباشد."
  });
  Object.assign(translations.en, {
    b_all: "All missions", b_forty: "40 missions",
    networkError: "Could not reach the server. Check your internet or VPN.",
    vpnNotice: "Note: turn on your VPN to sign up or sign in. GreenStep accounts run on Firebase, which may be unreachable without a VPN."
  });
  translations.fa.leaderboardDescription = "رقابت زنده با همهٔ کاربران GreenStep";
  translations.en.leaderboardDescription = "Live competition with all GreenStep users";
  Object.assign(translations.fa, {
    streakDays: "روز پیاپی", gardenTitle: "باغ من", doneToday: "امروز انجام شد", proofTitle: "چطور انجامش دادی؟",
    proofHint: "یک جملهٔ کوتاه بنویس که چطور انجامش دادی (حداقل ۸ حرف).", proofShort: "توضیح خیلی کوتاه است.", submitProof: "ثبت و گرفتن امتیاز", cancel: "انصراف",
    people: "افراد", teams: "تیم‌ها", noTeams: "هنوز تیمی ساخته نشده است. کد تیم را در پروفایل بنویس.", members: "عضو",
    teamLabel: "کد تیم یا کلاس (اختیاری)", soundLabel: "صدای پاداش", on: "روشن", off: "خاموش",
    fbTitle: "نظرت دربارهٔ GreenStep", fbPlaceholder: "نظر یا پیشنهادت را بنویس…", fbSend: "ارسال نظر", fbThanks: "ممنون از نظرت!", fbPick: "اول یک امتیاز از ۱ تا ۵ انتخاب کن.",
    next: "بعدی", start: "شروع", skip: "رد کردن",
    onb1t: "هر روز ۳ مأموریت", onb1d: "هر روز سه مأموریت تازه می‌گیری. هر روز پیاپی، پاداش بیشتری دارد.",
    onb2t: "باغت را بزرگ کن", onb2d: "با هر امتیاز، باغ تو از یک جوانه به درختی پرمیوه تبدیل می‌شود.",
    onb3t: "با تیمت رقابت کن", onb3d: "کد تیم یا کلاست را در پروفایل بنویس تا تیم‌ها در جدول رتبه‌بندی با هم رقابت کنند."
  });
  Object.assign(translations.en, {
    streakDays: "day streak", gardenTitle: "My garden", doneToday: "Done today", proofTitle: "How did you do it?",
    proofHint: "Write one short sentence about how you did it (at least 8 characters).", proofShort: "That note is too short.", submitProof: "Submit and earn XP", cancel: "Cancel",
    people: "People", teams: "Teams", noTeams: "No teams yet. Enter a team code in your profile.", members: "members",
    teamLabel: "Team or class code (optional)", soundLabel: "Reward sound", on: "On", off: "Off",
    fbTitle: "Your feedback on GreenStep", fbPlaceholder: "Write your feedback or suggestion…", fbSend: "Send feedback", fbThanks: "Thanks for your feedback!", fbPick: "Pick a rating from 1 to 5 first.",
    next: "Next", start: "Start", skip: "Skip",
    onb1t: "3 missions every day", onb1d: "You get three fresh missions daily. Each day in a row earns a bigger bonus.",
    onb2t: "Grow your garden", onb2d: "Every point grows your garden from a sprout into a fruit tree.",
    onb3t: "Compete with your team", onb3d: "Enter your team or class code in your profile so teams can compete on the leaderboard."
  });
  Object.assign(translations.fa, {
    vpnNotice: "توجه: برای ثبت‌نام و ورود، VPN خود را روشن کن. سرویس حساب GreenStep روی Firebase اجرا می‌شود و ممکن است بدون VPN در دسترس نباشد. اگر وصل نشد، «حالت مهمان» بدون اینترنت کار می‌کند.",
    guestButton: "ادامه به‌عنوان مهمان (بدون اینترنت)", guestName: "مهمان", guestRank: "در حالت مهمان، رتبه‌بندی و آمار جمعی در دسترس نیست. برای رقابت آنلاین وارد شو.",
    svPreT: "نظرسنجی آغازین", svPostT: "نظرسنجی پایانی", svHint: "۱ = هرگز، ۵ = همیشه", later: "بعداً",
    sv_w: "چقدر هنگام مصرف آب (مسواک، دوش، ظرف‌شویی) صرفه‌جویی می‌کنی؟", sv_e: "چقدر چراغ و وسایل برقی بی‌استفاده را خاموش می‌کنی؟", sv_s: "چقدر زباله را تفکیک یا بازیافت می‌کنی؟",
    svCard: "نظرسنجی کوتاه عادت‌هایت (۳ سؤال)", svTake: "شروع نظرسنجی", svAnswerAll: "به هر سه سؤال جواب بده.", svThanks: "پاسخ‌هایت ثبت شد. ممنون!",
    impactTitle: "اثر تخمینی من", impactNote: "برآورد تقریبی با ضرایب ساده، نه اندازه‌گیری دقیق.",
    imp_water: "لیتر آب", imp_energy: "کیلوواتساعت برق", imp_waste: "کیلو زباله", imp_co2: "کیلو CO₂", imp_nature: "اقدام برای طبیعت",
    statsTitle: "آمار و اثر جمعی", statUsers: "کاربر", statMissions: "مأموریت انجام‌شده", statReturned: "کاربر بازگشته (۲ روز یا بیشتر)", statAll: "همهٔ کاربران",
    statSurveyT: "تغییر عادت‌ها", statSurvey: "تغییر میانگین نمره (آب / برق / زباله)", noSurveyYet: "هنوز کسی هر دو نظرسنجی را کامل نکرده است.",
    forestTitle: "جنگل جمعی", forestNote: "هر ۵۰۰ امتیاز جمعی، یک درخت به جنگل اضافه می‌شود (بر اساس ۱۰۰ کاربر برتر).",
    aboutBtn: "درباره پروژه", statsBtn: "آمار و اثر جمعی", aboutTitle: "درباره GreenStep",
    aboutProblemH: "مسئله", aboutProblem: "بسیاری از ما می‌دانیم باید آب، برق و زباله را کمتر هدر بدهیم، اما این دانش به عادت روزانه تبدیل نمی‌شود. GreenStep کارهای کوچک زیست‌محیطی را به یک بازی روزانه و قابل‌پیگیری تبدیل می‌کند.",
    aboutGoalH: "هدف آزمایشی", aboutGoal: "هر کاربر در هفتهٔ اول دست‌کم ۳ روز فعال باشد و دست‌کم ۱۰ مأموریت انجام دهد، و نمرهٔ عادت‌هایش در نظرسنجی پایانی نسبت به آغاز بالاتر باشد.",
    aboutDesignH: "چرا این مکانیزم‌ها؟", aboutDesign: "• انتخاب دسته و مأموریت: حس انتخاب (خودمختاری)<br>• سطح، نشان و باغ: حس پیشرفت (شایستگی)<br>• تیم و رتبه‌بندی زنده: حس ارتباط با دیگران<br>• مأموریت روزانه و زنجیرهٔ روزها: تکرار تا شکل‌گیری عادت<br>• توضیح کوتاه هنگام ثبت: مسئولیت‌پذیری<br>انتخاب‌ها بر ایدهٔ نظریهٔ خودتعیین‌گری (SDT) تکیه دارند.",
    aboutImpactH: "اثر تخمینی", aboutImpact: "اثر هر مأموریت با ضرایب ساده و تقریبی تخمین زده می‌شود. این اعداد فقط مقیاس اثر را نشان می‌دهند و باید با منابع معتبر تنظیم شوند.",
    aboutPrivacyH: "حریم خصوصی", aboutPrivacy: "فقط نام کاربری، نام نمایشی، امتیاز، کد تیم و پاسخ نظرسنجی در حساب ذخیره می‌شود و برای کاربران دیگر دیده می‌شود. توضیح‌های مأموریت فقط برای خودت قابل‌خواندن است. نظرهای ارسالی ناشناس‌اند. می‌توانی حسابت را از پروفایل حذف کنی.",
    aboutLimitsH: "محدودیت‌ها", aboutLimits: "ثبت مأموریت‌ها مبتنی بر اعتماد است و هنوز تأیید خودکار ندارد. اثر محیط‌زیستی تخمینی است. رتبه‌بندی و آمار جمعی از ۱۰۰ کاربر برتر ساخته می‌شود.",
    deleteAccount: "حذف حساب", deleteTitle: "حذف همیشگی حساب", deleteHint: "حساب و همهٔ اطلاعاتت پاک می‌شود و برگشت‌پذیر نیست. برای تأیید، گذرواژه‌ات را بنویس.", deleteConfirm: "حذف حساب", deleted: "حساب حذف شد."
  });
  Object.assign(translations.en, {
    vpnNotice: "Note: turn on your VPN to sign up or sign in. GreenStep accounts run on Firebase, which may be unreachable without a VPN. If it won't connect, Guest mode works offline.",
    guestButton: "Continue as guest (offline)", guestName: "Guest", guestRank: "Leaderboard and community stats are unavailable in guest mode. Sign in to compete online.",
    svPreT: "Starting survey", svPostT: "Final survey", svHint: "1 = never, 5 = always", later: "Later",
    sv_w: "How often do you save water (brushing, showers, dishes)?", sv_e: "How often do you switch off unused lights and devices?", sv_s: "How often do you sort or recycle waste?",
    svCard: "Short survey about your habits (3 questions)", svTake: "Start survey", svAnswerAll: "Answer all three questions.", svThanks: "Your answers are saved. Thanks!",
    impactTitle: "My estimated impact", impactNote: "Rough estimate using simple factors, not an exact measurement.",
    imp_water: "litres of water", imp_energy: "kWh of energy", imp_waste: "kg of waste", imp_co2: "kg CO₂", imp_nature: "actions for nature",
    statsTitle: "Community stats and impact", statUsers: "users", statMissions: "missions done", statReturned: "returning users (2+ days)", statAll: "All users",
    statSurveyT: "Habit change", statSurvey: "Average score change (water / energy / waste)", noSurveyYet: "Nobody has completed both surveys yet.",
    forestTitle: "Community forest", forestNote: "Every 500 community points adds a tree (based on the top 100 users).",
    aboutBtn: "About the project", statsBtn: "Community stats", aboutTitle: "About GreenStep",
    aboutProblemH: "The problem", aboutProblem: "Many of us know we should waste less water, power and rubbish, but that knowledge rarely becomes a daily habit. GreenStep turns small eco actions into a trackable daily game.",
    aboutGoalH: "Pilot goal", aboutGoal: "In their first week, each user is active on at least 3 days, completes at least 10 missions, and scores higher on the final habit survey than on the first.",
    aboutDesignH: "Why these mechanics?", aboutDesign: "• Choosing categories and missions: a sense of choice (autonomy)<br>• Levels, badges and the garden: a sense of progress (competence)<br>• Teams and the live leaderboard: connection with others<br>• Daily missions and streaks: repetition until it becomes a habit<br>• A short note when logging: accountability<br>These choices draw on self-determination theory (SDT).",
    aboutImpactH: "Estimated impact", aboutImpact: "Each mission's impact is estimated with simple, rough factors. The numbers only show scale and should be calibrated with reliable sources.",
    aboutPrivacyH: "Privacy", aboutPrivacy: "Only your username, display name, points, team code and survey answers are stored in your account and visible to other users. Mission notes are readable only by you. Feedback is anonymous. You can delete your account from your profile.",
    aboutLimitsH: "Limitations", aboutLimits: "Mission logging is trust-based and has no automatic verification yet. Environmental impact is estimated. The leaderboard and community stats use the top 100 users.",
    deleteAccount: "Delete account", deleteTitle: "Delete account permanently", deleteHint: "Your account and all its data will be erased and this cannot be undone. Enter your password to confirm.", deleteConfirm: "Delete account", deleted: "Account deleted."
  });
  const IMP0 = { water: 0, energy: 0, waste: 0, co2: 0, nature: 0 };
  // Rough demo factors per XP (assumptions to replace with sourced figures)
  const IMPF = { water: ["water", 0.5], energy: ["energy", 0.01], waste: ["waste", 0.01], transport: ["co2", 0.02], food: ["co2", 0.03] };
  function impactAdd(imp, m) { if (m.cat === "nature") imp.nature += 1; else { const [k, f] = IMPF[m.cat]; imp[k] += m.points * f; } }
  function calcImpact(ids) { const a = { ...IMP0 }; ids.forEach(id => { const m = M.find(x => x.id === id); if (m) impactAdd(a, m); }); return a; }
  const r1 = v => number(Math.round((v || 0) * 10) / 10);
  function impactHTML(i) {
    const tile = (ic, v, k) => `<div class="stat-tile"><b>${ic} ${r1(v)}</b><small>${t(k)}</small></div>`;
    return `<div class="stat-grid">${tile("💧", i.water, "imp_water")}${tile("⚡", i.energy, "imp_energy")}${tile("🗑️", i.waste, "imp_waste")}${tile("🌫️", i.co2, "imp_co2")}${tile("🌳", i.nature, "imp_nature")}</div>`;
  }
  const TIPS = [["قبل از انداختن زباله در سطل بازیافت، آن را از باقی‌مانده مواد غذایی خالی کن.", "Remove food leftovers before putting waste into the recycling bin."], ["هنگام مسواک زدن شیر آب را ببند.", "Turn off the tap while brushing your teeth."], ["لامپ LED انرژی خیلی کمتری از لامپ رشته‌ای مصرف می‌کند.", "An LED bulb uses far less energy than an incandescent one."], ["کیسهٔ پارچه‌ای را همیشه همراه داشته باش تا لازم نشود کیسهٔ پلاستیکی بگیری.", "Keep a cloth bag with you so you never need a plastic one."], ["شارژر و دستگاه‌های بی‌استفاده را از برق بکش.", "Unplug chargers and devices you are not using."], ["دوش کوتاه‌تر، هم آب را کم می‌کند هم انرژی گرم‌کردن آب را.", "A shorter shower saves both water and the energy used to heat it."], ["غذای باقی‌مانده را برای وعدهٔ بعد نگه دار؛ هدر دادن غذا یعنی هدر دادن آب و انرژی تولیدش.", "Save leftovers for your next meal; wasted food wastes the water and energy used to make it."], ["کاغذ را از دو طرف استفاده کن و بعد بازیافتش کن.", "Use both sides of paper, then recycle it."], ["برای مسیرهای کوتاه پیاده برو یا دوچرخه بزن.", "Walk or cycle for short trips."], ["لباس‌ها را با آب سرد بشوی؛ بیشتر انرژی ماشین لباسشویی صرف گرم کردن آب می‌شود.", "Wash clothes in cold water; most of a washing machine's energy goes to heating the water."], ["یک گیاه خانگی کوچک، گوشه‌ای از خانه را زنده‌تر می‌کند.", "A small houseplant makes a corner of your home feel more alive."], ["قبل از خرید لیست بنویس تا چیز اضافه نخری.", "Write a list before shopping to avoid buying extras."], ["هر بار که از بطری شخصی استفاده می‌کنی، یک بطری یک‌بارمصرف کمتر مصرف شده است.", "Every time you use your own bottle, one less disposable bottle is used."], ["قبل از دورانداختن یک وسیله، فکر کن می‌شود تعمیرش کرد یا به کسی داد.", "Before tossing something, think whether it can be repaired or given away."], ["درز پنجره و در را بگیر تا گرما یا سرما هدر نرود.", "Seal gaps around windows and doors so heat or cool air doesn't escape."], ["لباس‌ها را در هوای آزاد خشک کن.", "Air-dry your laundry when you can."], ["تنظیم کولر یا بخاری حتی یک درجه، در مصرف انرژی اثر دارد.", "Even one degree on your heating or cooling changes energy use."], ["هنگام خروج از اتاق، چراغ را خاموش کن.", "Switch off the light when you leave a room."], ["آب باران یا آب اضافی را برای آبیاری گیاهان جمع کن.", "Collect rain or spare water to water your plants."], ["گیاهان را صبح زود یا غروب آبیاری کن؛ آب کمتر تبخیر می‌شود.", "Water plants early morning or at dusk; less water evaporates."], ["ماشین لباسشویی و ظرفشویی را فقط وقتی پر است روشن کن.", "Run the washing machine and dishwasher only when full."], ["کاشتن یک نهال از ساده‌ترین کارها برای کمک به طبیعت است.", "Planting a sapling is one of the simplest ways to help nature."], ["ظرف آب کوچکی برای پرندگان در روزهای گرم کمک بزرگی است.", "A small dish of water helps birds on hot days."], ["پسماند میوه و سبزی را کمپوست کن؛ هم زباله کم می‌شود هم خاک غنی.", "Compost fruit and vegetable scraps to cut waste and enrich soil."], ["محصول محلی و فصلی معمولاً مسافت حمل کمتری دارد.", "Local, seasonal produce usually travels a shorter distance."], ["گاهی یک وعدهٔ بدون گوشت را امتحان کن.", "Try a meat-free meal now and then."], ["باد مناسب لاستیک، مصرف سوخت را کمتر می‌کند.", "Correct tyre pressure reduces fuel use."], ["چند کار بیرون را در یک سفر انجام بده.", "Combine several errands into one trip."], ["باتری‌های مصرف‌شده را در سطل معمولی نینداز؛ به نقطهٔ جمع‌آوری ببر.", "Don't bin used batteries; take them to a collection point."], ["ایمیل‌ها و فایل‌های غیرضروری را پاک کن؛ ذخیره‌سازی هم برق مصرف می‌کند.", "Delete unneeded emails and files; storage uses electricity too."], ["شیشه و ظرف‌های خالی را دوباره استفاده کن.", "Reuse empty jars and containers."], ["یک عادت سبز را با دوستت در میان بگذار؛ عادت‌ها مسری‌اند.", "Share one green habit with a friend; habits spread."], ["کنار آشپزخانه دو سطل جدا بگذار تا تفکیک زباله آسان شود.", "Keep two separate bins in the kitchen to make sorting easy."], ["هنگام شستن ظرف‌ها شیر آب را دائم باز نگذار.", "Don't leave the tap running while washing dishes."], ["لیوان و قاشق شخصی، جای ظرف‌های یک‌بارمصرف را می‌گیرد.", "Your own cup and spoon replace disposable ones."], ["یک شیر چکه‌کن در طول زمان آب زیادی هدر می‌دهد؛ زود تعمیرش کن.", "A dripping tap wastes a lot of water over time; fix it soon."], ["تا جای ممکن از نور طبیعی روز استفاده کن.", "Use natural daylight as much as you can."], ["پله به‌جای آسانسور، هم برای تو خوب است هم برای مصرف برق.", "Taking the stairs is good for you and for electricity use."], ["اگر در طبیعت زباله دیدی، جمعش کن، حتی اگر مال تو نیست.", "If you see litter in nature, pick it up, even if it isn't yours."], ["تغییر کوچکِ هر روز، از یک کار بزرگِ یک‌باره مؤثرتر است.", "A small change every day beats one big effort once."]];
  let tipIdx = Math.floor(Math.random() * TIPS.length), tipTimer = 0;
  function showTip(next) {
    const el = $("#tipText"); if (!el) return;
    const set = () => { el.textContent = TIPS[tipIdx][language === "fa" ? 0 : 1]; };
    if (!next) { set(); el.style.opacity = 1; return; }
    tipIdx = (tipIdx + 1 + Math.floor(Math.random() * (TIPS.length - 1))) % TIPS.length;
    el.style.opacity = 0;
    setTimeout(() => { set(); el.style.opacity = 1; }, 180);
  }
  const CATS = { waste: "♻️", water: "💧", energy: "⚡", transport: "🚲", nature: "🌱", food: "🥗" };
  const LEVELS = [0, 150, 400, 800, 1300]; // XP needed for levels 1..5
  const AVATARS = ["🌿", "🌍", "🦋", "🐢", "🌻", "🐝", "🌳", "🐦"];

  // [id, icon, category, XP, fa title, en title, fa description, en description]
  const M = [
    [1,"♻️","waste",30,"تفکیک زباله‌های خشک و تر","Separate dry and wet waste","زباله‌های خشک و تر را در دو سطل جداگانه قرار بده.","Put dry and wet waste in separate bins."],
    [4,"🛍️","waste",20,"کیسه پارچه‌ای","Use a cloth bag","برای خرید از کیسه پارچه‌ای استفاده کن.","Use a reusable bag when shopping."],
    [5,"📄","waste",25,"بازیافت کاغذ","Recycle paper","کاغذهای باطله را جدا کن و برای بازیافت بده.","Collect scrap paper for recycling."],
    [6,"🍶","waste",20,"بطری شخصی","Carry a reusable bottle","امروز به‌جای بطری یک‌بارمصرف از بطری خودت استفاده کن.","Use your own bottle instead of a disposable one."],
    [7,"🍂","waste",40,"کمپوست پسماند","Compost food scraps","پسماند میوه و سبزی را کمپوست کن.","Compost fruit and vegetable scraps."],
    [2,"💧","water",20,"صرفه‌جویی در مصرف آب","Save water","هنگام مسواک زدن شیر آب را ببند.","Turn off the tap while brushing your teeth."],
    [8,"🚿","water",25,"دوش کوتاه","Take a short shower","دوش امروزت را به ۵ دقیقه برسان.","Keep today's shower to 5 minutes."],
    [9,"🪣","water",30,"استفاده دوباره از آب","Reuse water","آب شست‌وشوی سبزی را برای آبیاری گیاه استفاده کن.","Use vegetable-rinse water for plants."],
    [10,"🔧","water",35,"تعمیر شیر چکه‌کن","Fix a leaking tap","یک شیر یا اتصال چکه‌کن را تعمیر کن یا گزارش بده.","Fix or report a dripping tap."],
    [11,"🧺","water",20,"لباسشویی پر","Run full loads","ماشین لباسشویی یا ظرفشویی را فقط پر روشن کن.","Run the washing machine only when full."],
    [12,"💡","energy",15,"خاموش کردن چراغ‌ها","Switch off lights","چراغ اتاق‌های خالی را خاموش کن.","Turn off lights in empty rooms."],
    [13,"🔌","energy",15,"جدا کردن شارژر","Unplug chargers","شارژرهای بی‌استفاده را از برق بکش.","Unplug chargers you are not using."],
    [14,"🔆","energy",30,"لامپ کم‌مصرف","Use an efficient bulb","یک لامپ معمولی را با LED عوض کن.","Replace a regular bulb with an LED."],
    [15,"☀️","energy",20,"نور روز","Use daylight","تا جای ممکن از نور طبیعی روز استفاده کن.","Use natural daylight where you can."],
    [16,"🌡️","energy",25,"تنظیم دمای خانه","Adjust the thermostat","دمای بخاری یا کولر را یک درجه معتدل‌تر کن.","Set heating or cooling one degree milder."],
    [17,"🚶","transport",25,"پیاده‌روی","Walk","یک مسیر کوتاه را پیاده برو.","Walk a short trip instead of riding."],
    [18,"🚲","transport",35,"دوچرخه‌سواری","Ride a bike","امروز با دوچرخه رفت‌وآمد کن.","Get around by bike today."],
    [19,"🚌","transport",30,"حمل‌ونقل عمومی","Use public transport","به‌جای خودروی شخصی از اتوبوس یا مترو استفاده کن.","Take a bus or metro instead of driving."],
    [20,"🚗","transport",30,"اشتراک سواری","Share a ride","با همکلاسی یا همکار هم‌مسیر شو.","Carpool with a classmate or colleague."],
    [21,"🛑","transport",20,"خاموش کردن موتور","Turn off the engine","هنگام توقف طولانی موتور خودرو را خاموش کن.","Switch off the engine during long stops."],
    [3,"🌱","nature",40,"کاشت یک گیاه","Plant a small plant","یک گیاه کوچک بکار یا از گیاهی مراقبت کن.","Plant a small plant or take care of one."],
    [22,"🧤","nature",40,"جمع‌آوری زباله","Pick up litter","زباله‌های یک پارک یا خیابان را جمع کن.","Pick up litter in a park or street."],
    [23,"🐦","nature",15,"آب برای پرندگان","Water for birds","ظرف آبی برای پرندگان بیرون بگذار.","Put out a water dish for birds."],
    [24,"🗣️","nature",25,"آموزش به یک دوست","Teach a friend","یک عادت سبز را به دوستت یاد بده.","Share one green habit with a friend."],
    [25,"🌰","nature",35,"کاشت بذر","Sow seeds","چند بذر در گلدان یا باغچه بکار.","Sow seeds in a pot or garden."],
    [26,"🥗","food",30,"وعده گیاهی","Eat a plant-based meal","امروز یک وعده بدون گوشت بخور.","Have one meat-free meal today."],
    [27,"🛒","food",25,"برنامه خرید","Plan your shopping","با لیست خرید بخر تا غذا هدر نرود.","Shop with a list to avoid food waste."],
    [28,"🧅","food",25,"خرید محلی","Buy local","یک محصول محلی یا فصلی بخر.","Buy a local or seasonal product."],
    [29,"🍲","food",20,"استفاده از باقی‌مانده غذا","Use leftovers","از باقی‌مانده غذای دیروز یک وعده بساز.","Turn yesterday's leftovers into a meal."],
    [30,"☕","food",20,"لیوان شخصی","Bring your own cup","نوشیدنی‌ات را در لیوان شخصی بگیر.","Take your drink in your own cup."],
    [31,"🧴","waste",25,"خرید بدون بسته‌بندی","Buy package-free","یک محصول را فله یا با بسته‌بندی کم بخر.","Buy one item loose or with minimal packaging."],
    [32,"🧵","waste",35,"تعمیر به‌جای دورانداختن","Repair, don't toss","یک وسیلهٔ خراب یا لباس پاره را تعمیر کن.","Mend a broken item or torn clothing."],
    [33,"🎁","waste",30,"اهدای وسایل اضافه","Donate unused items","وسایلی که استفاده نمی‌کنی را اهدا کن.","Donate things you no longer use."],
    [34,"🔋","waste",35,"بازیافت باتری","Recycle batteries","باتری‌های مصرف‌شده را به نقطهٔ جمع‌آوری ببر.","Take used batteries to a collection point."],
    [35,"🫙","waste",20,"استفادهٔ دوباره از ظرف","Reuse a jar","یک شیشه یا ظرف خالی را دوباره استفاده کن.","Reuse an empty jar or container."],
    [36,"🌇","water",20,"آبیاری در غروب","Water plants in the evening","گیاهان را عصر آبیاری کن تا تبخیر کمتر شود.","Water plants at dusk to reduce evaporation."],
    [37,"🌧️","water",30,"جمع‌آوری آب اضافی","Collect spare water","آب باران یا آب اضافی را برای گیاهان جمع کن.","Collect rain or spare water for plants."],
    [38,"🪣","water",30,"شست‌وشو با سطل","Wash with a bucket","خودرو یا حیاط را با سطل بشوی، نه شلنگ.","Wash your car or yard with a bucket, not a hose."],
    [39,"🔍","water",25,"بررسی نشتی","Check for leaks","لوله‌ها و شیرها را برای نشتی بررسی کن.","Check pipes and taps for leaks."],
    [40,"🍽️","water",20,"شستن ظرف با صرفه‌جویی","Wash dishes smartly","هنگام کف‌مالی ظرف‌ها شیر را ببند.","Turn the tap off while scrubbing dishes."],
    [41,"📺","energy",20,"خاموش کردن کامل دستگاه‌ها","Switch off standby","تلویزیون و دستگاه‌ها را کامل خاموش کن.","Fully switch off the TV and devices."],
    [42,"👕","energy",25,"خشک کردن در هوای آزاد","Air-dry laundry","لباس‌ها را در هوای آزاد خشک کن.","Air-dry your laundry."],
    [43,"🪟","energy",30,"گرفتن درز پنجره","Seal drafts","درز یک پنجره یا در را بگیر.","Seal a draft around a window or door."],
    [44,"🪜","energy",20,"پله به‌جای آسانسور","Take the stairs","امروز از پله استفاده کن.","Use the stairs today."],
    [45,"📱","energy",15,"حالت صرفه‌جویی گوشی","Use battery saver","حالت صرفه‌جویی انرژی گوشی را روشن کن.","Turn on your phone's battery saver."],
    [46,"🛴","transport",25,"پیاده یا اسکوتر تا مقصد","Walk or scoot","تا ایستگاه یا مقصد پیاده یا با اسکوتر برو.","Walk or scoot to the stop or destination."],
    [47,"🗺️","transport",20,"ترکیب کارهای بیرون","Combine errands","چند کار بیرون را در یک سفر انجام بده.","Do several errands in one trip."],
    [48,"🛞","transport",25,"بادِ لاستیک","Check tyre pressure","باد لاستیک خودرو یا دوچرخه را کنترل کن.","Check your car or bike tyre pressure."],
    [49,"💻","transport",30,"کار آنلاین","Meet online","به‌جای رفت‌وآمد، کاری را آنلاین انجام بده.","Do something online instead of travelling."],
    [50,"🧭","transport",20,"معرفی مسیر سبز","Share a green route","مسیر پیاده یا دوچرخه را به یک دوست نشان بده.","Show a friend a walking or cycling route."],
    [51,"🌳","nature",50,"کاشت درخت گروهی","Join a tree planting","در یک برنامهٔ درخت‌کاری شرکت کن.","Join a tree-planting event."],
    [52,"🐞","nature",35,"خانهٔ حشرات","Build a bug hotel","یک خانهٔ ساده برای حشرات مفید بساز.","Build a simple bug hotel."],
    [53,"🔭","nature",20,"شناسایی یک گونه","Spot a species","یک گیاه یا جانور محلی را شناسایی کن.","Identify a local plant or animal."],
    [54,"🌊","nature",45,"پاک‌سازی ساحل یا رود","Clean a shore or stream","زباله‌های کنار آب را جمع کن.","Clear litter by a shore or stream."],
    [55,"📖","nature",15,"خواندن دربارهٔ طبیعت","Read about nature","یک مقالهٔ کوتاه زیست‌محیطی بخوان.","Read a short environmental article."],
    [56,"🪴","food",40,"کشت سبزی خانگی","Grow herbs at home","یک سبزی خوراکی در گلدان بکار.","Plant an edible herb in a pot."],
    [57,"🥦","food",35,"روز بدون گوشت","Go meat-free for a day","یک روز کامل گوشت نخور.","Eat no meat for a full day."],
    [58,"🫘","food",20,"خرید فله","Buy in bulk","حبوبات یا خشکبار را فله بخر.","Buy grains or nuts in bulk."],
    [59,"🍯","food",25,"نگهداری غذا","Preserve food","میوه یا سبزی اضافی را مربا یا ترشی کن.","Preserve extra produce as jam or pickles."],
    [60,"🤝","food",35,"اهدای غذا","Share extra food","غذای اضافه را با همسایه یا نیازمند تقسیم کن.","Share spare food with a neighbour in need."]
  ].map(([id, icon, cat, points, ft, et, fd, ed]) => ({ id, icon, cat, points, title: { fa: ft, en: et }, description: { fa: fd, en: ed } }));

  const BADGES = [
    { id: "first", icon: "🌟", t: "b_first", test: d => d.completed.length >= 1 },
    { id: "five", icon: "🏅", t: "b_five", test: d => d.completed.length >= 5 },
    { id: "ten", icon: "🎖️", t: "b_ten", test: d => d.completed.length >= 10 },
    { id: "forty", icon: "🥇", t: "b_forty", test: d => d.completed.length >= 40 },
    { id: "twenty", icon: "🏆", t: "b_twenty", test: d => d.completed.length >= 20 },
    { id: "all", icon: "👑", t: "b_all", test: d => d.completed.length >= M.length },
    { id: "xp300", icon: "⚡", t: "b_xp300", test: d => d.points >= 300 },
    { id: "xp600", icon: "🔥", t: "b_xp600", test: d => d.points >= 600 },
    { id: "lvl3", icon: "🌳", t: "b_lvl3", test: d => levelInfo(d.points).lvl >= 3 },
    { id: "lvl5", icon: "🌍", t: "b_lvl5", test: d => levelInfo(d.points).lvl >= 5 },
    ...Object.keys(CATS).map(c => ({
      id: "cat_" + c, icon: CATS[c], t: "b_cat", cat: c,
      test: d => M.filter(m => m.cat === c).every(m => d.completed.includes(m.id))
    }))
  ];

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  let language = localStorage.getItem(KEYS.language) || "fa";
  if (!translations[language]) language = "fa";
  let authMode = "login", activePage = "home", currentUser = localStorage.getItem(KEYS.currentUser) || "";
  let filterCat = "all", filterStatus = "all", installPrompt = null;

  const t = k => translations[language][k] || k;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const number = v => new Intl.NumberFormat(language === "fa" ? "fa-IR" : "en-US").format(v);
  const pct = v => number(v) + (language === "fa" ? "٪" : "%");
  const badgeName = b => b.cat ? t("b_cat").replace("{c}", t("cat_" + b.cat)) : t(b.t);

  function levelInfo(points) {
    let lvl = 1;
    LEVELS.forEach((min, i) => { if (points >= min) lvl = i + 1; });
    if (lvl >= LEVELS.length) return { lvl, pct: 100, max: true };
    const lo = LEVELS[lvl - 1], hi = LEVELS[lvl];
    return { lvl, pct: Math.round(((points - lo) / (hi - lo)) * 100), max: false };
  }

  // ---------- storage (with migration from v1 data) ----------
  function getUsers() { try { return JSON.parse(localStorage.getItem(KEYS.users) || "{}"); } catch { return {}; } }
  function saveUsers(u) { localStorage.setItem(KEYS.users, JSON.stringify(u)); }
  function normalize(d, name) {
    d = d && typeof d === "object" ? d : {};
    d.points = Number.isFinite(d.points) ? d.points : 0;
    d.completed = Array.isArray(d.completed) ? d.completed.filter(id => M.some(m => m.id === id)) : [];
    d.displayName = d.displayName || name;
    d.avatar = d.avatar || "";
    d.badges = Array.isArray(d.badges) ? d.badges : [];
    d.streak = Number.isInteger(d.streak) ? d.streak : 0; d.lastDay = d.lastDay || "";
    d.daily = d.daily && Array.isArray(d.daily.ids) ? d.daily : { day: "", ids: [] };
    d.team = d.team || ""; d.onboarded = !!d.onboarded; d.log = Array.isArray(d.log) ? d.log.slice(-30).map(x => ({ id: x.id, day: x.day })) : [];
    d.impact = d.impact && typeof d.impact === "object" ? { ...IMP0, ...d.impact } : calcImpact(d.completed);
    d.createdAt = d.createdAt || new Date().toISOString();
    return d;
  }
  let uid = "", cache = null, guest = false;
  function userData() { return cache; }
  function saveUserData(d) {
    cache = d;
    if (guest) { try { localStorage.setItem("greenstep-guest", JSON.stringify(d)); } catch {} return; }
    if (uid) setDoc(doc(db, "users", uid), { ...d, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => toast(t("networkError")));
  }
  function seedFromLocal(name) {
    const u = getUsers(), k = Object.keys(u).find(x => x.toLowerCase() === name);
    return k ? u[k] : {};
  }
  async function loadProfile(user) {
    const ref = doc(db, "users", user.uid), snap = await getDoc(ref);
    const name = (user.email || "").split("@")[0];
    cache = normalize(snap.exists() ? snap.data() : seedFromLocal(name), name);
    cache.username = name;
    if (!snap.exists()) { cache.badges = earnedBadges(cache).map(b => b.id); await setDoc(ref, cache); }
  }

  function toast(msg) {
    const old = $(".toast"); if (old) old.remove();
    const el = document.createElement("div");
    el.className = "toast"; el.setAttribute("role", "status"); el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }
  function setMessage(m, ok = false) {
    const el = $("#authMessage"); if (!el) return;
    el.textContent = m; el.classList.toggle("success", ok);
  }
  function setDir() {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
    document.body.dir = document.documentElement.dir;
  }

  // ---------- auth ----------
  function renderAuth() {
    $("#authScreen").classList.remove("hidden"); $("#appShell").classList.add("hidden");
    const login = authMode === "login";
    $("#authTitle").textContent = t(login ? "loginTitle" : "registerTitle");
    $("#authSubtitle").textContent = t(login ? "loginSubtitle" : "registerSubtitle");
    $("#passwordInput").autocomplete = login ? "current-password" : "new-password";
    $("#authSubmit").textContent = t(login ? "loginButton" : "registerButton");
    $("#authSwitchText").textContent = t(login ? "noAccount" : "hasAccount");
    $("#authModeButton").textContent = t(login ? "switchRegister" : "switchLogin");
    $("#authLanguageButton").textContent = language === "fa" ? "English" : "فارسی";
    $$("[data-i18n]", $("#authScreen")).forEach(el => { if (translations[language][el.dataset.i18n]) el.textContent = t(el.dataset.i18n); });
    setDir();
  }

  function showApp() {
    $("#authScreen").classList.add("hidden"); $("#appShell").classList.remove("hidden");
    setDir(); renderPage(activePage === "home" || !activePage ? "home" : activePage);
  }

  // ---------- home ----------
  function applyTranslations() {
    $$("[data-i18n]", $("#appShell")).forEach(el => { if (translations[language][el.dataset.i18n]) el.textContent = t(el.dataset.i18n); });
    $("#languageButton").textContent = language === "fa" ? "EN" : "FA";
    const d = userData();
    $$("[data-i18n]", $("#appShell")).forEach(el => {
      if (el.dataset.i18n === "welcome" && d) el.textContent = t("welcome").replace("{name}", d.displayName);
    });
    if (d) $("#avatarInitial").textContent = d.avatar || d.displayName.charAt(0).toUpperCase();
  }

  function updateStats() {
    const d = userData(); if (!d) return;
    const li = levelInfo(d.points);
    $("#pointsValue").textContent = number(d.points);
    $("#levelValue").textContent = number(li.lvl);
    $("#levelName").textContent = t("lvl" + li.lvl);
    $("#progressText").textContent = pct(li.pct);
    $("#levelProgress").style.width = li.pct + "%";
    $('[data-i18n="nextLevel"]').textContent = t(li.max ? "maxLevel" : "nextLevel");
  }

  function renderDashboard() {
    const d = userData(), box = $("#homeDashboard"); if (!d || !box) return;
    const bars = Object.keys(CATS).map(c => {
      const all = M.filter(m => m.cat === c), n = all.filter(m => d.completed.includes(m.id)).length;
      return `<div class="cat-row"><span>${CATS[c]} ${t("cat_" + c)}</span>
        <div class="progress-track"><div class="progress-fill" style="width:${Math.round(n / all.length * 100)}%"></div></div>
        <em>${number(n)}/${number(all.length)}</em></div>`;
    }).join("");
    box.innerHTML = gardenHTML(d) + `<div class="section-heading" style="margin-top:22px"><h2>${t("progressTitle")}</h2></div>
      <div class="stat-grid">
        <div class="stat-tile"><b>${number(d.completed.length)}/${number(M.length)}</b><small>${t("doneCount")}</small></div>
        <div class="stat-tile"><b>${number(earnedBadges(d).length)}/${number(BADGES.length)}</b><small>${t("badgesCount")}</small></div>
        <div class="stat-tile"><b>${number(levelInfo(d.points).lvl)}/${number(LEVELS.length)}</b><small>${t("levelStat")}</small></div>
      </div><div class="cat-bars">${bars}</div>
      <div class="section-heading" style="margin-top:22px"><h2>${t("impactTitle")}</h2><button class="text-button" data-go="about" type="button">${t("aboutBtn")}</button></div>${impactHTML(d.impact)}<p class="note">${t("impactNote")}</p>`;
  }

  const earnedBadges = d => BADGES.filter(b => b.test(d));

  // ---------- missions ----------
  const ymd = x => x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
  const today = () => ymd(new Date());
  const yesterday = () => { const x = new Date(); x.setDate(x.getDate() - 1); return ymd(x); };
  const streakNow = d => (d.lastDay === today() || d.lastDay === yesterday() ? d.streak : 0);
  const nextStreak = d => (d.lastDay === today() ? d.streak : d.lastDay === yesterday() ? d.streak + 1 : 1);
  const doneToday = d => (d.daily.day === today() ? d.daily.ids : []);
  function dailyPicks() { const n = Math.floor(Date.parse(today() + "T00:00:00Z") / 86400000); return [0, 1, 2].map(k => M[(n * 7 + k * 20) % M.length]); }

  function card(m, d, daily) {
    const done = daily ? doneToday(d).includes(m.id) : d.completed.includes(m.id);
    const gain = m.points + (daily ? Math.min(nextStreak(d), 7) * 5 : 0);
    return `<article class="mission-card ${done ? "done" : ""}">
      <div class="mission-icon">${m.icon}</div>
      <div class="mission-info"><h3>${esc(m.title[language])}</h3><p>${esc(m.description[language])}</p>
        <span class="cat-tag">${CATS[m.cat]} ${t("cat_" + m.cat)}</span></div>
      <div class="mission-action"><span class="xp-pill">+${number(gain)} XP</span>
        ${done ? `<span class="mission-status">✓ ${t(daily ? "doneToday" : "completed")}</span>`
          : `<button class="text-button complete-mission" type="button" data-mission-id="${m.id}" data-daily="${daily ? 1 : 0}">${t("startMission")}</button>`}
      </div></article>`;
  }

  function renderDashboardMissions() {
    const c = $("#dashboardMissions"), d = userData(); if (!c || !d) return;
    c.innerHTML = dailyPicks().map(m => card(m, d, true)).join("");
  }

  function renderMissions() {
    const d = userData();
    const list = M.filter(m => (filterCat === "all" || m.cat === filterCat) &&
      (filterStatus === "all" || (filterStatus === "done") === d.completed.includes(m.id)));
    const chip = (type, v, label) => `<button class="chip ${(type === "cat" ? filterCat : filterStatus) === v ? "active" : ""}" type="button" data-${type}="${v}">${label}</button>`;
    return `<section class="page-panel"><p class="eyebrow">${t("missionsDescription")}</p><h1>${t("missionsTitle")}</h1>
      <div class="chips">${chip("cat", "all", t("all"))}${Object.keys(CATS).map(c => chip("cat", c, CATS[c] + " " + t("cat_" + c))).join("")}</div>
      <div class="chips">${chip("status", "all", t("all"))}${chip("status", "todo", t("todo"))}${chip("status", "done", t("doneFilter"))}</div>
      <div class="mission-list">${list.length ? list.map(m => card(m, d)).join("") : `<p class="empty-note">${t("noResults")}</p>`}</div></section>`;
  }

  let pending = null, fbRating = 0, rankTab = "people", rankDocs = [];
  const soundOn = () => localStorage.getItem("greenstep-sound") !== "off";

  function openModal(html) {
    closeModal(); const b = document.createElement("div"); b.className = "modal-back";
    b.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`; document.body.appendChild(b);
  }
  function closeModal() { const b = $(".modal-back"); if (b) b.remove(); }

  function beep() {
    if (!soundOn()) return;
    try {
      const c = new (window.AudioContext || window.webkitAudioContext)();
      [523, 659, 784].forEach((f, i) => {
        const o = c.createOscillator(), g = c.createGain(), t0 = c.currentTime + i * 0.11;
        o.type = "triangle"; o.frequency.value = f; o.connect(g); g.connect(c.destination);
        g.gain.setValueAtTime(0.15, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.25); o.start(t0); o.stop(t0 + 0.26);
      });
    } catch {}
  }
  function confetti() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = document.createElement("div"); box.className = "confetti";
    box.innerHTML = Array.from({ length: 22 }, (_, i) => `<i style="left:${Math.random() * 100}%;animation-delay:${Math.random() * 0.4}s;animation-duration:${1.4 + Math.random()}s">${["🍃", "🌿", "✨", "🌱"][i % 4]}</i>`).join("");
    document.body.appendChild(box); setTimeout(() => box.remove(), 2800);
  }

  function gardenHTML(d) {
    const li = levelInfo(d.points), g = Math.min(1, d.points / 1300), h = 14 + g * 50, n = Math.round(2 + g * 7), sc = 0.6 + 0.4 * g, cy = 118 - h;
    const P = [[0, 0, 17], [-15, 7, 13], [15, 7, 13], [-7, -13, 12], [9, -13, 11], [-26, 13, 10], [26, 13, 10], [0, -24, 10], [0, 11, 12]];
    const leaves = P.slice(0, n).map(([x, y, r]) => `<circle cx="${100 + x * sc}" cy="${cy + y * sc}" r="${r * sc}" fill="#2f9157"/>`).join("");
    const fruit = li.lvl >= 4 ? P.slice(1, 4).map(([x, y]) => `<circle cx="${100 + x * sc * 0.8}" cy="${cy + y * sc * 0.8 + 3}" r="3" fill="#e0533d"/>`).join("") : "";
    return `<div class="section-heading"><h2>${t("gardenTitle")}</h2></div><div class="garden-card">
      <svg viewBox="0 0 200 140" role="img" aria-label="${t("gardenTitle")}"><rect width="200" height="140" fill="#eaf6ee"/>
      ${li.lvl >= 3 ? '<text x="20" y="32" font-size="20">☀️</text>' : ""}${li.lvl >= 5 ? '<text x="152" y="40" font-size="16">🐦</text>' : ""}
      <rect y="118" width="200" height="22" fill="#cfe8d5"/><rect x="${98 - g * 2.5}" y="${118 - h}" width="${4 + g * 5}" height="${h}" rx="2" fill="#8a6a45"/>${leaves}${fruit}</svg>
      <div class="garden-meta"><b>${t("lvl" + li.lvl)}</b><span class="streak">🔥 ${number(streakNow(d))} ${t("streakDays")}</span></div></div>`;
  }

  function askProof(id, daily) {
    const d = userData(), m = M.find(x => x.id === id); if (!d || !m) return;
    pending = { id, daily };
    openModal(`<h2>${esc(m.title[language])}</h2><p class="eyebrow" style="text-align:center">${t("proofHint")}</p>
      <textarea id="proofText" maxlength="120" rows="3" aria-label="${t("proofTitle")}"></textarea><p id="proofErr" class="auth-message"></p>
      <div class="modal-actions"><button class="text-button" data-modal-close type="button">${t("cancel")}</button>
      <button class="primary-button" data-proof-submit type="button">${t("submitProof")}</button></div>`);
    setTimeout(() => { const e = $("#proofText"); if (e) e.focus(); }, 50);
  }
  function submitProof() {
    const note = $("#proofText").value.trim();
    if (note.length < 8) { $("#proofErr").textContent = t("proofShort"); return; }
    const p = pending; pending = null; closeModal(); if (p) finishMission(p.id, p.daily, note);
  }

  function finishMission(id, daily, note) {
    const d = userData(), m = M.find(x => x.id === id); if (!d || !m) return;
    if (daily ? doneToday(d).includes(id) : d.completed.includes(id)) return;
    const before = levelInfo(d.points).lvl, day = today();
    if (d.lastDay !== day) { d.streak = nextStreak(d); d.lastDay = day; }
    let gain = m.points;
    if (daily) {
      gain += Math.min(d.streak, 7) * 5;
      d.daily = { day, ids: [...doneToday(d), id] };
      if (!d.completed.includes(id)) d.completed.push(id);
    } else d.completed.push(id);
    d.points += gain; impactAdd(d.impact, m); d.log = [...d.log, { id, day }].slice(-30);
    if (uid) addDoc(collection(db, "users", uid, "notes"), { id, day, note: note.slice(0, 120) }).catch(() => {});
    const fresh = BADGES.filter(b => !d.badges.includes(b.id) && b.test(d));
    d.badges.push(...fresh.map(b => b.id));
    saveUserData(d);
    const after = levelInfo(d.points).lvl;
    confetti(); beep();
    toast(after > before ? "🎉 " + t("levelUp").replace("{n}", number(after)) : fresh.length ? `${fresh[0].icon} ${t("newBadge")} ${badgeName(fresh[0])}` : `+${number(gain)} XP 🔥${number(d.streak)}`);
    renderPage(activePage);
  }

  function onboarding(i) {
    openModal(`<div style="font-size:44px;text-align:center">${["📅", "🌳", "🏆"][i]}</div><h2>${t("onb" + (i + 1) + "t")}</h2>
      <p style="margin:0;font-size:13px;line-height:1.9;text-align:center;color:var(--muted)">${t("onb" + (i + 1) + "d")}</p>
      <div class="modal-actions"><button class="text-button" data-onb-skip type="button">${t("skip")}</button>
      <button class="primary-button" data-onb-next="${i}" type="button">${t(i === 2 ? "start" : "next")}</button></div>`);
  }
  function endOnboarding() { closeModal(); const d = userData(); if (d) { d.onboarded = true; saveUserData(d); if (!d.pre) survey("pre"); } }

  async function sendFeedback() {
    if (guest) return toast(t("guestRank"));
    if (!fbRating) return toast(t("fbPick"));
    const text = ($("#fbText").value || "").trim().slice(0, 300);
    try {
      await addDoc(collection(db, "feedback"), { rating: fbRating, text, lang: language, createdAt: new Date().toISOString() });
      fbRating = 0; toast(t("fbThanks")); renderPage("profile");
    } catch { toast(t("networkError")); }
  }

  // ---------- leaderboard (real, live; people and teams) ----------
  function renderLeaderboard() {
    if (guest) return `<section class="page-panel"><h1>${t("leaderboardTitle")}</h1><p class="empty-note">${t("guestRank")}</p></section>`;
    loadRanks();
    const chip = (v, l) => `<button class="chip ${rankTab === v ? "active" : ""}" type="button" data-ranktab="${v}">${l}</button>`;
    return `<section class="page-panel"><p class="eyebrow">${t("leaderboardDescription")}</p><h1>${t("leaderboardTitle")}</h1>
      <div class="chips">${chip("people", t("people"))}${chip("teams", t("teams"))}</div>
      <div id="rankList"><p class="empty-note">${t("loading")}</p></div><p class="empty-note">${t("demoNote")}</p></section>`;
  }
  function paintRanks() {
    const el = $("#rankList"); if (!el) return;
    const medals = ["🥇", "🥈", "🥉"], pos = i => medals[i] || number(i + 1) + ".";
    if (rankTab === "people") {
      el.innerHTML = rankDocs.map((u, i) => `<div class="rank-row ${u.id === uid ? "me" : ""}"><strong>${pos(i)} ${esc(u.displayName || u.username)}</strong><span>${number(u.points || 0)} XP</span></div>`).join("") || `<p class="empty-note">${t("noRanks")}</p>`;
      return;
    }
    const g = {};
    rankDocs.forEach(u => { const k = (u.team || "").trim(); if (!k) return; g[k] = g[k] || { name: k, sum: 0, n: 0 }; g[k].sum += u.points || 0; g[k].n++; });
    const list = Object.values(g).map(x => ({ ...x, avg: Math.round(x.sum / x.n) })).sort((a, b) => b.avg - a.avg);
    el.innerHTML = list.map((x, i) => `<div class="rank-row ${cache && x.name === cache.team ? "me" : ""}"><strong>${pos(i)} ${esc(x.name)}</strong><span>${number(x.avg)} XP · ${number(x.n)} ${t("members")}</span></div>`).join("") || `<p class="empty-note">${t("noTeams")}</p>`;
  }
  let stopRanksFn = null;
  function stopRanks() { if (stopRanksFn) { stopRanksFn(); stopRanksFn = null; } }
  function loadRanks() {
    stopRanks();
    stopRanksFn = onSnapshot(query(collection(db, "users"), orderBy("points", "desc"), limit(100)), snap => {
      rankDocs = snap.docs.map(x => ({ id: x.id, ...x.data() })); paintRanks(); paintStats();
    }, () => { const el = $("#rankList"); if (el) el.innerHTML = `<p class="empty-note">${t("networkError")}</p>`; });
  }

  // ---------- about, stats, survey ----------
  function renderAbout() {
    const sec = (h, p) => `<div class="profile-card"><h2>${t(h)}</h2><p style="line-height:2;font-size:13px;margin:6px 0 0">${t(p)}</p></div>`;
    return `<section class="page-panel"><h1>${t("aboutTitle")}</h1>${sec("aboutProblemH", "aboutProblem")}${sec("aboutGoalH", "aboutGoal")}${sec("aboutDesignH", "aboutDesign")}${sec("aboutImpactH", "aboutImpact")}${sec("aboutPrivacyH", "aboutPrivacy")}${sec("aboutLimitsH", "aboutLimits")}</section>`;
  }
  function renderStats() {
    if (!guest) loadRanks();
    setTimeout(paintStats, 0);
    return `<section class="page-panel"><h1>${t("statsTitle")}</h1><div id="statsBox"></div></section>`;
  }
  function paintStats() {
    const el = $("#statsBox"); if (!el) return;
    const mine = userData(), tile = (v, k) => `<div class="stat-tile"><b>${number(v)}</b><small>${t(k)}</small></div>`;
    if (guest || !rankDocs.length) { el.innerHTML = `<h2 class="sub-title">${t("impactTitle")}</h2>${mine ? impactHTML(mine.impact) : ""}<p class="note">${t(guest ? "guestRank" : "loading")}</p>`; return; }
    const U = rankDocs, sum = f => U.reduce((a, u) => a + f(u), 0), xp = sum(u => u.points || 0), imp = { ...IMP0 };
    U.forEach(u => { const i = u.impact || calcImpact(u.completed || []); Object.keys(IMP0).forEach(k => { imp[k] += i[k] || 0; }); });
    const returned = U.filter(u => new Set((u.log || []).map(x => x.day)).size >= 2).length;
    const both = U.filter(u => u.pre && u.post), df = k => both.reduce((a, u) => a + (u.post[k] - u.pre[k]), 0) / both.length;
    const sg = v => (v >= 0 ? "+" : "") + number(Math.round(v * 10) / 10), trees = Math.min(40, Math.floor(xp / 500));
    el.innerHTML = `<div class="stat-grid">${tile(U.length, "statUsers")}${tile(sum(u => (u.completed || []).length), "statMissions")}${tile(returned, "statReturned")}</div>
      <h2 class="sub-title">${t("impactTitle")} · ${t("statAll")}</h2>${impactHTML(imp)}<p class="note">${t("impactNote")}</p>
      <h2 class="sub-title">${t("statSurveyT")}</h2><p class="note">${both.length ? `${t("statSurvey")}: ${sg(df("w"))} / ${sg(df("e"))} / ${sg(df("s"))} (${number(both.length)})` : t("noSurveyYet")}</p>
      <h2 class="sub-title">${t("forestTitle")}</h2><div class="forest">${"🌳".repeat(trees) || "🌱"}</div><p class="note">${t("forestNote")}</p>`;
  }
  const SV = ["w", "e", "s"]; let sv = {};
  const svKind = d => (!d.pre ? "pre" : !d.post && d.completed.length >= 5 ? "post" : "");
  function survey(kind) {
    sv = {};
    openModal(`<h2>${t(kind === "pre" ? "svPreT" : "svPostT")}</h2><p class="eyebrow" style="text-align:center">${t("svHint")}</p>` +
      SV.map(k => `<div><p style="margin:0 0 6px;font-size:13px">${t("sv_" + k)}</p><div class="chips">${[1, 2, 3, 4, 5].map(n => `<button type="button" class="chip" data-sv="${k}" data-v="${n}">${number(n)}</button>`).join("")}</div></div>`).join("") +
      `<p id="svErr" class="auth-message"></p><div class="modal-actions"><button class="text-button" data-modal-close type="button">${t("later")}</button><button class="primary-button" data-sv-submit="${kind}" type="button">${t("save")}</button></div>`);
  }
  function submitSurvey(kind) {
    if (SV.some(k => !sv[k])) { $("#svErr").textContent = t("svAnswerAll"); return; }
    const d = userData(); if (!d) return;
    d[kind] = { ...sv, at: today() }; saveUserData(d); closeModal(); toast(t("svThanks")); if (activePage === "profile") renderPage("profile");
  }

  // ---------- profile ----------
  function renderProfile() {
    const d = userData(), li = levelInfo(d.points), got = earnedBadges(d).map(b => b.id);
    const av = d.avatar || d.displayName.charAt(0).toUpperCase();
    return `<section class="page-panel"><p class="eyebrow">${esc(currentUser)}</p><h1>${t("profileTitle")}</h1>
      <div class="profile-card"><div class="avatar">${av}</div><h2>${esc(d.displayName)}</h2><p>${t("lvl" + li.lvl)} · ${t("currentLevel")}: ${number(li.lvl)}</p>
        <p>${t("totalPoints")}: <b>${number(d.points)} XP</b></p></div>
      <div class="profile-card"><h2>${t("editProfile")}</h2>
        <form class="edit-form" id="profileForm">
          <label for="nameInput">${t("displayName")}</label>
          <input id="nameInput" maxlength="20" required value="${esc(d.displayName)}" />
          <label for="teamInput">${t("teamLabel")}</label>
          <input id="teamInput" maxlength="20" value="${esc(d.team || "")}" />
          <label>${t("avatarLabel")}</label>
          <div class="avatar-picker">${AVATARS.map(a => `<button type="button" class="avatar-opt ${d.avatar === a ? "active" : ""}" data-avatar="${a}">${a}</button>`).join("")}</div>
          <button class="primary-button" type="submit">${t("save")}</button>
        </form></div>
      <h2 class="sub-title">${t("badgesTitle")} (${number(got.length)}/${number(BADGES.length)})</h2>
      <div class="badge-grid">${BADGES.map(b => `<div class="badge ${got.includes(b.id) ? "" : "locked"}"><span>${b.icon}</span>${esc(badgeName(b))}</div>`).join("")}</div>
      <div class="profile-card" style="margin-top:18px"><p>${t("language")}</p>
        <button class="text-button" id="profileLanguageButton" type="button">${t("changeLanguage")}</button>
        <button class="text-button" id="soundBtn" type="button">${t("soundLabel")}: ${soundOn() ? t("on") : t("off")}</button>
        <p style="font-size:11px;color:var(--muted);margin:10px 0 0">✓ ${t("offlineReady")}</p>
        ${installPrompt ? `<button class="text-button" id="installButton" type="button">${t("install")}</button>` : ""}</div>
      ${svKind(d) ? `<div class="profile-card"><p>${t("svCard")}</p><button class="text-button" type="button" data-survey="${svKind(d)}">${t("svTake")}</button></div>` : ""}
      <div class="profile-card"><button class="text-button" type="button" data-go="about">${t("aboutBtn")}</button> <button class="text-button" type="button" data-go="stats">${t("statsBtn")}</button></div>
      <div class="profile-card"><h2>${t("fbTitle")}</h2>
        <div class="avatar-picker">${[1, 2, 3, 4, 5].map(n => `<button type="button" class="chip ${fbRating === n ? "active" : ""}" data-rate="${n}">★ ${number(n)}</button>`).join("")}</div>
        <div class="edit-form"><textarea id="fbText" maxlength="300" rows="3" placeholder="${t("fbPlaceholder")}"></textarea>
        <button class="primary-button" id="fbSend" type="button">${t("fbSend")}</button></div></div>
      <div class="profile-actions"><button class="danger-button" id="logoutButton" type="button">${t("logout")}</button>${guest ? "" : `<button class="danger-button" id="deleteBtn" type="button">${t("deleteAccount")}</button>`}</div></section>`;
  }

  function saveProfile() {
    const d = userData(), name = $("#nameInput").value.trim();
    if (!name) return;
    d.displayName = name; d.team = $("#teamInput").value.trim().toLowerCase().slice(0, 20);
    const sel = $(".avatar-opt.active"); d.avatar = sel ? sel.dataset.avatar : "";
    saveUserData(d); toast(t("saved")); renderPage("profile");
  }

  // ---------- routing ----------
  function renderPage(page) {
    const main = $("#appMain"), sec = $("#secondaryMain"); if (!main || !userData()) return;
    activePage = page; stopRanks();
    $$(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.page === (page === "about" || page === "stats" ? "profile" : page)));
    applyTranslations();
    if (page === "home") {
      main.classList.remove("hidden"); sec.classList.add("hidden");
      updateStats(); renderDashboard(); renderDashboardMissions(); showTip(false); return;
    }
    main.classList.add("hidden"); sec.classList.remove("hidden");
    sec.innerHTML = { missions: renderMissions, leaderboard: renderLeaderboard, profile: renderProfile, about: renderAbout, stats: renderStats }[page]();
    window.scrollTo(0, 0);
  }

  function changeLanguage() {
    language = language === "fa" ? "en" : "fa";
    localStorage.setItem(KEYS.language, language);
    if (userData()) showApp(); else renderAuth();
  }

  async function submitAuth(e) {
    e.preventDefault();
    const name = $("#usernameInput").value.trim().toLowerCase(), pass = $("#passwordInput").value;
    if (name.length < 3) return setMessage(t("usernameShort"));
    if (!/^[a-z0-9_]+$/.test(name)) return setMessage(t("usernameInvalid"));
    if (pass.length < 6) return setMessage(t("passwordShort"));
    const btn = $("#authSubmit"); btn.disabled = true; setMessage("");
    const email = name + "@greenstep.app";
    try {
      if (authMode === "register") await createUserWithEmailAndPassword(auth, email, pass);
      else await signInWithEmailAndPassword(auth, email, pass);
      activePage = "home";
    } catch (err) {
      const c = err.code || "";
      setMessage(t(c === "auth/email-already-in-use" ? "userExists" : c === "auth/weak-password" ? "passwordShort" :
        c === "auth/network-request-failed" ? "networkError" : /invalid|user-not-found|wrong-password/.test(c) ? "wrongCredentials" : "genericError"));
    } finally { btn.disabled = false; }
  }

  function enterGuest() {
    guest = true; uid = ""; localStorage.setItem("greenstep-guest-active", "1");
    let raw = {}; try { raw = JSON.parse(localStorage.getItem("greenstep-guest") || "{}"); } catch {}
    cache = normalize(raw, "guest"); cache.username = "guest"; if (!raw.displayName) cache.displayName = t("guestName");
    currentUser = "guest"; activePage = "home"; showApp(); if (!cache.onboarded) onboarding(0);
  }
  function deleteAsk() {
    openModal(`<h2>${t("deleteTitle")}</h2><p style="margin:0;font-size:13px;line-height:1.9;text-align:center;color:var(--muted)">${t("deleteHint")}</p>
      <input id="delPass" class="modal-input" type="password" autocomplete="current-password" aria-label="${t("passwordLabel")}" /><p id="delErr" class="auth-message"></p>
      <div class="modal-actions"><button class="text-button" data-modal-close type="button">${t("cancel")}</button><button class="danger-button" data-del-confirm type="button">${t("deleteConfirm")}</button></div>`);
  }
  async function deleteAccount() {
    const u = auth.currentUser, pass = $("#delPass").value, err = $("#delErr"); if (!u || !pass) return;
    try {
      await reauthenticateWithCredential(u, EmailAuthProvider.credential(u.email, pass));
      const notes = await getDocs(collection(db, "users", u.uid, "notes"));
      await Promise.all(notes.docs.map(x => deleteDoc(x.ref)));
      await deleteDoc(doc(db, "users", u.uid));
      await deleteUser(u); closeModal(); toast(t("deleted"));
    } catch (e) { const c = e.code || ""; err.textContent = t(/network/.test(c) ? "networkError" : /credential|password/.test(c) ? "wrongCredentials" : "genericError"); }
  }
  function logout() {
    if (!confirm(t("confirmLogout"))) return;
    if (guest) { guest = false; localStorage.setItem("greenstep-guest-active", "0"); stopRanks(); cache = null; currentUser = ""; return renderAuth(); }
    signOut(auth);
  }

  document.addEventListener("click", e => {
    const g = s => e.target.closest(s);
    if (g("#authLanguageButton") || g("#languageButton") || g("#profileLanguageButton")) return changeLanguage();
    if (g("#authModeButton")) { authMode = authMode === "login" ? "register" : "login"; setMessage(""); return renderAuth(); }
    if (g(".nav-item")) return renderPage(g(".nav-item").dataset.page);
    if (g("[data-go]")) return renderPage(g("[data-go]").dataset.go);
    if (g(".complete-mission")) { const b = g(".complete-mission"); return askProof(Number(b.dataset.missionId), b.dataset.daily === "1"); }
    if (g("[data-proof-submit]")) return submitProof();
    if (g("[data-modal-close]")) { pending = null; return closeModal(); }
    if (g("[data-onb-next]")) { const i = Number(g("[data-onb-next]").dataset.onbNext); return i >= 2 ? endOnboarding() : onboarding(i + 1); }
    if (g("[data-onb-skip]")) return endOnboarding();
    if (g("[data-ranktab]")) { rankTab = g("[data-ranktab]").dataset.ranktab; $$("[data-ranktab]").forEach(b => b.classList.toggle("active", b.dataset.ranktab === rankTab)); return paintRanks(); }
    if (g("[data-rate]")) { fbRating = Number(g("[data-rate]").dataset.rate); $$("[data-rate]").forEach(b => b.classList.toggle("active", Number(b.dataset.rate) === fbRating)); return; }
    if (g("#fbSend")) return sendFeedback();
    if (g("#soundBtn")) { localStorage.setItem("greenstep-sound", soundOn() ? "off" : "on"); return renderPage("profile"); }
    if (g("[data-cat]")) { filterCat = g("[data-cat]").dataset.cat; return renderPage("missions"); }
    if (g("[data-status]")) { filterStatus = g("[data-status]").dataset.status; return renderPage("missions"); }
    if (g(".avatar-opt")) { const b = g(".avatar-opt"), was = b.classList.contains("active"); $$(".avatar-opt").forEach(x => x.classList.remove("active")); if (!was) b.classList.add("active"); return; }
    if (g("#installButton") && installPrompt) { installPrompt.prompt(); installPrompt.userChoice.finally(() => { installPrompt = null; renderPage("profile"); }); return; }
    if (g("#guestButton")) return enterGuest();
    if (g("[data-survey]")) return survey(g("[data-survey]").dataset.survey);
    if (g("[data-sv]")) { const b = g("[data-sv]"), k = b.dataset.sv; sv[k] = Number(b.dataset.v); $$(`[data-sv="${k}"]`).forEach(x => x.classList.toggle("active", x === b)); return; }
    if (g("[data-sv-submit]")) return submitSurvey(g("[data-sv-submit]").dataset.svSubmit);
    if (g("#deleteBtn")) return deleteAsk();
    if (g("[data-del-confirm]")) return deleteAccount();
    if (g("#logoutButton")) return logout();
  });
  document.addEventListener("submit", e => { if (e.target.id === "profileForm") { e.preventDefault(); saveProfile(); } });
  $("#authForm").addEventListener("submit", submitAuth);

  // a new green tip appears each time a scroll stops (home page only)
  window.addEventListener("scroll", () => {
    if (activePage !== "home" || !userData()) return;
    clearTimeout(tipTimer); tipTimer = setTimeout(() => showTip(true), 250);
  }, { passive: true });

  // ---------- PWA ----------
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); installPrompt = e; if (activePage === "profile" && userData()) renderPage("profile"); });
  window.addEventListener("appinstalled", () => { installPrompt = null; toast(t("installed")); });
  if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));

  onAuthStateChanged(auth, async user => {
    if (!user) {
      if (guest) return;
      stopRanks(); uid = ""; cache = null; currentUser = ""; $("#passwordInput").value = ""; authMode = "login";
      if (localStorage.getItem("greenstep-guest-active") === "1") return enterGuest();
      return renderAuth();
    }
    guest = false; localStorage.setItem("greenstep-guest-active", "0"); uid = user.uid;
    try { await loadProfile(user); } catch { toast(t("networkError")); return signOut(auth); }
    currentUser = cache.username; showApp(); if (!cache.onboarded) onboarding(0);
  });
})();