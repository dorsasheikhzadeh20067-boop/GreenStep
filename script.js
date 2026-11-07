import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, doc, getDoc, setDoc, collection, query, orderBy, limit, onSnapshot } from "./firebase-config.js";
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
    d.createdAt = d.createdAt || new Date().toISOString();
    return d;
  }
  let uid = "", cache = null;
  function userData() { return cache; }
  function saveUserData(d) {
    cache = d;
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
    box.innerHTML = `<div class="section-heading"><h2>${t("progressTitle")}</h2></div>
      <div class="stat-grid">
        <div class="stat-tile"><b>${number(d.completed.length)}/${number(M.length)}</b><small>${t("doneCount")}</small></div>
        <div class="stat-tile"><b>${number(earnedBadges(d).length)}/${number(BADGES.length)}</b><small>${t("badgesCount")}</small></div>
        <div class="stat-tile"><b>${number(levelInfo(d.points).lvl)}/${number(LEVELS.length)}</b><small>${t("levelStat")}</small></div>
      </div><div class="cat-bars">${bars}</div>`;
  }

  const earnedBadges = d => BADGES.filter(b => b.test(d));

  // ---------- missions ----------
  function card(m, d) {
    const done = d.completed.includes(m.id);
    return `<article class="mission-card ${done ? "done" : ""}">
      <div class="mission-icon">${m.icon}</div>
      <div class="mission-info"><h3>${esc(m.title[language])}</h3><p>${esc(m.description[language])}</p>
        <span class="cat-tag">${CATS[m.cat]} ${t("cat_" + m.cat)}</span></div>
      <div class="mission-action"><span class="xp-pill">+${number(m.points)} XP</span>
        ${done ? `<span class="mission-status">✓ ${t("completed")}</span>`
          : `<button class="text-button complete-mission" type="button" data-mission-id="${m.id}">${t("startMission")}</button>`}
      </div></article>`;
  }

  function renderDashboardMissions() {
    const c = $("#dashboardMissions"), d = userData(); if (!c || !d) return;
    // 2 daily picks that rotate by date, skipping completed ones
    const day = Math.floor(Date.now() / 86400000);
    const open = M.filter(m => !d.completed.includes(m.id));
    const picks = open.length ? [0, 1].map(i => open[(day * 2 + i) % open.length]).filter((m, i, a) => a.indexOf(m) === i) : [];
    c.innerHTML = picks.length ? picks.map(m => card(m, d)).join("") : `<p class="empty-note">${t("noMissions")}</p>`;
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

  function completeMission(id) {
    const d = userData(), m = M.find(x => x.id === id);
    if (!d || !m || d.completed.includes(id)) return;
    const before = levelInfo(d.points).lvl;
    d.completed.push(id); d.points += m.points;
    const fresh = BADGES.filter(b => !d.badges.includes(b.id) && b.test(d));
    d.badges.push(...fresh.map(b => b.id));
    saveUserData(d);
    const after = levelInfo(d.points).lvl;
    if (after > before) toast("🎉 " + t("levelUp").replace("{n}", number(after)));
    else if (fresh.length) toast(`${fresh[0].icon} ${t("newBadge")} ${badgeName(fresh[0])}`);
    renderPage(activePage);
  }

  // ---------- leaderboard (real, from Firestore) ----------
  function renderLeaderboard() {
    loadRanks();
    return `<section class="page-panel"><p class="eyebrow">${t("leaderboardDescription")}</p><h1>${t("leaderboardTitle")}</h1>
      <div id="rankList"><p class="empty-note">${t("loading")}</p></div><p class="empty-note">${t("demoNote")}</p></section>`;
  }
  let stopRanksFn = null;
  function stopRanks() { if (stopRanksFn) { stopRanksFn(); stopRanksFn = null; } }
  function loadRanks() {
    stopRanks();
    const q = query(collection(db, "users"), orderBy("points", "desc"), limit(50));
    stopRanksFn = onSnapshot(q, snap => {
      const el = $("#rankList"); if (!el) return;
      const medals = ["🥇", "🥈", "🥉"];
      el.innerHTML = snap.docs.map((x, i) => {
        const u = x.data();
        return `<div class="rank-row ${x.id === uid ? "me" : ""}"><strong>${medals[i] || number(i + 1) + "."} ${esc(u.displayName || u.username)}</strong><span>${number(u.points || 0)} XP</span></div>`;
      }).join("") || `<p class="empty-note">${t("noRanks")}</p>`;
    }, () => { const el = $("#rankList"); if (el) el.innerHTML = `<p class="empty-note">${t("networkError")}</p>`; });
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
          <label>${t("avatarLabel")}</label>
          <div class="avatar-picker">${AVATARS.map(a => `<button type="button" class="avatar-opt ${d.avatar === a ? "active" : ""}" data-avatar="${a}">${a}</button>`).join("")}</div>
          <button class="primary-button" type="submit">${t("save")}</button>
        </form></div>
      <h2 class="sub-title">${t("badgesTitle")} (${number(got.length)}/${number(BADGES.length)})</h2>
      <div class="badge-grid">${BADGES.map(b => `<div class="badge ${got.includes(b.id) ? "" : "locked"}"><span>${b.icon}</span>${esc(badgeName(b))}</div>`).join("")}</div>
      <div class="profile-card" style="margin-top:18px"><p>${t("language")}</p>
        <button class="text-button" id="profileLanguageButton" type="button">${t("changeLanguage")}</button>
        <p style="font-size:11px;color:var(--muted);margin:10px 0 0">✓ ${t("offlineReady")}</p>
        ${installPrompt ? `<button class="text-button" id="installButton" type="button">${t("install")}</button>` : ""}</div>
      <div class="profile-actions"><button class="danger-button" id="logoutButton" type="button">${t("logout")}</button></div></section>`;
  }

  function saveProfile() {
    const d = userData(), name = $("#nameInput").value.trim();
    if (!name) return;
    d.displayName = name;
    const sel = $(".avatar-opt.active"); d.avatar = sel ? sel.dataset.avatar : "";
    saveUserData(d); toast(t("saved")); renderPage("profile");
  }

  // ---------- routing ----------
  function renderPage(page) {
    const main = $("#appMain"), sec = $("#secondaryMain"); if (!main || !userData()) return;
    activePage = page; stopRanks();
    $$(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.page === page));
    applyTranslations();
    if (page === "home") {
      main.classList.remove("hidden"); sec.classList.add("hidden");
      updateStats(); renderDashboard(); renderDashboardMissions(); return;
    }
    main.classList.add("hidden"); sec.classList.remove("hidden");
    sec.innerHTML = { missions: renderMissions, leaderboard: renderLeaderboard, profile: renderProfile }[page]();
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

  function logout() {
    if (!confirm(t("confirmLogout"))) return;
    signOut(auth);
  }

  document.addEventListener("click", e => {
    const g = s => e.target.closest(s);
    if (g("#authLanguageButton") || g("#languageButton") || g("#profileLanguageButton")) return changeLanguage();
    if (g("#authModeButton")) { authMode = authMode === "login" ? "register" : "login"; setMessage(""); return renderAuth(); }
    if (g(".nav-item")) return renderPage(g(".nav-item").dataset.page);
    if (g("[data-go]")) return renderPage(g("[data-go]").dataset.go);
    if (g(".complete-mission")) return completeMission(Number(g(".complete-mission").dataset.missionId));
    if (g("[data-cat]")) { filterCat = g("[data-cat]").dataset.cat; return renderPage("missions"); }
    if (g("[data-status]")) { filterStatus = g("[data-status]").dataset.status; return renderPage("missions"); }
    if (g(".avatar-opt")) { const b = g(".avatar-opt"), was = b.classList.contains("active"); $$(".avatar-opt").forEach(x => x.classList.remove("active")); if (!was) b.classList.add("active"); return; }
    if (g("#installButton") && installPrompt) { installPrompt.prompt(); installPrompt.userChoice.finally(() => { installPrompt = null; renderPage("profile"); }); return; }
    if (g("#logoutButton")) return logout();
  });
  document.addEventListener("submit", e => { if (e.target.id === "profileForm") { e.preventDefault(); saveProfile(); } });
  $("#authForm").addEventListener("submit", submitAuth);

  // ---------- PWA ----------
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); installPrompt = e; if (activePage === "profile" && userData()) renderPage("profile"); });
  window.addEventListener("appinstalled", () => { installPrompt = null; toast(t("installed")); });
  if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));

  onAuthStateChanged(auth, async user => {
    if (!user) { stopRanks(); uid = ""; cache = null; currentUser = ""; $("#passwordInput").value = ""; authMode = "login"; return renderAuth(); }
    uid = user.uid;
    try { await loadProfile(user); } catch { toast(t("networkError")); return signOut(auth); }
    currentUser = cache.username; showApp();
  });
})();