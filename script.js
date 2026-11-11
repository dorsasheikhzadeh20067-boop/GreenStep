// فایربیس (Firebase) به‌صورت پویا بارگذاری می‌شود تا در صورتی که Firebase/gstatic مسدود شده باشد، برنامه (و حالت مهمان) همچنان کار کند.
let fbReady = false, auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, doc, getDoc, setDoc, collection, query, orderBy, limit, onSnapshot, addDoc, getDocs, deleteDoc, serverTimestamp, deleteUser, reauthenticateWithCredential, EmailAuthProvider;
const fbLoad = import("./firebase-config.js").then(m => { ({ auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, doc, getDoc, setDoc, collection, query, orderBy, limit, onSnapshot, addDoc, getDocs, deleteDoc, serverTimestamp, deleteUser, reauthenticateWithCredential, EmailAuthProvider } = m); fbReady = true; }).catch(() => {});
//مأموریت‌ها، مراحل، نشان‌ها، پروفایل، PWA
// داده‌ها فقط در همین مرورگر ذخیره می‌شوند 
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
    fbBlocked: "سرویس حساب (Firebase) بارگذاری نشد. VPN را روشن کن و صفحه را رفرش کن، یا از حالت مهمان استفاده کن.",
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
    fbBlocked: "The account service (Firebase) could not load. Turn on your VPN and refresh, or use Guest mode.",
    deleteAccount: "Delete account", deleteTitle: "Delete account permanently", deleteHint: "Your account and all its data will be erased and this cannot be undone. Enter your password to confirm.", deleteConfirm: "Delete account", deleted: "Account deleted."
  });
  Object.assign(translations.fa, {
    shopTitle: "فروشگاه باغ", shopDesc: "با بذرهایی که از مأموریت‌ها می‌گیری، باغت را تزیین کن.", seedsLabel: "بذر", buy: "خرید", owned: "داری", backHome: "← بازگشت به خانه", bought: "به باغت اضافه شد!",
    weeklyTitle: "چالش هفتگی جمعی", weeklyGoal: "این هفته: مأموریت‌های دستهٔ {c}", weeklyMine: "سهم تو: {n} مأموریت",
    weeklyHint: "با دست‌کم ۳ مأموریت از این دسته در پاداش شریک می‌شوی. وقتی هدف جمعی پر شد، پاداش را بگیر.", claim: "دریافت ۲۰ بذر پاداش", claimed: "پاداش این هفته را گرفتی.",
    weeklyHome: "چالش هفته: دستهٔ {c} · سهم تو: {n}", intTitle: "چه چیزی بیشتر برایت جالب است؟", intHint: "دسته‌های مورد علاقه‌ات را انتخاب کن؛ مأموریت‌های روزانه از همین‌ها می‌آیند.",
    intBtn: "علاقه‌مندی‌ها", d_easy: "آسان", d_mid: "متوسط", d_hard: "سخت",
    it_flower: "گل", it_mushroom: "قارچ", it_butterfly: "پروانه", it_bee: "زنبور", it_rabbit: "خرگوش", it_fountain: "آبنما", it_hut: "کلبه", it_rainbow: "رنگین‌کمان"
  });
  Object.assign(translations.en, {
    shopTitle: "Garden shop", shopDesc: "Decorate your garden with seeds earned from missions.", seedsLabel: "seeds", buy: "Buy", owned: "Owned", backHome: "← Back home", bought: "Added to your garden!",
    weeklyTitle: "Weekly community challenge", weeklyGoal: "This week: {c} missions", weeklyMine: "Your share: {n} missions",
    weeklyHint: "Complete at least 3 missions in this category to share the reward. Claim it once the community goal is full.", claim: "Claim 20 bonus seeds", claimed: "You claimed this week's reward.",
    weeklyHome: "Weekly challenge: {c} · your share: {n}", intTitle: "What interests you most?", intHint: "Pick your favourite categories; daily missions will come from these.",
    intBtn: "Interests", d_easy: "Easy", d_mid: "Medium", d_hard: "Hard",
    it_flower: "Flowers", it_mushroom: "Mushrooms", it_butterfly: "Butterfly", it_bee: "Bee", it_rabbit: "Rabbit", it_fountain: "Fountain", it_hut: "Cottage", it_rainbow: "Rainbow"
  });
  Object.assign(translations.fa, {
    b_ver: "سه تأیید مکانی", locLabel: "کد مکانی (اختیاری)", locHint: "اگر کنار محل مأموریت (سطل، آب‌خوری، …) برگهٔ کد دیدی، آن را بنویس تا پاداش ویژه بگیری.",
    locBad: "این کد معتبر نیست یا برای دستهٔ این مأموریت نیست.", locUsed: "این کد را امروز استفاده کرده‌ای.", capFull: "سقف امتیاز امروز پر شد. فردا ادامه بده!", capLine: "سقف امتیاز امروز: {n}/{c} XP",
    realTitle: "هدف اقدام واقعی"
  });
  Object.assign(translations.en, {
    b_ver: "3 location checks", locLabel: "Location code (optional)", locHint: "If you see a code sheet at the mission spot (bin, fountain, …), enter it for a special bonus.",
    locBad: "This code is invalid or doesn't match this mission's category.", locUsed: "You already used this code today.", capFull: "Today's XP cap is full. Continue tomorrow!", capLine: "Today's XP cap: {n}/{c} XP",
    realTitle: "Real-world action goal"
  });
  Object.assign(translations.fa, {
    noTeams: "هنوز تیمی به ۳ عضو نرسیده است. در پروفایل تیم بساز و دوستانت را دعوت کن.",
    teamTitle: "تیم من", teamName: "نام تیم (۲ تا ۲۰ حرف)", teamCreate: "ساخت تیم (من سرپرست می‌شوم)", teamInvite: "کد دعوت", teamJoin: "پیوستن با کد دعوت", teamLeave: "ترک تیم", teamShare: "ارسال کد دعوت",
    teamCreated: "تیم ساخته شد!", teamJoined: "به تیم پیوستی!", teamLeft: "از تیم خارج شدی.", teamNotFound: "تیمی با این کد پیدا نشد.", teamNameShort: "نام تیم باید ۲ تا ۲۰ حرف باشد.", teamCopied: "متن دعوت کپی شد.",
    teamInviteText: "به تیم «{n}» در GreenStep بپیوند! کد دعوت: {c}", teamWait: "تیم تو {n} از {m} عضو لازم را دارد؛ با رسیدن به {m} عضو در جدول می‌آید.",
    shareGarden: "اشتراک باغ", shareText: "باغ من در GreenStep 🌿 — سطح {l}، {xp} امتیاز.", shareSaved: "تصویر ذخیره شد."
  });
  Object.assign(translations.en, {
    noTeams: "No team has reached 3 members yet. Create a team in your profile and invite friends.",
    teamTitle: "My team", teamName: "Team name (2–20 characters)", teamCreate: "Create team (I become leader)", teamInvite: "Invite code", teamJoin: "Join with invite code", teamLeave: "Leave team", teamShare: "Send invite code",
    teamCreated: "Team created!", teamJoined: "You joined the team!", teamLeft: "You left the team.", teamNotFound: "No team found with this code.", teamNameShort: "Team name must be 2–20 characters.", teamCopied: "Invite text copied.",
    teamInviteText: "Join team “{n}” on GreenStep! Invite code: {c}", teamWait: "Your team has {n} of the {m} members needed; it appears on the board at {m}.",
    shareGarden: "Share garden", shareText: "My garden on GreenStep 🌿 — level {l}, {xp} XP.", shareSaved: "Image saved."
  });
  Object.assign(translations.fa, {
    demoBanner: "⚠️ داده نمونه: این جدول و آمار فقط برای نمایش است و کاربران واقعی نیستند. برای رقابت واقعی وارد حساب شو.",
    csvBtn: "خروجی CSV نتایج", csvSaved: "فایل CSV ذخیره شد.", statsTitle: "نتایج و آمار جمعی", statsBtn: "نتایج و آمار جمعی",
    statAvg: "میانگین مأموریت برای هر کاربر", statXP: "مجموع امتیاز", statSurveyN: "کاربر با هر دو نظرسنجی", catTitle: "مأموریت‌های انجام‌شده بر اساس دسته",
    svs_w: "صرفه‌جویی آب", svs_e: "خاموش کردن برق", svs_s: "تفکیک زباله", tbl_q: "عادت", tbl_pre: "آغاز", tbl_post: "پایان", tbl_diff: "تغییر"
  });
  Object.assign(translations.en, {
    demoBanner: "⚠️ Sample data: this board and these stats are for demonstration only and are not real users. Sign in to compete for real.",
    csvBtn: "Export results CSV", csvSaved: "CSV file saved.", statsTitle: "Results and community stats", statsBtn: "Results and stats",
    statAvg: "avg missions per user", statXP: "total XP", statSurveyN: "users with both surveys", catTitle: "Completed missions by category",
    svs_w: "Saving water", svs_e: "Switching off power", svs_s: "Sorting waste", tbl_q: "Habit", tbl_pre: "Start", tbl_post: "End", tbl_diff: "Change"
  });
  Object.assign(translations.fa, {
    todayQuestion: "امروز کدام بازی سبز را می‌بری؟", toNext: "{n} امتیاز تا سطح {l}",
    todayGame: "بازی امروز · جایزهٔ دوبرابر", playNow: "شروع بازی", gamesAll: "همهٔ بازی‌ها", gamesCount: "بازی",
    howXp: "چطور امتیاز بگیرم؟", howXpText: "هر بازی چند ثانیه‌ای XP می‌دهد؛ بازی هر روز دو برابر حساب می‌شود و هر روز بازی‌کردن استریک را زنده نگه می‌دارد.",
    records: "رکوردها", recent: "آخرین بازی‌ها", noRecent: "هنوز بازی نکرده‌ای. از خانه اولین بازی را شروع کن.", best: "بهترین", plays: "بار",
    b_g_first: "اولین قدم", b_g_streak: "پیاپی", b_g_sort: "استاد تفکیک", b_g_quiz: "مغز سبز", b_g_mem: "حافظهٔ طلایی", b_xp100: "صد امتیازی", b_g_ten: "بازی‌باز"
  });
  Object.assign(translations.en, {
    todayQuestion: "Which green game will you win today?", toNext: "{n} XP to level {l}",
    todayGame: "Today's game · double reward", playNow: "Play now", gamesAll: "All games", gamesCount: "games",
    howXp: "How do I earn points?", howXpText: "Every short game gives XP; the game of the day counts double, and playing daily keeps your streak alive.",
    records: "Records", recent: "Recent games", noRecent: "No games yet. Start your first one from Home.", best: "Best", plays: "plays",
    b_g_first: "First step", b_g_streak: "On a roll", b_g_sort: "Sorting master", b_g_quiz: "Green brain", b_g_mem: "Golden memory", b_xp100: "100 XP", b_g_ten: "Gamer"
  });
  Object.assign(translations.fa, {
    navCity: "شهر", cityTitle: "شهر سبز", cityDesc: "با سکه‌ای که از بازی‌ها می‌گیری، محله‌ات را آباد کن.",
    cityIndex: "شاخص پاکیزگی شهر", coinsLabel: "سکه", builtOf: "{n} از {m} ساختمان ساخته شده", perGame: "هر بازی ≈ ۲۰ سکه",
    yourHood: "محلهٔ تو", buildingsTitle: "ساختمان‌ها", build: "ساخت", builtLbl: "ساخته شد", needCoins: "سکهٔ کافی نداری.",
    cityBuilt: "به شهرت اضافه شد!", cityFresh: "شهر سرحال است. هر روز بازی کن تا شاخص بالا بماند.",
    cityDecay: "{n} روز است بازی نکرده‌ای و شاخص شهر {p}٪ افت کرده. امروز یک بازی یا مأموریت انجام بده!",
    b_city: "شهردار",
    bld_tree: "درخت", bld_tree_d: "سایه، هوای تازه و خانهٔ پرنده‌ها",
    bld_garden: "باغچهٔ محله", bld_garden_d: "گل‌های بومی روی پیاده‌رو",
    bld_recycle: "ایستگاه بازیافت", bld_recycle_d: "تفکیک زباله در محله",
    bld_bike: "مسیر دوچرخه", bld_bike_d: "رفت‌وآمد بدون دود",
    bld_solar: "پنل خورشیدی", bld_solar_d: "برق پاک برای شهر",
    bld_rain: "آبگیر باران", bld_rain_d: "ذخیرهٔ آب برای روزهای خشک",
    bld_wind: "توربین بادی", bld_wind_d: "باد، انرژی رایگان",
    bld_park: "پارک مرکزی", bld_park_d: "جایی برای همهٔ شهر"
  });
  Object.assign(translations.en, {
    navCity: "City", cityTitle: "Green City", cityDesc: "Use the coins you earn from games to build up your neighbourhood.",
    cityIndex: "City cleanliness index", coinsLabel: "coins", builtOf: "{n} of {m} buildings built", perGame: "Each game ≈ 20 coins",
    yourHood: "Your neighbourhood", buildingsTitle: "Buildings", build: "Build", builtLbl: "Built", needCoins: "Not enough coins.",
    cityBuilt: "Added to your city!", cityFresh: "The city is thriving. Play every day to keep the index up.",
    cityDecay: "You haven't played for {n} days and the city index dropped {p}%. Do a game or mission today!",
    b_city: "Mayor",
    bld_tree: "Tree", bld_tree_d: "Shade, fresh air and a home for birds",
    bld_garden: "Neighbourhood garden", bld_garden_d: "Native flowers along the sidewalk",
    bld_recycle: "Recycling station", bld_recycle_d: "Waste sorting for the neighbourhood",
    bld_bike: "Bike lane", bld_bike_d: "Smoke-free commuting",
    bld_solar: "Solar panel", bld_solar_d: "Clean power for the city",
    bld_rain: "Rain catcher", bld_rain_d: "Stored water for dry days",
    bld_wind: "Wind turbine", bld_wind_d: "Wind, free energy",
    bld_park: "Central park", bld_park_d: "A place for the whole city"
  });
  Object.assign(translations.fa, {
    szName: "سبزک", szTipTitle: "نکتهٔ روز از سبزک", szTipNext: "نکتهٔ دیگر",
    storySeason: "فصل داستانی", storyWin: "بحران «{t}» شکست خورد! جایزه‌ات را گرفتی.",
    storyDone: "همهٔ بحران‌ها را شکست دادی و شهر نجات پیدا کرد! از طرف همهٔ ساکنان شهر ممنون.",
    stepLabel: "گام بعدی:", stepBuild: "با سکه‌هایت می‌توانی «{b}» را در شهر بسازی.",
    stepCrisis: "{n} امتیاز دیگر تا شکست «{t}» لازم است؛ مأموریت‌های «{c}» دو برابر حساب می‌شوند.",
    stepMission: "یک مأموریت واقعی از صفحهٔ مأموریت‌ها انجام بده؛ اثر واقعی‌اش از بازی بیشتر است.",
    upTitle: "ارتقای بازی‌ها", upAll: "هر سطح ۲۰٪ امتیاز و سکهٔ بیشتر می‌دهد.", upLevel: "سطح {n}", upBtn: "ارتقا", upMax: "حداکثر", upBought: "بازی ارتقا یافت!",
    upPerk_sort: "هر سطح: ۱۰ ثانیه زمان بیشتر", upPerk_quiz: "هر سطح: بازهٔ پاداش سرعت بزرگ‌تر", upPerk_memory: "از سطح ۲: پیش‌نمایش کارت‌ها در شروع",
    b_story: "نجات‌دهندهٔ شهر",
    sto_drought_t: "خشکسالی",
    sto_drought_s: "چند ماه است باران نباریده؛ رودخانه خشک شده و گیاهان تشنه‌اند. با جمع کردن امتیاز به سبزک کمک کن تا آب را نجات بدهیم.",
    sto_drought_tip1: "یک شیر چکه‌کن در طول سال هزاران لیتر آب هدر می‌دهد؛ تعمیرش کن.",
    sto_drought_tip2: "گیاهان را صبح زود یا غروب آبیاری کن تا آب کمتر تبخیر شود.",
    sto_drought_tip3: "دوش کوتاه‌تر و بستن شیر هنگام مسواک، مصرف آب خانه را خیلی کم می‌کند.",
    sto_smog_t: "آلودگی هوا",
    sto_smog_s: "مه غلیظی روی شهر نشسته و نفس کشیدن سخت شده. هر قدم سبز کمی از دود را کم می‌کند؛ به سبزک کمک کن هوا را پاک کنیم.",
    sto_smog_tip1: "برای مسیرهای کوتاه پیاده برو یا دوچرخه بزن؛ هیچ دودی تولید نمی‌شود.",
    sto_smog_tip2: "هنگام توقف طولانی موتور خودرو را خاموش کن.",
    sto_smog_tip3: "مصرف برق کمتر معمولاً یعنی سوخت کمتری در نیروگاه‌ها می‌سوزد.",
    sto_trash_t: "کوه زباله",
    sto_trash_s: "زباله‌ها روی هم تلنبار شده‌اند و کوه بزرگی ساخته‌اند. با تفکیک و کم کردن پسماند، همراه سبزک کوه را کوچک کن.",
    sto_trash_tip1: "زبالهٔ خشک و تر را جدا کن؛ زبالهٔ تر می‌تواند کمپوست شود.",
    sto_trash_tip2: "قبل از دورانداختن فکر کن: می‌شود تعمیرش کرد یا به کسی داد؟",
    sto_trash_tip3: "بطری و لیوان شخصی، زبالهٔ یک‌بارمصرف را کم می‌کند."
  });
  Object.assign(translations.en, {
    szName: "Sabzak", szTipTitle: "Sabzak's tip of the day", szTipNext: "Another tip",
    storySeason: "Story season", storyWin: "The \"{t}\" crisis is defeated! Reward claimed.",
    storyDone: "You defeated every crisis and saved the city! All the residents thank you.",
    stepLabel: "Next step:", stepBuild: "You have enough coins to build \"{b}\" in your city.",
    stepCrisis: "{n} more XP to defeat \"{t}\"; \"{c}\" missions count double.",
    stepMission: "Do a real mission from the Missions page; its real-world impact beats any game.",
    upTitle: "Game upgrades", upAll: "Each level gives 20% more XP and coins.", upLevel: "Level {n}", upBtn: "Upgrade", upMax: "Max", upBought: "Game upgraded!",
    upPerk_sort: "Each level: 10 extra seconds", upPerk_quiz: "Each level: a wider speed-bonus window", upPerk_memory: "From level 2: cards are previewed at the start",
    b_story: "City savior",
    sto_drought_t: "Drought",
    sto_drought_s: "It hasn't rained for months; the river has dried up and the plants are thirsty. Collect points to help Sabzak save our water.",
    sto_drought_tip1: "A dripping tap wastes thousands of litres a year; fix it.",
    sto_drought_tip2: "Water plants early in the morning or at dusk so less evaporates.",
    sto_drought_tip3: "Shorter showers and turning off the tap while brushing cut household water use a lot.",
    sto_smog_t: "Air pollution",
    sto_smog_s: "A thick haze sits over the city and breathing is hard. Every green step clears a little smoke; help Sabzak clean the air.",
    sto_smog_tip1: "Walk or cycle for short trips; they make no exhaust.",
    sto_smog_tip2: "Switch off the engine during long stops.",
    sto_smog_tip3: "Using less electricity usually means less fuel burned in power plants.",
    sto_trash_t: "Trash mountain",
    sto_trash_s: "Waste has piled up into a huge mountain. Sort and reduce waste to shrink it together with Sabzak.",
    sto_trash_tip1: "Separate dry and wet waste; wet waste can be composted.",
    sto_trash_tip2: "Before throwing something away, ask: can it be repaired or given away?",
    sto_trash_tip3: "Your own bottle and cup cut down on disposable waste."
  });
  Object.assign(translations.fa, {
    missionsDescription: "هر روز سه مأموریت تازه داری؛ فردا مأموریت‌های دیگری باز می‌شود.",
    todayDoneCount: "{n} از {m} مأموریت امروز انجام شد", notToday: "این مأموریت در برنامهٔ امروز تو نیست.",
    comeBack: "همهٔ مأموریت‌های امروز را تمام کردی! فردا سه مأموریت سورپرایز تازه باز می‌شود؛ برگرد و ببین چه چیزی در انتظار توست.",
    tomorrowBonus: "پاداش پیاپی فردا: +{n} XP (🔥 روز {d})",
    mysteryT: "مأموریت سورپرایز", mysteryD: "فردا باز می‌شود",
    libraryTitle: "کتابخانهٔ مأموریت‌ها", libraryHint: "هر مأموریتی که انجام بدهی کشف می‌شود. {n} از {m} کشف شد.", undiscovered: "کشف‌نشده"
  });
  Object.assign(translations.en, {
    missionsDescription: "You get three fresh missions every day; new ones unlock tomorrow.",
    todayDoneCount: "{n} of {m} of today's missions done", notToday: "This mission isn't in today's plan.",
    comeBack: "You finished all of today's missions! Three new surprise missions unlock tomorrow; come back to see what awaits.",
    tomorrowBonus: "Tomorrow's streak bonus: +{n} XP (🔥 day {d})",
    mysteryT: "Surprise mission", mysteryD: "Unlocks tomorrow",
    libraryTitle: "Mission library", libraryHint: "Every mission you complete is discovered. {n} of {m} discovered.", undiscovered: "Undiscovered"
  });
  Object.assign(translations.fa, { gardenGrowth: "رشد باغ", gardenNote: "باغ فقط با مأموریت‌های واقعی رشد می‌کند؛ بازی‌ها سکه و امتیاز رتبه‌بندی می‌دهند." });
  Object.assign(translations.en, { gardenGrowth: "Garden growth", gardenNote: "The garden grows only through real missions; games earn coins and leaderboard XP." });
  Object.assign(translations.fa, { delNeedPass: "برای تأیید، گذرواژه‌ات را بنویس." });
  Object.assign(translations.en, { delNeedPass: "Enter your password to confirm." });
  const MIN_TEAM = 3;
  const ITEMS = [
    { id: "mushroom", e: "🍄", cost: 8, x: 176, y: 136, s: 12 }, { id: "flower", e: "🌸", cost: 10, x: 30, y: 134, s: 14 },
    { id: "butterfly", e: "🦋", cost: 15, x: 62, y: 72, s: 14 }, { id: "bee", e: "🐝", cost: 15, x: 138, y: 84, s: 13 },
    { id: "rabbit", e: "🐇", cost: 25, x: 140, y: 130, s: 16 }, { id: "fountain", e: "⛲", cost: 35, x: 64, y: 132, s: 18 },
    { id: "hut", e: "🏡", cost: 40, x: 20, y: 116, s: 24 }, { id: "rainbow", e: "🌈", cost: 50, x: 140, y: 52, s: 40 }
  ];
  const WEEK_GOAL = 150, WEEK_MIN = 3, WEEK_BONUS = 20;
  const DAILY_CAP = 150, REPEAT_F = 0.6, LOC_BONUS = 10; // daily XP cap, repeat-mission factor, location-code bonus
  // Location codes are stored hashed (SHA-256); the printable sheet is signs.html
  const LOCS = [{"h": "9be92c72337bafd095671f6b887757dbf5304d461f52a09a4df66b6cc96a3c0e", "cats": ["waste"], "fa": "سطل بازیافت", "en": "Recycling bin"}, {"h": "e8c3defe64dd3855cccc2df7b86f237436ad0d097015776c18921b7a86afae98", "cats": ["water"], "fa": "آب‌خوری یا سرویس بهداشتی", "en": "Water fountain or restroom"}, {"h": "a87c5d959980566b8b69dff2c30c59242ab449652293f9601d08ad0535638d12", "cats": ["energy"], "fa": "کلید برق یا تابلوی برق", "en": "Light switch or power panel"}, {"h": "7920eaa3ef5d41cbe6b2f3f9778aea644af9f8aeb4b97715db2b320a88cc24b6", "cats": ["transport"], "fa": "ایستگاه اتوبوس یا جای دوچرخه", "en": "Bus stop or bike rack"}, {"h": "caeb8b6a02ee18394990a910fe03e37bda8966a6766829c841d33412d29394ad", "cats": ["nature"], "fa": "فضای سبز یا باغچه", "en": "Garden or green space"}, {"h": "13d68b66f70cf5484899d4a78ef6abdded2dff33849713b215204365471abdc6", "cats": ["food"], "fa": "سلف یا کافه", "en": "Canteen or cafe"}];
  const REAL = { goal: 100,
    fa: "هدف ما: وقتی جنگل جمعی به ۱۰۰ درخت برسد، با همکاری دانشگاه یک اقدام واقعی (مثل نهال‌کاری) انجام شود.",
    en: "Our goal: when the community forest reaches 100 trees, we work with the university to carry out a real action (such as planting saplings)." };
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
  let tipIdx = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000) % TIPS.length, tipTimer = 0; // نکتهٔ روز: هر روز یک نکتهٔ ثابت
  function showTip(next) {
    const el = $("#tipText"); if (!el) return;
    const set = () => { el.textContent = TIPS[tipIdx][language === "fa" ? 0 : 1]; };
    if (!next) { set(); el.style.opacity = 1; return; }
    tipIdx = (tipIdx + 1 + Math.floor(Math.random() * (TIPS.length - 1))) % TIPS.length;
    el.style.opacity = 0;
    setTimeout(() => { set(); el.style.opacity = 1; }, 180);
  }
  const CATS = { waste: "♻️", water: "💧", energy: "⚡", transport: "🚲", nature: "🌱", food: "🥗" };
  const LEVELS = [0, 300, 800, 1600, 3000]; // XP needed for levels 1..5
  const GARDEN_MAX = 2000, GARDEN_LV = [0, 150, 500, 1000, 2000]; // رشد باغ فقط از مأموریت‌ها
  const gardenLevel = xp => GARDEN_LV.reduce((l, min, i) => (xp >= min ? i + 1 : l), 1);
  const AVATARS = ["🌿", "🌍", "🦋", "🐢", "🌻", "🐝", "🌳", "🐦"];

  //[شناسه، آیکون، دسته‌بندی، امتیاز تجربه (XP)، عنوان فارسی، عنوان انگلیسی، توضیحات فارسی، توضیحات انگلیسی]
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
    { id: "verified", icon: "📍", t: "b_ver", test: d => d.verified >= 3 },
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

  BADGES.push(
    { id: "g_first", icon: "🌱", t: "b_g_first", test: d => (d.gameCount || 0) >= 1 },
    { id: "g_streak", icon: "🔥", t: "b_g_streak", test: d => d.streak >= 3 },
    { id: "g_sort", icon: "♻️", t: "b_g_sort", test: d => ((d.games || {}).sort || {}).xp >= 120 },
    { id: "g_quiz", icon: "🧠", t: "b_g_quiz", test: d => ((d.games || {}).quiz || {}).best >= 70 },
    { id: "g_mem", icon: "🃏", t: "b_g_mem", test: d => ((d.games || {}).memory || {}).best >= 70 },
    { id: "xp100", icon: "⭐", t: "b_xp100", test: d => d.points >= 100 },
    { id: "g_ten", icon: "🎯", t: "b_g_ten", test: d => (d.gameCount || 0) >= 10 },
    { id: "city", icon: "🏙️", t: "b_city", test: d => (d.city || []).length >= 8 },
    { id: "story", icon: "🛡️", t: "b_story", test: d => ((d.story || {}).i || 0) >= 3 }
  );

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

  //ذخیره سازی
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
    d.gardenXp = Number.isFinite(d.gardenXp) ? Math.max(0, Math.round(d.gardenXp)) : Math.min(GARDEN_MAX, d.completed.reduce((a, id) => a + (M.find(m => m.id === id) || { points: 0 }).points, 0));
    d.seeds = Number.isInteger(d.seeds) ? d.seeds : Math.floor(d.points / 10);
    d.coins = Number.isInteger(d.coins) ? d.coins : 0;
    d.city = Array.isArray(d.city) ? d.city.filter(id => CITY.some(b => b.id === id)) : [];
    d.story = d.story && typeof d.story.i === "number" ? { i: d.story.i, xp: d.story.xp || 0 } : { i: 0, xp: 0 };
    d.up = d.up && typeof d.up === "object" ? d.up : {};
    d.garden = Array.isArray(d.garden) ? d.garden.filter(id => ITEMS.some(i => i.id === id)) : [];
    d.week = d.week && typeof d.week.n === "number" ? d.week : { key: "", n: 0 }; d.claimedWeek = d.claimedWeek || "";
    d.interests = Array.isArray(d.interests) ? d.interests.filter(c => CATS[c]) : [];
    d.teamName = d.teamName || ""; d.teamOwner = !!d.teamOwner;
    d.verified = Number.isInteger(d.verified) ? d.verified : 0; d.codesUsed = d.codesUsed && typeof d.codesUsed === "object" ? d.codesUsed : {};
    d.dayXp = d.dayXp && typeof d.dayXp.xp === "number" ? d.dayXp : { day: "", xp: 0 };
    d.gameXp = d.gameXp && typeof d.gameXp.xp === "number" ? d.gameXp : { day: "", xp: 0 };
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
    const ref = doc(db, "users", user.uid);
    let snap = await getDoc(ref);
    const name = (user.email || "").split("@")[0];
    if (!snap.exists()) {
      const d = normalize(seedFromLocal(name), name);
      d.username = name;
      d.badges = earnedBadges(d).map(b => b.id);
      d.createdTs = serverTimestamp();
      await setDoc(ref, d);
    } else if (!snap.data().createdTs) {
      await setDoc(ref, { createdTs: serverTimestamp() }, { merge: true }); // کاربران قدیمی
    }
    snap = await getDoc(ref); // createdTs را به‌صورت مقدار واقعی بخوان
    cache = normalize(snap.data(), name);
    cache.username = name;
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

  //احراز هویت
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

  //خانه
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
    const ring = $("#levelRing"); if (ring) ring.style.setProperty("--p", li.pct);
    const rem = $("#levelRemain");
    if (rem) rem.textContent = li.max ? t("maxLevel") : t("toNext").replace("{n}", number(LEVELS[li.lvl] - d.points)).replace("{l}", number(li.lvl + 1));
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

  //ماموریتها
  const ymd = x => x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
  const today = () => ymd(new Date());
  const yesterday = () => { const x = new Date(); x.setDate(x.getDate() - 1); return ymd(x); };
  const streakNow = d => (d.lastDay === today() || d.lastDay === yesterday() ? d.streak : 0);
  const nextStreak = d => (d.lastDay === today() ? d.streak : d.lastDay === yesterday() ? d.streak + 1 : 1);
  const doneToday = d => (d.daily.day === today() ? d.daily.ids : []);
  function dailyPicks(d) {
    if (d.daily.day === today() && d.daily.picks) return d.daily.picks.map(id => M.find(m => m.id === id)).filter(Boolean);
    const n = Math.floor(Date.parse(today() + "T00:00:00Z") / 86400000), lvl = levelInfo(d.points).lvl;
    let pool = M.filter(m => (!d.interests.length || d.interests.includes(m.cat)) && (lvl >= 3 || m.points <= 30));
    if (pool.length < 3) pool = M;
    const step = Math.floor(pool.length / 3);
    const picks = [0, 1, 2].map(k => pool[(n * 7 + k * step) % pool.length]);
    d.daily = { day: today(), ids: doneToday(d), picks: picks.map(m => m.id) }; // برنامهٔ امروز ثابت می‌ماند
    return picks;
  }
  function weekKey() { const x = new Date(); x.setDate(x.getDate() - ((x.getDay() + 1) % 7)); return ymd(x); }
  function weekTheme() { const k = Object.keys(CATS); return k[Math.floor(Date.parse(weekKey() + "T00:00:00Z") / 604800000) % k.length]; }

  //مینی گیم ها
  const GAME_IDS = ["sort", "quiz", "memory"], GAME_LIMIT = 1, GAME_DAY_CAP = 120; // حداکثر ۱ دور پاداش‌دار در روز برای هر بازی
  const gameOfDay = () => GAME_IDS[Math.floor(Date.parse(today() + "T00:00:00Z") / 86400000) % GAME_IDS.length];
  let playId = "";

  function finishGame(id, xpRaw) {
    const d = userData(); if (!d) return { gain: 0, doubled: false, practice: true };
    xpRaw = Math.round(xpRaw * (1 + 0.2 * (gameLevel(d, id) - 1))); // ارتقای بازی: ۲۰٪ بیشتر برای هر سطح
    const day = today(), before = levelInfo(d.points).lvl;
    d.games = d.games && typeof d.games === "object" ? d.games : {};
    const g = d.games[id] = { plays: 0, best: 0, xp: 0, day: "", today: 0, ...(d.games[id] || {}) };
    if (g.day !== day) { g.day = day; g.today = 0; }
    if (d.gameXp.day !== day) d.gameXp = { day, xp: 0 };
    const room = Math.max(0, GAME_DAY_CAP - d.gameXp.xp); // سقف کل XP بازی‌ها در روز
    const practice = g.today >= GAME_LIMIT || room <= 0, doubled = id === gameOfDay();
    const gain = practice ? 0 : Math.min(room, xpRaw * (doubled ? 2 : 1));
    d.gameXp.xp += gain;
    const coins = practice ? 0 : Math.max(1, Math.round((doubled ? gain / 2 : gain) / 4)); // ≈ ۲۰ سکه برای هر بازی
    if (d.lastDay !== day) { d.streak = nextStreak(d); d.lastDay = day; }
    g.plays++; g.best = Math.max(g.best, xpRaw); g.xp += gain; if (!practice) g.today++;
    d.gameCount = (d.gameCount || 0) + 1; d.points += gain; d.coins = (d.coins || 0) + coins;
    const beaten = storyAdd(d, gain, GAME_CAT[id] || null);
    if (gain) d.seeds += Math.max(1, Math.round(gain / 10));
    d.recent = [{ id, xp: gain, day }, ...(d.recent || [])].slice(0, 5);
    d.log = [...d.log, { id: "g_" + id, day }].slice(-30);
    const fresh = BADGES.filter(b => !d.badges.includes(b.id) && b.test(d));
    d.badges.push(...fresh.map(b => b.id));
    saveUserData(d);
    const after = levelInfo(d.points).lvl;
    confetti(); beep();
    toast(beaten ? "🏆 " + t("storyWin").replace("{t}", t("sto_" + beaten.id + "_t")) : after > before ? "🎉 " + t("levelUp").replace("{n}", number(after)) : fresh.length ? `${fresh[0].icon} ${t("newBadge")} ${badgeName(fresh[0])}` : `+${number(gain)} XP · 🪙${number(coins)} · 🔥${number(d.streak)}`);
    updateStats();
    return { gain, doubled, practice, coins, beatenTitle: beaten ? t("sto_" + beaten.id + "_t") : "" };
  }

  function renderGamesHome() {
    const box = $("#gamesHome"); if (!box || !window.GreenGames) return;
    const G = GreenGames.META, pk = x => x[language === "fa" ? 0 : 1], hero = G.find(g => g.id === gameOfDay()), d = userData();
    box.innerHTML = `<div class="hero-game"><span class="hero-tag">✨ ${t("todayGame")}</span>
        <div class="hero-row"><div class="hero-icon">${hero.icon}</div><div><h2>${pk(hero.title)}</h2><p>${pk(hero.desc)}</p></div></div>
        <button class="primary-button hero-btn" data-play="${hero.id}" type="button">▶ ${t("playNow")}</button></div>
      <button class="game-card city-teaser" data-go="city" type="button"><span class="mission-icon">🏙️</span>
        <span class="gc-body"><span class="gc-title">${t("cityTitle")}</span><span class="gc-desc" style="margin-bottom:0">${t("cityIndex")}: ${pct(cityStats(d).idx)} · 🪙 ${number(d.coins)}</span>${crisisTag(d)}</span></button>
      <div class="section-heading" style="margin-top:24px"><h2>${t("gamesAll")}</h2><small class="note">${number(G.length)} ${t("gamesCount")}</small></div>
      <div class="mission-list">${G.map(g => `<button class="game-card tone-${g.tone}" data-play="${g.id}" type="button"><span class="mission-icon">${g.icon}</span>
        <span class="gc-body"><span class="gc-title">${pk(g.title)}</span><span class="gc-desc">${pk(g.desc)}</span><span class="cat-tag">${pk(g.info)} · ${t("upLevel").replace("{n}", number(gameLevel(d, g.id)))}</span></span></button>`).join("")}</div>
      <div class="how-card"><h3>${t("howXp")}</h3><p>${t("howXpText")}</p></div>`;
  }

  function renderPlay() { return `<section class="page-panel"><div id="gameRoot"></div></section>`; }
  function startGame() {
    const root = $("#gameRoot"); if (!root || !window.GreenGames) return;
    GreenGames.mount(playId, root, {
      finish: r => finishGame(playId, r.xp),
    level: gameLevel(userData(), playId),
    next: () => nextStep(userData()),
      replay: () => renderPage("play"),
      exit: () => renderPage("home")
    });
  }

  function gamesProgressHTML(d) {
    if (!window.GreenGames) return "";
    const pk = x => x[language === "fa" ? 0 : 1], gs = d.games || {};
    const rec = GreenGames.META.map(g => { const s = gs[g.id] || {}; return `<div class="rank-row"><strong>${g.icon} ${pk(g.title)}</strong><span>${t("best")}: ${number(s.best || 0)} · ${number(s.plays || 0)} ${t("plays")}</span></div>`; }).join("");
    const rc = (d.recent || []).map(x => { const g = GreenGames.META.find(m => m.id === x.id); return g ? `<div class="rank-row"><strong>${g.icon} ${pk(g.title)}</strong><span>+${number(x.xp)} XP</span></div>` : ""; }).join("") || `<p class="empty-note">${t("noRecent")}</p>`;
    return `<div class="stat-grid"><div class="stat-tile"><b>${number(d.gameCount || 0)}</b><small>${t("gamesCount")}</small></div>
      <div class="stat-tile"><b>${number(streakNow(d))}</b><small>${t("streakDays")}</small></div>
      <div class="stat-tile"><b>${number(levelInfo(d.points).lvl)}</b><small>${t("levelStat")}</small></div></div>
      <h2 class="sub-title">${t("records")}</h2>${rec}<h2 class="sub-title">${t("recent")}</h2>${rc}`;
  }

  //شهر سبز یا محوطه سبز
  const CITY = [
    { id: "tree", icon: "🌳", cost: 20 }, { id: "garden", icon: "🌷", cost: 40 }, { id: "recycle", icon: "♻️", cost: 70 }, { id: "bike", icon: "🚲", cost: 100 },
    { id: "solar", icon: "☀️", cost: 140 }, { id: "rain", icon: "💧", cost: 180 }, { id: "wind", icon: "🌬️", cost: 230 }, { id: "park", icon: "🏞️", cost: 300 }
  ];
  const CITY_BASE = 35, CITY_PER_BUILDING = 7, DECAY_PER_DAY = 5, DECAY_MAX = 30;
  function cityStats(d) {
    const built = (d.city || []).length;
    const gap = d.lastDay ? Math.round((Date.parse(today() + "T00:00:00Z") - Date.parse(d.lastDay + "T00:00:00Z")) / 86400000) : 0;
    const decay = Math.min(DECAY_MAX, Math.max(0, gap - 1) * DECAY_PER_DAY);
    return { built, gap, decay, idx: Math.max(5, Math.min(100, CITY_BASE + built * CITY_PER_BUILDING - decay)) };
  }
  function renderCity() {
    const d = userData(), st = cityStats(d);
    const row = b => {
      const own = d.city.includes(b.id), can = d.coins >= b.cost;
      return `<article class="mission-card ${own ? "done" : can ? "" : "locked"}"><div class="mission-icon">${b.icon}</div>
        <div class="mission-info"><h3>${t("bld_" + b.id)}</h3><p>${t("bld_" + b.id + "_d")}</p></div>
        <div class="mission-action"><span class="xp-pill">🪙 ${number(b.cost)}</span>
        ${own ? `<span class="mission-status">✓ ${t("builtLbl")}</span>` : can ? `<button class="text-button" data-city-buy="${b.id}" type="button">${t("build")}</button>` : `<span class="mission-status" style="color:var(--muted)">🔒</span>`}</div></article>`;
    };
    return `<section class="page-panel"><p class="eyebrow">${t("cityDesc")}</p><h1>${t("cityTitle")}</h1>${crisisCardHTML(d)}
      <div class="city-card"><div class="city-top"><div><span class="eyebrow">${t("cityIndex")}</span><div class="city-index">${pct(st.idx)}</div></div>
        <span class="coin-pill">🪙 ${number(d.coins)} ${t("coinsLabel")}</span></div>
        <div class="progress-track"><div class="progress-fill" style="width:${st.idx}%"></div></div>
        <div class="city-meta"><span>${t("builtOf").replace("{n}", number(st.built)).replace("{m}", number(CITY.length))}</span><span>${t("perGame")}</span></div>
        ${st.decay ? `<p class="city-warn">${t("cityDecay").replace("{n}", number(st.gap)).replace("{p}", number(st.decay))}</p>` : `<p class="note" style="margin:0">${t("cityFresh")}</p>`}</div>
      <div class="hood ${st.decay ? "smog" : ""} ${hoodCrisis(d)}"><p class="eyebrow">${t("yourHood")}</p>
        <div class="hood-grid">${CITY.map(b => d.city.includes(b.id) ? `<div class="slot built" title="${esc(t("bld_" + b.id))}">${b.icon}</div>` : `<div class="slot">+</div>`).join("")}</div><div class="hood-ground"></div></div>
      <div class="section-heading"><h2>${t("buildingsTitle")}</h2><small class="note">${number(st.built)} / ${number(CITY.length)}</small></div>
      <div class="mission-list city-list">${CITY.map(row).join("")}</div>${upgradesHTML(d)}</section>`;
  }
  function buyBuilding(id) {
    const d = userData(), b = CITY.find(x => x.id === id); if (!d || !b || d.city.includes(id)) return;
    if (d.coins < b.cost) return toast(t("needCoins"));
    d.coins -= b.cost; d.city.push(id);
    const fresh = BADGES.filter(x => !d.badges.includes(x.id) && x.test(d)); d.badges.push(...fresh.map(x => x.id));
    saveUserData(d); confetti(); beep();
    toast(fresh.length ? `${fresh[0].icon} ${t("newBadge")} ${badgeName(fresh[0])}` : b.icon + " " + t("cityBuilt"));
    renderPage("city");
  }

  //سبزک، فصل داستانی، ارتقای بازی‌ها
  const sabzak = (html, cls = "") => `<div class="sz-coach ${cls}"><img class="sz-img" src="sabzak.jpg" alt="${esc(t("szName"))}" /><div class="sz-bubble"><b class="sz-name">${t("szName")}</b><p>${html}</p></div></div>`;
  const STORY = [
    { id: "drought", icon: "🏜️", goal: 250, cats: ["water"], reward: 60 },
    { id: "smog", icon: "🌫️", goal: 400, cats: ["energy", "transport"], reward: 100 },
    { id: "trash", icon: "🗑️", goal: 550, cats: ["waste", "food"], reward: 150 }
  ];
  const GAME_CAT = { sort: "waste" }; // بازی تفکیک زباله برای فصل «کوه زباله» دو برابر حساب می‌شود
  const UP_COST = [0, 60, 140], UP_MAX = 3;
  const gameLevel = (d, id) => Math.min(UP_MAX, Math.max(1, (d && d.up && d.up[id]) || 1));
  const joinCats = cats => cats.map(c => t("cat_" + c)).join(language === "fa" ? " و " : " & ");

  // امتیاز را به فصل فعلی اضافه می‌کند؛ اگر بحران شکست بخورد، فصل را برمی‌گرداند
  function storyAdd(d, xp, cat) {
    const ch = STORY[d.story.i]; if (!ch || xp <= 0) return null;
    d.story.xp += xp * (cat && ch.cats.includes(cat) ? 2 : 1);
    if (d.story.xp < ch.goal) return null;
    d.story = { i: d.story.i + 1, xp: d.story.xp - ch.goal };
    d.coins = (d.coins || 0) + ch.reward;
    return ch;
  }
  function crisisStep(d) {
    const ch = STORY[d.story.i]; if (!ch) return "";
    return t("stepCrisis").replace("{n}", number(Math.max(0, Math.ceil(ch.goal - d.story.xp)))).replace("{t}", t("sto_" + ch.id + "_t")).replace("{c}", joinCats(ch.cats));
  }
  function nextStep(d) {
    if (!d) return "";
    const b = CITY.find(x => !d.city.includes(x.id) && d.coins >= x.cost);
    return t("stepLabel") + " " + (b ? t("stepBuild").replace("{b}", t("bld_" + b.id)) : crisisStep(d) || t("stepMission"));
  }
  const hoodCrisis = d => (STORY[d.story.i] ? "crisis-" + STORY[d.story.i].id : "");
  function crisisTag(d) {
    const ch = STORY[d.story.i]; if (!ch) return "";
    return `<span class="cat-tag">${ch.icon} ${t("sto_" + ch.id + "_t")} · ${number(Math.round(d.story.xp))}/${number(ch.goal)}</span>`;
  }
  function crisisCardHTML(d) {
    const ch = STORY[d.story.i];
    if (!ch) return `<div class="crisis-card done">${sabzak(t("storyDone"))}</div>`;
    const w = Math.min(100, Math.round(d.story.xp / ch.goal * 100)), day = Math.floor(Date.parse(today() + "T00:00:00Z") / 86400000);
    return `<div class="crisis-card crisis-${ch.id}"><div class="crisis-head"><span class="crisis-ico">${ch.icon}</span>
      <div><p class="eyebrow">${t("storySeason")} · ${number(d.story.i + 1)}/${number(STORY.length)}</p><h2>${t("sto_" + ch.id + "_t")}</h2></div></div>
      <p class="note" style="margin:0">${t("sto_" + ch.id + "_s")}</p>
      <div class="progress-track"><div class="progress-fill" style="width:${w}%"></div></div>
      <div class="city-meta"><span>${number(Math.round(d.story.xp))}/${number(ch.goal)} XP</span><span>🎁 ${number(ch.reward)} 🪙</span></div>
      ${sabzak(`${t("sto_" + ch.id + "_tip" + (day % 3 + 1))}<br><b>${t("stepLabel")}</b> ${crisisStep(d)}`)}</div>`;
  }
  function upgradesHTML(d) {
    if (!window.GreenGames) return "";
    const pk = x => x[language === "fa" ? 0 : 1];
    return `<div class="section-heading" style="margin-top:26px"><h2>${t("upTitle")}</h2></div><p class="note" style="margin:0 2px 10px">${t("upAll")}</p>
      <div class="mission-list city-list">${GreenGames.META.map(g => {
        const lv = gameLevel(d, g.id), max = lv >= UP_MAX, cost = UP_COST[lv], can = !max && d.coins >= cost;
        return `<article class="mission-card ${max ? "done" : can ? "" : "locked"}"><div class="mission-icon">${g.icon}</div>
          <div class="mission-info"><h3>${pk(g.title)} · ${t("upLevel").replace("{n}", number(lv))}</h3><p>${t("upPerk_" + g.id)}</p></div>
          <div class="mission-action">${max ? `<span class="mission-status">✓ ${t("upMax")}</span>` : `<span class="xp-pill">🪙 ${number(cost)}</span>${can ? `<button class="text-button" data-up-buy="${g.id}" type="button">${t("upBtn")}</button>` : `<span class="mission-status" style="color:var(--muted)">🔒</span>`}`}</div></article>`;
      }).join("")}</div>`;
  }
  function buyUpgrade(id) {
    const d = userData(), lv = gameLevel(d, id); if (!d || lv >= UP_MAX || d.coins < UP_COST[lv]) return;
    d.coins -= UP_COST[lv]; d.up[id] = lv + 1; saveUserData(d); confetti(); beep(); toast("⬆️ " + t("upBought")); renderPage("city");
  }

  function card(m, d, daily) {
    const done = daily ? doneToday(d).includes(m.id) : d.completed.includes(m.id);
    const gain = m.points + (daily ? Math.min(nextStreak(d), 7) * 5 : 0);
    return `<article class="mission-card ${done ? "done" : ""}">
      <div class="mission-icon">${m.icon}</div>
      <div class="mission-info"><h3>${esc(m.title[language])}</h3><p>${esc(m.description[language])}</p>
        <span class="cat-tag">${m.cat === weekTheme() ? "🎯 " : ""}${CATS[m.cat]} ${t("cat_" + m.cat)} · ${t("d_" + (m.points <= 20 ? "easy" : m.points <= 30 ? "mid" : "hard"))}</span></div>
      <div class="mission-action"><span class="xp-pill">+${number(gain)} XP</span>
        ${done ? `<span class="mission-status">✓ ${t(daily ? "doneToday" : "completed")}</span>`
          : `<button class="text-button complete-mission" type="button" data-mission-id="${m.id}" data-daily="${daily ? 1 : 0}">${t("startMission")}</button>`}
      </div></article>`;
  }

  function renderDashboardMissions() {
    const c = $("#dashboardMissions"), d = userData(); if (!c || !d) return;
    c.innerHTML = dailyPicks(d).map(m => card(m, d, true)).join("");
  }

  function renderMissions() {
    const d = userData(), picks = dailyPicks(d), done = doneToday(d), n = picks.filter(m => done.includes(m.id)).length, allDone = n >= picks.length;
    const tmDays = d.streak + 1, tmBonus = Math.min(tmDays, 7) * 5;
    const mystery = [0, 1, 2].map(() => `<article class="mission-card locked"><div class="mission-icon">❓</div>
      <div class="mission-info"><h3>${t("mysteryT")}</h3><p>${t("mysteryD")}</p></div><div class="mission-action"><span class="mission-status" style="color:var(--muted)">🔒</span></div></article>`).join("");
    const lib = M.map(m => d.completed.includes(m.id)
      ? `<div class="badge"><span>${m.icon}</span>${esc(m.title[language])}</div>`
      : `<div class="badge locked"><span>❓</span>${t("undiscovered")}</div>`).join("");
    return `<section class="page-panel"><p class="eyebrow">${t("missionsDescription")}</p><h1>${t("todayMissions")}</h1>
      <div class="progress-track"><div class="progress-fill" style="width:${Math.round(n / picks.length * 100)}%"></div></div>
      <p class="note">${t("todayDoneCount").replace("{n}", number(n)).replace("{m}", number(picks.length))}</p>
      <div class="mission-list">${picks.map(m => card(m, d, true)).join("")}</div>
      ${allDone ? `<div class="crisis-card done" style="margin-top:16px">${sabzak(t("comeBack") + "<br><b>" + t("tomorrowBonus").replace("{n}", number(tmBonus)).replace("{d}", number(tmDays)) + "</b>")}</div>
        <div class="mission-list" style="margin-top:12px">${mystery}</div>` : ""}
      <h2 class="sub-title">${t("libraryTitle")}</h2><p class="note" style="margin-top:0">${t("libraryHint").replace("{n}", number(d.completed.length)).replace("{m}", number(M.length))}</p>
      <div class="badge-grid">${lib}</div></section>`;
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
    const gl = gardenLevel(d.gardenXp), g = Math.min(1, d.gardenXp / GARDEN_MAX), h = 14 + g * 50, n = Math.round(2 + g * 7), sc = 0.6 + 0.4 * g, cy = 118 - h;
    const P = [[0, 0, 17], [-15, 7, 13], [15, 7, 13], [-7, -13, 12], [9, -13, 11], [-26, 13, 10], [26, 13, 10], [0, -24, 10], [0, 11, 12]];
    const leaves = P.slice(0, n).map(([x, y, r]) => `<circle cx="${100 + x * sc}" cy="${cy + y * sc}" r="${r * sc}" fill="#2f9157"/>`).join("");
    const fruit = gl >= 4 ? P.slice(1, 4).map(([x, y]) => `<circle cx="${100 + x * sc * 0.8}" cy="${cy + y * sc * 0.8 + 3}" r="3" fill="#e0533d"/>`).join("") : "";
    return `<div class="section-heading"><h2>${t("gardenTitle")}</h2></div><div class="garden-card">
      <svg viewBox="0 0 200 140" role="img" aria-label="${t("gardenTitle")}"><rect width="200" height="140" fill="#eaf6ee"/>
      ${gl >= 3 ? '<text x="20" y="32" font-size="20">☀️</text>' : ""}${gl >= 5 ? '<text x="152" y="40" font-size="16">🐦</text>' : ""}
      <rect y="118" width="200" height="22" fill="#cfe8d5"/>${ITEMS.filter(i => d.garden.includes(i.id)).map(i => `<text x="${i.x - i.s / 2}" y="${i.y}" font-size="${i.s}">${i.e}</text>`).join("")}<rect x="${98 - g * 2.5}" y="${118 - h}" width="${4 + g * 5}" height="${h}" rx="2" fill="#8a6a45"/>${leaves}${fruit}</svg>
      <div class="garden-meta"><b>🌱 ${t("gardenGrowth")}: ${pct(Math.round(g * 100))}</b><span class="streak">🔥 ${number(streakNow(d))} ${t("streakDays")}</span>
      <button class="text-button" data-go="shop" type="button">🌰 ${number(d.seeds)} · ${t("shopTitle")}</button></div>
      <p class="note" style="margin:0 15px 12px">${t("gardenNote")}</p>
      <p class="note" style="margin:0 15px 12px">🎯 ${t("weeklyHome").replace("{c}", t("cat_" + weekTheme())).replace("{n}", number(d.week.key === weekKey() ? d.week.n : 0))}</p>
      <p class="note" style="margin:0 15px 12px">⚡ ${t("capLine").replace("{n}", number(dayXpToday(d))).replace("{c}", number(DAILY_CAP))}</p>
      <div style="padding:0 15px 12px"><button class="text-button" data-share type="button">📤 ${t("shareGarden")}</button></div></div>`;
  }

  function askProof(id, daily) {
    const d = userData(), m = M.find(x => x.id === id); if (!d || !m) return;
    if (!daily || !dailyPicks(d).some(x => x.id === id) || doneToday(d).includes(id)) return toast(t("notToday"));
    if (dayXpToday(d) >= DAILY_CAP) return toast(t("capFull"));
    pending = { id, daily };
    openModal(`<h2>${esc(m.title[language])}</h2><p class="eyebrow" style="text-align:center">${t("proofHint")}</p>
      <textarea id="proofText" maxlength="120" rows="3" aria-label="${t("proofTitle")}"></textarea>
      <input id="locCode" class="modal-input" maxlength="20" autocomplete="off" placeholder="${t("locLabel")}" /><p class="note" style="margin:0">${t("locHint")}</p><p id="proofErr" class="auth-message"></p>
      <div class="modal-actions"><button class="text-button" data-modal-close type="button">${t("cancel")}</button>
      <button class="primary-button" data-proof-submit type="button">${t("submitProof")}</button></div>`);
    setTimeout(() => { const e = $("#proofText"); if (e) e.focus(); }, 50);
  }
  async function submitProof() {
    const err = m => { $("#proofErr").textContent = m; };
    const note = $("#proofText").value.trim(), code = $("#locCode").value.trim().toLowerCase(), d = userData(), p = pending;
    if (note.length < 8) return err(t("proofShort"));
    let hash = "";
    if (code && p && d) {
      const m = M.find(x => x.id === p.id);
      try { hash = await sha("greenstep:" + code); } catch { return err(t("locBad")); }
      const loc = LOCS.find(l => l.h === hash);
      if (!loc || !loc.cats.includes(m.cat)) return err(t("locBad"));
      if (d.codesUsed[hash] === today()) return err(t("locUsed"));
    }
    pending = null; closeModal(); if (p) finishMission(p.id, p.daily, note, hash);
  }

  function finishMission(id, daily, note, locHash) {
    const d = userData(), m = M.find(x => x.id === id); if (!d || !m) return;
    if (!daily || !dailyPicks(d).some(x => x.id === id)) return; // فقط سه مأموریت امروز
    if (daily ? doneToday(d).includes(id) : d.completed.includes(id)) return;
    const before = levelInfo(d.points).lvl, day = today();
    if (d.lastDay !== day) { d.streak = nextStreak(d); d.lastDay = day; }
    const repeat = daily && d.completed.includes(id);
    let gain = repeat ? Math.round(m.points * REPEAT_F) : m.points;
    if (daily) {
      gain += Math.min(d.streak, 7) * 5;
      const pk = dailyPicks(d).map(x => x.id); d.daily = { day, ids: [...doneToday(d), id], picks: pk };
      if (!d.completed.includes(id)) d.completed.push(id);
    } else d.completed.push(id);
    if (locHash) { d.codesUsed[locHash] = day; d.verified++; gain += LOC_BONUS; }
    const used = dayXpToday(d); gain = Math.min(gain, Math.max(0, DAILY_CAP - used)); d.dayXp = { day, xp: used + gain };
    d.points += gain; d.gardenXp += gain; const seedGain = Math.max(1, Math.round(gain / 10)) + (locHash ? 2 : 0); d.seeds += seedGain;
    const coinGain = Math.max(1, Math.round(m.points / 2)); d.coins = (d.coins || 0) + coinGain;
    const beaten = storyAdd(d, gain, m.cat);
    const wk = weekKey(); if (d.week.key !== wk) d.week = { key: wk, n: 0 }; if (m.cat === weekTheme()) d.week.n++;
    impactAdd(d.impact, m); d.log = [...d.log, { id, day }].slice(-30);
    if (uid) addDoc(collection(db, "users", uid, "notes"), { id, day, note: note.slice(0, 120) }).catch(() => {});
    const fresh = BADGES.filter(b => !d.badges.includes(b.id) && b.test(d));
    d.badges.push(...fresh.map(b => b.id));
    saveUserData(d);
    const after = levelInfo(d.points).lvl;
    confetti(); beep();
    toast(beaten ? "🏆 " + t("storyWin").replace("{t}", t("sto_" + beaten.id + "_t")) : after > before ? "🎉 " + t("levelUp").replace("{n}", number(after)) : fresh.length ? `${fresh[0].icon} ${t("newBadge")} ${badgeName(fresh[0])}` : `+${number(gain)} XP · 🌰${number(seedGain)} · 🪙${number(coinGain)} · 🔥${number(d.streak)}${locHash ? " · 📍" : ""}`);
    renderPage(activePage);
  }

  function onboarding(i) {
    openModal(`<div style="font-size:44px;text-align:center">${["📅", "🌳", "🏆"][i]}</div><h2>${t("onb" + (i + 1) + "t")}</h2>
      <p style="margin:0;font-size:13px;line-height:1.9;text-align:center;color:var(--muted)">${t("onb" + (i + 1) + "d")}</p>
      <div class="modal-actions"><button class="text-button" data-onb-skip type="button">${t("skip")}</button>
      <button class="primary-button" data-onb-next="${i}" type="button">${t(i === 2 ? "start" : "next")}</button></div>`);
  }
  function endOnboarding() { closeModal(); const d = userData(); if (d) { d.onboarded = true; saveUserData(d); interestPicker(true); } }

  async function sendFeedback() {
    if (guest) return toast(t("guestRank"));
    if (!fbRating) return toast(t("fbPick"));
    const text = ($("#fbText").value || "").trim().slice(0, 300);
    try {
      await addDoc(collection(db, "feedback"), { rating: fbRating, text, lang: language, createdAt: new Date().toISOString() });
      fbRating = 0; toast(t("fbThanks")); renderPage("profile");
    } catch { toast(t("networkError")); }
  }

  //جدول رده بندی
  function renderLeaderboard() {
    if (guest) { rankDocs = demoDocs(true); setTimeout(paintRanks, 0); } else loadRanks();
    const chip = (v, l) => `<button class="chip ${rankTab === v ? "active" : ""}" type="button" data-ranktab="${v}">${l}</button>`;
    return `<section class="page-panel"><p class="eyebrow">${t("leaderboardDescription")}</p><h1>${t("leaderboardTitle")}</h1>
      ${guest ? `<div class="demo-banner">${t("demoBanner")}</div>` : ""}<div id="challengeBox"></div>
      <div class="chips">${chip("people", t("people"))}${chip("teams", t("teams"))}</div>
      <div id="rankList"><p class="empty-note">${t("loading")}</p></div><p class="empty-note">${t("demoNote")}</p></section>`;
  }
  function paintRanks() {
    const cb = $("#challengeBox"); if (cb) cb.innerHTML = challengeHTML();
    const el = $("#rankList"); if (!el) return;
    const medals = ["🥇", "🥈", "🥉"], pos = i => medals[i] || number(i + 1) + ".";
    if (rankTab === "people") {
      el.innerHTML = rankDocs.map((u, i) => `<div class="rank-row ${u.id === uid || u.me ? "me" : ""}"><strong>${pos(i)} ${esc(u.displayName || u.username)}</strong><span>${number(u.points || 0)} XP</span></div>`).join("") || `<p class="empty-note">${t("noRanks")}</p>`;
      return;
    }
    const g = {};
    rankDocs.forEach(u => {
      const k = (u.team || "").trim(); if (!k) return;
      const x = g[k] = g[k] || { key: k, name: k, sum: 0, n: 0, lead: false };
      if (u.teamName) x.name = u.teamName;
      x.sum += u.points || 0; x.n++; if (u.teamOwner) x.lead = true;
    });
    const all = Object.values(g).map(x => ({ ...x, avg: Math.round(x.sum / x.n) }));
    const list = all.filter(x => x.n >= MIN_TEAM).sort((a, b) => b.avg - a.avg);
    const mine = cache && cache.team ? all.find(x => x.key === cache.team) : null;
    const hint = mine && mine.n < MIN_TEAM ? `<p class="note">${t("teamWait").replace(/\{n\}/g, number(mine.n)).replace(/\{m\}/g, number(MIN_TEAM))}</p>` : "";
    el.innerHTML = hint + (list.map((x, i) => `<div class="rank-row ${cache && x.key === cache.team ? "me" : ""}"><strong>${pos(i)} ${x.lead ? "👑 " : ""}${esc(x.name)}</strong><span>${number(x.avg)} XP · ${number(x.n)} ${t("members")}</span></div>`).join("") || `<p class="empty-note">${t("noTeams")}</p>`);
  }
  let stopRanksFn = null;
  function stopRanks() { if (stopRanksFn) { stopRanksFn(); stopRanksFn = null; } }
  function loadRanks() {
    stopRanks();
    stopRanksFn = onSnapshot(query(collection(db, "users"), orderBy("points", "desc"), limit(100)), snap => {
      rankDocs = snap.docs.map(x => ({ id: x.id, ...x.data() })); paintRanks(); paintStats();
    }, () => { const el = $("#rankList"); if (el) el.innerHTML = `<p class="empty-note">${t("networkError")}</p>`; });
  }

  //درباره،آمار،نظرسنجی
  function renderAbout() {
    const sec = (h, p) => `<div class="profile-card"><h2>${t(h)}</h2><p style="line-height:2;font-size:13px;margin:6px 0 0">${t(p)}</p></div>`;
    return `<section class="page-panel"><h1>${t("aboutTitle")}</h1>${sec("aboutProblemH", "aboutProblem")}${sec("aboutGoalH", "aboutGoal")}${sec("aboutDesignH", "aboutDesign")}${sec("aboutImpactH", "aboutImpact")}${sec("aboutPrivacyH", "aboutPrivacy")}${sec("aboutLimitsH", "aboutLimits")}</section>`;
  }
  function renderStats() {
    if (!guest) loadRanks();
    setTimeout(paintStats, 0);
    return `<section class="page-panel"><h1>${t("statsTitle")}</h1><div id="statsBox"></div></section>`;
  }
  function demoDocs(withMe) {
    const wk = weekKey(), seen = new Set();
    const names = ["سارا", "Ali", "مینا", "Reza", "نگار", "Omid", "هانیه", "Kian", "آوا", "Parsa", "یاسمن", "Arman"];
    const pts = [520, 470, 430, 390, 350, 310, 270, 230, 190, 150, 100, 50];
    const tm = [["a1", "سبزها"], ["a1", "سبزها"], ["b2", "آب‌دوستان"], ["a1", "سبزها"], ["b2", "آب‌دوستان"], ["a1", "سبزها"], ["b2", "آب‌دوستان"], ["c3", "نهال"], ["c3", "نهال"], null, null, null];
    const docs = names.map((n, i) => {
      const ids = Array.from({ length: Math.max(1, Math.round(pts[i] / 24)) }, (_, j) => M[(j * 7 + i * 3) % M.length].id).filter((x, j, a) => a.indexOf(x) === j);
      const T = tm[i], lead = !!T && !seen.has(T[0]); if (T) seen.add(T[0]);
      return { id: "demo" + i, displayName: n, points: pts[i], completed: ids, team: T ? T[0] : "", teamName: T ? T[1] : "", teamOwner: lead,
        week: { key: wk, n: ids.length }, log: i < 10 ? [{ id: ids[0], day: "d1" }, { id: ids[0], day: "d2" }] : [{ id: ids[0], day: "d1" }],
        pre: i < 7 ? { w: 2 + (i % 2), e: 2 + (i % 3 === 0 ? 1 : 0), s: 2 } : undefined, post: i < 7 ? { w: 4, e: 3 + (i % 2), s: 3 + (i % 2) } : undefined, impact: calcImpact(ids) };
    });
    const d = userData();
    if (withMe && d) docs.push({ id: "__me", me: true, displayName: d.displayName, points: d.points, completed: d.completed, team: "", week: d.week.key === wk ? d.week : { key: "", n: 0 }, log: d.log, impact: d.impact });
    return docs.sort((a, b) => b.points - a.points);
  }
  function paintStats() {
    const el = $("#statsBox"); if (!el) return;
    const U = guest ? demoDocs(false) : rankDocs;
    if (!U.length) { el.innerHTML = `<p class="note">${t("loading")}</p>`; return; }
    const tile = (v, k) => `<div class="stat-tile"><b>${v}</b><small>${t(k)}</small></div>`;
    const sum = f => U.reduce((a, u) => a + f(u), 0), avg = (arr, f) => (arr.length ? arr.reduce((a, u) => a + f(u), 0) / arr.length : 0);
    const xp = sum(u => u.points || 0), nM = sum(u => (u.completed || []).length), imp = { ...IMP0 };
    U.forEach(u => { const i = u.impact || calcImpact(u.completed || []); Object.keys(IMP0).forEach(k => { imp[k] += i[k] || 0; }); });
    const returned = U.filter(u => new Set((u.log || []).map(x => x.day)).size >= 2).length;
    const both = U.filter(u => u.pre && u.post), sg = v => (v >= 0 ? "+" : "") + r1(v);
    const rows = ["w", "e", "s"].map(k => `<tr><td>${t("svs_" + k)}</td><td>${r1(avg(both, u => u.pre[k]))}</td><td>${r1(avg(both, u => u.post[k]))}</td><td><b>${sg(avg(both, u => u.post[k] - u.pre[k]))}</b></td></tr>`).join("");
    const cats = Object.keys(CATS).map(c => ({ c, n: sum(u => (u.completed || []).filter(id => { const m = M.find(x => x.id === id); return m && m.cat === c; }).length) }));
    const mx = Math.max(1, ...cats.map(x => x.n)), allTrees = Math.floor(xp / 500), trees = Math.min(40, allTrees);
    el.innerHTML = `${guest ? `<div class="demo-banner">${t("demoBanner")}</div>` : ""}
      <button class="primary-button" data-csv type="button" style="width:100%;margin:0 0 12px">⬇ ${t("csvBtn")}</button>
      <div class="stat-grid">${tile(number(U.length), "statUsers")}${tile(number(nM), "statMissions")}${tile(number(returned), "statReturned")}${tile(r1(nM / U.length), "statAvg")}${tile(number(xp), "statXP")}${tile(number(both.length), "statSurveyN")}</div>
      <h2 class="sub-title">${t("statSurveyT")}</h2>
      ${both.length ? `<table class="res-table"><tr><th>${t("tbl_q")}</th><th>${t("tbl_pre")}</th><th>${t("tbl_post")}</th><th>${t("tbl_diff")}</th></tr>${rows}</table><p class="note">${t("svHint")}</p>` : `<p class="note">${t("noSurveyYet")}</p>`}
      <h2 class="sub-title">${t("catTitle")}</h2><div class="cat-bars">${cats.map(x => `<div class="cat-row"><span>${CATS[x.c]} ${t("cat_" + x.c)}</span><div class="progress-track"><div class="progress-fill" style="width:${Math.round(x.n / mx * 100)}%"></div></div><em>${number(x.n)}</em></div>`).join("")}</div>
      <h2 class="sub-title">${t("impactTitle")} · ${t("statAll")}</h2>${impactHTML(imp)}<p class="note">${t("impactNote")}</p>
      <h2 class="sub-title">${t("forestTitle")}</h2><div class="forest">${"🌳".repeat(trees) || "🌱"}</div><p class="note">${t("forestNote")}</p>
      <h2 class="sub-title">${t("realTitle")}</h2><div class="profile-card"><div class="progress-track"><div class="progress-fill" style="width:${Math.min(100, Math.round(allTrees / REAL.goal * 100))}%"></div></div><p class="note">${number(allTrees)}/${number(REAL.goal)} · ${REAL[language]}</p></div>`;
  }
  function exportCSV() {
    const U = guest ? demoDocs(false) : rankDocs;
    const q = v => { let x = String(v ?? ""); if (/^[=+\-@]/.test(x)) x = "'" + x; return '"' + x.replace(/"/g, '""') + '"'; };
    const head = ["source", "name", "points", "missions", "team", "pre_water", "pre_energy", "pre_waste", "post_water", "post_energy", "post_waste", "change_water", "change_energy", "change_waste"];
    const rows = U.map(u => { const a = u.pre || {}, b = u.post || {}, df = k => (u.pre && u.post ? b[k] - a[k] : "");
      return [guest ? "demo" : "live", u.displayName || u.username || "", u.points || 0, (u.completed || []).length, u.teamName || u.team || "", a.w, a.e, a.s, b.w, b.e, b.s, df("w"), df("e"), df("s")].map(q).join(","); });
    const blob = new Blob(["\ufeff" + [head.join(","), ...rows].join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = (guest ? "demo-" : "") + "greenstep-results.csv"; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000); toast(t("csvSaved"));
  }
  function weekTotal() { const wk = weekKey(); return rankDocs.reduce((a, u) => a + (u.week && u.week.key === wk ? u.week.n : 0), 0); }
  function challengeHTML() {
    const d = userData(), wk = weekKey(), th = weekTheme(), total = weekTotal(), mine = d.week.key === wk ? d.week.n : 0;
    const can = total >= WEEK_GOAL && mine >= WEEK_MIN && d.claimedWeek !== wk;
    return `<div class="profile-card"><p class="eyebrow">${t("weeklyTitle")}</p><h2>${CATS[th]} ${t("weeklyGoal").replace("{c}", t("cat_" + th))}</h2>
      <div class="progress-track"><div class="progress-fill" style="width:${Math.min(100, Math.round(total / WEEK_GOAL * 100))}%"></div></div>
      <p class="note">${number(total)}/${number(WEEK_GOAL)} · ${t("weeklyMine").replace("{n}", number(mine))}</p>
      ${can ? `<button class="primary-button" data-claim type="button">${t("claim")}</button>` : d.claimedWeek === wk ? `<p class="note">✓ ${t("claimed")}</p>` : `<p class="note">${t("weeklyHint")}</p>`}</div>`;
  }
  function claimWeekly() {
    const d = userData(), wk = weekKey(), mine = d.week.key === wk ? d.week.n : 0;
    if (d.claimedWeek === wk || weekTotal() < WEEK_GOAL || mine < WEEK_MIN) return;
    d.seeds += WEEK_BONUS; d.claimedWeek = wk; saveUserData(d); confetti(); beep(); toast("🌰 +" + number(WEEK_BONUS)); paintRanks();
  }
  function renderShop() {
    const d = userData();
    return `<section class="page-panel"><p class="eyebrow">${t("shopDesc")}</p><h1>${t("shopTitle")}</h1>
      <div class="stat-grid" style="grid-template-columns:1fr"><div class="stat-tile"><b>🌰 ${number(d.seeds)}</b><small>${t("seedsLabel")}</small></div></div>
      <div class="mission-list">${ITEMS.map(i => { const own = d.garden.includes(i.id); return `<article class="mission-card ${own ? "done" : ""}">
        <div class="mission-icon">${i.e}</div><div class="mission-info"><h3>${t("it_" + i.id)}</h3></div>
        <div class="mission-action"><span class="xp-pill">🌰 ${number(i.cost)}</span>${own ? `<span class="mission-status">✓ ${t("owned")}</span>` : `<button class="text-button" data-buy="${i.id}" type="button" ${d.seeds < i.cost ? "disabled" : ""}>${t("buy")}</button>`}</div></article>`; }).join("")}</div>
      <button class="text-button" data-go="home" type="button" style="margin-top:14px">${t("backHome")}</button></section>`;
  }
  function buyItem(id) {
    const d = userData(), it = ITEMS.find(x => x.id === id); if (!d || !it || d.garden.includes(id) || d.seeds < it.cost) return;
    d.seeds -= it.cost; d.garden.push(id); saveUserData(d); confetti(); beep(); toast(it.e + " " + t("bought")); renderPage("shop");
  }
  let intSel = [], intFlow = false;
  function interestPicker(flow) {
    const d = userData(); if (!d) return; intSel = [...d.interests]; intFlow = flow;
    openModal(`<h2>${t("intTitle")}</h2><p class="eyebrow" style="text-align:center">${t("intHint")}</p>
      <div class="chips" style="flex-wrap:wrap;justify-content:center">${Object.keys(CATS).map(c => `<button type="button" class="chip ${intSel.includes(c) ? "active" : ""}" data-int="${c}">${CATS[c]} ${t("cat_" + c)}</button>`).join("")}</div>
      <div class="modal-actions"><button class="text-button" data-int-skip type="button">${t("skip")}</button><button class="primary-button" data-int-save type="button">${t("save")}</button></div>`);
  }
  function afterInterests(save) {
    const d = userData(), flow = intFlow; intFlow = false;
    if (save && d) { d.interests = [...intSel]; saveUserData(d); }
    closeModal();
    if (activePage === "home" || activePage === "profile") renderPage(activePage);
    if (flow && d && !d.pre) survey("pre");
  }
  function teamCardHTML(d) {
    if (guest) return `<div class="profile-card"><h2>${t("teamTitle")}</h2><p class="note">${t("guestRank")}</p></div>`;
    if (d.team) return `<div class="profile-card"><h2>${t("teamTitle")}: ${esc(d.teamName || d.team)} ${d.teamOwner ? "👑" : ""}</h2>
      <p class="note">${t("teamInvite")}: <b dir="ltr">${esc(d.team)}</b></p>
      <div class="profile-actions"><button class="text-button" data-team-share type="button">${t("teamShare")}</button><button class="text-button" data-team-leave type="button">${t("teamLeave")}</button></div></div>`;
    return `<div class="profile-card"><h2>${t("teamTitle")}</h2><div class="edit-form">
      <label for="teamNameInput">${t("teamName")}</label><input id="teamNameInput" maxlength="20" />
      <button class="primary-button" data-team-create type="button">${t("teamCreate")}</button>
      <label for="teamCodeInput">${t("teamInvite")}</label><input id="teamCodeInput" maxlength="8" dir="ltr" autocomplete="off" />
      <button class="primary-button" data-team-join type="button">${t("teamJoin")}</button></div></div>`;
  }
  function genCode() { const a = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; return [...crypto.getRandomValues(new Uint8Array(6))].map(x => a[x % a.length]).join(""); }
  async function createTeam() {
    const d = userData(), name = ($("#teamNameInput").value || "").trim();
    if (name.length < 2 || name.length > 20) return toast(t("teamNameShort"));
    for (let i = 0; i < 3; i++) {
      const code = genCode();
      try {
        await setDoc(doc(db, "teams", code), { name, ownerUid: uid, createdAt: new Date().toISOString() });
        d.team = code; d.teamName = name; d.teamOwner = true; saveUserData(d); toast(t("teamCreated")); return renderPage("profile");
      } catch {}
    }
    toast(t("networkError"));
  }
  async function joinTeam() {
    const d = userData(), code = ($("#teamCodeInput").value || "").trim().toUpperCase(); if (!code) return;
    try {
      const snap = await getDoc(doc(db, "teams", code));
      if (!snap.exists()) return toast(t("teamNotFound"));
      d.team = code; d.teamName = snap.data().name; d.teamOwner = false; saveUserData(d); toast(t("teamJoined")); renderPage("profile");
    } catch { toast(t("teamNotFound")); }
  }
  function leaveTeam() { const d = userData(); d.team = ""; d.teamName = ""; d.teamOwner = false; saveUserData(d); toast(t("teamLeft")); renderPage("profile"); }
  async function shareTeam() {
    const d = userData(), text = t("teamInviteText").replace("{n}", d.teamName || d.team).replace("{c}", d.team);
    try { if (navigator.share) { await navigator.share({ text }); return; } await navigator.clipboard.writeText(text); toast(t("teamCopied")); } catch {}
  }
  const gardenSVG = d => gardenHTML(d).match(/<svg[\s\S]*?<\/svg>/)[0].replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ');
  async function buildCard(d) {
    const W = 1080, H = 1350, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    const c = cv.getContext("2d"), fa = language === "fa", li = levelInfo(d.points), font = px => `700 ${px}px Vazirmatn, Inter, "Noto Color Emoji", sans-serif`;
    try { await document.fonts.ready; } catch {}
    c.fillStyle = "#f5f7f4"; c.fillRect(0, 0, W, H); c.fillStyle = "#247a4a"; c.fillRect(0, 0, W, 150);
    c.textAlign = "center"; c.direction = fa ? "rtl" : "ltr";
    c.fillStyle = "#fff"; c.font = font(64); c.fillText("GreenStep 🌿", W / 2, 98);
    const img = new Image();
    await new Promise(r => { img.onload = r; img.onerror = r; img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(gardenSVG(d)); });
    c.drawImage(img, 40, 190, 1000, 700);
    c.fillStyle = "#26352b"; c.font = font(56); c.fillText(d.displayName, W / 2, 985);
    c.fillStyle = "#7b887e"; c.font = font(38); c.fillText(`${t("lvl" + li.lvl)} · ${t("level")} ${number(li.lvl)}`, W / 2, 1045);
    [["⭐", number(d.points) + " XP"], ["🔥", number(streakNow(d)) + " " + t("streakDays")], ["✅", number(d.completed.length) + "/" + number(M.length)]].forEach(([ic, txt], i) => {
      const x = 60 + i * 330; c.fillStyle = "#fff"; c.fillRect(x, 1090, 300, 130); c.fillStyle = "#247a4a"; c.font = font(36); c.fillText(ic + " " + txt, x + 150, 1170);
    });
    c.fillStyle = "#7b887e"; c.font = font(30); c.fillText(location.host + location.pathname, W / 2, 1300);
    return new Promise(r => cv.toBlob(r, "image/png"));
  }
  async function shareCard() {
    const d = userData(); if (!d) return; const blob = await buildCard(d); if (!blob) return;
    const file = new File([blob], "greenstep-garden.png", { type: "image/png" });
    const text = t("shareText").replace("{l}", number(levelInfo(d.points).lvl)).replace("{xp}", number(d.points));
    try { if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text }); return; } } catch { return; }
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "greenstep-garden.png"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); toast(t("shareSaved"));
  }
  const dayXpToday = d => (d.dayXp.day === today() ? d.dayXp.xp : 0);
  async function sha(txt) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(txt)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join(""); }
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

  //پروفایل کاربر
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
          <label>${t("avatarLabel")}</label>
          <div class="avatar-picker">${AVATARS.map(a => `<button type="button" class="avatar-opt ${d.avatar === a ? "active" : ""}" data-avatar="${a}">${a}</button>`).join("")}</div>
          <button class="primary-button" type="submit">${t("save")}</button>
        </form></div>
      ${gamesProgressHTML(d)}
      <h2 class="sub-title">${t("badgesTitle")} (${number(got.length)}/${number(BADGES.length)})</h2>
      <div class="badge-grid">${BADGES.map(b => `<div class="badge ${got.includes(b.id) ? "" : "locked"}"><span>${b.icon}</span>${esc(badgeName(b))}</div>`).join("")}</div>
      <div class="profile-card" style="margin-top:18px"><p>${t("language")}</p>
        <button class="text-button" id="profileLanguageButton" type="button">${t("changeLanguage")}</button>
        <button class="text-button" id="soundBtn" type="button">${t("soundLabel")}: ${soundOn() ? t("on") : t("off")}</button>
        <p style="font-size:11px;color:var(--muted);margin:10px 0 0">✓ ${t("offlineReady")}</p>
        ${installPrompt ? `<button class="primary-button btn-full" id="installButton" type="button">⬇️ ${t("install")}</button>` : ""}</div>
      ${teamCardHTML(d)}
      ${svKind(d) ? `<div class="profile-card"><p>${t("svCard")}</p><button class="primary-button btn-full" type="button" data-survey="${svKind(d)}">📝 ${t("svTake")}</button></div>` : ""}
      <div class="btn-grid">
        <button class="action-button" type="button" data-go="about"><span>ℹ️</span>${t("aboutBtn")}</button>
        <button class="action-button" type="button" data-go="stats"><span>📊</span>${t("statsBtn")}</button>
        <button class="action-button" type="button" data-interests><span>🎯</span>${t("intBtn")}</button>
        <button class="action-button" type="button" data-go="shop"><span>🌰</span>${t("shopTitle")}</button>
      </div>
      <div class="profile-card"><h2>${t("fbTitle")}</h2>
        <div class="avatar-picker">${[1, 2, 3, 4, 5].map(n => `<button type="button" class="chip ${fbRating === n ? "active" : ""}" data-rate="${n}">★ ${number(n)}</button>`).join("")}</div>
        <div class="edit-form"><textarea id="fbText" maxlength="300" rows="3" placeholder="${t("fbPlaceholder")}"></textarea>
        <button class="primary-button" id="fbSend" type="button">${t("fbSend")}</button></div></div>
      <div class="profile-actions"><button class="danger-button" id="logoutButton" type="button">${t("logout")}</button>${guest ? "" : `<button class="danger-button" id="deleteBtn" type="button">${t("deleteAccount")}</button>`}</div></section>`;
  }

  function saveProfile() {
    const d = userData(), name = $("#nameInput").value.trim();
    if (!name) return;
    d.displayName = name;
    const sel = $(".avatar-opt.active"); d.avatar = sel ? sel.dataset.avatar : "";
    saveUserData(d); toast(t("saved")); renderPage("profile");
  }

  // مسیریابی
  function renderPage(page) {
    const main = $("#appMain"), sec = $("#secondaryMain"); if (!main || !userData()) return;
    activePage = page; stopRanks();
    if (window.GreenGames) GreenGames.stop();
    $$(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.page === ({ about: "profile", stats: "profile", shop: "home", play: "home" }[page] || page)));
    applyTranslations();
    if (page === "home") {
      main.classList.remove("hidden"); sec.classList.add("hidden");
      updateStats(); renderGamesHome(); renderDashboard(); renderDashboardMissions(); showTip(false); return;
    }
    main.classList.add("hidden"); sec.classList.remove("hidden");
    sec.innerHTML = { missions: renderMissions, leaderboard: renderLeaderboard, profile: renderProfile, about: renderAbout, stats: renderStats, shop: renderShop, play: renderPlay, city: renderCity }[page]();
    if (page === "play") startGame();
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
    if (!fbReady) return setMessage(t("fbBlocked"));
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
    const u = auth && auth.currentUser, pass = $("#delPass").value, err = $("#delErr"), btn = $("[data-del-confirm]");
    err.textContent = "";
    if (!u) { err.textContent = t("genericError"); return; }
    if (!pass) { err.textContent = t("delNeedPass"); return; }
    btn.disabled = true; err.textContent = t("loading");
    try {
      await reauthenticateWithCredential(u, EmailAuthProvider.credential(u.email, pass));
      const notes = await getDocs(collection(db, "users", u.uid, "notes"));
      await Promise.all(notes.docs.map(x => deleteDoc(x.ref)));
      await deleteDoc(doc(db, "users", u.uid));
      await deleteUser(u); closeModal(); toast(t("deleted"));
    } catch (e) {
      const c = e.code || "";
      console.error("GreenStep delete account failed:", e);
      err.textContent = t(/network/.test(c) ? "networkError" : /invalid-credential|wrong-password|invalid-login/.test(c) ? "wrongCredentials" : "genericError") + (c ? " (" + c + ")" : "");
      btn.disabled = false;
    }
  }
  function logout() {
    if (!confirm(t("confirmLogout"))) return;
    if (guest) { guest = false; localStorage.setItem("greenstep-guest-active", "0"); stopRanks(); cache = null; currentUser = ""; return renderAuth(); }
    signOut(auth);
  }

  document.addEventListener("click", e => {
    const g = s => e.target.closest(s);
    if (g("[data-up-buy]")) return buyUpgrade(g("[data-up-buy]").dataset.upBuy);
    if (g("[data-tip-next]")) return showTip(true);
    if (g("[data-city-buy]")) return buyBuilding(g("[data-city-buy]").dataset.cityBuy);
    if (g("[data-play]")) { playId = g("[data-play]").dataset.play; return renderPage("play"); }
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
    if (g("[data-csv]")) return exportCSV();
    if (g("[data-share]")) return shareCard();
    if (g("[data-team-create]")) return createTeam();
    if (g("[data-team-join]")) return joinTeam();
    if (g("[data-team-leave]")) return leaveTeam();
    if (g("[data-team-share]")) return shareTeam();
    if (g("[data-buy]")) return buyItem(g("[data-buy]").dataset.buy);
    if (g("[data-claim]")) return claimWeekly();
    if (g("[data-interests]")) return interestPicker(false);
    if (g("[data-int]")) { const b = g("[data-int]"), c = b.dataset.int; intSel = intSel.includes(c) ? intSel.filter(x => x !== c) : [...intSel, c]; b.classList.toggle("active", intSel.includes(c)); return; }
    if (g("[data-int-save]")) return afterInterests(true);
    if (g("[data-int-skip]")) return afterInterests(false);
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
    /* نکتهٔ روز ثابت است؛ با دکمهٔ «نکتهٔ دیگر» عوض می‌شود */
  }, { passive: true });

  // PWA
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); installPrompt = e; if (activePage === "profile" && userData()) renderPage("profile"); });
  window.addEventListener("appinstalled", () => { installPrompt = null; toast(t("installed")); });
  if ("serviceWorker" in navigator) {
    let refreshed = false;

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshed) return;

      refreshed = true;
      window.location.reload();
    });

    window.addEventListener("load", async () => {
      try {
        const registration =
          await navigator.serviceWorker.register("./sw.js", {
            scope: "./",
            updateViaCache: "none"
          });

        await registration.update();

      } catch (error) {
        console.error(
          "GreenStep service worker update failed:",
          error
        );
      }
    });
  }

  let authStarted = false;
  function startAuth() {
    if (authStarted || !fbReady) return; authStarted = true;
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
  }
  function startOffline() {
    if (authStarted) return;
    if (localStorage.getItem("greenstep-guest-active") === "1") return enterGuest();
    renderAuth(); setMessage(t("fbBlocked"));
  }
  fbLoad.then(startAuth);
  Promise.race([fbLoad, new Promise(r => setTimeout(r, 8000))]).then(() => { if (!fbReady) startOffline(); });
})();