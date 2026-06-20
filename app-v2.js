// ── Constants ──────────────────────────────────────────────────────
const todayKey = new Date().toISOString().slice(0, 10);
const PI_SANDBOX = location.hostname === "localhost" || location.hostname === "127.0.0.1";
const PI_PAYMENTS_ENABLED = true;
const BACKEND_ENDPOINTS = { signin:"/api/signin", approve:"/api/approve", complete:"/api/complete", incomplete:"/api/incomplete", leaderboard:"/api/leaderboard", me:"/api/me", ping:"/api/ping" };

// ── Toast system ───────────────────────────────────────────────────
function showToast(msg, type = "points", duration = 3000) {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

// ── Achievements ───────────────────────────────────────────────────
const ACHIEVEMENTS = [
  { key:"first-answer",  icon:"⚡", name:"First Answer",    desc:"Answer your first daily quest.",           check: s => s.record && Object.values(s.record).some(r => r.completedDays >= 1) },
  { key:"streak-3",      icon:"🔥", name:"3-Day Streak",    desc:"Complete 3 days in a row.",                check: s => s.streak >= 3 },
  { key:"streak-7",      icon:"💫", name:"Week Warrior",    desc:"Complete 7 days in a row.",                check: s => s.streak >= 7 },
  { key:"pts-100",       icon:"🌱", name:"100 Points",      desc:"Earn your first 100 points.",              check: s => s.points >= 100 },
  { key:"pts-500",       icon:"⭐", name:"500 Points",      desc:"Reach 500 points.",                        check: s => s.points >= 500 },
  { key:"pts-1000",      icon:"🌟", name:"1000 Points",     desc:"Reach 1,000 points.",                      check: s => s.points >= 1000 },
  { key:"lessons-5",     icon:"📖", name:"Scholar",         desc:"Complete 5 lessons.",                      check: s => Object.keys(s.answered||{}).filter(k => !k.startsWith("visual::")).length >= 5 },
  { key:"pi-quiz",       icon:"π",  name:"Pi Scholar",      desc:"Answer a Pi knowledge quiz question.",     check: s => Object.keys(s.piQuizAnswers||{}).length >= 1 },
  { key:"utility-done",  icon:"🗺️", name:"Mainnet Ready",   desc:"Complete all 7 Pi utility steps.",         check: s => [0,1,2,3,4,5,6].every(i => s.claimed[`utility-${i}`]) },
  { key:"premium-view",  icon:"💜", name:"Pi Spender",      desc:"Unlock a premium Pi service.",             check: s => Object.keys(s.premiumUnlocks||{}).length >= 1 },
  { key:"visual-done",   icon:"🎨", name:"Visual Learner",  desc:"Complete 3 visual learning tasks.",        check: s => Object.keys(s.answered||{}).filter(k => k.startsWith("visual::")).length >= 3 },
  { key:"pi-pioneer",    icon:"🚀", name:"True Pioneer",    desc:"Reach Pioneer rank (300+ pts).",           check: s => s.points >= 300 },
];

function getUnlockedAchievements(st) {
  return ACHIEVEMENTS.filter(a => a.check(st));
}

function checkAndCelebrateAchievements(st, prevUnlocked) {
  const now = getUnlockedAchievements(st).map(a => a.key);
  const prev = prevUnlocked || [];
  const newOnes = now.filter(k => !prev.includes(k));
  newOnes.forEach(key => {
    const badge = ACHIEVEMENTS.find(a => a.key === key);
    if (badge) showToast(`${badge.icon} Achievement unlocked: ${badge.name}!`, "success", 4000);
  });
  return now;
}

// ── Rank-up detection ──────────────────────────────────────────────
let _lastRankKey = null;
function checkRankUp(pts) {
  const rank = currentRank(pts);
  if (_lastRankKey && _lastRankKey !== rank.key) {
    const overlay   = document.getElementById("rankUpOverlay");
    const iconEl    = document.getElementById("rankUpIcon");
    const msgEl     = document.getElementById("rankUpMsg");
    if (overlay && iconEl && msgEl) {
      iconEl.textContent = rank.icon;
      msgEl.textContent  = `You are now a ${rank.label}`;
      overlay.hidden     = false;
    }
  }
  _lastRankKey = rank.key;
}

// ── PWA / service worker ───────────────────────────────────────────
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

// ── Pi Browser detection ───────────────────────────────────────────
function detectPiBrowser() {
  const isPiBrowser = /Pi Browser/i.test(navigator.userAgent) || typeof window.Pi !== "undefined";
  const banner      = document.getElementById("piBrowserBanner");
  const dismissed   = localStorage.getItem("questora-banner-dismissed");
  if (!isPiBrowser && !dismissed && banner) {
    banner.hidden = false;
  }
  return isPiBrowser;
}

// ── Backend ping ───────────────────────────────────────────────────
async function pingBackend() {
  const card = document.getElementById("backendStatusCard");
  if (!card) return;
  try {
    const res  = await fetch("/api/ping");
    const data = await res.json();
    if (data.piReady) {
      card.className = "backend-status-card ok";
      card.innerHTML = `<span class="bs-icon">✅</span><div><strong>Backend ready</strong><p>Pi API key is configured. Payments and user verification are active.</p></div>`;
    } else {
      card.className = "backend-status-card warn";
      card.innerHTML = `<span class="bs-icon">⚠️</span><div><strong>PI_API_KEY missing</strong><p>Add PI_API_KEY in Vercel Dashboard → questora → Settings → Environment Variables, then redeploy.</p></div>`;
    }
  } catch (_) {
    card.className = "backend-status-card";
    card.innerHTML = `<span class="bs-icon">⚪</span><div><strong>Backend checking…</strong><p>Connecting to Questora backend.</p></div>`;
  }
}

// ── Leaderboard fetch ──────────────────────────────────────────────
async function fetchAndRenderLeaderboard() {
  const grid   = document.getElementById("leaderboardGrid");
  const pill   = document.getElementById("leaderPill");
  if (!grid) return;
  grid.innerHTML = `<div style="padding:14px;text-align:center;color:var(--muted);font-size:.88rem">Loading leaderboard…</div>`;
  try {
    const res  = await fetch("/api/leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: state.userName, points: state.points }),
    });
    const data = await res.json();
    if (data.ok && data.leaderboard) {
      const icons = ["🥇","🥈","🥉"];
      const rankCls = ["first","second","third"];
      grid.innerHTML = data.leaderboard.map((p, i) =>
        `<div class="leaderboard-row${p.isYou ? " you" : ""}">
          <span class="leaderboard-rank ${rankCls[i]||""}">${icons[i]||i+1}</span>
          <span class="leaderboard-name">${p.username}${p.isYou ? " (you)" : ""}</span>
          <span class="leaderboard-pts">${p.points} pts</span>
        </div>`
      ).join("");
      if (pill) pill.textContent = `${data.leaderboard.length} Pioneers`;
    }
  } catch (_) {
    grid.innerHTML = `<div style="padding:14px;text-align:center;color:var(--muted);font-size:.88rem">Leaderboard unavailable offline.</div>`;
  }
}

// ── Pioneer ranks ──────────────────────────────────────────────────
const pioneerRanks = [
  { key:"explorer",    label:"Explorer",    icon:"🥉", min:0,    max:299,      desc:"Starting your Pioneer journey." },
  { key:"pioneer",     label:"Pioneer",     icon:"🥈", min:300,  max:799,      desc:"Building daily habits and streaks." },
  { key:"miner",       label:"Miner",       icon:"🥇", min:800,  max:1799,     desc:"Consistent learner with Pi knowledge." },
  { key:"contributor", label:"Contributor", icon:"💎", min:1800, max:3499,     desc:"Deep knowledge across all categories." },
  { key:"ambassador",  label:"Ambassador",  icon:"🌟", min:3500, max:Infinity, desc:"Elite Pioneer leader in the community." },
];

function currentRank(pts) {
  return pioneerRanks.find(r => pts <= r.max) || pioneerRanks[pioneerRanks.length - 1];
}

// ── Daily Pi facts ─────────────────────────────────────────────────
const piFacts = [
  "Pi Network was founded on Pi Day — March 14, 2019 — by Stanford graduates Dr. Nicolas Kokkalis and Dr. Chengdiao Fan.",
  "Pi uses the Stellar Consensus Protocol (SCP), which mines through human trust rather than energy-intensive computation.",
  "Tapping the Pi mining button every 24 hours does not drain your battery — it logs your active participation.",
  "Your Security Circle of 3 to 5 trusted people helps strengthen the Pi network trust graph and boosts your mining rate.",
  "Pi KYC verification ensures that real humans are the only ones earning Pi on the network.",
  "Pi Mainnet launched in 2022, allowing verified Pioneers to migrate and transact with real Pi.",
  "The Pi Browser is the gateway to a growing ecosystem of Pi-powered mini apps and services.",
  "You can boost your mining rate by inviting friends who become active Pioneers on your team.",
  "Over 60 million Pioneers have joined Pi Network, making it one of the largest crypto communities by user count.",
  "Pi apps use Pi SDK so that Pioneer authentication and payments work natively inside Pi Browser.",
  "Your Pi wallet passphrase is the only key to your funds — Pi support will never ask for it.",
  "Pi Mainnet uses a permission model where users must pass KYC before migrating their mined balance.",
  "Pi Network aims to build a utility-driven economy where Pi is used for real goods, services, and apps.",
  "The Pi Developer Platform lets anyone build and launch a mini app accessible to all Pioneers worldwide.",
  "Pi supply is not fixed — the global mining rate halves with each wave of new Pioneers joining the network.",
];

function todayPiFact() {
  const day = Math.floor(new Date(todayKey).getTime() / 86400000);
  return piFacts[day % piFacts.length];
}

// ── Pi phases ──────────────────────────────────────────────────────
const piPhases = [
  { num:"01", label:"Mining App",  tag:"Completed", active:false, desc:"Global launch of the Pi app. Pioneers mined Pi on mobile by tapping daily and building Security Circles." },
  { num:"02", label:"Testnet",     tag:"Completed", active:false, desc:"Pi blockchain tested with real nodes, developer tools released, and Pi Browser launched to the community." },
  { num:"03", label:"Mainnet",     tag:"Live now",  active:true,  desc:"Verified Pioneers migrate Pi to the open Mainnet. Real transactions, Pi apps, and utility services are live." },
];

// ── Pi ecosystem apps ──────────────────────────────────────────────
const piApps = [
  { icon:"💜", name:"Pi Network",     desc:"Core mining and wallet app." },
  { icon:"🌐", name:"Pi Browser",     desc:"Gateway to all Pi mini apps." },
  { icon:"🔑", name:"Pi Wallet",      desc:"Store and send Pi securely." },
  { icon:"🪪", name:"Pi KYC",         desc:"Verify your human identity." },
  { icon:"🛒", name:"Pi Marketplace", desc:"Trade goods for Pi." },
  { icon:"📱", name:"Pi Chat",        desc:"Encrypted Pioneer messaging." },
  { icon:"🎯", name:"Pi Apps",        desc:"Discover community-built apps." },
  { icon:"🔐", name:"Pi Auth",        desc:"Login to apps with your Pi ID." },
  { icon:"⛏️", name:"Pi Mining",      desc:"Tap daily to stay active." },
];

// ── Pi utility guide ───────────────────────────────────────────────
const piUtilitySteps = [
  { title:"Download Pi Network app",          desc:"Get the official Pi app from the App Store or Google Play." },
  { title:"Tap mining daily",                 desc:"Open the app every 24 hours and tap the lightning bolt to stay active." },
  { title:"Build your Security Circle",       desc:"Add 3 to 5 people you trust to boost your mining rate." },
  { title:"Complete KYC verification",        desc:"Verify your identity in the app to qualify for Mainnet migration." },
  { title:"Migrate to Mainnet",               desc:"After KYC, follow in-app steps to move your Pi to open Mainnet." },
  { title:"Set up Pi Wallet",                 desc:"Store your 24-word passphrase safely offline. Never share it." },
  { title:"Explore Pi Browser apps",          desc:"Open Pi Browser and discover apps where you can use real Pi." },
];

// ── Pi safety rules ────────────────────────────────────────────────
const piSafetyRules = [
  { icon:"🔒", title:"Never share your passphrase",      desc:"Your wallet passphrase is the only key to your Pi. No support team or app should ever ask for it." },
  { icon:"🚫", title:"Ignore fake airdrop promises",     desc:"Legitimate Pi rewards have clear rules. Any offer promising free Pi without conditions is a scam." },
  { icon:"🔍", title:"Verify app sources",               desc:"Only use Pi apps found inside the official Pi Browser. Unofficial links can steal your credentials." },
  { icon:"📵", title:"Reject passphrase requests",       desc:"If any chat, email, or form asks for your 24-word passphrase — stop immediately and report it." },
  { icon:"🛡️", title:"Choose Security Circle wisely",   desc:"Only add people you genuinely trust. A weak circle reduces network integrity and your mining rate." },
];

// ── Mining FAQ ─────────────────────────────────────────────────────
const miningFaq = [
  { q:"Does Pi mining drain my battery?",          a:"No. Pi mining logs a brief daily event rather than running continuous computation on your device." },
  { q:"What happens if I miss a day?",             a:"Your mining session pauses. Tap the button when you return — no Pi is lost from previous sessions." },
  { q:"How does Pi prevent fake accounts?",        a:"The Security Circle creates a human trust web. KYC adds a second layer of real-person confirmation." },
  { q:"When can I spend my Pi?",                   a:"After KYC and Mainnet migration, your Pi is real and usable in Pi Browser apps and the Pi Marketplace." },
  { q:"Is Pi available on crypto exchanges?",      a:"Pi has listed on some exchanges after Mainnet. Always verify exchange legitimacy before trading." },
];

// ── Pi knowledge quiz ──────────────────────────────────────────────
const piKnowledgeQuiz = [
  { q:"What protocol does Pi Network use?",              answers:["Proof of Work","Stellar Consensus Protocol","Proof of Stake","Delegated BFT"],              correct:1, explain:"Pi uses SCP — it relies on a trust graph, not energy-intensive mining.", pts:40 },
  { q:"What is your Security Circle used for?",          answers:["Sending Pi payments","Boosting mining and trust","Unlocking Pi Browser","Recovering passphrase"], correct:1, explain:"3 to 5 trusted Pioneers boosts your mining rate and strengthens the trust graph.", pts:40 },
  { q:"What must you do before migrating to Mainnet?",   answers:["Buy Pi on exchange","Complete KYC verification","Invite 10 friends","Join mining pool"],        correct:1, explain:"KYC confirms you are a real human before you can migrate to open Mainnet.", pts:45 },
  { q:"Who founded Pi Network?",                         answers:["Vitalik Buterin","Kokkalis and Fan","Satoshi Nakamoto","Justin Sun"],                          correct:1, explain:"Pi was founded in 2019 by Stanford graduates Dr. Nicolas Kokkalis and Dr. Chengdiao Fan.", pts:35 },
  { q:"What should you NEVER share with anyone?",        answers:["Your Pi username","Your passphrase","Your mining rate","Your referral code"],                  correct:1, explain:"Your wallet passphrase is the only key to your Pi. Sharing it means losing your funds.", pts:50 },
  { q:"What is the Pi Browser used for?",                answers:["Sending emails","Accessing Pi mini apps","Trading Pi on exchanges","Social media"],            correct:1, explain:"Pi Browser is the gateway to the Pi ecosystem — apps and services built on the Pi Platform.", pts:40 },
  { q:"How often must you tap the Pi mining button?",    answers:["Every hour","Every 12 hours","Every 24 hours","Once a week"],                                  correct:2, explain:"You tap every 24 hours to keep mining active. Missing a day simply pauses mining.", pts:35 },
  { q:"In which year did Pi Network launch?",            answers:["2017","2018","2019","2021"],                                                                   correct:2, explain:"Pi Network launched on Pi Day — March 14, 2019.", pts:30 },
];

function todayPiQuiz() {
  const day = Math.floor(new Date(todayKey).getTime() / 86400000);
  return piKnowledgeQuiz[day % piKnowledgeQuiz.length];
}

// ── Categories ─────────────────────────────────────────────────────
const categories = [
  {
    key:"safety", title:"Pi Safety", style:"gold",
    summary:"Protect accounts, spot scams, and use Pi apps with confidence.",
    daily:{ title:"Spot the fake reward promise", body:"Safe apps explain real utility. They do not promise free Pi for every tap.", points:50, question:"Which promise is unsafe?", answers:["A clear quiz reward in app points","Free Pi for everyone without rules","A lesson badge after learning"], correct:1 },
    lessons:[
      { key:"passphrase", title:"Passphrase protection", body:"Your wallet passphrase is private. Real support teams should never ask for it.", reward:"Shield Badge", points:35, question:"Who should know your wallet passphrase?", answers:["Only you","Any helper","A public group"], correct:0 },
      { key:"fake-airdrop", title:"Fake airdrop signs", body:"Pressure, secret links, and guaranteed rewards are common warning signs.", reward:"Scam Spotter", points:40, question:"What is a warning sign?", answers:["Clear terms","Forced urgency","Privacy policy"], correct:1 },
      { key:"safe-browser", title:"Safe Pi Browser use", body:"Use official flows, check app names, and avoid unknown links.", reward:"Browser Pro", points:30, question:"What should you avoid?", answers:["Unknown links","Reading rules","Checking app details"], correct:0 },
    ],
  },
  {
    key:"money", title:"Money Basics", style:"green",
    summary:"Practice saving, spending choices, and simple planning.",
    daily:{ title:"Build a tiny saving habit", body:"Choose one small thing to save or track today before spending.", points:45, question:"What comes first in a simple budget?", answers:["Track needs","Buy randomly","Ignore prices"], correct:0 },
    lessons:[
      { key:"needs-wants", title:"Needs vs wants", body:"Needs support daily life. Wants are nice, but should wait when money is tight.", reward:"Smart Saver", points:35, question:"Which is usually a need?", answers:["Food","Luxury skin","Random upgrade"], correct:0 },
      { key:"goal-saving", title:"Goal saving", body:"A clear goal makes saving feel like progress, not punishment.", reward:"Goal Coin", points:30, question:"What makes saving easier?", answers:["No plan","A clear goal","Daily guessing"], correct:1 },
      { key:"value-check", title:"Value check", body:"Before spending, ask if the item helps your goal or only gives a short feeling.", reward:"Value Lens", points:30, question:"A value check asks about...", answers:["Long-term use","Peer pressure","Fastest click"], correct:0 },
    ],
  },
  {
    key:"health", title:"Healthy Habits", style:"blue",
    summary:"Small daily actions for energy, focus, and family wellbeing.",
    daily:{ title:"Move for five minutes", body:"A short walk, stretch, or tidy-up can reset focus and mood.", points:40, question:"What is a good daily health step?", answers:["Tiny repeatable action","One huge push only","Skip sleep"], correct:0 },
    lessons:[
      { key:"sleep", title:"Sleep rhythm", body:"Good sleep supports learning, patience, and decision making.", reward:"Focus Star", points:30, question:"Sleep helps with...", answers:["Focus","Scams","Forgetting everything"], correct:0 },
      { key:"water", title:"Water reminder", body:"A simple water habit can improve energy without cost.", reward:"Energy Drop", points:25, question:"A low-cost energy habit is...", answers:["Drink water","Ignore thirst","Stay still all day"], correct:0 },
      { key:"kindness", title:"Kindness challenge", body:"A helpful message, chore, or thank-you can improve a home or group.", reward:"Kindness Badge", points:35, question:"A kindness quest should be...", answers:["Safe and helpful","Embarrassing","Risky"], correct:0 },
    ],
  },
  {
    key:"growth", title:"Skills & Growth", style:"purple",
    summary:"Learn digital skills, confidence, and useful daily productivity.",
    daily:{ title:"Learn one useful idea", body:"Pick one concept, explain it simply, and turn it into action.", points:50, question:"What proves learning happened?", answers:["A small action","Only scrolling","Copying blindly"], correct:0 },
    lessons:[
      { key:"digital-skill", title:"Digital skill stack", body:"Typing, searching, safety, and communication are global skills.", reward:"Skill Spark", points:40, question:"Which is a digital skill?", answers:["Safe searching","Sharing secrets","Clicking unknown links"], correct:0 },
      { key:"confidence", title:"Confidence builder", body:"Confidence grows by finishing small tasks and seeing proof.", reward:"Courage Badge", points:35, question:"Confidence grows through...", answers:["Small completed tasks","Never trying","Only watching"], correct:0 },
      { key:"focus", title:"Focus sprint", body:"A ten-minute focus block can beat waiting for perfect motivation.", reward:"Focus Flame", points:30, question:"A focus sprint is...", answers:["Short focused work","Endless distraction","No goal"], correct:0 },
    ],
  },
  {
    key:"stem", title:"STEM Lab", style:"blue",
    summary:"Science, technology, engineering, and math for curious learners.",
    daily:{ title:"Think like a scientist", body:"Observe one thing, ask why it happens, and choose a simple test.", points:55, question:"What comes first in a STEM investigation?", answers:["Observation","Guessing forever","Ignoring evidence"], correct:0 },
    lessons:[
      { key:"science-method", title:"Scientific method", body:"Observe, ask, predict, test, and learn from the result.", reward:"Lab Badge", points:45, question:"A fair test changes...", answers:["One thing at a time","Everything at once","Nothing ever"], correct:0 },
      { key:"coding-logic", title:"Coding logic", body:"Code is a set of clear steps. Good steps are small and testable.", reward:"Code Spark", points:45, question:"A program is built from...", answers:["Clear steps","Random taps","Secret passwords"], correct:0 },
      { key:"math-patterns", title:"Math patterns", body:"Patterns help us predict, compare, count, and solve problems.", reward:"Pattern Star", points:40, question:"A pattern helps you...", answers:["Predict what comes next","Forget the rule","Hide the answer"], correct:0 },
      { key:"engineering-design", title:"Engineering design", body:"Engineers define a problem, build a solution, test it, and improve it.", reward:"Builder Badge", points:45, question:"After testing a design, you should...", answers:["Improve it","Never change it","Throw away learning"], correct:0 },
      { key:"electrical-engineering", title:"Electrical engineering basics", body:"Electrical engineering studies circuits, power, signals, sensors, motors, and safe energy systems.", reward:"Circuit Badge", points:50, question:"What does electrical engineering often work with?", answers:["Circuits and power","Unsafe wiring","Guessing current"], correct:0 },
    ],
  },
  {
    key:"pet", title:"Pet Care", style:"green",
    summary:"House pet ownership, daily care, kindness, hygiene, and safety.",
    daily:{ title:"Check a pet's basic needs", body:"A pet needs clean water, safe food, a clean space, movement, and gentle attention.", points:50, question:"What is part of responsible pet care?", answers:["Clean water daily","Ignoring behavior changes","Unsafe punishment"], correct:0 },
    lessons:[
      { key:"daily-feeding", title:"Daily feeding guide", body:"Use pet-safe food, regular times, clean bowls, and portions that match age and size.", reward:"Feeding Badge", points:40, question:"A healthy feeding habit is...", answers:["Clean bowl and safe food","Any human snack","No water check"], correct:0 },
      { key:"pet-health", title:"Health watch", body:"Notice appetite, energy, breathing, coat, bathroom habits, and unusual behavior.", reward:"Care Watch", points:45, question:"A sudden behavior change means...", answers:["Pay attention","Always ignore it","Punish first"], correct:0 },
      { key:"safe-petting", title:"Safe petting", body:"Approach calmly, avoid hurting ears or tails, and stop when the pet wants space.", reward:"Gentle Hands", points:35, question:"Safe petting means...", answers:["Respect signals","Force attention","Pull tails"], correct:0 },
      { key:"clean-home", title:"Clean home routine", body:"Clean sleeping areas, litter spaces, cages, and feeding spots to protect the whole family.", reward:"Clean Habitat", points:40, question:"A clean pet area helps...", answers:["Pet and family health","Spread germs","Hide problems"], correct:0 },
    ],
  },
  {
    key:"pieco", title:"Pi Ecosystem", style:"pi",
    summary:"Understand Pi Network, mining, wallets, and the global Pioneer community.",
    daily:{ title:"Know your network", body:"Pi is built on the Stellar Consensus Protocol — trust, not computation, powers the network.", points:55, question:"What powers Pi Network consensus?", answers:["Energy-intensive mining","Human trust and SCP","Proof of Stake pools","Centralised servers"], correct:1 },
    lessons:[
      { key:"pi-mission", title:"Pi Network mission", body:"Pi Network aims to build a utility-driven digital currency that everyday people can mine and use.", reward:"Mission Badge", points:40, question:"Pi Network aims to build...", answers:["A utility-driven currency","An energy-heavy blockchain","A closed financial club","A social media platform"], correct:0 },
      { key:"pi-mining-how", title:"How Pi mining works", body:"You tap daily to log an active mining session. Your Security Circle boosts your rate. No battery drain.", reward:"Mining Pro", points:45, question:"What boosts your Pi mining rate?", answers:["A strong Security Circle","Leaving the app open","Sharing your passphrase","Paying a fee"], correct:0 },
      { key:"pi-security-circle", title:"Security Circle", body:"Adding 3 to 5 trusted Pioneers to your circle strengthens the network trust graph and increases your mining rate.", reward:"Trust Builder", points:40, question:"How many people can be in a Security Circle?", answers:["1 to 2","3 to 5","10 to 20","Unlimited"], correct:1 },
      { key:"pi-kyc", title:"KYC verification", body:"KYC confirms you are a real human. It is required before migrating your Pi balance to the open Mainnet.", reward:"Verified Pioneer", points:50, question:"Why is KYC required?", answers:["To confirm real humans","To buy more Pi","To join a mining pool","To access the app store"], correct:0 },
      { key:"pi-wallet", title:"Pi Wallet and passphrase", body:"Your 24-word passphrase is the master key to your Pi Wallet. Store it offline. Never share it.", reward:"Wallet Guardian", points:55, question:"Where should your passphrase be stored?", answers:["Safely offline","In a chat message","On a shared document","In an email draft"], correct:0 },
      { key:"pi-browser-apps", title:"Pi Browser and apps", body:"Pi Browser is the gateway to mini apps built on the Pi Platform where Pioneers can earn and spend Pi.", reward:"App Explorer", points:45, question:"What is Pi Browser used for?", answers:["Accessing Pi mini apps","Sending regular emails","Mining Pi faster","Trading on exchanges"], correct:0 },
    ],
  },
];

// ── Tools ──────────────────────────────────────────────────────────
const tools = [
  { key:"scam-checker", title:"Scam checker",         body:"Judge a claim as safe, risky, or fake before trusting it.",                     points:30 },
  { key:"goal-planner", title:"Goal planner",          body:"Turn a weekly goal into small daily steps.",                                    points:25 },
  { key:"reward-map",   title:"Reward map",            body:"See what points can unlock now and what premium could unlock later.",            points:20 },
  { key:"family-code",  title:"Family safety code",    body:"Create one family rule for devices, wallets, or links.",                        points:25 },
  { key:"stem-solver",  title:"STEM solver",           body:"Turn a problem into observe, test, measure, and improve.",                      points:30 },
  { key:"pet-care-check",title:"Pet care checklist",   body:"Review water, food, cleanliness, movement, and mood for a house pet.",          points:30 },
  { key:"pi-trust-check",title:"Pi trust checker",     body:"Evaluate whether a Pi app or offer shows signs of a trustworthy service.",      points:35 },
  { key:"pi-habit",     title:"Pi habit tracker",      body:"Build your daily Pi tapping habit and Security Circle to grow your mining rate.",points:30 },
];

// ── Rewards ────────────────────────────────────────────────────────
const rewards = [
  { key:"starter",  title:"Starter Chest",        need:100,  value:"Unlocks beginner tips" },
  { key:"safety",   title:"Safety Shield",         need:250,  value:"Unlocks safety checklist" },
  { key:"family",   title:"Family Pack",           need:400,  value:"Unlocks family quest ideas" },
  { key:"stem",     title:"STEM Kit",              need:550,  value:"Unlocks science and builder challenges" },
  { key:"pet",      title:"Pet Care Kit",          need:650,  value:"Unlocks daily care guide ideas" },
  { key:"pioneer",  title:"Pioneer Badge",         need:800,  value:"Unlocks Miner rank and Pi ecosystem deep content" },
  { key:"premium",  title:"Future Premium",        need:900,  value:"Preview for optional Pi utility packs" },
];

// ── Premium packs ──────────────────────────────────────────────────
const premiumPacks = [
  {
    key:"pi-market-scanner", title:"Pi Market Scanner", amount:0.30, price:"0.30 Pi",
    category:"pi", tag:"Pi Tools",
    audience:"For Pioneers who want to spot fair deals, compare marketplace offers, and avoid red flags.",
    body:"A premium Pi Marketplace intelligence pack — price comparison frameworks, red-flag checklists, and a step-by-step offer evaluation guide.",
    includes:["12 premium pages on Pi Marketplace offer analysis, price signals, and seller trust indicators.","Red-flag pattern list for fake scarcity, pressure tactics, and unfair exchange rates.","Offer comparison worksheet you can apply before any Pi transaction."],
    outcomes:["Evaluate Pi Marketplace listings with confidence.","Spot overpriced or suspicious offers faster.","Make better Pi spending decisions."],
    lessons:[
      { title:"Did you know most marketplace mistakes happen in the first 10 seconds?", hint:"Impulse decisions skip the checks that protect you.", action:"Always read the full listing, check seller history, compare prices, and verify the payment route before committing." },
      { title:"This is how to compare Pi offers fairly", hint:"Price is only one variable — value, trust, and terms matter equally.", action:"Score offers on price fairness, seller signals, clear terms, and safe payment flow before deciding." },
    ],
  },
  {
    key:"quiz-pro", title:"Daily Quiz Pro", amount:0.15, price:"0.15 Pi",
    category:"learning", tag:"Learning",
    audience:"For learners who want harder daily challenges, a point multiplier, and bonus quiz streaks.",
    body:"Upgrade your daily question experience — harder questions, a 1.5× point multiplier for correct answers, and an exclusive streak bonus track.",
    includes:["10 premium quiz pages with advanced Pi, money, STEM, and safety questions.","1.5× point multiplier applied automatically to daily answers while unlocked.","Streak bonus calendar that adds extra pts on days 3, 7, and 14 of a continuous streak."],
    outcomes:["Earn more points per daily answer.","Challenge yourself beyond the standard question set.","Build a faster path to higher Pioneer ranks."],
    lessons:[
      { title:"Did you know harder questions improve retention faster?", hint:"Difficulty creates memorable learning moments.", action:"After each advanced question, note one key insight and try to explain it in a single sentence." },
      { title:"This is how the multiplier works", hint:"A 1.5× multiplier on 50 pts earns 75 pts for the same effort.", action:"Answer correctly and consistently — the multiplier compounds fastest when your streak is active." },
    ],
  },
  {
    key:"pioneer-coaching", title:"Pioneer Coaching", amount:0.50, price:"0.50 Pi",
    category:"pi", tag:"Coaching",
    audience:"For Pioneers ready to build a clear, personalised 7-day learning roadmap.",
    body:"A premium structured coaching pack with a 7-day personalised learning plan, daily accountability prompts, and a rank progression strategy guide.",
    includes:["20 premium coaching pages covering goal setting, rank ladders, daily habits, and weekly review templates.","A 7-day step-by-step learning plan personalised to your current rank and points.","Accountability prompts that appear each day to keep the plan on track."],
    outcomes:["Turn scattered daily taps into a focused learning strategy.","Build a clear path from Explorer toward Ambassador rank.","Understand exactly which actions give the most points per day."],
    lessons:[
      { title:"Did you know most Pioneers plateau without a plan?", hint:"Random learning gives random results — a structure gives compound progress.", action:"Write down your current rank, your target rank, and exactly one daily action that advances it." },
      { title:"This is how a 7-day plan prevents burnout", hint:"Short sprints with clear targets are easier to keep than open-ended goals.", action:"Break your weekly Pi learning goal into one focused task per day, then review progress every Sunday." },
    ],
  },
  {
    key:"pi-business", title:"Pi Business Blueprint", amount:0.45, price:"0.45 Pi",
    category:"money", tag:"Business",
    audience:"For Pioneers who want to accept Pi payments, start a Pi-powered service, or build a merchant presence.",
    body:"A premium business pack with a Pi merchant setup guide, payment flow explainer, product pricing templates, and customer trust playbook.",
    includes:["18 premium pages on setting up Pi payment acceptance, pricing in Pi, and merchant credibility.","Step-by-step merchant onboarding checklist covering Pi Browser integration, product listing, and pricing strategy.","Customer trust playbook with payment transparency templates and dispute-avoidance practices."],
    outcomes:["Understand how to accept Pi for goods or services.","Build a simple, clear Pi-powered product or service offer.","Set fair Pi prices and communicate value clearly to buyers."],
    lessons:[
      { title:"Did you know Pi merchants often undercharge in early transactions?", hint:"Without a pricing anchor, sellers default to the lowest number out of uncertainty.", action:"Research 3 comparable offerings, set a value-based Pi price, and write a one-line justification for the amount." },
      { title:"This is how to build trust as a new Pi merchant", hint:"Trust is built through transparency — clear terms, honest descriptions, and a safe payment path.", action:"Write your refund stance, describe your product accurately, and route payments through the official Pi payment flow." },
    ],
  },
  {
    key:"advanced-mining", title:"Advanced Mining Guide", amount:0.25, price:"0.25 Pi",
    category:"pi", tag:"Mining",
    audience:"For Pioneers who want to optimise their Security Circle, understand mining rate factors, and maximise their Pi balance growth.",
    body:"A premium mining intelligence pack — Security Circle audit tools, mining rate analytics explainer, and a referral strategy guide.",
    includes:["14 premium pages on mining rate variables, Security Circle health scoring, and referral quality factors.","Security Circle audit checklist to identify inactive members and suggest trusted replacements.","Mining rate optimisation guide covering team activity, KYC status, and app-level boosts."],
    outcomes:["Understand exactly what affects your daily Pi mining rate.","Audit and strengthen your Security Circle.","Grow your Pi balance faster through informed habit changes."],
    lessons:[
      { title:"Did you know an inactive Security Circle member lowers your mining rate?", hint:"Pi rewards active human trust — inactive members reduce the trust signal.", action:"Review your circle this week. Remove anyone who has stopped tapping and replace them with an active Pioneer." },
      { title:"This is how to compound your mining rate over time", hint:"Mining rate is a function of team activity, referral depth, and consistent daily engagement.", action:"Tap daily, complete KYC, keep your circle active, and log your rate each week to spot improvements." },
    ],
  },
  {
    key:"trust-review", title:"Pioneer Trust Review", amount:0.2, price:"0.20 Pi",
    category:"safety", tag:"Safety",
    audience:"Best for users who want safer Pi decisions before spending time or Pi.",
    body:"A premium safety service with deeper scam spotting, marketplace trust checks, and a step-by-step account protection playbook.",
    includes:["12 short premium safety pages with clear examples and safer next actions.","Red-flag review for links, promises, app wording, and privacy terms.","A repeatable trust checklist the user can use before future Pi actions."],
    outcomes:["Spot hype and fake reward language faster.","Know which app details to check before using a service.","Use Pi Browser more confidently with less guesswork."],
    lessons:[
      { title:"Did you know trust grows when rules are visible?", hint:"Apps that hide terms, pressure quick action, or blur fees are harder to trust.", action:"Check source, terms, payment reason, support path, and privacy signals before you continue." },
      { title:"This is how to compare a risky offer", hint:"Fast reward language often tries to outrun careful thinking.", action:"Pause, compare the promise with the app purpose, and reject anything that asks for secrets or blind trust." },
    ],
  },
  {
    key:"money-blueprint", title:"Money Blueprint Pro", amount:0.25, price:"0.25 Pi",
    category:"money", tag:"Money",
    audience:"Best for learners who want stronger saving, planning, and value decisions.",
    body:"A premium money service with guided weekly planning, spending filters, and practical decision tools.",
    includes:["15 premium pages on saving, value checks, goal planning, and spending pressure.","Small-budget decision templates for students, workers, and families.","Simple weekly review prompts that keep the user returning with purpose."],
    outcomes:["Turn money goals into repeatable daily behavior.","Spend with more clarity and less impulse.","Build a stronger record before using Pi on optional services."],
    lessons:[
      { title:"Did you know a budget works better when it is tiny?", hint:"Most people keep a small plan longer than a perfect plan.", action:"Track one need, one want, and one savings move each day before spending." },
      { title:"This is how to test value before paying", hint:"A good offer should still make sense one week later.", action:"Ask what problem it solves, how often it helps, and what cheaper option already exists." },
    ],
  },
  {
    key:"stem-builder", title:"STEM Builder Vault", amount:0.3, price:"0.30 Pi",
    category:"stem", tag:"STEM",
    audience:"Best for curious learners who want premium STEM tasks and electrical engineering content.",
    body:"A premium STEM service with deeper science labs, electrical engineering explainers, builder logic, and structured observation tasks.",
    includes:["18 premium STEM pages spanning circuits, signals, safe testing, energy flow, and design loops.","Electrical engineering prompts covering current, switches, loads, sensors, and safe troubleshooting.","Project cards that turn theory into observe-test-record-improve learning."],
    outcomes:["Understand how systems behave instead of only memorizing words.","Build stronger STEM confidence through guided testing.","See electrical engineering as practical, not abstract."],
    lessons:[
      { title:"Did you know electrical engineering begins with flow?", hint:"Current needs a complete path, not just a power source.", action:"Follow source, path, load, and switch so you understand what completes or breaks a circuit." },
      { title:"This is how STEM thinking gets better", hint:"The strongest learners do not guess once and stop.", action:"Observe, test, record, compare results, and improve the design with each round." },
    ],
  },
  {
    key:"pi-ecosystem-master", title:"Pi Ecosystem Master", amount:0.35, price:"0.35 Pi",
    category:"pi", tag:"Pi Tools",
    audience:"Best for Pioneers who want deep Pi Network knowledge, mining optimisation, and ecosystem literacy.",
    body:"A premium Pioneer service with 20 pages covering Pi phases, wallet security, Security Circle strategy, ecosystem apps, and Mainnet readiness.",
    includes:["20 premium pages on Pi history, phases, KYC, Mainnet migration, wallet safety, and ecosystem apps.","Security Circle strategy guide with trust-graph explainers and rate optimisation tips.","A Mainnet readiness checklist covering KYC, passphrase backup, and first transactions."],
    outcomes:["Understand Pi Network from mining to Mainnet with zero guesswork.","Build a safer, more effective Security Circle.","Know exactly how to migrate Pi and use it on open Mainnet."],
    lessons:[
      { title:"Did you know your Security Circle affects your mining rate?", hint:"A full circle of active, trusted Pioneers significantly boosts your hourly mining rate.", action:"Review your circle, remove inactive members, and add 1 to 2 more trusted Pioneers today." },
      { title:"This is how to prepare for Mainnet migration", hint:"KYC, passphrase backup, and wallet setup all need to happen before migration.", action:"Verify your KYC status, write your passphrase on paper, and review the Pi app migration steps." },
    ],
  },
  {
    key:"family-circle", title:"Family Learning Circle", amount:0.2, price:"0.20 Pi",
    category:"family", tag:"Family",
    audience:"Best for homes that want family-safe routines, pet care guidance, and shared learning moments.",
    body:"A premium family service with guided conversation prompts, pet care routines, health follow-ups, and home learning activities for all ages.",
    includes:["14 premium pages on family device rules, kindness routines, pet ownership, and shared goals.","Daily check-in ideas that keep younger and older users learning together.","A house-pet care bundle with feeding, mood, hygiene, and safe petting reminders."],
    outcomes:["Create safer shared rules at home.","Keep family learning gentle, clear, and repeatable.","Turn device time into guided growth instead of passive scrolling."],
    lessons:[
      { title:"Did you know family rules work better when everyone helps shape them?", hint:"People follow rules more consistently when they understand the reason behind them.", action:"Agree on a simple device, payment, or pet-care rule and keep it visible." },
      { title:"This is how daily pet care becomes safer", hint:"Care is not only food — it is also space, mood, water, and observation.", action:"Check water, food, clean space, movement, and mood every day, then record changes early." },
    ],
  },
];

// ── Boosters ───────────────────────────────────────────────────────
const boosters = [
  { key:"morning", label:"Morning boost",    pts:15, icon:"🌅" },
  { key:"streak",  label:"Streak bonus",     pts:20, icon:"🔥" },
  { key:"social",  label:"Share a tip",      pts:10, icon:"💬" },
  { key:"pioneer", label:"Pioneer check-in", pts:25, icon:"π" },
];

// ── Art data (condensed) ───────────────────────────────────────────
const artStyles  = [{ key:"poster",label:"AI poster style" },{ key:"story",label:"storybook style" },{ key:"clean",label:"clean icon style" },{ key:"future",label:"future learning style" },{ key:"soft",label:"soft classroom style" },{ key:"bold",label:"bold explorer style" }];
const artFrames  = [{ key:"focus",label:"focus frame" },{ key:"lesson",label:"lesson frame" },{ key:"compare",label:"compare frame" },{ key:"field",label:"field frame" },{ key:"guide",label:"guide frame" },{ key:"lab",label:"lab frame" }];
const artPalettes= [
  { key:"gold",   background:"#fff7e5",accent:"#E8A400",support:"#2E1A8A",extra:"#0E9F6E" },
  { key:"mint",   background:"#eefcf6",accent:"#0E9F6E",support:"#2563EB",extra:"#E8A400" },
  { key:"sky",    background:"#edf6ff",accent:"#2563EB",support:"#542DE0",extra:"#0E9F6E" },
  { key:"violet", background:"#f5efff",accent:"#542DE0",support:"#E8A400",extra:"#2563EB" },
  { key:"sun",    background:"#fff4ea",accent:"#E8A400",support:"#0E9F6E",extra:"#542DE0" },
  { key:"calm",   background:"#f1fbfa",accent:"#0E9F6E",support:"#6B65A4",extra:"#E8A400" },
];

const artBlueprints = {
  safety:[ { key:"safe-link",scene:"phone",title:"Suspicious reward message",prompt:"A phone shows a message promising instant rewards from an unknown link.",question:"What is the safest action?",answers:["Open quickly","Check the source first","Share your passphrase"],correct:1,lesson:"Unknown reward links can be risky. Check the source before tapping.",points:35 } ],
  money:[ { key:"market-choice",scene:"market",title:"Marketplace decision",prompt:"A user compares two offers before spending points or future Pi.",question:"What should the user check?",answers:["Only bright colors","Value and clear terms","Pressure words"],correct:1,lesson:"Good choices come from value, clear terms, and no pressure.",points:35 } ],
  health:[ { key:"water-break",scene:"phone",title:"Hydration reminder",prompt:"A daily reminder encourages a water break before another long screen session.",question:"What type of habit is this?",answers:["Small and repeatable","Extreme and rare","Stressful"],correct:0,lesson:"Healthy routines work best when they are easy to repeat.",points:30 } ],
  growth:[ { key:"idea-note",scene:"phone",title:"One useful idea",prompt:"A learner writes a short note explaining a new idea in simple words.",question:"What does this show?",answers:["Active learning","Passive guessing","Copying without thought"],correct:0,lesson:"Learning becomes stronger when the learner can explain it clearly.",points:34 } ],
  stem:[ { key:"circuit-path",scene:"lab",title:"Circuit path check",prompt:"A learner traces a battery, switch, and lamp to understand whether a circuit is complete.",question:"What makes the lamp work?",answers:["A complete path","A random color","A hidden wire name"],correct:0,lesson:"Electrical engineering starts with understanding the path that current follows.",points:45 } ],
  pet:[ { key:"pet-care",scene:"pet",title:"Pet care check",prompt:"A house pet sits near a bowl, clean space, and care checklist.",question:"What should the owner check every day?",answers:["Water, food, space, mood","Only decorations","Nothing until problems grow"],correct:0,lesson:"Daily care helps pets stay safer, calmer, and healthier.",points:40 } ],
  pieco:[ { key:"pi-wallet-safety",scene:"phone",title:"Wallet passphrase safety",prompt:"A Pioneer is prompted to store their 24-word passphrase offline before migrating to Mainnet.",question:"Where should your passphrase be stored?",answers:["Safely offline on paper","In a chat message","On a shared document"],correct:0,lesson:"Your passphrase is the only key to your Pi. Store it safely offline.",points:45 } ],
};

function buildAiArtLibrary() {
  return categories.flatMap((category, ci) => {
    const blueprints = artBlueprints[category.key] || [];
    return blueprints.flatMap((bp, bi) =>
      artStyles.flatMap((style, si) =>
        artFrames.map((frame, fi) => {
          const palette = artPalettes[(ci + bi + si + fi) % artPalettes.length];
          return {
            key:`${category.key}-${bp.key}-${style.key}-${frame.key}`,
            categoryKey:category.key, title:bp.title,
            scene:{ type:bp.scene, palette, style, frame },
            artLabel:`${style.label} - ${frame.label}`,
            points:bp.points + (fi % 2 === 0 ? 3 : 0),
            prompt:`${bp.prompt} ${style.label} with a ${frame.label}.`,
            question:bp.question, answers:bp.answers, correct:bp.correct, lesson:bp.lesson,
          };
        })
      )
    );
  });
}

const aiArtLibrary = buildAiArtLibrary();

function dailyVisualTasks(categoryKey) {
  const day = Math.floor(new Date(todayKey).getTime() / 86400000);
  const cat  = aiArtLibrary.filter(i => i.categoryKey === categoryKey);
  const rest = aiArtLibrary.filter(i => i.categoryKey !== categoryKey);
  const ls   = cat.length  ? (day * 3) % cat.length  : 0;
  const gs   = rest.length ? (day * 5) % rest.length : 0;
  return [...(cat.length ? cat.slice(ls, ls + 4) : []), ...(rest.length ? rest.slice(gs, gs + 2) : [])];
}

const ethicsStatements = [
  { key:"impact",    text:"Before launching an AI feature, possible harm to users should be considered." },
  { key:"early",     text:"Ethical analysis should happen from the early design stage, not only after launch." },
  { key:"approval",  text:"High-risk AI features should be reviewed before they are released." },
  { key:"community", text:"People affected by an AI tool should have a way to give feedback." },
];
const ratingOptions = ["I don't know","Strongly disagree","Disagree","Neutral","Agree","Strongly agree"];

const dailyRotation = {
  safety:[ { title:"Check before you tap", body:"A safe Pioneer checks the source, app name, and rules before trusting a reward.", points:50, question:"What should you check first?", answers:["The source","A random promise","A passphrase request"], correct:0 }, { title:"Private means private", body:"Your passphrase should stay with you. No support helper should ask for it.", points:50, question:"Who should receive your passphrase?", answers:["Nobody else","Any admin","A stranger"], correct:0 } ],
  money:[ { title:"One useful saving move", body:"Track one spend today and ask if it supports your goal.", points:45, question:"What helps money choices?", answers:["Tracking spending","Buying fast","No plan"], correct:0 }, { title:"Value before reward", body:"A good offer explains value clearly before asking for attention or payment.", points:45, question:"A good offer should have...", answers:["Clear value","Pressure only","Hidden terms"], correct:0 } ],
  health:[ { title:"Small health win", body:"Pick one safe action: water, movement, rest, hygiene, or kindness.", points:40, question:"A strong daily habit is...", answers:["Small and repeatable","Risky","Impossible"], correct:0 }, { title:"Reset your focus", body:"A short stretch or walk can reset attention before another lesson.", points:40, question:"What can reset focus?", answers:["Gentle movement","Skipping sleep","Ignoring stress"], correct:0 } ],
  growth:[ { title:"One skill today", body:"Learn one idea, answer one question, and turn it into action.", points:50, question:"What makes learning real?", answers:["Action","Only scrolling","Guessing"], correct:0 }, { title:"Confidence proof", body:"Confidence grows when you complete small tasks and see progress.", points:50, question:"Confidence grows through...", answers:["Completed tasks","Avoiding everything","Random luck"], correct:0 } ],
  stem:[ { title:"Observe and test", body:"STEM starts when you observe, ask a question, test, and improve.", points:55, question:"What starts a STEM task?", answers:["Observation","Ignoring evidence","Copying blindly"], correct:0 }, { title:"Build then improve", body:"Engineering means making a solution better after testing it.", points:55, question:"After a test, you should...", answers:["Improve the design","Hide results","Stop learning"], correct:0 } ],
  pet:[ { title:"Daily pet check", body:"Check water, food, clean space, movement, and mood.", points:50, question:"What should pet owners check?", answers:["Water, food, space, mood","Only decorations","Nothing"], correct:0 }, { title:"Gentle petting", body:"Petting should be calm, safe, and respectful of the pet's signals.", points:50, question:"Safe petting means...", answers:["Respect signals","Force contact","Pull tails"], correct:0 } ],
  pieco:[ { title:"Trust your network", body:"Pi's power comes from a verified human trust graph — your Security Circle matters.", points:55, question:"What makes Pi's network secure?", answers:["Human trust circles","Energy-intensive mining","Centralised servers","Paid validators"], correct:0 }, { title:"Passphrase discipline", body:"Your Pi passphrase should be written on paper, stored safely, and never shared.", points:55, question:"How should you store your passphrase?", answers:["Offline on paper","In a chat","In email","On social media"], correct:0 } ],
};

// ── State ──────────────────────────────────────────────────────────
const state = {
  streak:        Number(localStorage.getItem("questora-streak") || 0),
  points:        Number(localStorage.getItem("questora-points") || 0),
  badges:        Number(localStorage.getItem("questora-badges") || 0),
  age:           localStorage.getItem("questora-age")            || "Adults",
  goal:          localStorage.getItem("questora-goal")           || "Pi safety",
  country:       localStorage.getItem("questora-country")        || "Kenya",
  language:      localStorage.getItem("questora-language")       || "English",
  category:      localStorage.getItem("questora-category")       || "safety",
  userName:      localStorage.getItem("questora-user-name")      || "",
  record:        JSON.parse(localStorage.getItem("questora-record")          || "{}"),
  claimed:       JSON.parse(localStorage.getItem("questora-claimed")         || "{}"),
  answered:      JSON.parse(localStorage.getItem("questora-answered")        || "{}"),
  ethics:        JSON.parse(localStorage.getItem("questora-ethics")          || "{}"),
  walletClaims:  JSON.parse(localStorage.getItem("questora-wallet-claims")   || "[]"),
  premiumUnlocks:JSON.parse(localStorage.getItem("questora-premium-unlocks") || "{}"),
  premiumHistory:JSON.parse(localStorage.getItem("questora-premium-history") || "[]"),
  piQuizAnswers: JSON.parse(localStorage.getItem("questora-pi-quiz")         || "{}"),
  selectedPremium:localStorage.getItem("questora-selected-premium")          || "trust-review",
  currentPage:   localStorage.getItem("questora-current-page")               || "home",
  highContrast:  localStorage.getItem("questora-high-contrast")  === "true",
  largeText:     localStorage.getItem("questora-large-text")     === "true",
  user:          null,
  accessToken:   "",
};

// ── Settings accordion ─────────────────────────────────────────────
document.addEventListener("click", function settingsAccordion(e) {
  const toggle = e.target.closest(".settings-toggle[data-toggle]");
  if (!toggle) return;
  const bodyId = toggle.dataset.toggle;
  const body   = document.getElementById(bodyId);
  if (!body) return;
  const isOpen = body.classList.contains("open");
  // Close all others
  document.querySelectorAll(".settings-body.open").forEach(b => b.classList.remove("open"));
  document.querySelectorAll(".settings-toggle[aria-expanded='true']").forEach(t => t.setAttribute("aria-expanded","false"));
  if (!isOpen) {
    body.classList.add("open");
    toggle.setAttribute("aria-expanded","true");
  }
}, { capture: true });

// ── DOM refs ───────────────────────────────────────────────────────
const streakCount        = document.querySelector("#streakCount");
const pointCount         = document.querySelector("#pointCount");
const badgeCount         = document.querySelector("#badgeCount");
const rankIcon           = document.querySelector("#rankIcon");
const rankLabel          = document.querySelector("#rankLabel");
const rankSubtitle       = document.querySelector("#rankSubtitle");
const loginButton        = document.querySelector("#loginButton");
const statusText         = document.querySelector("#statusText");
const piFactText         = document.querySelector("#piFactText");
const piFactHub          = document.querySelector("#piFactHub");
const dashUser           = document.querySelector("#dashUser");
const dashLevel          = document.querySelector("#dashLevel");
const dashRewards        = document.querySelector("#dashRewards");
const dashLessons        = document.querySelector("#dashLessons");
const dashDaily          = document.querySelector("#dashDaily");
const dashNext           = document.querySelector("#dashNext");
const dashboardPill      = document.querySelector("#dashboardPill");
const pathPill           = document.querySelector("#pathPill");
const choiceButtons      = [...document.querySelectorAll(".choice")];
const goalSelect         = document.querySelector("#goalSelect");
const countrySelect      = document.querySelector("#countrySelect");
const languageSelect     = document.querySelector("#languageSelect");
const categorySelect     = document.querySelector("#categorySelect");
const pageTabs           = [...document.querySelectorAll("[data-page-target]")];
const pageSections       = [...document.querySelectorAll("[data-page]")];
const dailyPanels        = [...document.querySelectorAll(".daily-learning-panel")];
// home
const dailyCardTop       = document.querySelector("#dailyCardTop");
const dailyAnswerGridTop = document.querySelector("#dailyAnswerGridTop");
const dailyFeedbackTop   = document.querySelector("#dailyFeedbackTop");
const dailyRewardPillTop = document.querySelector("#dailyRewardPillTop");
const pulseGrid          = document.querySelector("#pulseGrid");
const pulsePill          = document.querySelector("#pulsePill");
const pulseCopy          = document.querySelector("#pulseCopy");
const missionRail        = document.querySelector("#missionRail");
const missionPill        = document.querySelector("#missionPill");
const missionCopy        = document.querySelector("#missionCopy");
const challengeCard      = document.querySelector("#challengeCard");
const challengePill      = document.querySelector("#challengePill");
const purposeGrid        = document.querySelector("#purposeGrid");
const purposePill        = document.querySelector("#purposePill");
const purposeCopy        = document.querySelector("#purposeCopy");
const surpriseGrid       = document.querySelector("#surpriseGrid");
const globalGrid         = document.querySelector("#globalGrid");
const globalPill         = document.querySelector("#globalPill");
const tomorrowCard       = document.querySelector("#tomorrowCard");
const tomorrowPill       = document.querySelector("#tomorrowPill");
const nextGrid           = document.querySelector("#nextGrid");
const nextPill           = document.querySelector("#nextPill");
// learn
const reasonText         = document.querySelector("#reasonText");
const actionText         = document.querySelector("#actionText");
const categoryGrid       = document.querySelector("#categoryGrid");
const categoryPill       = document.querySelector("#categoryPill");
const dailyCard          = document.querySelector("#dailyCard");
const dailyAnswerGrid    = document.querySelector("#dailyAnswerGrid");
const dailyFeedback      = document.querySelector("#dailyFeedback");
const dailyRewardPill    = document.querySelector("#dailyRewardPill");
const boosterGrid        = document.querySelector("#boosterGrid");
const learnJourneyGrid   = document.querySelector("#learnJourneyGrid");
const learnJourneyPill   = document.querySelector("#learnJourneyPill");
const learnJourneyCopy   = document.querySelector("#learnJourneyCopy");
const featuredLessonCard = document.querySelector("#featuredLessonCard");
const featuredLessonPill = document.querySelector("#featuredLessonPill");
const lessonGrid         = document.querySelector("#lessonGrid");
const researchPanel      = document.querySelector("#researchPanel");
const visualGrid         = document.querySelector("#visualGrid");
const visualPill         = document.querySelector("#visualPill");
const visualCopy         = document.querySelector("#visualCopy");
const ethicsList         = document.querySelector("#ethicsList");
const toolGrid           = document.querySelector("#toolGrid");
// pioneer hub
const pioneerRankPill    = document.querySelector("#pioneerRankPill");
const rankGrid           = document.querySelector("#rankGrid");
const piPhaseGrid        = document.querySelector("#piPhaseGrid");
const piAppsGrid         = document.querySelector("#piAppsGrid");
const piUtilityGrid      = document.querySelector("#piUtilityGrid");
const utilityPill        = document.querySelector("#utilityPill");
const piQuizCard         = document.querySelector("#piQuizCard");
const piQuizPill         = document.querySelector("#piQuizPill");
const piSafetyList       = document.querySelector("#piSafetyList");
const miningFaqEl        = document.querySelector("#miningFaq");
// rewards
const rewardGrid         = document.querySelector("#rewardGrid");
const rewardCenterGrid   = document.querySelector("#rewardCenterGrid");
const rewardCenterPill   = document.querySelector("#rewardCenterPill");
const rewardCenterCopy   = document.querySelector("#rewardCenterCopy");
const rewardJourneyGrid  = document.querySelector("#rewardJourneyGrid");
const rewardJourneyPill  = document.querySelector("#rewardJourneyPill");
const rewardJourneyCopy  = document.querySelector("#rewardJourneyCopy");
const walletClaimAmount  = document.querySelector("#walletClaimAmount");
const claimWalletButton  = document.querySelector("#claimWalletButton");
const walletPill         = document.querySelector("#walletPill");
const claimHistoryList   = document.querySelector("#claimHistoryList");
const claimHistoryPill   = document.querySelector("#claimHistoryPill");
const premiumGrid        = document.querySelector("#premiumGrid");
const premiumDetail      = document.querySelector("#premiumDetail");
const premiumStatusGrid  = document.querySelector("#premiumStatusGrid");
const premiumHistoryList = document.querySelector("#premiumHistoryList");
const premiumGuideGrid   = document.querySelector("#premiumGuideGrid");
const premiumGuidePill   = document.querySelector("#premiumGuidePill");
const premiumGuideCopy   = document.querySelector("#premiumGuideCopy");
const premiumCompareGrid = document.querySelector("#premiumCompareGrid");
const premiumComparePill = document.querySelector("#premiumComparePill");
const premiumCompareCopy = document.querySelector("#premiumCompareCopy");
const leaderboardGrid    = document.querySelector("#leaderboardGrid");
const yourRankLabel      = document.querySelector("#yourRankLabel");
const yourRankPoints     = document.querySelector("#yourRankPoints");
// profile
const recordName         = document.querySelector("#recordName");
const recordLevel        = document.querySelector("#recordLevel");
const recordToday        = document.querySelector("#recordToday");
const profileGrid        = document.querySelector("#profileGrid");
const profileCopy        = document.querySelector("#profileCopy");
const profilePill        = document.querySelector("#profilePill");
const profileSummaryGrid = document.querySelector("#profileSummaryGrid");
const referralCard       = document.querySelector("#referralCard");

// ── Helpers ────────────────────────────────────────────────────────
function currentCategory() {
  return categories.find(c => c.key === state.category) || categories[0];
}

function currentDailyQuest(category) {
  const opts = dailyRotation[category.key] || [category.daily];
  const day  = Math.floor(new Date(todayKey).getTime() / 86400000);
  return opts[day % opts.length];
}

function userRecord() {
  const id = state.userName || "guest";
  state.record[id] ||= { createdAt:todayKey, lastDailyDate:"", completedDays:0, completedLessons:[], completedTools:[], unlockedRewards:[] };
  return state.record[id];
}

function saveState() {
  localStorage.setItem("questora-streak",         String(state.streak));
  localStorage.setItem("questora-points",         String(state.points));
  localStorage.setItem("questora-badges",         String(state.badges));
  localStorage.setItem("questora-age",            state.age);
  localStorage.setItem("questora-goal",           state.goal);
  localStorage.setItem("questora-country",        state.country);
  localStorage.setItem("questora-language",       state.language);
  localStorage.setItem("questora-category",       state.category);
  localStorage.setItem("questora-user-name",      state.userName);
  localStorage.setItem("questora-record",         JSON.stringify(state.record));
  localStorage.setItem("questora-claimed",        JSON.stringify(state.claimed));
  localStorage.setItem("questora-answered",       JSON.stringify(state.answered));
  localStorage.setItem("questora-ethics",         JSON.stringify(state.ethics));
  localStorage.setItem("questora-wallet-claims",  JSON.stringify(state.walletClaims));
  localStorage.setItem("questora-premium-unlocks",JSON.stringify(state.premiumUnlocks));
  localStorage.setItem("questora-premium-history",JSON.stringify(state.premiumHistory));
  localStorage.setItem("questora-pi-quiz",        JSON.stringify(state.piQuizAnswers));
  localStorage.setItem("questora-selected-premium",state.selectedPremium);
  localStorage.setItem("questora-current-page",  state.currentPage);
  localStorage.setItem("questora-high-contrast", String(state.highContrast));
  localStorage.setItem("questora-large-text",    String(state.largeText));
}

function addPoints(pts, reason) {
  const prevUnlocked = getUnlockedAchievements(state).map(a => a.key);
  const prevRank     = currentRank(state.points).key;
  state.points += pts;
  if (state.points >= 250 && state.badges < 1) state.badges = 1;
  if (state.points >= 500 && state.badges < 2) state.badges = 2;
  if (state.points >= 900 && state.badges < 3) state.badges = 3;
  saveState();
  // Show toast
  showToast(`+${pts} pts · ${reason.split(".")[0]}`, "points");
  // Check achievements
  checkAndCelebrateAchievements(state, prevUnlocked);
  // Check rank up (after points applied)
  if (currentRank(state.points).key !== prevRank) {
    checkRankUp(state.points);
  } else {
    _lastRankKey = currentRank(state.points).key;
  }
  renderInPlace();
  if (statusText) statusText.textContent = reason;
}

function explain(reason, action) {
  if (reasonText) reasonText.textContent = reason;
  if (actionText) actionText.textContent = action;
  if (statusText) statusText.textContent = `${reason} ${action}`;
}

function renderPages() {
  const page = state.currentPage;
  pageSections.forEach(s => { s.hidden = s.dataset.page !== page; });
  pageTabs.forEach(t => { t.classList.toggle("active", t.dataset.pageTarget === page); });
  syncToggles();
}

function openPage(page) {
  state.currentPage = page;
  saveState();
  render();
  window.scrollTo({ top:0, behavior:"smooth" });
}

function renderInPlace() {
  const scroll = window.scrollY;
  const page   = state.currentPage;
  render();
  state.currentPage = page;
  requestAnimationFrame(() => window.scrollTo({ top:scroll, behavior:"auto" }));
}

// ── Scene SVG builder ──────────────────────────────────────────────
function renderScene(scene) {
  if (typeof scene === "object") {
    const { type, palette, style, frame } = scene;
    const { accent: a, support: s, extra: e, background: bg } = palette;
    const shapes = {
      phone:`<rect x="92" y="36" width="76" height="86" rx="12" fill="#fff" stroke="${s}" stroke-width="6"/><path d="M111 58h38M111 76h28M111 94h42" stroke="${s}" stroke-width="7" stroke-linecap="round"/><circle cx="130" cy="112" r="5" fill="${a}"/><circle cx="62" cy="54" r="18" fill="${a}"/><path d="M190 52l12 12 22-24" fill="none" stroke="${e}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
      lab:`<circle cx="58" cy="46" r="20" fill="${a}"/><rect x="136" y="38" width="68" height="80" rx="10" fill="#fff" stroke="${s}" stroke-width="5"/><path d="M155 96c0-21 18-31 32-45" stroke="${e}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M46 108h72" stroke="${s}" stroke-width="8" stroke-linecap="round"/><circle cx="86" cy="64" r="12" fill="${s}"/>`,
      market:`<rect x="34" y="40" width="74" height="82" rx="10" fill="#fff" stroke="${a}" stroke-width="5"/><rect x="152" y="40" width="74" height="82" rx="10" fill="#fff" stroke="${s}" stroke-width="5"/><circle cx="130" cy="82" r="18" fill="${e}"/>`,
      pet:`<circle cx="88" cy="72" r="28" fill="${s}"/><circle cx="69" cy="44" r="11" fill="${s}"/><circle cx="107" cy="44" r="11" fill="${s}"/><circle cx="78" cy="70" r="4" fill="#fff"/><circle cx="99" cy="70" r="4" fill="#fff"/><path d="M82 86c8 7 16 7 24 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="150" y="42" width="68" height="72" rx="10" fill="#fff" stroke="${e}" stroke-width="5"/>`,
      family:`<rect x="50" y="98" width="160" height="20" rx="9" fill="${a}"/><circle cx="80" cy="66" r="18" fill="${s}"/><circle cx="130" cy="56" r="22" fill="${e}"/><circle cx="182" cy="68" r="18" fill="${a}"/>`,
      engineering:`<circle cx="56" cy="50" r="18" fill="${a}"/><rect x="142" y="38" width="70" height="82" rx="12" fill="#fff" stroke="${e}" stroke-width="5"/>`,
    };
    return `<svg viewBox="0 0 260 150" class="scene-box" role="img" aria-label="${style.label} art scene"><rect width="260" height="150" rx="8" fill="${bg}"/>${shapes[type]||shapes.phone}</svg>`;
  }
  const icons = { phone:"📱", family:"👨‍👩‍👧‍👦", market:"🛒", lab:"🔬", pet:"🐾", engineering:"⚡" };
  return `<div class="scene-box" role="img" aria-label="${scene} scene">${icons[scene]||"🖼️"}</div>`;
}

// ── Leaderboard data ───────────────────────────────────────────────
function buildLeaderboard(userPts) {
  const demo = [
    { name:"PiNova254",   pts: Math.max(userPts + 420, 980) },
    { name:"SafeChain",   pts: Math.max(userPts + 210, 740) },
    { name:"MinerLex",    pts: Math.max(userPts + 95,  620) },
    { name:"TrustCircle", pts: Math.max(userPts + 30,  520) },
  ];
  return demo.sort((a, b) => b.pts - a.pts);
}

// ── Render ─────────────────────────────────────────────────────────
function render() {
  const category         = currentCategory();
  const dailyQuest       = currentDailyQuest(category);
  const todaysVisuals    = dailyVisualTasks(category.key);
  const record           = userRecord();
  const dailyDone        = record.lastDailyDate === todayKey;
  const level            = Math.max(1, Math.floor(state.points / 150) + 1);
  const unlockedRewards  = rewards.filter(r => state.points >= r.need).length;
  const allLessonKeys    = categories.flatMap(c => c.lessons.map(l => `${c.key}::${l.key}`));
  const completedLessons = allLessonKeys.filter(k => state.answered[k]).length;
  const nextReward       = rewards.find(r => state.points < r.need);
  const alreadyClaimed   = state.walletClaims.reduce((s, c) => s + c.points, 0);
  const claimable        = Math.max(0, state.points - alreadyClaimed);
  const rank             = currentRank(state.points);
  const catLessonKeys    = category.lessons.map(l => `${category.key}::${l.key}`);
  const completedCatLessons = catLessonKeys.filter(k => state.answered[k]).length;
  const firstOpenLesson  = category.lessons.find(l => !state.answered[`${category.key}::${l.key}`]) || category.lessons[0];
  const piQuiz           = todayPiQuiz();
  const piQuizAnswered   = state.piQuizAnswers[piQuiz.q] !== undefined;
  const piQuizCorrect    = state.piQuizAnswers[piQuiz.q] === piQuiz.correct;

  // ── Hero stats ──────────────────────────────────────────────────
  if (streakCount) streakCount.textContent = state.streak;
  if (pointCount)  pointCount.textContent  = state.points;
  if (badgeCount)  badgeCount.textContent  = state.badges;
  if (rankIcon)    rankIcon.textContent    = rank.icon;
  if (rankLabel)   rankLabel.textContent   = rank.label;

  // Rank chip (compact hero)
  const rankChip = document.getElementById("rankChip");
  if (rankChip) rankChip.innerHTML = `<span>${rank.icon}</span><span>${rank.label}</span>`;

  // Level chip
  const levelChip = document.getElementById("dashLevel");
  if (levelChip) levelChip.textContent = `L${level}`;

  // Connect bar
  const connectBar   = document.getElementById("connectBar");
  const connectIcon  = document.getElementById("connectIcon");
  const connectLabel = document.getElementById("connectLabel");
  const loginBtn     = document.getElementById("loginButton");
  if (connectBar && connectIcon && connectLabel) {
    if (state.user) {
      connectBar.className = "connect-bar connected";
      connectIcon.textContent  = "🟢";
      connectLabel.textContent = `@${state.userName}`;
      if (loginBtn) { loginBtn.textContent = "Connected"; loginBtn.disabled = true; }
    } else {
      connectBar.className = "connect-bar";
      connectIcon.textContent  = "⚪";
      connectLabel.textContent = "Not connected";
      if (loginBtn) { loginBtn.textContent = "π Connect"; loginBtn.disabled = false; }
    }
  }

  // Quick tile sub-labels
  const qls = document.getElementById("quickLearnSub");
  const qrs = document.getElementById("quickRewardSub");
  if (qls) qls.textContent = `${completedLessons} lessons done`;
  if (qrs) qrs.textContent = `${unlockedRewards} reward${unlockedRewards!==1?"s":""} open`;

  // Streak pill
  const streakPill = document.getElementById("streakPill");
  if (streakPill) streakPill.textContent = `${state.streak}-day streak`;

  // Next unlock band
  const nub = document.getElementById("nextUnlockBand");
  if (nub) {
    if (nextReward) {
      nub.innerHTML = `<span class="nub-icon">🎯</span><div><strong>${nextReward.title}</strong><p>${Math.max(0,nextReward.need-state.points)} pts to unlock · ${nextReward.value}</p></div>`;
      nub.hidden = false;
    } else {
      nub.innerHTML = `<span class="nub-icon">✅</span><div><strong>All rewards unlocked</strong><p>You have reached the top reward tier. Keep earning to build your Pioneer record.</p></div>`;
    }
  }

  // Reward strip
  const rsPts = document.getElementById("rewardStripPts");
  const rsUnl = document.getElementById("rewardStripUnlocked");
  const rsCl  = document.getElementById("rewardStripClaimable");
  if (rsPts) rsPts.textContent = state.points;
  if (rsUnl) rsUnl.textContent = unlockedRewards;
  if (rsCl)  rsCl.textContent  = claimable;

  // Profile hero
  const phName  = document.getElementById("profileHeroName");
  const phRank  = document.getElementById("profileHeroRank");
  const phStats = document.getElementById("profileHeroStats");
  const phAvatar= document.getElementById("profileAvatar");
  if (phName)   phName.textContent   = state.userName ? `@${state.userName}` : "Guest Pioneer";
  if (phRank)   phRank.textContent   = `${rank.icon} ${rank.label}`;
  if (phStats)  phStats.textContent  = `${state.points} pts · Level ${level} · ${record.completedDays} daily wins`;
  if (phAvatar) phAvatar.textContent = state.userName ? state.userName[0].toUpperCase() : "π";

  // Achieve count in settings toggle
  const achCount = document.getElementById("achieveCount");
  if (achCount) achCount.textContent = `${getUnlockedAchievements(state).length} / ${ACHIEVEMENTS.length}`;

  // ── Dashboard ───────────────────────────────────────────────────
  if (dashUser)      dashUser.textContent      = state.userName || "Guest";
  if (dashLevel)     dashLevel.textContent     = `Level ${level}`;
  if (dashRewards)   dashRewards.textContent   = unlockedRewards;
  if (dashLessons)   dashLessons.textContent   = completedLessons;
  if (dashDaily)     dashDaily.textContent     = record.completedDays;
  if (dashNext)      dashNext.textContent      = nextReward ? `${nextReward.need - state.points} pts` : "All open";
  if (dashboardPill) dashboardPill.textContent = state.userName ? "Connected" : "Guest mode";
  if (pathPill)      pathPill.textContent      = state.age;

  // ── Pi facts ────────────────────────────────────────────────────
  const fact = todayPiFact();
  if (piFactText) piFactText.textContent = fact;
  if (piFactHub)  piFactHub.textContent  = fact;

  // ── Select syncing ──────────────────────────────────────────────
  if (goalSelect)     goalSelect.value     = state.goal;
  if (countrySelect)  countrySelect.value  = state.country;
  if (languageSelect) languageSelect.value = state.language;
  if (categorySelect) categorySelect.value = state.category;
  choiceButtons.forEach(b => b.classList.toggle("active", b.dataset.age === state.age));

  // ── Pills ───────────────────────────────────────────────────────
  if (categoryPill)      categoryPill.textContent      = category.title;
  if (dailyRewardPill)   dailyRewardPill.textContent   = `+${dailyQuest.points} pts`;
  if (dailyRewardPillTop)dailyRewardPillTop.textContent= `+${dailyQuest.points} pts`;
  if (learnJourneyPill)  learnJourneyPill.textContent  = `${completedCatLessons}/${category.lessons.length} done`;
  if (featuredLessonPill)featuredLessonPill.textContent= state.answered[`${category.key}::${firstOpenLesson.key}`] ? "Review" : "Best next";
  if (pulsePill)         pulsePill.textContent         = `${todaysVisuals.length} live`;
  if (visualPill)        visualPill.textContent        = `${aiArtLibrary.length.toLocaleString()} art scenes`;
  if (challengePill)     challengePill.textContent     = dailyDone ? "Continue" : "Do this";
  if (globalPill)        globalPill.textContent        = `${state.country} · ${state.language}`;
  if (tomorrowPill)      tomorrowPill.textContent      = dailyDone ? "Come back" : "Finish today";
  if (nextPill)          nextPill.textContent          = nextReward ? `${nextReward.need - state.points} pts left` : "All unlocked";
  if (missionPill) {
    const steps    = [dailyDone, completedLessons > 0, unlockedRewards > 0, claimable >= 100];
    const stepNum  = steps.findIndex(s => !s);
    missionPill.textContent = `Step ${stepNum === -1 ? steps.length : stepNum + 1}`;
  }
  if (purposePill) purposePill.textContent = state.goal;
  if (rewardCenterPill)  rewardCenterPill.textContent  = claimable >= 100 ? "Ready to claim" : "Keep earning";
  if (rewardJourneyPill) rewardJourneyPill.textContent = unlockedRewards ? `${unlockedRewards} unlocked` : "Building";
  if (claimHistoryPill)  claimHistoryPill.textContent  = state.walletClaims.length ? `${state.walletClaims.length} records` : "No claims yet";
  if (premiumGuidePill)  premiumGuidePill.textContent  = unlockedRewards ? "Ready to compare" : "Value first";
  if (walletPill)        walletPill.textContent        = state.walletClaims.length ? `${state.walletClaims.length} claims` : "Preview";
  if (pioneerRankPill)   pioneerRankPill.textContent   = `${rank.icon} ${rank.label}`;
  if (piQuizPill)        piQuizPill.textContent        = piQuizAnswered ? (piQuizCorrect ? "Correct today" : "Try again") : "Daily";
  if (utilityPill) {
    const done = piUtilitySteps.filter((_, i) => state.claimed[`utility-${i}`]).length;
    utilityPill.textContent = `${done}/${piUtilitySteps.length} done`;
  }
  if (profilePill)       profilePill.textContent       = state.userName ? "Known user" : "Guest path";
  if (yourRankLabel)     yourRankLabel.textContent     = state.userName || "You";
  if (yourRankPoints)    yourRankPoints.textContent    = `${state.points} pts`;

  // ── Copy text ───────────────────────────────────────────────────
  if (learnJourneyCopy) learnJourneyCopy.textContent = `${category.title} works best moving from the daily brief to lessons, then to visual practice.`;
  if (pulseCopy)        pulseCopy.textContent        = `${state.country}, ${state.language}, and ${category.title} shape today's live feed.`;
  if (missionCopy)      missionCopy.textContent      = dailyDone ? "Today's question is complete. Keep the flow moving through lessons and rewards." : "Start with today's question, then move through lessons and rewards.";
  if (visualCopy)       visualCopy.textContent       = `${todaysVisuals.length} visual tasks are live today for ${category.title}.`;
  if (rewardCenterCopy) rewardCenterCopy.textContent  = claimable >= 100 ? "You have enough progress for a reward review record." : "Keep earning to build your reward record.";
  if (rewardJourneyCopy) rewardJourneyCopy.textContent = nextReward ? `Every point pushes toward ${nextReward.title}.` : "All current reward tiers are open.";
  if (premiumGuideCopy) premiumGuideCopy.textContent  = unlockedRewards ? "Premium now feels like a deeper service layer built on free learning." : "Premium stays visible, but Questora proves itself through free learning first.";
  if (purposeCopy)      purposeCopy.textContent      = `Questora helps ${state.age.toLowerCase()} focused on ${state.goal} build daily habits that matter.`;
  if (profileCopy)      profileCopy.textContent      = `${state.userName || "Guest learner"} is building a clear record across daily wins, lessons, and rewards.`;
  if (premiumCompareCopy) {
    const pack = premiumPacks.find(p => p.key === state.selectedPremium) || premiumPacks[0];
    premiumCompareCopy.textContent = `${pack.title} — what it includes, what stays free, and why ${pack.price} makes sense.`;
  }

  // ── Records ─────────────────────────────────────────────────────
  if (recordName)  recordName.textContent  = state.userName || "Guest learner";
  if (recordLevel) recordLevel.textContent = `Level ${level}`;
  if (recordToday) recordToday.textContent = dailyDone ? "Done" : "Waiting";

  // ── Streak calendar ─────────────────────────────────────────────
  const cal = document.getElementById("streakCalendar");
  if (cal) {
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const now  = new Date();
    cal.innerHTML = Array.from({ length: 7 }, (_, i) => {
      const d    = new Date(now); d.setDate(now.getDate() - (6 - i));
      const key  = d.toISOString().slice(0,10);
      const dayName = days[d.getDay()];
      const isToday = key === todayKey;
      const isDone  = key === record.lastDailyDate || (isToday && dailyDone);
      return `<div class="streak-day${isDone?" done":""}${isToday&&!isDone?" today":""}">
        <span class="day-label">${dayName}</span>
        <span class="day-icon">${isDone?"✓":isToday?"📍":"·"}</span>
      </div>`;
    }).join("");
  }

  // ── Achievements ─────────────────────────────────────────────────
  const unlocked = getUnlockedAchievements(state);
  const renderAchGrid = (el) => {
    if (!el) return;
    el.innerHTML = ACHIEVEMENTS.map(a => {
      const done = unlocked.some(u => u.key === a.key);
      return `<div class="achievement-badge${done?" unlocked":"locked"}" title="${a.desc}">
        <span class="badge-icon">${a.icon}</span>
        <span class="badge-name">${a.name}</span>
      </div>`;
    }).join("");
  };
  renderAchGrid(document.getElementById("achievementGrid"));
  renderAchGrid(document.getElementById("profileAchievementGrid"));
  const achieveCount = unlocked.length;
  const achievePill  = document.getElementById("achievePill");
  const profAchPill  = document.getElementById("profileAchievePill");
  if (achievePill) achievePill.textContent = `${achieveCount} unlocked`;
  if (profAchPill) profAchPill.textContent = `${achieveCount} / ${ACHIEVEMENTS.length}`;

  // ── Pi status band ────────────────────────────────────────────────
  const piStatus = document.getElementById("piStatusBand");
  if (piStatus) {
    if (state.user) {
      piStatus.className = "pi-status-band connected";
      document.getElementById("piStatusIcon").textContent  = "🟢";
      document.getElementById("piStatusTitle").textContent = `Connected as @${state.userName}`;
      document.getElementById("piStatusDesc").textContent  = "Pioneer account linked. Pi payments and verification are active.";
    } else {
      piStatus.className = "pi-status-band";
      document.getElementById("piStatusIcon").textContent  = "⚪";
      document.getElementById("piStatusTitle").textContent = "Not connected";
      document.getElementById("piStatusDesc").textContent  = "Open Questora in Pi Browser to connect your Pioneer account.";
    }
  }

  // ── Quest hero (home page) ────────────────────────────────────────
  const qhCat      = document.getElementById("questHeroCategory");
  const qhCard     = document.getElementById("questHeroCard");
  const qhAnswers  = document.getElementById("questHeroAnswers");
  const qhFeedback = document.getElementById("questHeroFeedback");
  const qhReward   = document.getElementById("questRewardPill");
  const qhStatus   = document.getElementById("questStatusPill");
  if (qhCat)    qhCat.textContent    = category.title;
  if (qhReward) qhReward.textContent = `+${dailyQuest.points} pts`;
  if (qhStatus) qhStatus.textContent = dailyDone ? "✓ Done" : "Ready";
  if (qhCard) {
    qhCard.className = `quest-hero-card${dailyDone ? " daily-card " + category.style : ""}`;
    qhCard.innerHTML = `<h3>${dailyQuest.title}</h3><p style="color:var(--muted);font-size:.88rem;margin:0">${dailyQuest.body}</p>${dailyDone ? `<span class="reward-note">✓ Quest complete for today</span>` : `<strong class="reward-note">Correct answer → +${dailyQuest.points} pts saved</strong>`}`;
  }
  if (qhAnswers) {
    qhAnswers.innerHTML = dailyQuest.answers.map((a,i) =>
      `<button class="answer${dailyDone && i===dailyQuest.correct?" correct":""}" data-daily-answer="${i}" type="button"${dailyDone?" disabled":""}>${a}</button>`
    ).join("");
  }
  if (qhFeedback) qhFeedback.textContent = dailyDone ? "Daily quest complete. Come back tomorrow." : dailyQuest.question;

  // ── Achievement strip ─────────────────────────────────────────────
  const strip = document.getElementById("achievementStrip");
  if (strip) {
    strip.innerHTML = ACHIEVEMENTS.map(a => {
      const done = getUnlockedAchievements(state).some(u => u.key === a.key);
      return `<div class="achievement-badge${done?" unlocked":" locked"}" title="${a.desc}"><span class="badge-icon">${a.icon}</span><span class="badge-name">${a.name}</span></div>`;
    }).join("");
  }

  // ── Daily card ──────────────────────────────────────────────────
  const dailyMarkup = `<p class="quest-label">${category.title}</p><h3>${dailyQuest.title}</h3><p>${dailyQuest.body}</p><strong class="reward-note">Correct answer earns +${dailyQuest.points} pts and saves today's win.</strong>`;
  const answerMarkup = dailyQuest.answers.map((a, i) => `<button class="answer${dailyDone && i === dailyQuest.correct ? " correct" : ""}" data-daily-answer="${i}" type="button"${dailyDone ? " disabled" : ""}>${a}</button>`).join("");
  const feedbackText = dailyDone ? "Daily quest completed. Come back tomorrow for a new reward." : dailyQuest.question;

  if (dailyCard) { dailyCard.className = `daily-card ${category.style}`; dailyCard.innerHTML = dailyMarkup; }
  if (dailyAnswerGrid) dailyAnswerGrid.innerHTML = answerMarkup;
  if (dailyFeedback)   dailyFeedback.textContent = feedbackText;
  if (dailyCardTop)    { dailyCardTop.className = `daily-card ${category.style}`; dailyCardTop.innerHTML = dailyMarkup; }
  if (dailyAnswerGridTop) dailyAnswerGridTop.innerHTML = answerMarkup;
  if (dailyFeedbackTop)   dailyFeedbackTop.textContent = feedbackText;

  // ── Boosters ────────────────────────────────────────────────────
  if (boosterGrid) boosterGrid.innerHTML = boosters.map(b => {
    const claimed = state.claimed[`booster-${b.key}`];
    return `<button class="booster${claimed ? " claimed" : ""}" data-booster="${b.key}" data-points="${b.pts}" type="button"><strong>${b.icon} ${b.label}</strong><span>${claimed ? "Claimed" : `+${b.pts} pts`}</span></button>`;
  }).join("");

  // ── Category grid ───────────────────────────────────────────────
  if (categoryGrid) categoryGrid.innerHTML = categories.map(c =>
    `<button class="category-card ${c.style}${c.key === state.category ? " active" : ""}" data-category="${c.key}" type="button"><strong>${c.title}</strong><span>${c.summary}</span></button>`
  ).join("");

  // ── Learn journey ───────────────────────────────────────────────
  if (learnJourneyGrid) learnJourneyGrid.innerHTML = [
    { title:"Read the daily brief", body:`${category.title} starts with a daily idea — read it first.`, done:true },
    { title:"Answer category lessons", body:completedCatLessons ? `${completedCatLessons} lesson reward${completedCatLessons > 1 ? "s" : ""} already saved.` : "Move through lesson cards and answer one at a time.", done:completedCatLessons > 0 },
    { title:"Use visual tasks and tools", body:"Reinforce the topic with visual tasks and practical tools.", done:false },
  ].map((item, i) =>
    `<article class="learn-journey-step${item.done ? " done" : ""}"><span>${i+1}</span><div><strong>${item.title}</strong><p>${item.body}</p></div></article>`
  ).join("");

  // ── Featured lesson ─────────────────────────────────────────────
  if (featuredLessonCard) featuredLessonCard.innerHTML = `
    <p class="quest-label">${category.title}</p>
    <h3>${firstOpenLesson.title}</h3>
    <p>${firstOpenLesson.body}</p>
    <strong>${firstOpenLesson.reward} — +${firstOpenLesson.points} pts</strong>
    <p class="featured-question">${firstOpenLesson.question}</p>
    <button class="featured-action" data-open-featured="${category.key}::${firstOpenLesson.key}" type="button">
      ${state.answered[`${category.key}::${firstOpenLesson.key}`] ? "Review lesson below" : "Answer this lesson below"}
    </button>`;

  // ── Lessons ─────────────────────────────────────────────────────
  if (lessonGrid) lessonGrid.innerHTML = category.lessons.map(lesson => {
    const key = `${category.key}::${lesson.key}`;
    const done = !!state.answered[key];
    return `<article class="lesson-card${done ? " claimed" : ""}">
      <strong>${lesson.title}</strong><p>${lesson.body}</p><span>${lesson.reward} — +${lesson.points} pts</span>
      <div class="mini-question"><p>${lesson.question}</p>
        <small>${done ? "Completed and saved." : "Pick one answer."}</small>
        ${lesson.answers.map((a,i) => `<button class="mini-answer${done && i===lesson.correct ? " correct" : ""}" data-lesson="${key}" data-index="${i}" type="button"${done ? " disabled" : ""}>${a}</button>`).join("")}
      </div></article>`;
  }).join("");

  // ── Research library ────────────────────────────────────────────
  const resLib = { safety:{ count:5988, quote:"Trust grows when every reward has clear rules." }, money:{ count:5988, quote:"Small money choices become powerful when repeated." }, health:{ count:5988, quote:"Health improves when care becomes simple enough to repeat." }, growth:{ count:5988, quote:"Skill grows when learning turns into one visible action." }, stem:{ count:5988, quote:"STEM is curiosity organised into tests, tools, and evidence." }, pet:{ count:5988, quote:"A pet is not decoration; it is daily responsibility." }, pieco:{ count:7500, quote:"Pi grows when Pioneers understand the network they are building." } };
  const lib = resLib[category.key] || resLib.safety;
  if (researchPanel) researchPanel.innerHTML = `<div class="research-header"><div><p class="eyebrow">Permanent Research</p><h3>${category.title} library</h3></div><span>${lib.count.toLocaleString()} pages</span></div><blockquote>${lib.quote}</blockquote>`;

  // ── Visual grid ─────────────────────────────────────────────────
  if (visualGrid) visualGrid.innerHTML = todaysVisuals.map(task => {
    const key = `visual::${task.key}`;
    const done = !!state.answered[key];
    return `<article class="visual-card${done ? " claimed" : ""}">
      ${renderScene(task.scene)}
      <div class="visual-copy"><strong>${task.title}</strong><p>${task.prompt}</p><span>${task.artLabel}</span><b>${done ? task.lesson : `Earn +${task.points} pts`}</b></div>
      <div class="mini-question"><p>${task.question}</p><small>${done ? "Visual lesson completed." : "Select the clearest answer."}</small>
        ${task.answers.map((a,i) => `<button class="mini-answer${done && i===task.correct ? " correct" : ""}" data-visual="${task.key}" data-index="${i}" type="button"${done ? " disabled" : ""}>${a}</button>`).join("")}
      </div></article>`;
  }).join("");

  // ── Ethics ──────────────────────────────────────────────────────
  if (ethicsList) ethicsList.innerHTML = ethicsStatements.map(s => {
    const saved = state.ethics[s.key];
    return `<article class="ethics-card${saved !== undefined ? " answered" : ""}">
      <p>${s.text}</p><div class="rating-row">${ratingOptions.map((o,i) => `<button class="rating-button${saved===i ? " selected" : ""}" data-ethics="${s.key}" data-value="${i}" type="button">${o}</button>`).join("")}</div></article>`;
  }).join("");

  // ── Tools ───────────────────────────────────────────────────────
  if (toolGrid) toolGrid.innerHTML = tools.map(t => {
    const claimed = state.claimed[t.key];
    return `<button class="tool-card${claimed ? " claimed" : ""}" data-tool="${t.key}" data-points="${t.points}" type="button"><strong>${t.title}</strong><p>${t.body}</p><span>${claimed ? "Used" : `Earn +${t.points} pts`}</span></button>`;
  }).join("");

  // ── Purpose cards ───────────────────────────────────────────────
  if (purposeGrid) purposeGrid.innerHTML = [
    { title:"Learn", body:`Daily ${category.title} questions build knowledge in small, safe steps.` },
    { title:"Earn",  body:`Points and badges reward consistent effort across all categories.` },
    { title:"Grow",  body:`Premium Pi services deepen learning for Pioneers ready to invest.` },
  ].map(c => `<article class="purpose-card"><strong>${c.title}</strong><p>${c.body}</p></article>`).join("");

  // ── Global cards ────────────────────────────────────────────────
  if (globalGrid) globalGrid.innerHTML = [
    { title:`${state.country} pioneers`, body:`Questora is designed for Pioneers everywhere. Your region, language, and goals shape the daily flow.`, badge:state.language },
    { title:"Why Questora",              body:"Short daily quests, Pi ecosystem knowledge, and premium learning that proves value before asking for Pi.", badge:"Daily use" },
    { title:"Trust before payment",      body:"Free learning shows value first. Premium Pi services are optional and explained clearly before any payment.", badge:"Pi ready" },
  ].map(c => `<article class="global-card"><strong>${c.title}</strong><p>${c.body}</p><span>${c.badge}</span></article>`).join("");

  // ── Mission steps ───────────────────────────────────────────────
  if (missionRail) {
    const steps = [
      { title:"Answer daily",         body:dailyDone ? "Today's question is complete." : "Complete today's question to lock in your daily win.", done:dailyDone },
      { title:"Finish lessons",       body:completedLessons ? `${completedLessons} lesson rewards saved.` : "Move through category lessons to build points.", done:completedLessons > 0 },
      { title:"Unlock rewards",       body:unlockedRewards ? `${unlockedRewards} reward tier${unlockedRewards > 1?"s":""} unlocked.` : "Keep earning to unlock your first reward tier.", done:unlockedRewards > 0 },
      { title:"Explore Pi Hub",       body:state.piQuizAnswers && Object.keys(state.piQuizAnswers).length > 0 ? "Pioneer Hub visited." : "Visit the Pioneer Hub to grow your Pi knowledge.", done:Object.keys(state.piQuizAnswers).length > 0 },
    ];
    const activeStep = steps.findIndex(s => !s.done);
    missionRail.innerHTML = steps.map((step, i) =>
      `<article class="mission-step${step.done?" done":""}${i===activeStep?" active":""}" role="listitem"><span>${step.done?"✓":i+1}</span><div><strong>${step.title}</strong><p>${step.body}</p></div></article>`
    ).join("");
  }

  // ── Pulse cards ─────────────────────────────────────────────────
  if (pulseGrid) pulseGrid.innerHTML = [
    { label:"Hot today",    title:dailyQuest.title, body:`Correct answer earns +${dailyQuest.points} pts immediately.`, tone:category.style, page:"home" },
    { label:"Pi knowledge", title:"Pioneer Hub",    body:"Test your Pi Network knowledge and advance your Pioneer rank.", tone:"gold", page:"pioneer" },
    { label:"Near unlock",  title:nextReward?nextReward.title:"All rewards open", body:nextReward?`${Math.max(0,nextReward.need-state.points)} pts to unlock ${nextReward.value}.`:"Every reward tier is already open.", tone:"green", page:"rewards" },
    { label:"Level up",     title:`${rank.icon} ${rank.label}`, body:`${rank.desc} Keep earning to advance your Pioneer rank.`, tone:"purple", page:"pioneer" },
  ].map(c => `<button class="pulse-card ${c.tone}" data-open-page="${c.page}" type="button"><p class="eyebrow">${c.label}</p><strong>${c.title}</strong><p>${c.body}</p></button>`).join("");

  // ── Spotlights ──────────────────────────────────────────────────
  if (surpriseGrid) surpriseGrid.innerHTML = [
    { title:"Daily brief",     body:`${dailyQuest.title} is live. Correct answer earns +${dailyQuest.points} pts.`, cta:"Open today's question", page:"home" },
    { title:"Category sprint", body:`${category.title} has ${category.lessons.length} lessons waiting.`, cta:"Open lessons", page:"learn" },
    { title:"Pioneer Hub",     body:"Explore Pi phases, mining FAQ, ecosystem apps, and the Pi knowledge quiz.", cta:"Open Pioneer Hub", page:"pioneer" },
    { title:"Reward runway",   body:nextReward?`${nextReward.need-state.points} more pts unlocks ${nextReward.title}.`:"Every reward tier is unlocked.", cta:"See rewards", page:"rewards" },
    { title:"Premium packs",   body:`${premiumPacks.length} optional Pi learning services with clear outcomes and fair pricing.`, cta:"See premium", page:"rewards" },
    { title:"Your rank",       body:`You are ${rank.label} — ${rank.desc}`, cta:"View Pioneer Hub", page:"pioneer" },
  ].map(c => `<button class="spotlight-card" data-open-page="${c.page}" type="button"><strong>${c.title}</strong><p>${c.body}</p><span>${c.cta} →</span></button>`).join("");

  // ── Challenge card ──────────────────────────────────────────────
  if (challengeCard) challengeCard.innerHTML = `
    <p class="quest-label">Bonus flow</p>
    <h3>${category.title} combo challenge</h3>
    <p>Complete the daily brief, then answer one lesson and visit the Pioneer Hub to turn one visit into a full learning win.</p>
    <strong>Worth up to ${dailyQuest.points + 45} pts today</strong>
    <p class="challenge-note">Pairing a daily answer with a lesson and Pi knowledge visit makes the topic stick better.</p>`;

  // ── Tomorrow card ───────────────────────────────────────────────
  if (tomorrowCard) tomorrowCard.innerHTML = `
    <p class="quest-label">Return loop</p>
    <h3>${dailyDone ? "A new daily brief unlocks tomorrow" : "Today's brief is still waiting"}</h3>
    <p>${dailyDone ? `Questora will rotate a new ${category.title} brief and a fresh reason to earn tomorrow.` : "Finish today's brief so tomorrow's comeback feels stronger and the streak stays protected."}</p>
    <strong>${nextReward ? `Next reward in ${Math.max(0,nextReward.need-state.points)} pts` : "Current reward ladder complete"}</strong>
    <p class="challenge-note">${dailyDone ? "Come back for a fresh question, new visual drop, and next reward push." : "Answer today's question first, then return tomorrow for the next brief."}</p>`;

  // ── Next unlock ─────────────────────────────────────────────────
  if (nextGrid) nextGrid.innerHTML = [
    { label:"Reward path",    title:nextReward?nextReward.title:"All rewards open",                           body:nextReward?`${nextReward.need-state.points} more pts unlock ${nextReward.value}.`:"You have reached the current reward ceiling." },
    { label:"Claim record",   title:claimable>=100?"Claim record ready":"Build claim record",                  body:claimable>=100?`${claimable} pts ready for payout review.`:`Reach 100 fresh pts for a claim record. You have ${claimable}.` },
    { label:"Pioneer rank",   title:`${rank.label} — ${rank.icon}`,                                           body:rank.desc },
  ].map(c => `<article class="next-card"><p class="eyebrow">${c.label}</p><strong>${c.title}</strong><p>${c.body}</p></article>`).join("");

  // ═══════════════════════════════════════════════════════════
  // PIONEER HUB
  // ═══════════════════════════════════════════════════════════

  // ── Rank grid ──────────────────────────────────────────────────
  if (rankGrid) rankGrid.innerHTML = pioneerRanks.map(r => {
    const isCurrent = r.key === rank.key;
    const progress  = isCurrent ? Math.min(100, Math.max(0, Math.round(((state.points - r.min) / (r.max - r.min)) * 100))) : (state.points >= r.min ? 100 : 0);
    return `<article class="rank-info-card${isCurrent?" current":""}">
      <div class="rank-label">${r.icon}</div>
      <strong>${r.label}</strong>
      <p>${r.desc}</p>
      <span class="rank-pts">${r.min}${r.max===Infinity?"+":` – ${r.max}`} pts</span>
      <div class="rank-progress"><span style="width:${progress}%"></span></div>
    </article>`;
  }).join("");

  // ── Pi phases ──────────────────────────────────────────────────
  if (piPhaseGrid) piPhaseGrid.innerHTML = piPhases.map(ph =>
    `<article class="pi-phase-card${ph.active?" active":""}">
      <div class="pi-phase-number">${ph.num}</div>
      <strong>${ph.label}</strong>
      <p>${ph.desc}</p>
      <span class="pi-phase-tag">${ph.tag}</span>
    </article>`
  ).join("");

  // ── Pi apps grid ───────────────────────────────────────────────
  if (piAppsGrid) piAppsGrid.innerHTML = piApps.map(a =>
    `<article class="pi-app-card"><div class="pi-app-icon">${a.icon}</div><strong>${a.name}</strong><p>${a.desc}</p></article>`
  ).join("");

  // ── Pi utility guide ───────────────────────────────────────────
  if (piUtilityGrid) {
    const doneCount = piUtilitySteps.filter((_, i) => state.claimed[`utility-${i}`]).length;
    if (utilityPill) utilityPill.textContent = `${doneCount}/${piUtilitySteps.length} done`;
    piUtilityGrid.innerHTML = piUtilitySteps.map((step, i) => {
      const done = !!state.claimed[`utility-${i}`];
      return `<article class="pi-utility-card${done?" done":""}">
        <div class="pi-utility-num">${done?"✓":i+1}</div>
        <div><strong>${step.title}</strong><p>${step.desc}</p></div>
        ${!done ? `<button style="margin-left:auto;padding:7px 14px;background:var(--pi-purple);color:#fff;border-radius:999px;font-size:.8rem;font-weight:800" data-utility="${i}" type="button">Mark done +15 pts</button>` : ""}
      </article>`;
    }).join("");
  }

  // ── Pi knowledge quiz ──────────────────────────────────────────
  if (piQuizCard) piQuizCard.innerHTML = `
    <p class="quest-label">Pi Network quiz</p>
    <h3>${piQuiz.q}</h3>
    <p class="quiz-meta">Earn +${piQuiz.pts} pts for a correct answer</p>
    <div style="display:grid;gap:7px">
      ${piQuiz.answers.map((a,i) => {
        let cls = "answer";
        if (piQuizAnswered) { if (i === piQuiz.correct) cls += " correct"; else if (i === state.piQuizAnswers[piQuiz.q] && i !== piQuiz.correct) cls += " wrong"; }
        return `<button class="${cls}" data-pi-quiz-answer="${i}" type="button"${piQuizAnswered?" disabled":""}>${a}</button>`;
      }).join("")}
    </div>
    ${piQuizAnswered ? `<div class="pi-quiz-result${piQuizCorrect?"":" wrong-result"}"><strong>${piQuizCorrect?"Correct!":"Not quite"}</strong><p>${piQuiz.explain}</p></div>` : ""}`;

  // ── Pi safety list ─────────────────────────────────────────────
  if (piSafetyList) piSafetyList.innerHTML = piSafetyRules.map(r =>
    `<article class="pi-utility-card">
      <div class="pi-utility-num">${r.icon}</div>
      <div><strong>${r.title}</strong><p>${r.desc}</p></div>
    </article>`
  ).join("");

  // ── Mining FAQ ─────────────────────────────────────────────────
  if (miningFaqEl) miningFaqEl.innerHTML = miningFaq.map(item =>
    `<article class="mission-step">
      <span>?</span>
      <div><strong>${item.q}</strong><p>${item.a}</p></div>
    </article>`
  ).join("");

  // ═══════════════════════════════════════════════════════════
  // REWARDS
  // ═══════════════════════════════════════════════════════════

  // ── Reward tiers ───────────────────────────────────────────────
  if (rewardGrid) rewardGrid.innerHTML = rewards.map(r => {
    const unlocked = state.points >= r.need;
    const progress = Math.min(100, Math.round((state.points / r.need) * 100));
    return `<article class="reward-card${unlocked?" unlocked":""}">
      <p class="eyebrow">${unlocked?"Unlocked":"In progress"}</p>
      <strong>${r.title}</strong><p>${r.value}</p>
      <div class="reward-meter"><span style="width:${progress}%"></span></div>
      <span>${unlocked?"Unlocked":r.need-state.points+" pts left"}</span>
    </article>`;
  }).join("");

  // ── Reward center ──────────────────────────────────────────────
  if (rewardCenterGrid) rewardCenterGrid.innerHTML = [
    { label:"Reward energy", title:`${state.points} pts total`,    body:`${record.completedDays} daily wins and ${completedLessons} lesson unlocks.`, tone:"purple" },
    { label:"Current level", title:`Level ${level}`,               body:unlockedRewards?`${unlockedRewards} reward tier${unlockedRewards>1?"s":""} unlocked.`:"First reward tier still ahead.", tone:"blue" },
    { label:"Next target",   title:nextReward?nextReward.title:"All open", body:nextReward?`${nextReward.need-state.points} pts to unlock ${nextReward.value}.`:"All reward tiers open.", tone:"gold" },
    { label:"Review queue",  title:claimable>=100?"Ready to record":"Build more first", body:claimable>=100?`${claimable} pts ready for a review record.`:`Need 100+ pts. You have ${claimable}.`, tone:claimable>=100?"green":"purple" },
  ].map(c => `<article class="reward-center-card ${c.tone}"><p class="eyebrow">${c.label}</p><strong>${c.title}</strong><p>${c.body}</p></article>`).join("");

  // ── Reward journey ─────────────────────────────────────────────
  if (rewardJourneyGrid) rewardJourneyGrid.innerHTML = [
    { title:"Earn from action", body:"Daily answers, lessons, visual tasks, and tools all contribute.", state:"live" },
    { title:unlockedRewards?"Unlock reached":"Next unlock ahead", body:unlockedRewards?`${unlockedRewards} tier${unlockedRewards>1?"s":""} already open.`:"First reward tier still ahead.", state:unlockedRewards?"done":"active" },
    { title:claimable>=100?"Review record available":"Build review record", body:claimable>=100?`${claimable} pts ready for review.`:"Keep going until 100+ pts are ready.", state:claimable>=100?"done":"active" },
    { title:"Next reward target", body:nextReward?`${nextReward.need-state.points} more pts unlock ${nextReward.title}.`:"All tiers open — focus on record quality.", state:"live" },
  ].map(c => `<article class="reward-journey-card ${c.state}"><strong>${c.title}</strong><p>${c.body}</p></article>`).join("");

  // ── Wallet ─────────────────────────────────────────────────────
  if (walletClaimAmount) walletClaimAmount.textContent = `${claimable} points ready`;
  if (claimWalletButton) claimWalletButton.disabled = claimable < 100;

  // ── Claim history ──────────────────────────────────────────────
  if (claimHistoryList) claimHistoryList.innerHTML = state.walletClaims.length
    ? [...state.walletClaims].reverse().map((c, i) =>
        `<article class="claim-history-card"><strong>Payout review ${state.walletClaims.length - i}</strong><p>${c.points} pts recorded on ${c.date}.</p><span>Kept separate from Pi payments so premium purchases stay clear.</span></article>`
      ).join("")
    : `<article class="claim-history-card empty"><strong>No payout review records yet</strong><p>Earn at least 100 fresh points, then create your first review record here.</p></article>`;

  // ── Premium ────────────────────────────────────────────────────
  if (premiumGrid) premiumGrid.innerHTML = premiumPacks.map(p =>
    `<button class="premium-card${p.key===state.selectedPremium?" active":""}" data-premium="${p.key}" type="button"><strong>${p.title}</strong><p>${p.audience}</p><span>${p.price} premium service</span></button>`
  ).join("");

  const selectedPack  = premiumPacks.find(p => p.key === state.selectedPremium) || premiumPacks[0];
  const packUnlocked  = !!state.premiumUnlocks[selectedPack.key];
  if (premiumComparePill) premiumComparePill.textContent = selectedPack.title;

  if (premiumCompareGrid) premiumCompareGrid.innerHTML = [
    { label:"What opens",    title:selectedPack.title,                    body:selectedPack.body,                                                   tone:"gold" },
    { label:"What stays free",title:"Daily learning still works",         body:"Daily questions, lessons, visual tasks, and reward progress stay free.", tone:"blue" },
    { label:"Why Pi",        title:packUnlocked?"Already unlocked":"Optional upgrade", body:packUnlocked?"Access is open on this device.":"Free learning proves value first. Then premium deepens it.", tone:"purple" },
    { label:"Pi payment",    title:`${selectedPack.price} service unlock`,body:"Pi payment follows the secure backend flow: approve → blockchain → complete.", tone:"green" },
  ].map(c => `<article class="premium-compare-card ${c.tone}"><p class="eyebrow">${c.label}</p><strong>${c.title}</strong><p>${c.body}</p></article>`).join("");

  if (premiumGuideGrid) premiumGuideGrid.innerHTML = [
    { title:"Free value first",  body:"Users should trust the free learning loop before thinking about spending Pi.", tone:"base" },
    { title:unlockedRewards?"Premium now has context":"Premium should stay informative", body:unlockedRewards?"The user already sees real value, so deeper learning feels reasonable.":"Until rewards and lessons feel solid, premium should remain informative.", tone:unlockedRewards?"strong":"base" },
    { title:claimable>=100?"User is engaged enough":"Keep building interest", body:claimable>=100?"This learner has enough activity to compare premium as an upgrade.":"More earned progress will make premium feel more credible.", tone:claimable>=100?"strong":"base" },
  ].map(c => `<article class="premium-guide-card ${c.tone}"><strong>${c.title}</strong><p>${c.body}</p></article>`).join("");

  if (premiumStatusGrid) premiumStatusGrid.innerHTML = [
    { label:"Service value",  title:packUnlocked?"Unlocked and readable":"Worth paying only if useful", body:packUnlocked?`${selectedPack.title} is open with premium pages.`:`${selectedPack.price} unlocks a specific outcome.`, tone:packUnlocked?"green":"gold" },
    { label:"User state",     title:state.user?"Pi connected":"Connect first",  body:state.user?"This user can request a Pi payment when ready.":"Pi Browser connection needed before payment.", tone:state.user?"blue":"purple" },
    { label:"Payment route",  title:"Pi demo flow aligned",                     body:"Questora uses approve → blockchain → complete before treating access as unlocked.", tone:"blue" },
  ].map(c => `<article class="premium-compare-card ${c.tone}"><p class="eyebrow">${c.label}</p><strong>${c.title}</strong><p>${c.body}</p></article>`).join("");

  if (premiumDetail) premiumDetail.innerHTML = `
    <div class="premium-detail-card">
      <p class="quest-label">${packUnlocked?"Service unlocked":"Service preview"}</p>
      <h3>${selectedPack.title}</h3><p>${selectedPack.body}</p>
      <div class="premium-detail-meta"><span>${selectedPack.price}</span><span>${packUnlocked?"Unlocked":"Optional Pi payment"}</span><span>${selectedPack.lessons.length} guided pages</span></div>
      <article class="premium-insight-card"><strong>What this service includes</strong><ul>${selectedPack.includes.map(i=>`<li>${i}</li>`).join("")}</ul></article>
      <article class="premium-insight-card"><strong>What you should gain</strong><ul>${selectedPack.outcomes.map(o=>`<li>${o}</li>`).join("")}</ul></article>
      <div class="premium-page-grid">${selectedPack.lessons.map((l,i)=>`<article class="premium-page-card"><p class="eyebrow">Page ${i+1}</p><strong>${l.title}</strong><p>${l.hint}</p><span>${l.action}</span></article>`).join("")}</div>
      <button type="button" id="premiumAccessButton"${packUnlocked?" disabled":""}>${packUnlocked?"Service already unlocked":`Pay ${selectedPack.price} with Pi to unlock`}</button>
    </div>`;

  if (premiumHistoryList) premiumHistoryList.innerHTML = state.premiumHistory.length
    ? state.premiumHistory.map(e => `<article class="claim-history-card"><strong>${e.service}</strong><p>${e.status} — ${e.amount} on ${e.date}</p><span>${e.note}</span></article>`).join("")
    : `<article class="claim-history-card empty"><strong>No premium activity yet</strong><p>When you open, approve, or complete a Pi payment, Questora records it here.</p></article>`;

  // ── Leaderboard ────────────────────────────────────────────────
  if (leaderboardGrid) {
    const leaders = buildLeaderboard(state.points);
    const rankIcons = ["🥇","🥈","🥉"];
    leaderboardGrid.innerHTML = leaders.map((p, i) =>
      `<div class="leaderboard-row"><span class="leaderboard-rank ${["first","second","third"][i]||""}">${rankIcons[i]||i+1}</span><span class="leaderboard-name">${p.name}</span><span class="leaderboard-pts">${p.pts} pts</span></div>`
    ).join("");
  }

  // ═══════════════════════════════════════════════════════════
  // STORE
  // ═══════════════════════════════════════════════════════════

  // ── Store page ─────────────────────────────────────────────
  const ownedCount = premiumPacks.filter(p => state.premiumUnlocks[p.key]).length;

  // Quick tile sub-label
  const qss = document.getElementById("quickStoreSub");
  if (qss) qss.textContent = `${ownedCount} pack${ownedCount !== 1 ? "s" : ""} owned`;

  // Masthead owned badge
  const storeOwnedBadge = document.getElementById("storeOwnedBadge");
  if (storeOwnedBadge) {
    storeOwnedBadge.textContent = ownedCount > 0 ? `${ownedCount} owned` : "10 services";
    storeOwnedBadge.hidden = false;
  }

  // Status bar
  const storeStatusIcon = document.getElementById("storeStatusIcon");
  const storeStatusText = document.getElementById("storeStatusText");
  if (storeStatusIcon && storeStatusText) {
    if (state.user) {
      storeStatusIcon.textContent = "🟢";
      storeStatusText.textContent = `Connected as @${state.userName} — Pi payments ready`;
    } else {
      storeStatusIcon.textContent = "⚪";
      storeStatusText.textContent = "Open in Pi Browser to purchase with Pi";
    }
  }

  // Owned library
  const ownedPane = document.getElementById("ownedPacksPane");
  const ownedGrid = document.getElementById("ownedPacksGrid");
  const ownedPill = document.getElementById("ownedPill");
  if (ownedPane && ownedGrid) {
    const ownedPacks = premiumPacks.filter(p => state.premiumUnlocks[p.key]);
    ownedPane.style.display = ownedPacks.length ? "" : "none";
    if (ownedPill) ownedPill.textContent = `${ownedPacks.length} owned`;
    const tagIcons = { safety:"🛡️", money:"💰", stem:"🔬", pi:"π", learning:"📚", coaching:"🎯", mining:"⛏️", family:"👨‍👩‍👧‍👦" };
    ownedGrid.innerHTML = ownedPacks.map(p =>
      `<div class="owned-card">
        <div class="owned-card-icon">${tagIcons[p.category] || "✅"}</div>
        <div class="owned-card-text">
          <strong>${p.title}</strong>
          <span>✅ Active · ${p.price}</span>
        </div>
      </div>`
    ).join("");
  }

  // Category filter tabs
  const storeFilter    = document.getElementById("storeFilter");
  const allPacksGrid   = document.getElementById("allPacksGrid");
  const allPacksPill   = document.getElementById("allPacksPill");
  const storeFilterKey = state._storeFilter || "all";
  const tags = ["all", ...new Set(premiumPacks.map(p => p.tag))];
  if (storeFilter) {
    storeFilter.innerHTML = tags.map(t =>
      `<button class="store-tab${storeFilterKey === t ? " active" : ""}" data-store-filter="${t}" role="tab" aria-selected="${storeFilterKey === t}" type="button">${t === "all" ? "All Services" : t}</button>`
    ).join("");
  }

  // Service catalog cards
  if (allPacksGrid) {
    const filtered = storeFilterKey === "all" ? premiumPacks : premiumPacks.filter(p => p.tag === storeFilterKey);
    if (allPacksPill) allPacksPill.textContent = `${filtered.length} of ${premiumPacks.length}`;
    const tagIcons = { safety:"🛡️", money:"💰", stem:"🔬", pi:"π", learning:"📚", coaching:"🎯", mining:"⛏️", family:"👨‍👩‍👧‍👦" };
    allPacksGrid.innerHTML = filtered.map(p => {
      const owned = !!state.premiumUnlocks[p.key];
      const cat   = p.category || "pi";
      return `<article class="service-card${owned ? " owned" : ""}">
        <div class="service-card-stripe ${cat}"></div>
        <div class="service-card-body">
          <div class="service-card-head">
            <span class="service-tag ${cat}">${tagIcons[cat] || ""} ${p.tag}</span>
            <span class="service-price${owned ? " owned-label" : ""}">${owned ? "✅ Owned" : p.price}</span>
          </div>
          <h3 class="service-card-title">${p.title}</h3>
          <p class="service-card-desc">${p.audience}</p>
          <ul class="service-outcomes">
            ${p.outcomes.slice(0, 2).map(o => `<li>${o}</li>`).join("")}
          </ul>
          <button class="service-cta${owned ? " owned-cta" : ""}" data-pay-pack="${p.key}" type="button">
            ${owned ? "✅ View your pack" : `Pay ${p.price} with Pi`}
          </button>
        </div>
      </article>`;
    }).join("");
  }

  // Home featured banner
  const featuredBanner = document.getElementById("featuredPackBanner");
  if (featuredBanner) {
    const featuredPack = premiumPacks.find(p => !state.premiumUnlocks[p.key]) || premiumPacks[0];
    featuredBanner.innerHTML = `<div class="fpb-inner"><span class="fpb-icon">✨</span><div><strong>${featuredPack.title}</strong><p>${featuredPack.price} · ${featuredPack.tag}</p></div><button style="padding:7px 14px;background:var(--pi-purple);color:#fff;border-radius:999px;font-size:.78rem;font-weight:800;border:none;cursor:pointer;flex-shrink:0" data-page-target="store" type="button">Browse</button></div>`;
  }

  // Payment history
  const storeHistoryList = document.getElementById("premiumHistoryList");
  const storeHistoryPill = document.getElementById("storeHistoryPill");
  if (storeHistoryList) {
    if (storeHistoryPill) storeHistoryPill.textContent = `${state.premiumHistory.length} records`;
    const tagIcons2 = { safety:"🛡️", money:"💰", stem:"🔬", pi:"π", learning:"📚", coaching:"🎯", mining:"⛏️", family:"👨‍👩‍👧‍👦" };
    storeHistoryList.innerHTML = state.premiumHistory.length
      ? state.premiumHistory.map(e => {
          const pack = premiumPacks.find(p => p.title === e.service);
          const icon = pack ? (tagIcons2[pack.category] || "π") : "π";
          return `<div class="history-entry">
            <div class="history-entry-icon">${icon}</div>
            <div class="history-entry-text">
              <strong>${e.service}</strong>
              <p>${e.status} · ${e.amount} · ${e.date}</p>
            </div>
          </div>`;
        }).join("")
      : `<div class="history-empty">No payment activity yet.<br>Purchases made with Pi appear here.</div>`;
  }

  // ═══════════════════════════════════════════════════════════
  // PROFILE
  // ═══════════════════════════════════════════════════════════
  if (profileGrid) profileGrid.innerHTML = [
    { label:"Identity",    title:`${state.age} • ${state.goal}`,        body:`${state.country} and ${state.language} shape your Questora experience.`, tone:"purple" },
    { label:"Consistency", title:`${record.completedDays} daily wins`,  body:state.streak?`Current streak: ${state.streak} day${state.streak>1?"s":""}.`:"The next daily win starts your streak.", tone:"green" },
    { label:"Progress",    title:`${completedLessons} lesson rewards`,  body:unlockedRewards?`${unlockedRewards} reward tier${unlockedRewards>1?"s":""} open at Level ${level}.`:`Level ${level} building toward first reward tier.`, tone:"blue" },
    { label:"Rank",        title:`${rank.icon} ${rank.label}`,          body:rank.desc, tone:"gold" },
  ].map(c => `<article class="profile-card ${c.tone}"><p class="eyebrow">${c.label}</p><strong>${c.title}</strong><p>${c.body}</p></article>`).join("");

  if (profileSummaryGrid) profileSummaryGrid.innerHTML = [
    { label:"Points",   title:`${state.points} pts`,         body:`Level ${level} · ${unlockedRewards} rewards unlocked` },
    { label:"Streak",   title:`${state.streak} day${state.streak!==1?"s":""}`, body:`${record.completedDays} total daily wins` },
    { label:"Lessons",  title:`${completedLessons} done`,    body:`Across ${categories.length} learning categories` },
    { label:"Pi rank",  title:`${rank.icon} ${rank.label}`,  body:rank.desc },
  ].map(c => `<article class="dashboard-card"><p class="eyebrow" style="font-size:.7rem">${c.label}</p><strong>${c.title}</strong><p>${c.body}</p></article>`).join("");

  if (referralCard) referralCard.innerHTML = `
    <article class="mission-step">
      <span>π</span>
      <div>
        <strong>Your Pioneer code</strong>
        <p>Share Questora with your Security Circle. Each Pioneer who joins and completes their first daily quest earns you +50 bonus points.</p>
        <button style="margin-top:10px;padding:9px 16px;background:var(--pi-gold);color:#1a1338;border-radius:999px;font-weight:900;font-size:.85rem" data-copy-referral="true" type="button">Copy invite link</button>
      </div>
    </article>`;

  renderPages();
}

// ── Pi SDK helpers ─────────────────────────────────────────────────
function initPiSdk() {
  if (!window.Pi) return false;
  try { window.Pi.init({ version:"2.0", sandbox:PI_SANDBOX }); return true; }
  catch (e) { console.warn("Pi SDK init skipped", e); return true; }
}

async function postToBackend(endpoint, body) {
  try {
    const res  = await fetch(endpoint, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = { raw:text }; }
    return { ok:res.ok, status:res.status, data };
  } catch (e) {
    console.info("Backend not ready", endpoint, e);
    return { ok:false, status:0, data:{ error:"Backend endpoint not ready." } };
  }
}

function rememberPremiumEvent(pack, status, note, extra={}) {
  state.premiumHistory.unshift({ serviceKey:pack.key, service:pack.title, amount:pack.price, status, note, date:new Date().toLocaleString(), ...extra });
  state.premiumHistory = state.premiumHistory.slice(0, 12);
}

async function connectWithPi() {
  if (!initPiSdk()) {
    explain("Pi SDK is not available here.", "Open Questora in Pi Browser so authentication can pair with Pi.");
    return;
  }
  try {
    const authResult = await window.Pi.authenticate(["username","payments"], payment => {
      console.info("Incomplete Pi payment found", payment);
      postToBackend(BACKEND_ENDPOINTS.incomplete, { payment });
    });
    state.user      = authResult.user;
    state.accessToken = authResult.accessToken;
    state.userName  = state.user.username;
    userRecord();
    const verified  = await postToBackend(BACKEND_ENDPOINTS.signin, { authResult });
    saveState(); render();
    if (loginButton) loginButton.innerHTML = `<span>π</span> Connected as ${state.userName}`;
    explain(
      verified.ok ? `Verified as ${state.userName}.` : `Connected as ${state.userName} — backend verification pending.`,
      verified.ok ? "Continue learning and earning rewards." : "Add /api/signin to verify with Pi Platform API.",
    );
  } catch (e) {
    console.error(e);
    explain("Pi login was not completed.", "Try again inside Pi Browser.");
  }
}

function _paymentOverlay(show, title, msg) {
  const ov = document.getElementById("paymentOverlay");
  const ot = document.getElementById("paymentOverlayTitle");
  const om = document.getElementById("paymentOverlayMsg");
  if (!ov) return;
  if (show) {
    if (ot) ot.textContent = title || "Confirming payment…";
    if (om) om.textContent = msg   || "Contacting Pi Platform…";
    ov.hidden = false;
  } else {
    ov.hidden = true;
  }
}

function paymentCallbacks(pack) {
  return {
    // Fires when Pi SDK has a paymentId — send to backend for approval
    onReadyForServerApproval: async paymentId => {
      _paymentOverlay(true, `Approving ${pack.price}`, "Checking payment with Pi Platform…");
      const result = await postToBackend(BACKEND_ENDPOINTS.approve, { paymentId, packKey:pack.key, amount:pack.amount });
      rememberPremiumEvent(pack, result.ok?"Approved":"Approval pending", result.ok?"Backend approved the payment.":"Check backend logs.", { paymentId });
      saveState(); renderInPlace();
    },
    // Fires after user submits tx to blockchain — send paymentId + txid to backend
    onReadyForServerCompletion: async (paymentId, txid) => {
      _paymentOverlay(true, "Completing payment…", "Confirming on Pi blockchain…");
      const result = await postToBackend(BACKEND_ENDPOINTS.complete, { paymentId, txid, packKey:pack.key, amount:pack.amount });
      _paymentOverlay(false);
      if (result.ok) {
        state.premiumUnlocks[pack.key] = { paymentId, txid, date:todayKey, title:pack.title };
        rememberPremiumEvent(pack, "Unlocked", "Payment completed and service opened.", { paymentId, txid });
        saveState(); renderInPlace();
        showToast(`✅ ${pack.title} unlocked!`, "success", 4000);
        explain(`${pack.title} is now unlocked.`, "Open the premium card to read your learning pages.");
        return;
      }
      rememberPremiumEvent(pack, "Completion pending", "Payment reached backend but completion was not confirmed.", { paymentId, txid });
      saveState(); renderInPlace();
      showToast("Payment pending — check history", "info", 4000);
    },
    // Fires when user cancels in Pi Browser — or no approval within 60 s
    onCancel: paymentId => {
      _paymentOverlay(false);
      rememberPremiumEvent(pack, "Cancelled", "User cancelled the Pi payment.", { paymentId });
      saveState(); renderInPlace();
      showToast("Payment cancelled", "error", 2500);
    },
    // Fires on any SDK error
    onError: (error, payment) => {
      _paymentOverlay(false);
      console.error("Pi payment error", error, payment);
      rememberPremiumEvent(pack, "Error", "Pi payment returned an error.", { paymentId:payment?.identifier });
      saveState(); renderInPlace();
      showToast("Payment error — try again", "error", 3000);
    },
  };
}

async function requestPremiumPayment(pack) {
  if (!initPiSdk()) { showToast("Open in Pi Browser for payments", "error", 3000); return; }
  if (!state.user)  { showToast("Connect Pi account first", "error", 3000); return; }
  if (state.premiumUnlocks[pack.key]) { showToast(`${pack.title} is already unlocked`, "info", 2500); return; }
  if (!PI_PAYMENTS_ENABLED) { showToast("Payments disabled in this build", "error", 3000); return; }

  rememberPremiumEvent(pack, "Started", "User opened the Pi payment flow.");
  saveState(); renderInPlace();

  // Pi.createPayment is void — it opens the Pi Browser payment sheet natively.
  // Do NOT wrap in try/finally to hide an overlay here (it would hide immediately).
  // Overlay is shown/hidden inside the callbacks instead.
  window.Pi.createPayment(
    { amount: pack.amount, memo: `Questora: ${pack.title}`, metadata: { packKey: pack.key, type: "premium-service" } },
    paymentCallbacks(pack)
  );
}

// ── Answer handlers ────────────────────────────────────────────────
function markAnswers(container, selector, picked, correct) {
  container.querySelectorAll(selector).forEach(btn => {
    const idx = Number(btn.dataset.index ?? btn.dataset.dailyAnswer);
    btn.classList.remove("correct","wrong");
    if (idx === correct) btn.classList.add("correct");
    if (idx === picked && picked !== correct) btn.classList.add("wrong");
  });
}

function answerDaily(index) {
  const category  = currentCategory();
  const quest     = currentDailyQuest(category);
  const record    = userRecord();
  if (record.lastDailyDate === todayKey) { explain("Today's quest is already done.", "Come back tomorrow for a new daily reward."); return; }
  if (index !== quest.correct) {
    markAnswers(dailyAnswerGrid,"[data-daily-answer]",index,quest.correct);
    if (dailyAnswerGridTop) markAnswers(dailyAnswerGridTop,"[data-daily-answer]",index,quest.correct);
    if (dailyFeedback)    dailyFeedback.textContent    = "Not quite. Read the lesson and try the green answer.";
    if (dailyFeedbackTop) dailyFeedbackTop.textContent = "Not quite. Read the lesson and try the green answer.";
    return;
  }
  markAnswers(dailyAnswerGrid,"[data-daily-answer]",index,quest.correct);
  if (dailyAnswerGridTop) markAnswers(dailyAnswerGridTop,"[data-daily-answer]",index,quest.correct);
  record.lastDailyDate = todayKey;
  record.completedDays++;
  state.streak++;
  addPoints(quest.points, `Daily quest complete. +${quest.points} pts saved.`);
}

function answerLesson(key, index) {
  if (state.answered[key]) { explain("Lesson already complete.", "Choose another lesson."); return; }
  const [ck, lk] = key.split("::");
  const cat  = categories.find(c => c.key === ck);
  const lesson = cat?.lessons.find(l => l.key === lk);
  if (!lesson) return;
  if (index !== lesson.correct) {
    const row = lessonGrid.querySelector(`[data-lesson="${key}"][data-index="${index}"]`);
    if (row) { row.classList.add("wrong"); setTimeout(() => row.classList.remove("wrong"), 900); }
    return;
  }
  lessonGrid.querySelectorAll(`[data-lesson="${key}"]`).forEach((btn, _, all) => {
    btn.classList.remove("correct","wrong");
    if (Number(btn.dataset.index) === lesson.correct) btn.classList.add("correct");
    btn.disabled = true;
  });
  state.answered[key] = true;
  userRecord().completedLessons.push(key);
  addPoints(lesson.points, `${lesson.reward} unlocked. +${lesson.points} pts.`);
}

function answerVisual(taskKey, index) {
  const task = aiArtLibrary.find(t => t.key === taskKey);
  const key  = `visual::${taskKey}`;
  if (!task || state.answered[key]) { explain("Visual task already complete.", "Continue to another image."); return; }
  if (index !== task.correct) {
    const btn = visualGrid.querySelector(`[data-visual="${taskKey}"][data-index="${index}"]`);
    if (btn) { btn.classList.add("wrong"); setTimeout(() => btn.classList.remove("wrong"), 900); }
    return;
  }
  visualGrid.querySelectorAll(`[data-visual="${taskKey}"]`).forEach(btn => {
    if (Number(btn.dataset.index) === task.correct) btn.classList.add("correct");
    btn.disabled = true;
  });
  state.answered[key] = true;
  addPoints(task.points, `${task.lesson} +${task.points} pts.`);
}

function answerPiQuiz(index) {
  const quiz = todayPiQuiz();
  if (state.piQuizAnswers[quiz.q] !== undefined) return;
  state.piQuizAnswers[quiz.q] = index;
  if (index === quiz.correct) {
    addPoints(quiz.pts, `Pi knowledge correct. +${quiz.pts} pts.`);
  } else {
    saveState(); renderInPlace();
    explain("Not quite.", quiz.explain);
  }
}

// ── Event delegation ───────────────────────────────────────────────
if (loginButton) loginButton.addEventListener("click", connectWithPi);

document.addEventListener("click", e => {
  // page tabs
  const pt = e.target.closest("[data-page-target]");
  if (pt) { openPage(pt.dataset.pageTarget); return; }

  // daily answers (both learn page and quest hero)
  const da = e.target.closest("[data-daily-answer]");
  if (da) { answerDaily(Number(da.dataset.dailyAnswer)); return; }

  // lesson answers
  const la = e.target.closest("[data-lesson]");
  if (la) { answerLesson(la.dataset.lesson, Number(la.dataset.index)); return; }

  // visual answers
  const va = e.target.closest("[data-visual]");
  if (va) { answerVisual(va.dataset.visual, Number(va.dataset.index)); return; }

  // ethics
  const ea = e.target.closest("[data-ethics]");
  if (ea) {
    const firstAnswer = state.ethics[ea.dataset.ethics] === undefined;
    state.ethics[ea.dataset.ethics] = Number(ea.dataset.value);
    if (firstAnswer) addPoints(10, "Reflection saved. +10 pts.");
    else { saveState(); renderInPlace(); }
    return;
  }

  // tools
  const ta = e.target.closest("[data-tool]");
  if (ta) {
    const key = ta.dataset.tool;
    if (state.claimed[key]) { explain("Tool already used.", "Try another tool."); return; }
    state.claimed[key] = true;
    userRecord().completedTools.push(key);
    addPoints(Number(ta.dataset.points), `Tool completed. +${ta.dataset.points} pts.`);
    return;
  }

  // boosters
  const ba = e.target.closest("[data-booster]");
  if (ba) {
    const key = `booster-${ba.dataset.booster}`;
    if (state.claimed[key]) { explain("Booster already claimed today.", "Come back tomorrow."); return; }
    state.claimed[key] = true;
    addPoints(Number(ba.dataset.points), `Booster claimed. +${ba.dataset.points} pts.`);
    return;
  }

  // Pi quiz
  const pqa = e.target.closest("[data-pi-quiz-answer]");
  if (pqa) { answerPiQuiz(Number(pqa.dataset.piQuizAnswer)); return; }

  // utility steps
  const ua = e.target.closest("[data-utility]");
  if (ua) {
    const key = `utility-${ua.dataset.utility}`;
    if (state.claimed[key]) return;
    state.claimed[key] = true;
    addPoints(15, `Utility step marked done. +15 pts.`);
    return;
  }

  // category select
  const ca = e.target.closest("[data-category]");
  if (ca) {
    state.category = ca.dataset.category;
    saveState(); render();
    explain(`${currentCategory().title} loaded.`, "Answer the daily brief, then scroll through lessons.");
    return;
  }

  // premium select
  const pa = e.target.closest("[data-premium]");
  if (pa) {
    state.selectedPremium = pa.dataset.premium;
    saveState(); render();
    return;
  }

  // store filter tabs
  const sf = e.target.closest("[data-store-filter]");
  if (sf) {
    state._storeFilter = sf.dataset.storeFilter;
    renderInPlace();
    return;
  }

  // pay pack (store cards + featured)
  const ppk = e.target.closest("[data-pay-pack]");
  if (ppk) {
    const pack = premiumPacks.find(p => p.key === ppk.dataset.payPack);
    if (pack) {
      state.selectedPremium = pack.key;
      saveState();
      requestPremiumPayment(pack);
    }
    return;
  }

  // premium pay button (rewards page detail)
  if (e.target.closest("#premiumAccessButton")) {
    const pack = premiumPacks.find(p => p.key === state.selectedPremium) || premiumPacks[0];
    requestPremiumPayment(pack);
    return;
  }

  // featured lesson scroll
  const fa = e.target.closest("[data-open-featured]");
  if (fa && lessonGrid) {
    const target = lessonGrid.querySelector(`[data-lesson="${fa.dataset.openFeatured}"]`);
    if (target) target.scrollIntoView({ behavior:"smooth", block:"center" });
    return;
  }

  // open page from card
  const op = e.target.closest("[data-open-page]");
  if (op) { openPage(op.dataset.openPage); return; }

  // wallet claim
  if (e.target.closest("#claimWalletButton")) {
    const already   = state.walletClaims.reduce((s, c) => s + c.points, 0);
    const claimable = Math.max(0, state.points - already);
    if (claimable < 100) { explain("Need 100+ fresh pts for a review record.", `You have ${claimable}.`); return; }
    state.walletClaims.push({ points:claimable, date:todayKey });
    saveState(); render();
    explain("Payout review record created.", "Questora keeps reward records separate from Pi payments.");
    return;
  }

  // referral copy
  if (e.target.closest("[data-copy-referral]")) {
    navigator.clipboard?.writeText(`https://questora.vercel.app?ref=${state.userName||"pioneer"}`).then(() => {
      explain("Invite link copied.", "Share it with Pioneers in your Security Circle.");
    }).catch(() => explain("Copy invite link manually:", `questora.vercel.app?ref=${state.userName||"pioneer"}`));
    return;
  }

  // text size / contrast / reset / dark mode
  if (e.target.closest("#textSizeButton")) {
    state.largeText = !state.largeText; saveState(); renderInPlace();
    const btn = document.getElementById("textSizeButton");
    if (btn) { btn.classList.toggle("on", state.largeText); btn.textContent = state.largeText ? "On" : "Off"; btn.setAttribute("aria-checked", String(state.largeText)); }
    showToast(state.largeText ? "Aa Bigger text on" : "Aa Bigger text off", "info", 2000);
    return;
  }
  if (e.target.closest("#contrastButton")) {
    state.highContrast = !state.highContrast; saveState(); renderInPlace();
    const btn = document.getElementById("contrastButton");
    if (btn) { btn.classList.toggle("on", state.highContrast); btn.textContent = state.highContrast ? "On" : "Off"; btn.setAttribute("aria-checked", String(state.highContrast)); }
    showToast(state.highContrast ? "◑ High contrast on" : "◑ High contrast off", "info", 2000);
    return;
  }
  if (e.target.closest("#resetButton")) {
    if (!confirm("Reset ALL progress? This cannot be undone.")) return;
    Object.assign(state, { streak:0, points:0, badges:0, record:{}, claimed:{}, answered:{}, ethics:{}, walletClaims:[], premiumUnlocks:{}, premiumHistory:[], piQuizAnswers:{} });
    saveState(); render();
    showToast("↺ Progress reset", "error", 3000);
    return;
  }
});

// ── Select handlers ────────────────────────────────────────────────
if (goalSelect)     goalSelect.addEventListener("change",     () => { state.goal     = goalSelect.value;     saveState(); renderInPlace(); });
if (countrySelect)  countrySelect.addEventListener("change",  () => { state.country  = countrySelect.value;  saveState(); renderInPlace(); });
if (languageSelect) languageSelect.addEventListener("change", () => { state.language = languageSelect.value; saveState(); renderInPlace(); });
if (categorySelect) categorySelect.addEventListener("change", () => { state.category = categorySelect.value; saveState(); render(); });
choiceButtons.forEach(b => b.addEventListener("click", () => { state.age = b.dataset.age; saveState(); renderInPlace(); }));

// ── Refresh leaderboard button ─────────────────────────────────────
const refreshBtn = document.getElementById("refreshLeaderboard");
if (refreshBtn) refreshBtn.addEventListener("click", fetchAndRenderLeaderboard);

// ── Rank-up dismiss ────────────────────────────────────────────────
const rankUpDismiss = document.getElementById("rankUpDismiss");
if (rankUpDismiss) rankUpDismiss.addEventListener("click", () => {
  const ov = document.getElementById("rankUpOverlay");
  if (ov) ov.hidden = true;
});

// ── Dark mode button ───────────────────────────────────────────────
const darkModeButton = document.getElementById("darkModeButton");
if (darkModeButton) darkModeButton.addEventListener("click", () => {
  state.darkMode = !state.darkMode;
  document.documentElement.classList.toggle("dark-mode", state.darkMode);
  localStorage.setItem("questora-dark-mode", String(state.darkMode));
  darkModeButton.textContent = state.darkMode ? "☀️" : "🌙";
  showToast(state.darkMode ? "🌙 Dark mode on" : "☀️ Light mode on", "info", 2000);
});
// Restore dark mode
if (localStorage.getItem("questora-dark-mode") === "true") {
  state.darkMode = true;
  document.documentElement.classList.add("dark-mode");
  if (darkModeButton) darkModeButton.textContent = "☀️";
}

// ── Pi Browser banner dismiss ──────────────────────────────────────
const dismissBanner = document.getElementById("dismissBanner");
if (dismissBanner) dismissBanner.addEventListener("click", () => {
  const banner = document.getElementById("piBrowserBanner");
  if (banner) banner.hidden = true;
  localStorage.setItem("questora-banner-dismissed", "1");
});

// ── Payment overlay cancel ─────────────────────────────────────────
const cancelPaymentBtn = document.getElementById("cancelPaymentBtn");
if (cancelPaymentBtn) cancelPaymentBtn.addEventListener("click", () => {
  const ov = document.getElementById("paymentOverlay");
  if (ov) ov.hidden = true;
  showToast("Payment cancelled", "error", 2500);
});

// ── Sync toggle-switch UI state ────────────────────────────────────
function syncToggles() {
  const tSize = document.getElementById("textSizeButton");
  const tCon  = document.getElementById("contrastButton");
  const tDark = document.getElementById("darkModeButton");
  if (tSize) { tSize.classList.toggle("on", !!state.largeText);    tSize.textContent = state.largeText    ? "On" : "Off"; tSize.setAttribute("aria-checked", String(!!state.largeText)); }
  if (tCon)  { tCon.classList.toggle("on",  !!state.highContrast); tCon.textContent  = state.highContrast ? "On" : "Off"; tCon.setAttribute("aria-checked", String(!!state.highContrast)); }
  if (tDark) { tDark.classList.toggle("on", !!state.darkMode);     tDark.textContent = state.darkMode     ? "On" : "Off"; tDark.setAttribute("aria-checked", String(!!state.darkMode)); }
  document.documentElement.classList.toggle("high-contrast", !!state.highContrast);
  document.documentElement.classList.toggle("large-text",    !!state.largeText);
  document.documentElement.classList.toggle("dark-mode",     !!state.darkMode);
}

// ── Init ───────────────────────────────────────────────────────────
state.darkMode = localStorage.getItem("questora-dark-mode") === "true";
userRecord();
_lastRankKey = currentRank(state.points).key;
detectPiBrowser();
syncToggles();
render();
// Async post-init
setTimeout(() => {
  pingBackend();
  fetchAndRenderLeaderboard();
}, 800);
