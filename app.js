const todayKey = new Date().toISOString().slice(0, 10);
const PI_SANDBOX = location.hostname === "localhost" || location.hostname === "127.0.0.1";
const PI_PAYMENTS_ENABLED = false;
const BACKEND_ENDPOINTS = {
  signin: "/api/signin",
  approve: "/api/approve",
  complete: "/api/complete",
  incomplete: "/api/incomplete",
};

const categories = [
  {
    key: "safety",
    title: "Pi Safety",
    style: "gold",
    summary: "Protect accounts, spot scams, and use Pi apps with confidence.",
    daily: {
      title: "Spot the fake reward promise",
      body: "Safe apps explain real utility. They do not promise free Pi for every tap.",
      points: 50,
      question: "Which promise is unsafe?",
      answers: [
        "A clear quiz reward in app points",
        "Free Pi for everyone without rules",
        "A lesson badge after learning",
      ],
      correct: 1,
    },
    lessons: [
      {
        key: "passphrase",
        title: "Passphrase protection",
        body: "Your wallet passphrase is private. Real support teams should never ask for it.",
        reward: "Shield Badge",
        points: 35,
        question: "Who should know your wallet passphrase?",
        answers: ["Only you", "Any helper", "A public group"],
        correct: 0,
      },
      {
        key: "fake-airdrop",
        title: "Fake airdrop signs",
        body: "Pressure, secret links, and guaranteed rewards are common warning signs.",
        reward: "Scam Spotter",
        points: 40,
        question: "What is a warning sign?",
        answers: ["Clear terms", "Forced urgency", "Privacy policy"],
        correct: 1,
      },
      {
        key: "safe-browser",
        title: "Safe Pi Browser use",
        body: "Use official flows, check app names, and avoid unknown links.",
        reward: "Browser Pro",
        points: 30,
        question: "What should you avoid?",
        answers: ["Unknown links", "Reading rules", "Checking app details"],
        correct: 0,
      },
    ],
  },
  {
    key: "money",
    title: "Money Basics",
    style: "green",
    summary: "Practice saving, spending choices, and simple planning.",
    daily: {
      title: "Build a tiny saving habit",
      body: "Choose one small thing to save or track today before spending.",
      points: 45,
      question: "What comes first in a simple budget?",
      answers: ["Track needs", "Buy randomly", "Ignore prices"],
      correct: 0,
    },
    lessons: [
      {
        key: "needs-wants",
        title: "Needs vs wants",
        body: "Needs support daily life. Wants are nice, but should wait when money is tight.",
        reward: "Smart Saver",
        points: 35,
        question: "Which is usually a need?",
        answers: ["Food", "Luxury skin", "Random upgrade"],
        correct: 0,
      },
      {
        key: "goal-saving",
        title: "Goal saving",
        body: "A clear goal makes saving feel like progress, not punishment.",
        reward: "Goal Coin",
        points: 30,
        question: "What makes saving easier?",
        answers: ["No plan", "A clear goal", "Daily guessing"],
        correct: 1,
      },
      {
        key: "value-check",
        title: "Value check",
        body: "Before spending, ask if the item helps your goal or only gives a short feeling.",
        reward: "Value Lens",
        points: 30,
        question: "A value check asks about...",
        answers: ["Long-term use", "Peer pressure", "Fastest click"],
        correct: 0,
      },
    ],
  },
  {
    key: "health",
    title: "Healthy Habits",
    style: "blue",
    summary: "Small daily actions for energy, focus, and family wellbeing.",
    daily: {
      title: "Move for five minutes",
      body: "A short walk, stretch, or tidy-up can reset focus and mood.",
      points: 40,
      question: "What is a good daily health step?",
      answers: ["Tiny repeatable action", "One huge push only", "Skip sleep"],
      correct: 0,
    },
    lessons: [
      {
        key: "sleep",
        title: "Sleep rhythm",
        body: "Good sleep supports learning, patience, and decision making.",
        reward: "Focus Star",
        points: 30,
        question: "Sleep helps with...",
        answers: ["Focus", "Scams", "Forgetting everything"],
        correct: 0,
      },
      {
        key: "water",
        title: "Water reminder",
        body: "A simple water habit can improve energy without cost.",
        reward: "Energy Drop",
        points: 25,
        question: "A low-cost energy habit is...",
        answers: ["Drink water", "Ignore thirst", "Stay still all day"],
        correct: 0,
      },
      {
        key: "kindness",
        title: "Kindness challenge",
        body: "A helpful message, chore, or thank-you can improve a home or group.",
        reward: "Kindness Badge",
        points: 35,
        question: "A kindness quest should be...",
        answers: ["Safe and helpful", "Embarrassing", "Risky"],
        correct: 0,
      },
    ],
  },
  {
    key: "growth",
    title: "Skills & Growth",
    style: "purple",
    summary: "Learn digital skills, confidence, and useful daily productivity.",
    daily: {
      title: "Learn one useful idea",
      body: "Pick one concept, explain it simply, and turn it into action.",
      points: 50,
      question: "What proves learning happened?",
      answers: ["A small action", "Only scrolling", "Copying blindly"],
      correct: 0,
    },
    lessons: [
      {
        key: "digital-skill",
        title: "Digital skill stack",
        body: "Typing, searching, safety, and communication are global skills.",
        reward: "Skill Spark",
        points: 40,
        question: "Which is a digital skill?",
        answers: ["Safe searching", "Sharing secrets", "Clicking unknown links"],
        correct: 0,
      },
      {
        key: "confidence",
        title: "Confidence builder",
        body: "Confidence grows by finishing small tasks and seeing proof.",
        reward: "Courage Badge",
        points: 35,
        question: "Confidence grows through...",
        answers: ["Small completed tasks", "Never trying", "Only watching"],
        correct: 0,
      },
      {
        key: "focus",
        title: "Focus sprint",
        body: "A ten-minute focus block can beat waiting for perfect motivation.",
        reward: "Focus Flame",
        points: 30,
        question: "A focus sprint is...",
        answers: ["Short focused work", "Endless distraction", "No goal"],
        correct: 0,
      },
    ],
  },
  {
    key: "stem",
    title: "STEM Lab",
    style: "blue",
    summary: "Science, technology, engineering, and math for curious learners.",
    daily: {
      title: "Think like a scientist",
      body: "Observe one thing, ask why it happens, and choose a simple test.",
      points: 55,
      question: "What comes first in a good STEM investigation?",
      answers: ["Observation", "Guessing forever", "Ignoring evidence"],
      correct: 0,
    },
    lessons: [
      {
        key: "science-method",
        title: "Scientific method",
        body: "Observe, ask, predict, test, and learn from the result.",
        reward: "Lab Badge",
        points: 45,
        question: "A fair test changes...",
        answers: ["One thing at a time", "Everything at once", "Nothing ever"],
        correct: 0,
      },
      {
        key: "coding-logic",
        title: "Coding logic",
        body: "Code is a set of clear steps. Good steps are small and testable.",
        reward: "Code Spark",
        points: 45,
        question: "A program is built from...",
        answers: ["Clear steps", "Random taps", "Secret passwords"],
        correct: 0,
      },
      {
        key: "math-patterns",
        title: "Math patterns",
        body: "Patterns help us predict, compare, count, and solve problems.",
        reward: "Pattern Star",
        points: 40,
        question: "A pattern helps you...",
        answers: ["Predict what comes next", "Forget the rule", "Hide the answer"],
        correct: 0,
      },
      {
        key: "engineering-design",
        title: "Engineering design",
        body: "Engineers define a problem, build a solution, test it, and improve it.",
        reward: "Builder Badge",
        points: 45,
        question: "After testing a design, you should...",
        answers: ["Improve it", "Never change it", "Throw away learning"],
        correct: 0,
      },
      {
        key: "electrical-engineering",
        title: "Electrical engineering basics",
        body: "Electrical engineering studies circuits, power, signals, sensors, motors, and safe energy systems.",
        reward: "Circuit Badge",
        points: 50,
        question: "What does electrical engineering often work with?",
        answers: ["Circuits and power", "Unsafe wiring", "Guessing current"],
        correct: 0,
      },
    ],
  },
  {
    key: "pet",
    title: "Pet Care",
    style: "green",
    summary: "House pet ownership, daily care, kindness, hygiene, and safety.",
    daily: {
      title: "Check a pet's basic needs",
      body: "A pet needs clean water, safe food, a clean space, movement, and gentle attention.",
      points: 50,
      question: "What is part of responsible pet care?",
      answers: ["Clean water daily", "Ignoring behavior changes", "Unsafe punishment"],
      correct: 0,
    },
    lessons: [
      {
        key: "daily-feeding",
        title: "Daily feeding guide",
        body: "Use pet-safe food, regular times, clean bowls, and portions that match age and size.",
        reward: "Feeding Badge",
        points: 40,
        question: "A healthy feeding habit is...",
        answers: ["Clean bowl and safe food", "Any human snack", "No water check"],
        correct: 0,
      },
      {
        key: "pet-health",
        title: "Health watch",
        body: "Notice appetite, energy, breathing, coat, bathroom habits, and unusual behavior.",
        reward: "Care Watch",
        points: 45,
        question: "A sudden behavior change means...",
        answers: ["Pay attention", "Always ignore it", "Punish first"],
        correct: 0,
      },
      {
        key: "safe-petting",
        title: "Safe petting",
        body: "Approach calmly, avoid hurting ears or tails, and stop when the pet wants space.",
        reward: "Gentle Hands",
        points: 35,
        question: "Safe petting means...",
        answers: ["Respect signals", "Force attention", "Pull tails"],
        correct: 0,
      },
      {
        key: "clean-home",
        title: "Clean home routine",
        body: "Clean sleeping areas, litter spaces, cages, and feeding spots to protect the whole family.",
        reward: "Clean Habitat",
        points: 40,
        question: "A clean pet area helps...",
        answers: ["Pet and family health", "Spread germs", "Hide problems"],
        correct: 0,
      },
    ],
  },
];

const tools = [
  {
    key: "scam-checker",
    title: "Scam checker",
    body: "Judge a claim as safe, risky, or fake before trusting it.",
    points: 30,
  },
  {
    key: "goal-planner",
    title: "Goal planner",
    body: "Turn a weekly goal into small daily steps.",
    points: 25,
  },
  {
    key: "reward-map",
    title: "Reward map",
    body: "See what points can unlock now and what premium could unlock later.",
    points: 20,
  },
  {
    key: "family-code",
    title: "Family safety code",
    body: "Create one family rule for devices, wallets, or links.",
    points: 25,
  },
  {
    key: "stem-solver",
    title: "STEM solver",
    body: "Turn a problem into observe, test, measure, and improve.",
    points: 30,
  },
  {
    key: "pet-care-check",
    title: "Pet care checklist",
    body: "Review water, food, cleanliness, movement, and mood for a house pet.",
    points: 30,
  },
];

const rewards = [
  { key: "starter", title: "Starter Chest", need: 100, value: "Unlocks beginner tips" },
  { key: "safety", title: "Safety Shield", need: 250, value: "Unlocks safety checklist" },
  { key: "family", title: "Family Pack", need: 400, value: "Unlocks family quest ideas" },
  { key: "stem", title: "STEM Kit", need: 550, value: "Unlocks science and builder challenges" },
  { key: "pet", title: "Pet Care Kit", need: 650, value: "Unlocks daily care guide ideas" },
  { key: "premium", title: "Future Premium", need: 900, value: "Preview for optional Pi utility packs" },
];

const premiumPacks = [
  {
    key: "deep-stem",
    title: "STEM Lab Pro",
    price: "0.2 Pi",
    body: "Advanced science projects, coding logic, math puzzles, and builder guides.",
    tips: [
      "Start every project with one question you can test.",
      "Write what you changed and what stayed the same.",
      "Improve the design after each result, even if the test failed.",
    ],
  },
  {
    key: "life-skills",
    title: "Life Skills Pro",
    price: "0.2 Pi",
    body: "Money habits, safety decisions, study routines, confidence, and daily planning.",
    tips: [
      "Use one small action per day instead of a huge plan you cannot repeat.",
      "Track decisions by goal: safety, money, health, learning, or family.",
      "Review your wins weekly and choose the next useful habit.",
    ],
  },
  {
    key: "pet-home",
    title: "Pet Care Pro",
    price: "0.2 Pi",
    body: "House pet ownership, care checklists, safe petting, hygiene, and family guidance.",
    tips: [
      "Check water, food, clean space, and mood every day.",
      "Teach children to approach pets calmly and respect signals.",
      "Record unusual appetite, energy, or behavior changes early.",
    ],
  },
  {
    key: "pioneer-pro",
    title: "Pioneer Pro Tips",
    price: "0.2 Pi",
    body: "Pi safety, ecosystem trust checks, marketplace choices, and creator tips.",
    tips: [
      "Never trade trust for a fast reward promise.",
      "Check terms, support, privacy, and app purpose before using a service.",
      "Build or use Pi utility that solves a real problem first.",
    ],
  },
];

const researchLibrary = {
  safety: {
    count: 5988,
    quote: "Trust grows when every reward has clear rules.",
    pages: [
      {
        title: "Account protection research",
        hint: "Did you know a passphrase should never be typed into random links?",
        action: "This is how to stay safer: pause, check the app source, and never share private wallet words.",
      },
      {
        title: "Scam pressure signals",
        hint: "Did you know urgency is often used to stop people from thinking?",
        action: "This is how to respond: slow down, compare details, and ask whether the offer has real utility.",
      },
    ],
  },
  money: {
    count: 5988,
    quote: "Small money choices become powerful when they are repeated.",
    pages: [
      {
        title: "Saving behavior",
        hint: "Did you know tracking one purchase can reveal a spending pattern?",
        action: "This is how to begin: write one need, one want, and one saving goal.",
      },
      {
        title: "Value thinking",
        hint: "Did you know a cheap item can still be wasteful if it solves no problem?",
        action: "This is how to decide: ask whether the item helps your goal after one week.",
      },
    ],
  },
  health: {
    count: 5988,
    quote: "Health improves when care becomes simple enough to repeat.",
    pages: [
      {
        title: "Tiny habit research",
        hint: "Did you know short movement can reset attention?",
        action: "This is how to use it: stretch, walk, or tidy for a few safe minutes before learning.",
      },
      {
        title: "Rest and memory",
        hint: "Did you know rest helps your brain keep what you learned?",
        action: "This is how to support it: reduce late distractions and choose a calm sleep routine.",
      },
    ],
  },
  growth: {
    count: 5988,
    quote: "Skill grows when learning turns into one visible action.",
    pages: [
      {
        title: "Confidence practice",
        hint: "Did you know confidence often follows proof, not motivation?",
        action: "This is how to build it: finish one small task and record the result.",
      },
      {
        title: "Digital fluency",
        hint: "Did you know safe searching is a global work skill?",
        action: "This is how to practice: search, compare sources, and summarize what changed your mind.",
      },
    ],
  },
  stem: {
    count: 5988,
    quote: "STEM is curiosity organized into tests, tools, and evidence.",
    pages: [
      {
        title: "Electrical engineering",
        hint: "Did you know a circuit needs a path for current to flow?",
        action: "This is how to learn it: compare battery, wire, switch, and load, then ask what happens when the path opens.",
      },
      {
        title: "Signals and sensors",
        hint: "Did you know phones, solar systems, radios, and motors all depend on electrical engineering?",
        action: "This is how to explore it: identify one device at home and name its power source, control, and output.",
      },
      {
        title: "Engineering safety",
        hint: "Did you know electricity should be learned with safe low-power examples first?",
        action: "This is how to stay safe: avoid mains wiring, use supervised kits, and learn symbols before touching circuits.",
      },
    ],
  },
  pet: {
    count: 5988,
    quote: "A pet is not decoration; it is daily responsibility.",
    pages: [
      {
        title: "Daily care routine",
        hint: "Did you know pets communicate through appetite, energy, and behavior?",
        action: "This is how to care: check water, food, space, mood, and cleanliness every day.",
      },
      {
        title: "Safe petting",
        hint: "Did you know gentle handling protects both children and pets?",
        action: "This is how to pet safely: approach calmly, avoid tails and ears, and stop when the pet moves away.",
      },
    ],
  },
};

const dailyRotation = {
  safety: [
    {
      title: "Check before you tap",
      body: "A safe Pioneer checks the source, app name, and rules before trusting a reward.",
      points: 50,
      question: "What should you check first?",
      answers: ["The source", "A random promise", "A passphrase request"],
      correct: 0,
    },
    {
      title: "Private means private",
      body: "Your passphrase should stay with you. No support helper should ask for it.",
      points: 50,
      question: "Who should receive your passphrase?",
      answers: ["Nobody else", "Any admin", "A stranger"],
      correct: 0,
    },
  ],
  money: [
    {
      title: "One useful saving move",
      body: "Track one spend today and ask if it supports your goal.",
      points: 45,
      question: "What helps money choices?",
      answers: ["Tracking spending", "Buying fast", "No plan"],
      correct: 0,
    },
    {
      title: "Value before reward",
      body: "A good offer explains value clearly before asking for attention or payment.",
      points: 45,
      question: "A good offer should have...",
      answers: ["Clear value", "Pressure only", "Hidden terms"],
      correct: 0,
    },
  ],
  health: [
    {
      title: "Small health win",
      body: "Pick one safe action: water, movement, rest, hygiene, or kindness.",
      points: 40,
      question: "A strong daily habit is...",
      answers: ["Small and repeatable", "Risky", "Impossible"],
      correct: 0,
    },
    {
      title: "Reset your focus",
      body: "A short stretch or walk can reset attention before another lesson.",
      points: 40,
      question: "What can reset focus?",
      answers: ["Gentle movement", "Skipping sleep", "Ignoring stress"],
      correct: 0,
    },
  ],
  growth: [
    {
      title: "One skill today",
      body: "Learn one idea, answer one question, and turn it into action.",
      points: 50,
      question: "What makes learning real?",
      answers: ["Action", "Only scrolling", "Guessing"],
      correct: 0,
    },
    {
      title: "Confidence proof",
      body: "Confidence grows when you complete small tasks and see progress.",
      points: 50,
      question: "Confidence grows through...",
      answers: ["Completed tasks", "Avoiding everything", "Random luck"],
      correct: 0,
    },
  ],
  stem: [
    {
      title: "Observe and test",
      body: "STEM starts when you observe, ask a question, test, and improve.",
      points: 55,
      question: "What starts a STEM task?",
      answers: ["Observation", "Ignoring evidence", "Copying blindly"],
      correct: 0,
    },
    {
      title: "Build then improve",
      body: "Engineering means making a solution better after testing it.",
      points: 55,
      question: "After a test, you should...",
      answers: ["Improve the design", "Hide results", "Stop learning"],
      correct: 0,
    },
  ],
  pet: [
    {
      title: "Daily pet check",
      body: "Check water, food, clean space, movement, and mood.",
      points: 50,
      question: "What should pet owners check?",
      answers: ["Water, food, space, mood", "Only decorations", "Nothing"],
      correct: 0,
    },
    {
      title: "Gentle petting",
      body: "Petting should be calm, safe, and respectful of the pet's signals.",
      points: 50,
      question: "Safe petting means...",
      answers: ["Respect signals", "Force contact", "Pull tails"],
      correct: 0,
    },
  ],
};

const artStyles = [
  { key: "poster", label: "AI poster style" },
  { key: "story", label: "storybook style" },
  { key: "clean", label: "clean icon style" },
  { key: "future", label: "future learning style" },
  { key: "soft", label: "soft classroom style" },
  { key: "bold", label: "bold explorer style" },
];

const artFrames = [
  { key: "focus", label: "focus frame" },
  { key: "lesson", label: "lesson frame" },
  { key: "compare", label: "compare frame" },
  { key: "field", label: "field frame" },
  { key: "guide", label: "guide frame" },
  { key: "lab", label: "lab frame" },
];

const artPalettes = [
  { key: "gold", background: "#fff7e5", accent: "#f5b83b", support: "#6b3a99", extra: "#24a86b" },
  { key: "mint", background: "#eefcf6", accent: "#24a86b", support: "#2f74d0", extra: "#f5b83b" },
  { key: "sky", background: "#edf6ff", accent: "#2f74d0", support: "#6b3a99", extra: "#24a86b" },
  { key: "violet", background: "#f5efff", accent: "#6b3a99", support: "#f5b83b", extra: "#2f74d0" },
  { key: "sun", background: "#fff4ea", accent: "#f5b83b", support: "#24a86b", extra: "#6b3a99" },
  { key: "calm", background: "#f1fbfa", accent: "#24a86b", support: "#6f6878", extra: "#f5b83b" },
];

const artBlueprints = {
  safety: [
    {
      key: "safe-link",
      scene: "phone",
      title: "Suspicious reward message",
      prompt: "A phone shows a message promising instant rewards from an unknown link.",
      question: "What is the safest action?",
      answers: ["Open quickly", "Check the source first", "Share your passphrase"],
      correct: 1,
      lesson: "Unknown reward links can be risky. Check the source before tapping.",
      points: 35,
    },
    {
      key: "wallet-warning",
      scene: "phone",
      title: "Wallet alert check",
      prompt: "A learner sees a warning asking for a wallet secret before a reward unlock.",
      question: "What should the learner protect?",
      answers: ["Their passphrase", "A stranger's link", "A fake bonus claim"],
      correct: 0,
      lesson: "No safe app should ask for a wallet passphrase inside a reward screen.",
      points: 40,
    },
    {
      key: "community-rule",
      scene: "family",
      title: "Family safety rule",
      prompt: "A family writes one shared rule for links, wallets, and help requests.",
      question: "What makes the rule useful?",
      answers: ["It is clear and shared", "It is secret and confusing", "It changes every minute"],
      correct: 0,
      lesson: "Simple shared rules reduce risky taps and panic decisions.",
      points: 32,
    },
    {
      key: "offer-compare",
      scene: "market",
      title: "Offer comparison",
      prompt: "Two digital offers appear side by side, but only one explains the rules clearly.",
      question: "Which sign helps you trust an offer?",
      answers: ["Clear rules", "Urgent shouting", "Hidden details"],
      correct: 0,
      lesson: "Trust grows when the terms are clear before the action starts.",
      points: 36,
    },
    {
      key: "safe-observation",
      scene: "lab",
      title: "Check before tapping",
      prompt: "A learner compares one safe sign and one risky sign before choosing a link.",
      question: "What skill is being used?",
      answers: ["Observation", "Blind trust", "Secret sharing"],
      correct: 0,
      lesson: "Safe Pi use starts with stopping, checking, and comparing.",
      points: 34,
    },
    {
      key: "secure-home",
      scene: "pet",
      title: "Home device care",
      prompt: "A home checklist reminds the user to update devices and avoid risky promises.",
      question: "What helps daily digital safety?",
      answers: ["Simple checklists", "Ignoring updates", "Saving passwords in public chats"],
      correct: 0,
      lesson: "Security becomes easier when the habit is visible and repeatable.",
      points: 38,
    },
  ],
  money: [
    {
      key: "market-choice",
      scene: "market",
      title: "Marketplace decision",
      prompt: "A user compares two offers before spending points or future Pi.",
      question: "What should the user check?",
      answers: ["Only bright colors", "Value and clear terms", "Pressure words"],
      correct: 1,
      lesson: "Good choices come from value, clear terms, and no pressure.",
      points: 35,
    },
    {
      key: "save-first",
      scene: "phone",
      title: "Tiny saving prompt",
      prompt: "A phone budget note asks the learner to save a small amount before spending.",
      question: "What habit is being built?",
      answers: ["Save first", "Spend first", "Guess later"],
      correct: 0,
      lesson: "Small saving habits make bigger goals easier to reach.",
      points: 30,
    },
    {
      key: "family-budget",
      scene: "family",
      title: "Family budget talk",
      prompt: "A family is choosing between a need and a want at the table.",
      question: "What should come first?",
      answers: ["The need", "The loudest choice", "The newest ad"],
      correct: 0,
      lesson: "Needs come first when a budget is limited.",
      points: 34,
    },
    {
      key: "price-check",
      scene: "market",
      title: "Price and value check",
      prompt: "A learner compares a cheaper item and a better-value item with clearer use.",
      question: "What matters most?",
      answers: ["Long-term value", "The flashiest color", "The fastest countdown"],
      correct: 0,
      lesson: "Value is about usefulness, not pressure.",
      points: 37,
    },
    {
      key: "goal-board",
      scene: "lab",
      title: "Goal planning board",
      prompt: "A simple chart shows a money goal broken into smaller weekly steps.",
      question: "Why does this help?",
      answers: ["The goal becomes visible", "It hides progress", "It removes planning"],
      correct: 0,
      lesson: "Visible goals make daily discipline easier.",
      points: 33,
    },
    {
      key: "careful-spending",
      scene: "pet",
      title: "Care before cost",
      prompt: "A pet owner checks food, health, and safe supplies before spending on extras.",
      question: "What does this show?",
      answers: ["Priorities", "Random spending", "Impulse pressure"],
      correct: 0,
      lesson: "Good budgets support real needs before extras.",
      points: 31,
    },
  ],
  health: [
    {
      key: "water-break",
      scene: "phone",
      title: "Hydration reminder",
      prompt: "A daily reminder encourages a water break before another long screen session.",
      question: "What type of habit is this?",
      answers: ["Small and repeatable", "Extreme and rare", "Stressful and unsafe"],
      correct: 0,
      lesson: "Healthy routines work best when they are easy to repeat.",
      points: 30,
    },
    {
      key: "family-wellbeing",
      scene: "family",
      title: "Family wellbeing check",
      prompt: "A family plans sleep, movement, and meal times together.",
      question: "What are they building?",
      answers: ["A stable routine", "A random rush", "A hidden problem"],
      correct: 0,
      lesson: "Shared routines improve energy and reduce stress.",
      points: 34,
    },
    {
      key: "meal-choice",
      scene: "market",
      title: "Balanced meal choice",
      prompt: "A learner compares one balanced meal and one empty snack before lunch.",
      question: "What supports steady energy?",
      answers: ["Balanced food", "Only sugar", "Skipping meals"],
      correct: 0,
      lesson: "Balanced meals help the body and brain work better through the day.",
      points: 36,
    },
    {
      key: "rest-observation",
      scene: "lab",
      title: "Rest and focus note",
      prompt: "A learner records how sleep changes focus and patience over several days.",
      question: "What is the learner doing?",
      answers: ["Tracking a pattern", "Ignoring evidence", "Choosing chaos"],
      correct: 0,
      lesson: "Simple tracking helps people notice what improves health.",
      points: 35,
    },
    {
      key: "pet-walk",
      scene: "pet",
      title: "Walk and mood check",
      prompt: "A pet owner takes a calm walk and notices better mood and energy after.",
      question: "What daily benefit is shown?",
      answers: ["Movement helps wellbeing", "Movement never matters", "Only screens improve energy"],
      correct: 0,
      lesson: "Gentle movement supports both body and mood.",
      points: 32,
    },
    {
      key: "screen-reset",
      scene: "phone",
      title: "Screen pause reset",
      prompt: "A learner uses a short break, stretch, and deep breath before continuing online study.",
      question: "Why is the break useful?",
      answers: ["It resets focus", "It wastes the day", "It hides the lesson"],
      correct: 0,
      lesson: "Short healthy resets make long study sessions easier to manage.",
      points: 31,
    },
  ],
  growth: [
    {
      key: "idea-note",
      scene: "phone",
      title: "One useful idea",
      prompt: "A learner writes a short note explaining a new idea in simple words.",
      question: "What does this show?",
      answers: ["Active learning", "Passive guessing", "Copying without thought"],
      correct: 0,
      lesson: "Learning becomes stronger when the learner can explain it clearly.",
      points: 34,
    },
    {
      key: "family-learning",
      scene: "family",
      title: "Family learning moment",
      prompt: "A family is planning device rules together at a table.",
      question: "What can they learn?",
      answers: ["Agree on safe rules", "Hide all problems", "Click every offer"],
      correct: 0,
      lesson: "Shared rules help kids, teens, and adults stay safer online.",
      points: 30,
    },
    {
      key: "compare-skills",
      scene: "market",
      title: "Skill choice",
      prompt: "A learner compares two skill paths and chooses the one with clearer real-world use.",
      question: "What is a good next step?",
      answers: ["Pick a useful path", "Wait forever", "Follow noise only"],
      correct: 0,
      lesson: "Useful growth starts when the next step is visible and practical.",
      points: 33,
    },
    {
      key: "progress-loop",
      scene: "lab",
      title: "Practice and improve",
      prompt: "A learner tries, checks, and improves a simple task instead of quitting early.",
      question: "What creates growth?",
      answers: ["Practice with feedback", "Avoiding effort", "Hiding mistakes"],
      correct: 0,
      lesson: "Skills grow faster when mistakes become feedback.",
      points: 37,
    },
    {
      key: "pet-routine",
      scene: "pet",
      title: "Care routine confidence",
      prompt: "A pet owner follows a calm daily checklist and becomes more confident over time.",
      question: "Why does confidence rise?",
      answers: ["Small wins build it", "Luck alone builds it", "Confusion builds it"],
      correct: 0,
      lesson: "Confidence usually comes from repeated proof, not hype.",
      points: 32,
    },
    {
      key: "focus-stack",
      scene: "phone",
      title: "Focus stack",
      prompt: "A learner puts one task, one timer, and one goal on the screen before working.",
      question: "What does the stack do?",
      answers: ["Makes focus easier", "Adds distraction", "Removes purpose"],
      correct: 0,
      lesson: "Clear single-task focus beats vague intention.",
      points: 35,
    },
  ],
  stem: [
    {
      key: "stem-lab",
      scene: "lab",
      title: "Plant light test",
      prompt: "A learner tests a plant near light and records what changes.",
      question: "What STEM skill are they using?",
      answers: ["Observation and testing", "Guessing without looking", "Copying a secret"],
      correct: 0,
      lesson: "STEM grows when you observe, test, record, and improve.",
      points: 40,
    },
    {
      key: "circuit-path",
      scene: "engineering",
      title: "Circuit path check",
      prompt: "A learner traces a battery, switch, and lamp to understand whether a circuit is complete.",
      question: "What makes the lamp work?",
      answers: ["A complete path", "A random color", "A hidden wire name"],
      correct: 0,
      lesson: "Electrical engineering starts with understanding the path that current follows.",
      points: 45,
    },
    {
      key: "family-build",
      scene: "family",
      title: "Build and test together",
      prompt: "A family works on a simple bridge model and checks which design holds better.",
      question: "What are they doing?",
      answers: ["Testing designs", "Avoiding evidence", "Pretending the result"],
      correct: 0,
      lesson: "Engineering improves when ideas are tested side by side.",
      points: 36,
    },
    {
      key: "compare-energy",
      scene: "market",
      title: "Energy choice comparison",
      prompt: "A learner compares two energy-saving devices by looking at use and efficiency.",
      question: "What matters most?",
      answers: ["Performance and efficiency", "Only the brightest box", "Only the loudest ad"],
      correct: 0,
      lesson: "Good engineering decisions compare function, safety, and efficiency.",
      points: 38,
    },
    {
      key: "signal-screen",
      scene: "phone",
      title: "Signal on the screen",
      prompt: "A phone app shows a changing graph from a sensor reading over time.",
      question: "What is being learned?",
      answers: ["Signals carry information", "Graphs hide meaning", "Sensors never help"],
      correct: 0,
      lesson: "Electrical systems often turn real-world changes into readable signals.",
      points: 41,
    },
    {
      key: "safe-kit",
      scene: "engineering",
      title: "Safe low-power kit",
      prompt: "A beginner studies a supervised low-power circuit kit before touching bigger systems.",
      question: "Why start small?",
      answers: ["It is safer and clearer", "It is more dangerous", "It removes learning"],
      correct: 0,
      lesson: "Safe electrical learning begins with low-power examples and clear symbols.",
      points: 44,
    },
  ],
  pet: [
    {
      key: "pet-care",
      scene: "pet",
      title: "Pet care check",
      prompt: "A house pet sits near a bowl, clean space, and care checklist.",
      question: "What should the owner check every day?",
      answers: ["Water, food, space, mood", "Only decorations", "Nothing until problems grow"],
      correct: 0,
      lesson: "Daily care helps pets stay safer, calmer, and healthier.",
      points: 40,
    },
    {
      key: "gentle-petting",
      scene: "pet",
      title: "Gentle petting guide",
      prompt: "A learner sees calm pet signals before offering a gentle touch.",
      question: "What should happen first?",
      answers: ["Read the pet's signals", "Grab quickly", "Ignore stress"],
      correct: 0,
      lesson: "Good pet care starts with noticing comfort, stress, and consent.",
      points: 36,
    },
    {
      key: "family-care",
      scene: "family",
      title: "Shared care routine",
      prompt: "A family shares feeding, cleaning, and play duties for a house pet.",
      question: "What improves with this plan?",
      answers: ["Consistency", "Confusion", "Neglect"],
      correct: 0,
      lesson: "Pets thrive when daily care is steady and shared clearly.",
      points: 33,
    },
    {
      key: "smart-supplies",
      scene: "market",
      title: "Smart supply choice",
      prompt: "A pet owner compares safe, useful supplies with flashy extras.",
      question: "What should come first?",
      answers: ["Safe basics", "Only toys", "Only decoration"],
      correct: 0,
      lesson: "Good pet ownership puts health and safety before appearance.",
      points: 31,
    },
    {
      key: "mood-log",
      scene: "lab",
      title: "Mood and health log",
      prompt: "A learner records mood, appetite, and activity changes to notice pet health early.",
      question: "Why keep the log?",
      answers: ["To notice patterns", "To ignore change", "To skip care"],
      correct: 0,
      lesson: "Simple daily notes help owners catch changes before they grow.",
      points: 37,
    },
    {
      key: "safe-home-pet",
      scene: "phone",
      title: "Pet checklist on screen",
      prompt: "A phone checklist reminds the owner about water, space, and daily attention.",
      question: "What does the checklist support?",
      answers: ["Reliable care", "Forgetting", "Unsafe guessing"],
      correct: 0,
      lesson: "A visible checklist makes pet care easier to repeat well.",
      points: 32,
    },
  ],
};

function buildAiArtLibrary() {
  return categories.flatMap((category, categoryIndex) => {
    const blueprints = artBlueprints[category.key] || [];
    return blueprints.flatMap((blueprint, blueprintIndex) =>
      artStyles.flatMap((style, styleIndex) =>
        artFrames.flatMap((frame, frameIndex) => {
          const palette = artPalettes[(categoryIndex + blueprintIndex + styleIndex + frameIndex) % artPalettes.length];
          return {
            key: `${category.key}-${blueprint.key}-${style.key}-${frame.key}`,
            categoryKey: category.key,
            title: `${blueprint.title}`,
            scene: {
              type: blueprint.scene,
              palette,
              style,
              frame,
            },
            artLabel: `${style.label} - ${frame.label}`,
            points: blueprint.points + (frameIndex % 2 === 0 ? 3 : 0),
            prompt: `${blueprint.prompt} ${style.label} with a ${frame.label}.`,
            question: blueprint.question,
            answers: blueprint.answers,
            correct: blueprint.correct,
            lesson: blueprint.lesson,
          };
        }),
      ),
    );
  });
}

const aiArtLibrary = buildAiArtLibrary();

function dailyVisualTasks(categoryKey) {
  const dayNumber = Math.floor(new Date(todayKey).getTime() / 86400000);
  const categoryTasks = aiArtLibrary.filter((item) => item.categoryKey === categoryKey);
  const globalTasks = aiArtLibrary.filter((item) => item.categoryKey !== categoryKey);
  const localStart = (dayNumber * 3) % categoryTasks.length;
  const globalStart = (dayNumber * 5) % globalTasks.length;
  return [
    ...categoryTasks.slice(localStart, localStart + 4),
    ...globalTasks.slice(globalStart, globalStart + 2),
  ];
}

const ethicsStatements = [
  {
    key: "impact",
    text: "Before launching an AI feature, possible harm to users should be considered.",
  },
  {
    key: "early",
    text: "Ethical analysis should happen from the early design stage, not only after launch.",
  },
  {
    key: "approval",
    text: "High-risk AI features should be reviewed before they are released.",
  },
  {
    key: "community",
    text: "People affected by an AI tool should have a way to give feedback.",
  },
];

const ratingOptions = ["I don't know", "Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];

const state = {
  streak: Number(localStorage.getItem("questora-streak") || 0),
  points: Number(localStorage.getItem("questora-points") || 0),
  badges: Number(localStorage.getItem("questora-badges") || 0),
  age: localStorage.getItem("questora-age") || "Kids",
  goal: localStorage.getItem("questora-goal") || "Pi safety",
  country: localStorage.getItem("questora-country") || "Kenya",
  language: localStorage.getItem("questora-language") || "English",
  category: localStorage.getItem("questora-category") || "safety",
  userName: localStorage.getItem("questora-user-name") || "",
  record: JSON.parse(localStorage.getItem("questora-record") || "{}"),
  claimed: JSON.parse(localStorage.getItem("questora-claimed") || "{}"),
  answered: JSON.parse(localStorage.getItem("questora-answered") || "{}"),
  ethics: JSON.parse(localStorage.getItem("questora-ethics") || "{}"),
  walletClaims: JSON.parse(localStorage.getItem("questora-wallet-claims") || "[]"),
  selectedPremium: localStorage.getItem("questora-selected-premium") || "deep-stem",
  currentPage: localStorage.getItem("questora-current-page") || "home",
  highContrast: localStorage.getItem("questora-high-contrast") === "true",
  largeText: localStorage.getItem("questora-large-text") === "true",
  user: null,
  accessToken: "",
};

const streakCount = document.querySelector("#streakCount");
const pointCount = document.querySelector("#pointCount");
const badgeCount = document.querySelector("#badgeCount");
const statusText = document.querySelector("#statusText");
const loginButton = document.querySelector("#loginButton");
const featurePanel = document.querySelector("#featurePanel");
const choiceButtons = [...document.querySelectorAll(".choice")];
const goalSelect = document.querySelector("#goalSelect");
const countrySelect = document.querySelector("#countrySelect");
const languageSelect = document.querySelector("#languageSelect");
const pathPill = document.querySelector("#pathPill");
const tabs = [...document.querySelectorAll(".tab")];
const textSizeButton = document.querySelector("#textSizeButton");
const contrastButton = document.querySelector("#contrastButton");
const resetButton = document.querySelector("#resetButton");
const dashUser = document.querySelector("#dashUser");
const dashLevel = document.querySelector("#dashLevel");
const dashRewards = document.querySelector("#dashRewards");
const dashLessons = document.querySelector("#dashLessons");
const dashDaily = document.querySelector("#dashDaily");
const dashNext = document.querySelector("#dashNext");
const dashboardPill = document.querySelector("#dashboardPill");
const reasonText = document.querySelector("#reasonText");
const actionText = document.querySelector("#actionText");
const recordName = document.querySelector("#recordName");
const recordLevel = document.querySelector("#recordLevel");
const recordToday = document.querySelector("#recordToday");
const dailyStatusPill = document.querySelector("#dailyStatusPill");
const dailyRewardPill = document.querySelector("#dailyRewardPill");
const categoryPill = document.querySelector("#categoryPill");
const categoryGrid = document.querySelector("#categoryGrid");
const researchPanel = document.querySelector("#researchPanel");
const learnJourneyGrid = document.querySelector("#learnJourneyGrid");
const learnJourneyCopy = document.querySelector("#learnJourneyCopy");
const learnJourneyPill = document.querySelector("#learnJourneyPill");
const featuredLessonCard = document.querySelector("#featuredLessonCard");
const featuredLessonPill = document.querySelector("#featuredLessonPill");
const dailyCard = document.querySelector("#dailyCard");
const dailyAnswerGrid = document.querySelector("#dailyAnswerGrid");
const dailyFeedback = document.querySelector("#dailyFeedback");
const dailyCardTop = document.querySelector("#dailyCardTop");
const dailyAnswerGridTop = document.querySelector("#dailyAnswerGridTop");
const dailyFeedbackTop = document.querySelector("#dailyFeedbackTop");
const dailyRewardPillTop = document.querySelector("#dailyRewardPillTop");
const missionRail = document.querySelector("#missionRail");
const missionCopy = document.querySelector("#missionCopy");
const missionPill = document.querySelector("#missionPill");
const surpriseGrid = document.querySelector("#surpriseGrid");
const surprisePill = document.querySelector("#surprisePill");
const pulseGrid = document.querySelector("#pulseGrid");
const pulsePill = document.querySelector("#pulsePill");
const pulseCopy = document.querySelector("#pulseCopy");
const challengeCard = document.querySelector("#challengeCard");
const challengePill = document.querySelector("#challengePill");
const globalGrid = document.querySelector("#globalGrid");
const globalPill = document.querySelector("#globalPill");
const purposeGrid = document.querySelector("#purposeGrid");
const purposeCopy = document.querySelector("#purposeCopy");
const purposePill = document.querySelector("#purposePill");
const nextGrid = document.querySelector("#nextGrid");
const nextPill = document.querySelector("#nextPill");
const lessonGrid = document.querySelector("#lessonGrid");
const rewardGrid = document.querySelector("#rewardGrid");
const rewardCenterGrid = document.querySelector("#rewardCenterGrid");
const rewardCenterCopy = document.querySelector("#rewardCenterCopy");
const rewardCenterPill = document.querySelector("#rewardCenterPill");
const rewardJourneyGrid = document.querySelector("#rewardJourneyGrid");
const rewardJourneyCopy = document.querySelector("#rewardJourneyCopy");
const rewardJourneyPill = document.querySelector("#rewardJourneyPill");
const claimHistoryList = document.querySelector("#claimHistoryList");
const claimHistoryPill = document.querySelector("#claimHistoryPill");
const visualGrid = document.querySelector("#visualGrid");
const visualPill = document.querySelector("#visualPill");
const visualCopy = document.querySelector("#visualCopy");
const ethicsList = document.querySelector("#ethicsList");
const toolGrid = document.querySelector("#toolGrid");
const premiumGrid = document.querySelector("#premiumGrid");
const premiumDetail = document.querySelector("#premiumDetail");
const premiumGuideGrid = document.querySelector("#premiumGuideGrid");
const premiumGuideCopy = document.querySelector("#premiumGuideCopy");
const premiumGuidePill = document.querySelector("#premiumGuidePill");
const premiumCompareGrid = document.querySelector("#premiumCompareGrid");
const premiumCompareCopy = document.querySelector("#premiumCompareCopy");
const premiumComparePill = document.querySelector("#premiumComparePill");
const walletClaimAmount = document.querySelector("#walletClaimAmount");
const claimWalletButton = document.querySelector("#claimWalletButton");
const walletPill = document.querySelector("#walletPill");
const yourRankLabel = document.querySelector("#yourRankLabel");
const yourRankPoints = document.querySelector("#yourRankPoints");
const pageTabs = [...document.querySelectorAll("[data-page-target]")];
const pageSections = [...document.querySelectorAll("[data-page]")];
const pageJumpButtons = [...document.querySelectorAll("[data-page-jump]")];
const dailyPanels = [...document.querySelectorAll(".daily-learning-panel")];

const tabContent = {
  learn: {
    title: "Learning that earns",
    body: "Every category has short lessons, questions, rewards, and a daily task. Users earn app points for steady learning, not fake Pi promises.",
  },
  family: {
    title: "Family-friendly progress",
    body: "Kids, teens, adults, and parents can choose safe goals and build habits together with simple daily quests.",
  },
  rank: {
    title: "Future global ranking",
    body: "Leaderboards can later compare countries, categories, and streaks after backend accounts are connected.",
  },
};

const globalStories = {
  Kenya: [
    "Learners in Kenya often use Questora for safety, budgeting, and digital confidence.",
    "Short tasks work well when mobile data and time both matter.",
    "Strong trust signals matter before users try a premium pack.",
  ],
  Nigeria: [
    "Pioneers in Nigeria benefit from scam spotting, practical savings, and skill-building paths.",
    "Fast, clear questions help keep daily learning consistent.",
    "Community credibility matters more than hype.",
  ],
  India: [
    "Questora fits learners who want short daily progress across STEM, money basics, and family growth.",
    "Compact lessons help users return even on busy days.",
    "Premium works best when value is obvious before payment.",
  ],
  Brazil: [
    "Daily streaks, visual tasks, and practical tips make learning more social and more memorable.",
    "A good mini app keeps the first screen useful, not noisy.",
    "Users stay longer when free learning already feels rich.",
  ],
  Philippines: [
    "Family-safe learning and repeatable daily questions help Questora feel welcoming and practical.",
    "Friendly language and clear rewards improve trust.",
    "A light, fast experience is part of the product value.",
  ],
  "South Africa": [
    "Questora supports learners who want practical growth, not just novelty.",
    "Short lessons and visible progress are strong return triggers.",
    "Reliable reward logic helps users believe in the app.",
  ],
  Global: [
    "A global Pioneer app should feel useful in the first minute, not only after a long setup.",
    "The strongest mini apps teach, reward, and guide the next step clearly.",
    "Questora wins when every section answers: why this, why now, what next.",
  ],
};

const purposeProfiles = {
  "Pi safety": {
    title: "Trust first",
    copy: "Questora helps Pioneers spot risk, protect accounts, and learn what a trustworthy app should feel like.",
    cards: [
      { title: "Protect", body: "Learn safer choices before tapping links, sharing details, or trusting rewards." },
      { title: "Understand", body: "Turn short lessons into habits that make Pi app use more confident and more informed." },
      { title: "Return", body: "Come back for a daily question that improves judgment, not just activity." },
    ],
  },
  "Daily learning": {
    title: "Grow every day",
    copy: "Questora exists to turn small daily learning into visible progress, stronger habits, and a reason to return tomorrow.",
    cards: [
      { title: "Learn", body: "Short, useful topics make progress possible even on busy days." },
      { title: "Answer", body: "Clear questions turn learning into proof instead of passive scrolling." },
      { title: "Earn", body: "Points and rewards show that useful effort is being saved and recognized." },
    ],
  },
  "Healthy habits": {
    title: "Stay balanced",
    copy: "Questora supports daily wellbeing with tiny steps that improve focus, consistency, and home life.",
    cards: [
      { title: "Reset", body: "Use small actions to recover energy and stay ready for learning." },
      { title: "Repeat", body: "Simple routines matter because they can be done again tomorrow." },
      { title: "Share", body: "Healthy habits become stronger when they support family and community too." },
    ],
  },
  "Money basics": {
    title: "Choose value",
    copy: "Questora helps users think more clearly about spending, saving, and long-term value before making decisions.",
    cards: [
      { title: "Notice", body: "Small choices reveal patterns that can change bigger outcomes." },
      { title: "Compare", body: "Clear value beats pressure, hype, and impulse." },
      { title: "Plan", body: "Visible goals make money habits feel purposeful instead of strict." },
    ],
  },
  "STEM learning": {
    title: "Build curiosity",
    copy: "Questora gives STEM learners a daily reason to observe, test, and improve ideas in simple steps.",
    cards: [
      { title: "Observe", body: "Start with real questions and what you can actually notice." },
      { title: "Test", body: "Short challenges turn curiosity into evidence and learning." },
      { title: "Improve", body: "Progress matters more when each lesson leads to the next better idea." },
    ],
  },
  "Pet care": {
    title: "Care well",
    copy: "Questora helps house pet owners build kinder, safer, and more consistent care routines every day.",
    cards: [
      { title: "Check", body: "Water, food, mood, and space should be part of regular care." },
      { title: "Notice", body: "Small behavior changes often matter before bigger problems appear." },
      { title: "Protect", body: "Daily care supports the pet, the home, and the family too." },
    ],
  },
  "Family growth": {
    title: "Grow together",
    copy: "Questora helps families create shared rules, shared learning, and shared progress that feels safe and practical.",
    cards: [
      { title: "Talk", body: "Family-safe questions make it easier to agree on better habits." },
      { title: "Guide", body: "Small lessons can improve device use, trust, and everyday choices." },
      { title: "Build", body: "Consistent family learning creates stronger routines over time." },
    ],
  },
};

function globalMoments() {
  const stories = globalStories[state.country] || globalStories.Global;
  return [
    {
      title: `${state.country} focus`,
      body: stories[0],
      badge: state.language,
    },
    {
      title: "Why Questora feels different",
      body: stories[1],
      badge: "Daily use",
    },
    {
      title: "Trust before payment",
      body: stories[2],
      badge: "Pi ready",
    },
  ];
}

function purposeProfile() {
  return purposeProfiles[state.goal] || purposeProfiles["Daily learning"];
}

function missionSteps(dailyDone, completedLessons, unlockedRewards, claimable) {
  return [
    {
      title: "Answer daily",
      body: dailyDone ? "Today's main question is already complete." : "Complete today's question first to lock in your daily win.",
      done: dailyDone,
    },
    {
      title: "Finish lessons",
      body: completedLessons ? `${completedLessons} lesson rewards already saved.` : "Move into category lessons to build more points.",
      done: completedLessons > 0,
    },
    {
      title: "Open rewards",
      body: unlockedRewards ? `${unlockedRewards} reward tier${unlockedRewards > 1 ? "s" : ""} unlocked so far.` : "Keep earning to unlock your first reward tier.",
      done: unlockedRewards > 0,
    },
    {
      title: "Preview premium",
      body: claimable >= 100 ? "You now have enough point activity to meaningfully compare free and premium value." : "Premium stays visible, but free learning should prove value first.",
      done: claimable >= 100,
    },
  ];
}

function nextUnlockCards(nextReward, claimable, unlockedRewards) {
  return [
    {
      title: nextReward ? nextReward.title : "All rewards open",
      body: nextReward
        ? `${nextReward.need - state.points} more pts to unlock ${nextReward.value}.`
        : "You have reached the current reward ceiling. More learning still builds your record.",
      label: "Reward path",
    },
    {
      title: claimable >= 100 ? "Claim record ready" : "Build claim record",
      body:
        claimable >= 100
          ? `${claimable} pts are ready for a claim preview record in Rewards.`
          : `Reach 100 fresh pts to create a new claim preview. You currently have ${claimable} pts.`,
      label: "Wallet preview",
    },
    {
      title: unlockedRewards ? "Premium has context" : "Premium should wait",
      body:
        unlockedRewards
          ? "The user has already seen free value, so premium previews make more sense now."
          : "Keep the user in free learning until the reward system feels credible.",
      label: "Trust path",
    },
  ];
}

function learnJourney(category, completedLessons) {
  return [
    {
      title: "Read the brief",
      body: `${category.title} starts with a short daily idea that explains what to notice first.`,
      done: true,
    },
    {
      title: "Answer category lessons",
      body: completedLessons ? `${completedLessons} lesson reward${completedLessons > 1 ? "s" : ""} already saved in this learning path.` : "Move through the lesson cards and answer one question at a time.",
      done: completedLessons > 0,
    },
    {
      title: "Use images and tools",
      body: "Reinforce the topic with visual tasks, reflections, and practical tools so the learning feels real.",
      done: false,
    },
  ];
}

function rewardJourney(unlockedRewards, claimable, nextReward) {
  return [
    {
      title: "Earn from action",
      body: "Daily answers, lessons, visuals, ethics, and tools all contribute to progress.",
      state: "live",
    },
    {
      title: unlockedRewards ? "Unlock reached" : "Next unlock ahead",
      body: unlockedRewards
        ? `${unlockedRewards} reward tier${unlockedRewards > 1 ? "s are" : " is"} already open for this learner.`
        : "The first reward tier is still ahead, which keeps the loop motivating.",
      state: unlockedRewards ? "done" : "active",
    },
    {
      title: claimable >= 100 ? "Claim preview available" : "Build claim preview",
      body: claimable >= 100
        ? `${claimable} pts are available for a reward claim record preview.`
        : "Keep going until there are 100 fresh points ready for a claim record.",
      state: claimable >= 100 ? "done" : "active",
    },
    {
      title: "Next reward target",
      body: nextReward
        ? `${nextReward.need - state.points} more pts unlock ${nextReward.title}.`
        : "Current reward tiers are fully open, so the user can focus on record and premium value.",
      state: "live",
    },
  ];
}

function rewardCenterCards(unlockedRewards, claimable, nextReward, record) {
  const level = Math.max(1, Math.floor(state.points / 150) + 1);
  const nextNeed = nextReward ? Math.max(0, nextReward.need - state.points) : 0;
  return [
    {
      label: "Reward energy",
      title: `${state.points} pts total`,
      body: `${record.completedDays} daily wins and ${record.completedLessons.length} lesson unlocks are already powering this account.`,
      tone: "purple",
    },
    {
      label: "Current level",
      title: `Level ${level}`,
      body: unlockedRewards
        ? `${unlockedRewards} reward tier${unlockedRewards > 1 ? "s are" : " is"} already unlocked.`
        : "The first reward tier is still ahead, so early progress needs to feel visible.",
      tone: "blue",
    },
    {
      label: "Next target",
      title: nextReward ? nextReward.title : "All rewards open",
      body: nextReward
        ? `${nextNeed} more pts unlock ${nextReward.value}.`
        : "Every reward tier is already open, so now the value comes from record quality and future premium fit.",
      tone: "gold",
    },
    {
      label: "Claim preview",
      title: claimable >= 100 ? "Ready to record" : "Build more first",
      body: claimable >= 100
        ? `${claimable} fresh pts are ready for a new reward-claim preview.`
        : `Reach 100 fresh pts to create a claim preview. You currently have ${claimable}.`,
      tone: claimable >= 100 ? "green" : "purple",
    },
  ];
}

function premiumGuide(unlockedRewards, claimable) {
  return [
    {
      title: "Free value first",
      body: "Users should trust the free learning loop before even thinking about spending Pi.",
      tone: "base",
    },
    {
      title: unlockedRewards ? "Premium now has context" : "Premium should stay a preview",
      body: unlockedRewards
        ? "The user already sees real value, so deeper paid learning feels more reasonable."
        : "Until rewards and lessons feel solid, premium should remain informative rather than urgent.",
      tone: unlockedRewards ? "strong" : "base",
    },
    {
      title: claimable >= 100 ? "User is engaged enough" : "Keep building interest",
      body: claimable >= 100
        ? "This learner has enough activity to compare premium as an upgrade, not a shortcut."
        : "More earned progress will make premium feel more credible and more interesting later.",
      tone: claimable >= 100 ? "strong" : "base",
    },
  ];
}

function premiumCompareCards(pack, unlockedRewards, claimable) {
  return [
    {
      label: "What opens",
      title: pack.title,
      body: pack.body,
      tone: "gold",
    },
    {
      label: "What stays free",
      title: "Daily learning still works",
      body: "The daily question, category lessons, visual tasks, and reward progress remain useful before any Pi payment is made.",
      tone: "blue",
    },
    {
      label: "Why now",
      title: unlockedRewards ? "Premium has context" : "Premium is still a preview",
      body: unlockedRewards
        ? "This user has already seen free value, so deeper learning now feels like an upgrade."
        : "Questora still needs to prove value through free learning first, which keeps trust stronger.",
      tone: "purple",
    },
    {
      label: "Payment preview",
      title: `${pack.price} example access`,
      body: claimable >= 100
        ? "The Pi payment preview fits a user who already has visible activity and reward history."
        : "The Pi payment preview is shown for future readiness, but the app should still earn trust before payment matters.",
      tone: "green",
    },
  ];
}

function homeSpotlights(category, dailyQuest, level, nextReward, claimable, record) {
  return [
    {
      title: "Daily brief",
      body: `${dailyQuest.title} is live now. A correct answer turns green and earns +${dailyQuest.points} pts.`,
      cta: "Open today's question",
      page: "home",
    },
    {
      title: "Category sprint",
      body: `${category.title} is active with ${category.lessons.length} lessons, clear rewards, and short answer tasks that keep the scroll useful.`,
      cta: "Open lessons",
      page: "learn",
    },
    {
      title: "Daily art drop",
      body: `${aiArtLibrary.length.toLocaleString()} AI art scenes power Questora's rotating image tasks, so today's scroll feels fresh instead of repeated.`,
      cta: "Open art tasks",
      page: "learn",
    },
    {
      title: "Reward runway",
      body: nextReward
        ? `${nextReward.need - state.points} more pts unlocks ${nextReward.title}.`
        : "Every current reward tier is unlocked. Keep learning to build more claim records.",
      cta: "See rewards",
      page: "rewards",
    },
    {
      title: "Premium preview",
      body: `Level ${level} learners can preview deeper guides, research, and tips. Example access stays paired to the 0.2 Pi payment flow.`,
      cta: "See premium",
      page: "premium",
    },
    {
      title: "Consistency matters",
      body: `${record.completedDays} daily wins saved and ${claimable} pts currently ready for a claim record preview.`,
      cta: "Open profile",
      page: "profile",
    },
    {
      title: `${state.country} Pioneer mode`,
      body: `${state.language} is selected, ${state.goal} is active, and Questora is shaping the flow around clear daily progress.`,
      cta: "Tune profile",
      page: "home",
    },
  ];
}

function homePulse(category, dailyQuest, todaysVisuals, nextReward, claimable, level) {
  const firstVisual = todaysVisuals[0];
  return [
    {
      label: "Hot today",
      title: dailyQuest.title,
      body: `Start here: a right answer turns green and saves +${dailyQuest.points} pts immediately.`,
      tone: category.style,
      page: "home",
    },
    {
      label: "Fresh art",
      title: firstVisual ? firstVisual.title : "Visual learning",
      body: firstVisual
        ? `${firstVisual.artLabel} is in today's art drop with +${firstVisual.points} pts waiting.`
        : "Today's visual feed is preparing your next learning card.",
      tone: "blue",
      page: "learn",
    },
    {
      label: "Near unlock",
      title: nextReward ? nextReward.title : "Reward ceiling reached",
      body: nextReward
        ? `${Math.max(0, nextReward.need - state.points)} pts left before the next reward tier opens.`
        : "Every current reward is open, so now the app can focus on richer discovery and progression.",
      tone: "green",
      page: "rewards",
    },
    {
      label: "Upgrade mood",
      title: `Level ${level} momentum`,
      body: claimable >= 100
        ? "You already have enough activity for premium to feel like a real upgrade instead of noise."
        : "Questora is still proving value through free learning first, which makes premium feel more trustworthy later.",
      tone: "purple",
      page: "premium",
    },
  ];
}

function dailySurpriseChallenge(category, dailyQuest, todaysVisuals) {
  const visual = todaysVisuals[1] || todaysVisuals[0];
  const totalPoints = dailyQuest.points + (visual ? Math.round(visual.points / 2) : 20);
  return {
    title: `${category.title} combo challenge`,
    body: visual
      ? `Complete the daily brief, then finish "${visual.title}" from today's visual feed to turn one visit into a fuller learning win.`
      : "Complete the daily brief, then add one more lesson so today's visit feels complete instead of shallow.",
    reward: `Visible progress worth up to +${totalPoints} pts today`,
    reason: visual
      ? "Reason: pairing a quick text answer with a visual card makes the topic stick better."
      : "Reason: a second useful action makes the daily visit feel more rewarding.",
    action: visual
      ? `Action: answer today's question first, then open Learn and finish the visual task.`
      : "Action: answer today's question first, then open Learn for your next lesson.",
  };
}

function currentCategory() {
  return categories.find((category) => category.key === state.category) || categories[0];
}

function userRecord() {
  const id = state.userName || "guest";
  state.record[id] ||= {
    createdAt: todayKey,
    lastDailyDate: "",
    completedDays: 0,
    completedLessons: [],
    completedTools: [],
    completedHealthDays: 0,
    lastHealthDate: "",
    unlockedRewards: [],
  };
  state.record[id].completedHealthDays ||= 0;
  state.record[id].lastHealthDate ||= "";
  return state.record[id];
}

function saveState() {
  localStorage.setItem("questora-streak", String(state.streak));
  localStorage.setItem("questora-points", String(state.points));
  localStorage.setItem("questora-badges", String(state.badges));
  localStorage.setItem("questora-age", state.age);
  localStorage.setItem("questora-goal", state.goal);
  localStorage.setItem("questora-country", state.country);
  localStorage.setItem("questora-language", state.language);
  localStorage.setItem("questora-category", state.category);
  localStorage.setItem("questora-user-name", state.userName);
  localStorage.setItem("questora-record", JSON.stringify(state.record));
  localStorage.setItem("questora-claimed", JSON.stringify(state.claimed));
  localStorage.setItem("questora-answered", JSON.stringify(state.answered));
  localStorage.setItem("questora-ethics", JSON.stringify(state.ethics));
  localStorage.setItem("questora-wallet-claims", JSON.stringify(state.walletClaims));
  localStorage.setItem("questora-selected-premium", state.selectedPremium);
  localStorage.setItem("questora-current-page", state.currentPage);
  localStorage.setItem("questora-high-contrast", String(state.highContrast));
  localStorage.setItem("questora-large-text", String(state.largeText));
}

function initPiSdk() {
  if (!window.Pi) return false;
  try {
    window.Pi.init({ version: "2.0", sandbox: PI_SANDBOX });
    return true;
  } catch (error) {
    console.warn("Pi SDK init skipped", error);
    return true;
  }
}

async function postToBackend(endpoint, body) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return response.ok;
  } catch (error) {
    console.info("Backend endpoint not ready yet", endpoint, error);
    return false;
  }
}

function addPoints(points, reason) {
  state.points += points;
  if (state.points >= 250 && state.badges < 1) state.badges = 1;
  if (state.points >= 500 && state.badges < 2) state.badges = 2;
  if (state.points >= 900 && state.badges < 3) state.badges = 3;
  saveState();
  renderInPlace();
  statusText.textContent = reason;
}

function explain(reason, action) {
  reasonText.textContent = reason;
  actionText.textContent = action;
  statusText.textContent = `${reason} ${action}`;
}

function renderPages() {
  pageSections.forEach((section) => {
    section.hidden = section.dataset.page !== state.currentPage;
  });
  if (dailyPanels.length > 1 && dailyCardTop) {
    dailyPanels.slice(1).forEach((panel) => {
      panel.hidden = true;
    });
  }
  pageTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.pageTarget === state.currentPage);
  });
}

function renderInPlace() {
  const scrollTop = window.scrollY;
  const activePage = state.currentPage;
  render();
  state.currentPage = activePage;
  requestAnimationFrame(() => {
    window.scrollTo({ top: scrollTop, behavior: "auto" });
  });
}

function openPage(page) {
  state.currentPage = page;
  saveState();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function render() {
  const category = currentCategory();
  const dailyQuest = currentDailyQuest(category);
  const todaysVisuals = dailyVisualTasks(category.key);
  const record = userRecord();
  const dailyDone = record.lastDailyDate === todayKey;
  const level = Math.max(1, Math.floor(state.points / 150) + 1);
  const unlockedRewards = rewards.filter((reward) => state.points >= reward.need).length;
  const lessonKeys = categories.flatMap((item) =>
    item.lessons.map((lesson) => `${item.key}::${lesson.key}`),
  );
  const completedLessons = lessonKeys.filter((key) => state.answered[key]).length;
  const nextReward = rewards.find((reward) => state.points < reward.need);
  const alreadyClaimed = state.walletClaims.reduce((sum, claim) => sum + claim.points, 0);
  const claimable = Math.max(0, state.points - alreadyClaimed);
  const purpose = purposeProfile();
  const categoryLessonKeys = category.lessons.map((lesson) => `${category.key}::${lesson.key}`);
  const completedCategoryLessons = categoryLessonKeys.filter((key) => state.answered[key]).length;
  const firstOpenLesson = category.lessons.find((lesson) => !state.answered[`${category.key}::${lesson.key}`]) || category.lessons[0];
  const journey = learnJourney(category, completedCategoryLessons);
  const steps = missionSteps(dailyDone, completedLessons, unlockedRewards, claimable);
  const rewardFlow = rewardJourney(unlockedRewards, claimable, nextReward);
  const rewardCenter = rewardCenterCards(unlockedRewards, claimable, nextReward, record);
  const premiumFlow = premiumGuide(unlockedRewards, claimable);
  const pulseCards = homePulse(category, dailyQuest, todaysVisuals, nextReward, claimable, level);
  const surpriseChallenge = dailySurpriseChallenge(category, dailyQuest, todaysVisuals);
  const currentStep = steps.findIndex((step) => !step.done);
  const activeStep = currentStep === -1 ? steps.length : currentStep + 1;

  streakCount.textContent = state.streak;
  pointCount.textContent = state.points;
  badgeCount.textContent = state.badges;
  pathPill.textContent = state.age;
  goalSelect.value = state.goal;
  countrySelect.value = state.country;
  languageSelect.value = state.language;
  recordName.textContent = state.userName || "Guest learner";
  dashUser.textContent = state.userName || "Guest";
  dashLevel.textContent = `Level ${level}`;
  dashRewards.textContent = unlockedRewards;
  dashLessons.textContent = completedLessons;
  dashDaily.textContent = record.completedDays;
  dashNext.textContent = nextReward ? `${nextReward.need - state.points} pts` : "All open";
  dashboardPill.textContent = state.userName ? "Connected" : "Guest mode";
  purposePill.textContent = purpose.title;
  missionPill.textContent = `Step ${activeStep}`;
  recordLevel.textContent = `Level ${level}`;
  recordToday.textContent = dailyDone ? "Done" : "Waiting";
  dailyStatusPill.textContent = dailyDone ? "Completed" : "Available";
  dailyRewardPill.textContent = `+${dailyQuest.points} pts`;
  if (dailyRewardPillTop) dailyRewardPillTop.textContent = `+${dailyQuest.points} pts`;
  categoryPill.textContent = category.title;
  learnJourneyPill.textContent = `${completedCategoryLessons}/${category.lessons.length} done`;
  featuredLessonPill.textContent = state.answered[`${category.key}::${firstOpenLesson.key}`] ? "Review" : "Best next";
  surprisePill.textContent = category.title;
  pulsePill.textContent = `${todaysVisuals.length} live now`;
  challengePill.textContent = dailyDone ? "Continue" : "Do this";
  globalPill.textContent = `${state.country} • ${state.language}`;
  rewardJourneyPill.textContent = unlockedRewards ? `${unlockedRewards} unlocked` : "Building";
  rewardCenterPill.textContent = claimable >= 100 ? "Ready to claim" : "Keep earning";
  claimHistoryPill.textContent = state.walletClaims.length ? `${state.walletClaims.length} records` : "No claims yet";
  premiumGuidePill.textContent = unlockedRewards ? "Ready to compare" : "Value first";
  yourRankPoints.textContent = state.points;
  yourRankLabel.textContent = state.userName || "You";
  purposeCopy.textContent = purpose.copy;
  learnJourneyCopy.textContent = `${category.title} works best when the user moves from the brief to lesson questions, then to visual practice and tools.`;
  rewardJourneyCopy.textContent = nextReward
    ? `Every point now pushes toward ${nextReward.title}, while claim records stay tied to real activity.`
    : "All current reward tiers are open, so the focus shifts to record quality and future value.";
  rewardCenterCopy.textContent = claimable >= 100
    ? "You have enough fresh progress for the Rewards page to feel active right now: review the center, then create a claim preview record."
    : "The Rewards page now shows what is unlocked, what is close, and exactly how much progress is still needed.";
  premiumGuideCopy.textContent = unlockedRewards
    ? "Premium now feels like a deeper layer of something the user already trusts."
    : "Premium stays visible, but Questora should still prove itself through free learning first.";
  visualPill.textContent = `${aiArtLibrary.length.toLocaleString()} art scenes`;
  visualCopy.textContent = `${todaysVisuals.length} rotating visual tasks are live today for ${category.title}. Questora now pulls from a large AI-art library so users keep seeing new lesson moments.`;
  pulseCopy.textContent = `${state.country}, ${state.language}, ${state.goal}, and ${category.title} are shaping today's feed so Questora feels more alive and less repetitive.`;
  nextPill.textContent = nextReward ? `${nextReward.need - state.points} pts left` : "All unlocked";
  missionCopy.textContent = dailyDone
    ? "Today's question is complete. Keep the flow moving through lessons, rewards, and premium previews."
    : "Start with today's question, then keep moving through lessons, rewards, and premium previews.";

  document.documentElement.classList.toggle("high-contrast", state.highContrast);
  document.documentElement.classList.toggle("large-text", state.largeText);

  choiceButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.age === state.age);
  });

  categoryGrid.innerHTML = categories
    .map(
      (item) => `
        <button class="category-card ${item.style} ${item.key === state.category ? "active" : ""}" data-category="${item.key}" type="button">
          <strong>${item.title}</strong>
          <span>${item.summary}</span>
        </button>
      `,
    )
    .join("");

  const research = researchLibrary[category.key];
  researchPanel.innerHTML = `
    <div class="research-header">
      <div>
        <p class="eyebrow">Permanent Research</p>
        <h3>${category.title} library</h3>
      </div>
      <span>${research.count.toLocaleString()} pages</span>
    </div>
    <blockquote>${research.quote}</blockquote>
    <div class="research-pages">
      ${research.pages
        .map(
          (page, index) => `
            <article class="research-page">
              <strong>Page ${index + 1}: ${page.title}</strong>
              <p>${page.hint}</p>
              <span>${page.action}</span>
            </article>
          `,
        )
        .join("")}
    </div>
  `;

  learnJourneyGrid.innerHTML = journey
    .map(
      (item, index) => `
        <article class="learn-journey-step ${item.done ? "done" : ""}">
          <span>${index + 1}</span>
          <div>
            <strong>${item.title}</strong>
            <p>${item.body}</p>
          </div>
        </article>
      `,
    )
    .join("");

  featuredLessonCard.innerHTML = `
    <p class="quest-label">${category.title}</p>
    <h3>${firstOpenLesson.title}</h3>
    <p>${firstOpenLesson.body}</p>
    <strong>${firstOpenLesson.reward} - +${firstOpenLesson.points} pts</strong>
    <p class="featured-question">${firstOpenLesson.question}</p>
    <button class="featured-action" data-open-featured="${category.key}::${firstOpenLesson.key}" type="button">
      ${state.answered[`${category.key}::${firstOpenLesson.key}`] ? "Review lesson below" : "Answer this lesson below"}
    </button>
  `;

  surpriseGrid.innerHTML = homeSpotlights(
    category,
    dailyQuest,
    level,
    nextReward,
    claimable,
    record,
  )
    .map(
      (item) => `
        <button class="spotlight-card" data-open-page="${item.page}" type="button">
          <strong>${item.title}</strong>
          <p>${item.body}</p>
          <span>${item.cta}</span>
        </button>
      `,
    )
    .join("");

  pulseGrid.innerHTML = pulseCards
    .map(
      (item) => `
        <button class="pulse-card ${item.tone}" data-open-page="${item.page}" type="button">
          <p class="eyebrow">${item.label}</p>
          <strong>${item.title}</strong>
          <p>${item.body}</p>
        </button>
      `,
    )
    .join("");

  challengeCard.innerHTML = `
    <p class="quest-label">Bonus flow</p>
    <h3>${surpriseChallenge.title}</h3>
    <p>${surpriseChallenge.body}</p>
    <strong>${surpriseChallenge.reward}</strong>
    <p class="challenge-note">${surpriseChallenge.reason}</p>
    <p class="challenge-note">${surpriseChallenge.action}</p>
  `;

  globalGrid.innerHTML = globalMoments()
    .map(
      (item) => `
        <article class="global-card">
          <strong>${item.title}</strong>
          <p>${item.body}</p>
          <span>${item.badge}</span>
        </article>
      `,
    )
    .join("");

  purposeGrid.innerHTML = purpose.cards
    .map(
      (item) => `
        <article class="purpose-card">
          <strong>${item.title}</strong>
          <p>${item.body}</p>
        </article>
      `,
    )
    .join("");

  missionRail.innerHTML = steps
    .map(
      (step, index) => `
        <article class="mission-step ${step.done ? "done" : ""} ${index + 1 === activeStep ? "active" : ""}">
          <span>${index + 1}</span>
          <div>
            <strong>${step.title}</strong>
            <p>${step.body}</p>
          </div>
        </article>
      `,
    )
    .join("");

  nextGrid.innerHTML = nextUnlockCards(nextReward, claimable, unlockedRewards)
    .map(
      (card) => `
        <article class="next-card">
          <p class="eyebrow">${card.label}</p>
          <strong>${card.title}</strong>
          <p>${card.body}</p>
        </article>
      `,
    )
    .join("");

  dailyCard.className = `daily-card ${category.style}`;
  dailyCard.innerHTML = `
    <p class="quest-label">${category.title}</p>
    <h3>${dailyQuest.title}</h3>
    <p>${dailyQuest.body}</p>
    <strong class="reward-note">Correct answer earns +${dailyQuest.points} pts and saves today's win.</strong>
  `;
  if (dailyCardTop) {
    dailyCardTop.className = `daily-card ${category.style}`;
    dailyCardTop.innerHTML = `
      <p class="quest-label">${category.title}</p>
      <h3>${dailyQuest.title}</h3>
      <p>${dailyQuest.body}</p>
      <strong class="reward-note">Correct answer earns +${dailyQuest.points} pts and saves today's win.</strong>
    `;
  }

  const dailyAnswerMarkup = dailyQuest.answers
    .map(
      (answer, index) => `
        <button class="answer ${dailyDone && index === dailyQuest.correct ? "correct" : ""}" data-daily-answer="${index}" type="button" ${dailyDone ? "disabled" : ""}>${answer}</button>
      `,
    ).join("");
  dailyAnswerGrid.innerHTML = dailyAnswerMarkup;
  if (dailyAnswerGridTop) dailyAnswerGridTop.innerHTML = dailyAnswerMarkup;
  const dailyFeedbackText = dailyDone
    ? "Daily learning completed. Come back tomorrow for a new reward."
    : dailyQuest.question;
  dailyFeedback.textContent = dailyFeedbackText;
  if (dailyFeedbackTop) dailyFeedbackTop.textContent = dailyFeedbackText;

  lessonGrid.innerHTML = category.lessons
    .map((lesson) => {
      const key = `${category.key}::${lesson.key}`;
      const answered = state.answered[key];
      return `
        <article class="lesson-card styled-card ${category.style} ${answered ? "claimed" : ""}">
          <strong>${lesson.title}</strong>
          <p>${lesson.body}</p>
          <span>${lesson.reward} - +${lesson.points} pts</span>
          <div class="mini-question">
            <p>${lesson.question}</p>
            <small>${answered ? "Completed and saved." : "Pick one answer. Right turns green and wrong turns red."}</small>
            ${lesson.answers
              .map(
                (answer, index) => `
                  <button class="mini-answer ${answered && index === lesson.correct ? "correct" : ""}" data-lesson="${key}" data-index="${index}" type="button" ${answered ? "disabled" : ""}>${answer}</button>
                `,
              )
              .join("")}
          </div>
        </article>
      `;
    })
    .join("");

  rewardGrid.innerHTML = rewards
    .map((reward) => {
      const unlocked = state.points >= reward.need;
      const progress = Math.min(100, Math.max(0, Math.round((state.points / reward.need) * 100)));
      return `
        <article class="reward-card ${unlocked ? "unlocked" : ""}">
          <p class="eyebrow">${unlocked ? "Unlocked" : "In progress"}</p>
          <strong>${reward.title}</strong>
          <p>${reward.value}</p>
          <div class="reward-meter" aria-hidden="true">
            <span style="width:${progress}%"></span>
          </div>
          <span>${unlocked ? "Unlocked" : `${reward.need - state.points} pts left`}</span>
        </article>
      `;
    })
    .join("");

  rewardCenterGrid.innerHTML = rewardCenter
    .map(
      (card) => `
        <article class="reward-center-card ${card.tone}">
          <p class="eyebrow">${card.label}</p>
          <strong>${card.title}</strong>
          <p>${card.body}</p>
        </article>
      `,
    )
    .join("");

  rewardJourneyGrid.innerHTML = rewardFlow
    .map(
      (item) => `
        <article class="reward-journey-card ${item.state}">
          <strong>${item.title}</strong>
          <p>${item.body}</p>
        </article>
      `,
    )
    .join("");

  claimHistoryList.innerHTML = state.walletClaims.length
    ? state.walletClaims
        .slice()
        .reverse()
        .map(
          (claim, index) => `
            <article class="claim-history-card">
              <strong>Claim preview ${state.walletClaims.length - index}</strong>
              <p>${claim.points} pts recorded on ${claim.date}.</p>
              <span>This is a preview record only until approved Pi wallet payout flow is added.</span>
            </article>
          `,
        )
        .join("")
    : `
        <article class="claim-history-card empty">
          <strong>No claim previews yet</strong>
          <p>Earn at least 100 fresh points, then create your first claim preview record here.</p>
          <span>Questora keeps the rules visible so reward history feels trustworthy.</span>
        </article>
      `;

  visualGrid.innerHTML = todaysVisuals
    .map((task) => {
      const key = `visual::${task.key}`;
      const answered = state.answered[key];
      return `
        <article class="visual-card ${answered ? "claimed" : ""}">
          ${renderScene(task.scene)}
          <div class="visual-copy">
            <strong>${task.title}</strong>
            <p>${task.prompt}</p>
            <span>${task.artLabel}</span>
            <b>${answered ? task.lesson : `Earn +${task.points} pts`}</b>
          </div>
          <div class="mini-question">
            <p>${task.question}</p>
            <small>${answered ? "Visual lesson completed." : "Select the clearest answer from what the image is teaching."}</small>
            ${task.answers
              .map(
                (answer, index) => `
                  <button class="mini-answer ${answered && index === task.correct ? "correct" : ""}" data-visual="${task.key}" data-index="${index}" type="button" ${answered ? "disabled" : ""}>${answer}</button>
                `,
              )
              .join("")}
          </div>
        </article>
      `;
    })
    .join("");

  ethicsList.innerHTML = ethicsStatements
    .map((statement) => {
      const saved = state.ethics[statement.key];
      return `
        <article class="ethics-card ${saved ? "answered" : ""}">
          <p>${statement.text}</p>
          <div class="rating-row">
            ${ratingOptions
              .map(
                (option, index) => `
                  <button class="rating-button ${saved === index ? "selected" : ""}" data-ethics="${statement.key}" data-value="${index}" type="button">${option}</button>
                `,
              )
              .join("")}
          </div>
        </article>
      `;
    })
    .join("");

  toolGrid.innerHTML = tools
    .map((tool) => {
      const claimed = state.claimed[tool.key];
      return `
        <button class="tool-card ${claimed ? "claimed" : ""}" data-tool="${tool.key}" data-points="${tool.points}" type="button">
          <strong>${tool.title}</strong>
          <p>${tool.body}</p>
          <span>${claimed ? "Used" : `Earn +${tool.points} pts`}</span>
        </button>
      `;
    })
    .join("");

  premiumGrid.innerHTML = premiumPacks
    .map(
      (pack) => `
        <button class="premium-card ${state.selectedPremium === pack.key ? "active" : ""}" data-premium="${pack.key}" type="button">
          <strong>${pack.title}</strong>
          <p>${pack.body}</p>
          <span>${pack.price} example access</span>
        </button>
      `,
    )
    .join("");

  const selectedPack = premiumPacks.find((pack) => pack.key === state.selectedPremium) || premiumPacks[0];
  const premiumCompare = premiumCompareCards(selectedPack, unlockedRewards, claimable);
  premiumComparePill.textContent = selectedPack.title;
  premiumCompareCopy.textContent = `${selectedPack.title} should feel clear before payment: what it improves, what stays free, and why ${selectedPack.price} is only a preview until the Pi backend flow is completed.`;
  premiumGuideGrid.innerHTML = premiumFlow
    .map(
      (item) => `
        <article class="premium-guide-card ${item.tone}">
          <strong>${item.title}</strong>
          <p>${item.body}</p>
        </article>
      `,
    )
    .join("");
  premiumCompareGrid.innerHTML = premiumCompare
    .map(
      (item) => `
        <article class="premium-compare-card ${item.tone}">
          <p class="eyebrow">${item.label}</p>
          <strong>${item.title}</strong>
          <p>${item.body}</p>
        </article>
      `,
    )
    .join("");
  premiumDetail.innerHTML = `
    <div class="premium-detail-card">
      <p class="quest-label">Premium learning preview</p>
      <h3>${selectedPack.title}</h3>
      <p>${selectedPack.body}</p>
      <ul>
        ${selectedPack.tips.map((tip) => `<li>${tip}</li>`).join("")}
      </ul>
      <div class="premium-detail-meta">
        <span>Example access: ${selectedPack.price}</span>
        <span>Free learning remains available</span>
      </div>
      <button type="button" id="premiumAccessButton">Preview ${selectedPack.price} access</button>
    </div>
  `;

  walletClaimAmount.textContent = `${claimable} points ready`;
  walletPill.textContent = state.walletClaims.length ? `${state.walletClaims.length} claims` : "Preview";
  claimWalletButton.disabled = claimable < 100;
  renderPages();
}

function currentDailyQuest(category) {
  const options = dailyRotation[category.key] || [category.daily];
  const dayNumber = Math.floor(new Date(todayKey).getTime() / 86400000);
  return options[dayNumber % options.length];
}

function renderScene(scene) {
  if (typeof scene === "object") {
    const { type, palette, style, frame } = scene;
    const accent = palette.accent;
    const support = palette.support;
    const extra = palette.extra;
    const header = `
      <rect width="260" height="150" rx="8" fill="${palette.background}" />
      <rect x="16" y="16" width="228" height="118" rx="12" fill="rgba(255,255,255,0.76)" stroke="${support}" stroke-width="2" />
      <text x="28" y="34" fill="${support}" font-size="10" font-weight="700">${style.label}</text>
      <text x="182" y="34" fill="${accent}" font-size="10" font-weight="700">${frame.label}</text>
    `;
    const artShapes = {
      phone: `
        <rect x="92" y="36" width="76" height="86" rx="12" fill="#fff" stroke="${support}" stroke-width="6" />
        <path d="M111 58h38M111 76h28M111 94h42" stroke="${support}" stroke-width="7" stroke-linecap="round" />
        <circle cx="130" cy="112" r="5" fill="${accent}" />
        <circle cx="62" cy="54" r="18" fill="${accent}" />
        <path d="M190 52l12 12 22-24" fill="none" stroke="${extra}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
      `,
      family: `
        <rect x="50" y="98" width="160" height="20" rx="9" fill="${accent}" />
        <circle cx="80" cy="66" r="18" fill="${support}" />
        <circle cx="130" cy="56" r="22" fill="${extra}" />
        <circle cx="182" cy="68" r="18" fill="${accent}" />
        <path d="M60 100c7-25 33-25 40 0M109 100c8-31 36-31 43 0M164 100c6-24 29-24 36 0" fill="#fff" opacity=".92" />
        <path d="M90 38h80" stroke="${support}" stroke-width="8" stroke-linecap="round" />
      `,
      market: `
        <rect x="34" y="40" width="74" height="82" rx="10" fill="#fff" stroke="${accent}" stroke-width="5" />
        <rect x="152" y="40" width="74" height="82" rx="10" fill="#fff" stroke="${support}" stroke-width="5" />
        <path d="M51 60h40M51 80h28M51 100h46M169 60h40M169 80h28M169 100h46" stroke="#6f6878" stroke-width="6" stroke-linecap="round" />
        <circle cx="130" cy="82" r="18" fill="${extra}" />
        <path d="M122 82h16M130 74v16" stroke="${support}" stroke-width="5" stroke-linecap="round" />
      `,
      lab: `
        <circle cx="58" cy="46" r="20" fill="${accent}" />
        <rect x="136" y="38" width="68" height="80" rx="10" fill="#fff" stroke="${support}" stroke-width="5" />
        <path d="M155 96c0-21 18-31 32-45" stroke="${extra}" stroke-width="7" fill="none" stroke-linecap="round" />
        <path d="M156 72c-14-7-21-16-24-25M170 70c12-10 24-11 35-8" stroke="${extra}" stroke-width="7" fill="none" stroke-linecap="round" />
        <path d="M46 108h72M58 88h44" stroke="${support}" stroke-width="8" stroke-linecap="round" />
        <circle cx="86" cy="64" r="12" fill="${support}" />
      `,
      pet: `
        <circle cx="88" cy="72" r="28" fill="${support}" />
        <circle cx="69" cy="44" r="11" fill="${support}" />
        <circle cx="107" cy="44" r="11" fill="${support}" />
        <circle cx="78" cy="70" r="4" fill="#fff" />
        <circle cx="99" cy="70" r="4" fill="#fff" />
        <path d="M82 86c8 7 16 7 24 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" />
        <rect x="150" y="42" width="68" height="72" rx="10" fill="#fff" stroke="${extra}" stroke-width="5" />
        <path d="M164 64h34M164 82h28M164 100h38" stroke="#6f6878" stroke-width="6" stroke-linecap="round" />
      `,
      engineering: `
        <circle cx="56" cy="50" r="18" fill="${accent}" />
        <circle cx="92" cy="82" r="14" fill="${support}" />
        <rect x="142" y="38" width="70" height="82" rx="12" fill="#fff" stroke="${extra}" stroke-width="5" />
        <path d="M132 52h68" stroke="${support}" stroke-width="8" stroke-linecap="round" />
        <path d="M82 100h42M72 118h62" stroke="${support}" stroke-width="8" stroke-linecap="round" />
        <path d="M140 74c16 4 24 15 28 30M178 66c-18 10-24 16-30 32" stroke="${extra}" stroke-width="7" fill="none" stroke-linecap="round" />
      `,
    };
    return `
      <svg class="task-image" viewBox="0 0 260 150" role="img" aria-label="${style.label} ${type} learning art">
        ${header}
        ${artShapes[type] || artShapes.phone}
      </svg>
    `;
  }
  const scenes = {
    phone: `
      <svg class="task-image" viewBox="0 0 260 150" role="img" aria-label="Phone with a suspicious reward message">
        <rect width="260" height="150" rx="8" fill="#f7f0ff" />
        <rect x="86" y="18" width="88" height="114" rx="12" fill="#45215f" />
        <rect x="96" y="34" width="68" height="78" rx="6" fill="#fff" />
        <circle cx="130" cy="122" r="4" fill="#f5b83b" />
        <path d="M109 56h42M109 73h32M109 90h48" stroke="#6b3a99" stroke-width="7" stroke-linecap="round" />
        <path d="M187 42l13 13 27-29" fill="none" stroke="#24a86b" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `,
    family: `
      <svg class="task-image" viewBox="0 0 260 150" role="img" aria-label="Family planning safe digital habits">
        <rect width="260" height="150" rx="8" fill="#eef7ff" />
        <rect x="54" y="92" width="152" height="18" rx="8" fill="#f5b83b" />
        <circle cx="82" cy="62" r="18" fill="#6b3a99" />
        <circle cx="130" cy="52" r="20" fill="#24a86b" />
        <circle cx="178" cy="64" r="17" fill="#2f74d0" />
        <path d="M62 93c6-24 34-24 40 0M108 93c7-30 37-30 44 0M160 93c5-22 31-22 36 0" fill="#fff" opacity=".9" />
        <path d="M92 30h76" stroke="#45215f" stroke-width="8" stroke-linecap="round" />
      </svg>
    `,
    market: `
      <svg class="task-image" viewBox="0 0 260 150" role="img" aria-label="User comparing marketplace offers">
        <rect width="260" height="150" rx="8" fill="#f1fff7" />
        <rect x="28" y="34" width="82" height="88" rx="8" fill="#fff" stroke="#24a86b" stroke-width="4" />
        <rect x="150" y="34" width="82" height="88" rx="8" fill="#fff" stroke="#6b3a99" stroke-width="4" />
        <path d="M47 58h44M47 78h30M47 98h48M169 58h44M169 78h30M169 98h48" stroke="#6f6878" stroke-width="6" stroke-linecap="round" />
        <circle cx="130" cy="78" r="20" fill="#f5b83b" />
        <path d="M122 78h16M130 70v16" stroke="#45215f" stroke-width="5" stroke-linecap="round" />
      </svg>
    `,
    lab: `
      <svg class="task-image" viewBox="0 0 260 150" role="img" aria-label="STEM lab with plant observation">
        <rect width="260" height="150" rx="8" fill="#eef7ff" />
        <circle cx="58" cy="42" r="22" fill="#f5b83b" />
        <rect x="132" y="36" width="72" height="82" rx="8" fill="#fff" stroke="#2f74d0" stroke-width="4" />
        <path d="M154 98c0-22 20-34 34-48" stroke="#24a86b" stroke-width="6" fill="none" stroke-linecap="round" />
        <path d="M154 73c-16-7-22-16-24-26M169 70c14-10 25-12 38-9" stroke="#24a86b" stroke-width="6" fill="none" stroke-linecap="round" />
        <path d="M45 106h72M55 86h48" stroke="#45215f" stroke-width="8" stroke-linecap="round" />
        <circle cx="84" cy="62" r="12" fill="#6b3a99" />
      </svg>
    `,
    pet: `
      <svg class="task-image" viewBox="0 0 260 150" role="img" aria-label="House pet care checklist">
        <rect width="260" height="150" rx="8" fill="#f1fff7" />
        <circle cx="89" cy="68" r="30" fill="#6b3a99" />
        <circle cx="70" cy="39" r="12" fill="#6b3a99" />
        <circle cx="108" cy="39" r="12" fill="#6b3a99" />
        <circle cx="78" cy="66" r="4" fill="#fff" />
        <circle cx="100" cy="66" r="4" fill="#fff" />
        <path d="M82 82c8 7 16 7 24 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" />
        <rect x="146" y="38" width="72" height="76" rx="8" fill="#fff" stroke="#24a86b" stroke-width="4" />
        <path d="M160 60h38M160 78h32M160 96h42" stroke="#6f6878" stroke-width="6" stroke-linecap="round" />
      </svg>
    `,
  };
  return scenes[scene] || scenes.phone;
}

function onIncompletePaymentFound(payment) {
  console.info("Incomplete Pi payment found", payment);
  postToBackend(BACKEND_ENDPOINTS.incomplete, { payment });
}

async function connectWithPi() {
  if (!initPiSdk()) {
    explain(
      "Pi SDK is not available here.",
      "Open Questora from Pi Browser sandbox so authentication and payments can pair with Pi.",
    );
    return;
  }

  try {
    const authResult = await window.Pi.authenticate(
      ["username", "payments"],
      onIncompletePaymentFound,
    );
    state.user = authResult.user;
    state.accessToken = authResult.accessToken;
    state.userName = state.user.username;
    userRecord();
    const verified = await postToBackend(BACKEND_ENDPOINTS.signin, { authResult });
    saveState();
    render();
    loginButton.textContent = "Connected";
    explain(
      verified
        ? `Connected and backend verified as ${state.userName}.`
        : `Connected as ${state.userName}, but backend verification is still needed.`,
      verified
        ? "Continue learning and claiming app-point rewards."
        : "Add /api/signin to verify the access token with Pi Platform API /v2/me.",
    );
  } catch (error) {
    console.error(error);
    explain("Pi login was not completed.", "Try again inside Pi Browser.");
  }
}

function paymentCallbacks(pack) {
  return {
    onReadyForServerApproval: (paymentId) => {
      explain("Payment created.", "Backend must approve it with Pi server approval.");
      postToBackend(BACKEND_ENDPOINTS.approve, { paymentId, packKey: pack.key });
    },
    onReadyForServerCompletion: (paymentId, txid) => {
      explain("Payment submitted to blockchain.", "Backend must complete it with Pi server completion.");
      postToBackend(BACKEND_ENDPOINTS.complete, { paymentId, txid, packKey: pack.key });
    },
    onCancel: (paymentId) => {
      explain(`Payment cancelled: ${paymentId}.`, "No premium access should unlock from a cancelled payment.");
    },
    onError: (error, payment) => {
      console.error("Pi payment error", error, payment);
      explain("Pi payment could not be completed.", "Check backend approval, completion, and incomplete-payment handling.");
    },
  };
}

async function requestPremiumPayment(pack) {
  if (!initPiSdk()) {
    explain("Pi payments need Pi Browser.", "Open Questora inside Pi Browser before using premium access.");
    return;
  }

  if (!state.user) {
    explain("Premium access needs a connected Pi user.", "Connect with Pi first, then open premium access.");
    return;
  }

  if (!PI_PAYMENTS_ENABLED) {
    explain(
      "Premium is paired with Pi payment callbacks, but live payment is disabled.",
      "Deploy backend approve and complete endpoints before enabling real 0.2 Pi access.",
    );
    return;
  }

  await window.Pi.createPayment(
    {
      amount: Number(pack.price.replace(" Pi", "")),
      memo: `Questora premium: ${pack.title}`,
      metadata: { packKey: pack.key, type: "premium-learning" },
    },
    paymentCallbacks(pack),
  );
}

function answerDaily(index) {
  const category = currentCategory();
  const dailyQuest = currentDailyQuest(category);
  const record = userRecord();
  if (record.lastDailyDate === todayKey) {
    explain("Today's daily learning reward is already saved.", "Keep scrolling to complete lessons, visual tasks, tools, and reflections.");
    return;
  }

  if (index !== dailyQuest.correct) {
    markAnswerState(dailyAnswerGrid, "[data-daily-answer]", index, dailyQuest.correct);
    dailyFeedback.textContent = "Not yet. Read the lesson and choose the safest answer.";
    explain("That answer is wrong because it does not match the lesson.", "Review the brief topic and choose the green safe answer.");
    return;
  }

  markAnswerState(dailyAnswerGrid, "[data-daily-answer]", index, dailyQuest.correct);
  record.lastDailyDate = todayKey;
  record.completedDays += 1;
  state.streak += 1;
  addPoints(dailyQuest.points, `Daily learning completed. You earned ${dailyQuest.points} points.`);
}

function answerLesson(key, index) {
  if (state.answered[key]) {
    explain("This lesson reward is already complete.", "Choose another lesson or scroll to visual tasks.");
    return;
  }

  const [categoryKey, lessonKey] = key.split("::");
  const category = categories.find((item) => item.key === categoryKey);
  const lesson = category?.lessons.find((item) => item.key === lessonKey);
  if (!lesson) return;

  if (index !== lesson.correct) {
    markAnswerState(lessonGrid, `[data-lesson="${key}"]`, index, lesson.correct);
    explain("That answer is wrong for this lesson.", "Read the lesson reason again and select the green answer.");
    return;
  }

  markAnswerState(lessonGrid, `[data-lesson="${key}"]`, index, lesson.correct);
  state.answered[key] = true;
  const record = userRecord();
  record.completedLessons.push(key);
  addPoints(lesson.points, `${lesson.reward} unlocked. You earned ${lesson.points} points.`);
}

function answerVisual(taskKey, index) {
  const task = aiArtLibrary.find((item) => item.key === taskKey);
  const answerKey = `visual::${taskKey}`;
  if (!task || state.answered[answerKey]) {
    explain("This visual task is already complete.", "Continue scrolling to another image or premium learning.");
    return;
  }

  if (index !== task.correct) {
    markAnswerState(visualGrid, `[data-visual="${taskKey}"]`, index, task.correct);
    explain("That visual answer is wrong.", "Look at the image again and pick what the scene is teaching.");
    return;
  }

  markAnswerState(visualGrid, `[data-visual="${taskKey}"]`, index, task.correct);
  state.answered[answerKey] = true;
  addPoints(task.points, `${task.lesson} You earned ${task.points} points.`);
}

function markAnswerState(container, selector, pickedIndex, correctIndex) {
  container.querySelectorAll(selector).forEach((button) => {
    const buttonIndex = Number(button.dataset.index ?? button.dataset.dailyAnswer);
    button.classList.remove("correct", "wrong");
    if (buttonIndex === correctIndex) button.classList.add("correct");
    if (buttonIndex === pickedIndex && pickedIndex !== correctIndex) button.classList.add("wrong");
  });
}

function rateEthics(statementKey, value) {
  const firstAnswer = state.ethics[statementKey] === undefined;
  state.ethics[statementKey] = value;

  if (firstAnswer) {
    addPoints(10, "Reflection saved. You earned 10 points for responsible thinking.");
    explain("Reflection saved because responsible thinking matters.", "Use the rating to compare your belief with safer AI practice.");
    return;
  }

  saveState();
  renderInPlace();
  explain("Reflection updated.", "Keep reviewing AI safety from design to launch.");
}

function claimTool(toolKey, points) {
  if (state.claimed[toolKey]) {
    explain("This tool reward is already claimed.", "Try another tool to keep earning.");
    return;
  }

  state.claimed[toolKey] = true;
  userRecord().completedTools.push(toolKey);
  addPoints(points, `Tool completed. You earned ${points} points.`);
}

function chooseAge(age) {
  state.age = age;
  saveState();
  renderInPlace();
  explain(`${state.age} path selected.`, "Questora will keep lessons family-friendly and matched to this path.");
}

function chooseGoal(goal) {
  state.goal = goal;
  saveState();
  renderInPlace();
  explain(`${state.goal} is now your main goal.`, "Use categories and daily questions that support this interest.");
}

function chooseCountry(country) {
  state.country = country;
  saveState();
  renderInPlace();
  explain(`${state.country} is now your region focus.`, "Questora will keep the home flow feeling more local while staying global.");
}

function chooseLanguage(language) {
  state.language = language;
  saveState();
  renderInPlace();
  explain(`${state.language} is selected for your experience.`, "This helps shape the global identity of your Questora profile.");
}

function selectTab(selectedTab) {
  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === selectedTab);
  });

  const content = tabContent[selectedTab];
  featurePanel.innerHTML = `<h2>${content.title}</h2><p>${content.body}</p>`;
}

function toggleLargeText() {
  state.largeText = !state.largeText;
  saveState();
  renderInPlace();
  explain(state.largeText ? "Bigger text is on." : "Bigger text is off.", "Use the setting that makes scrolling and learning easier.");
}

function toggleContrast() {
  state.highContrast = !state.highContrast;
  saveState();
  renderInPlace();
  explain(state.highContrast ? "High contrast is on." : "High contrast is off.", "Use the setting that makes answers and sections clearer.");
}

function resetProgress() {
  state.streak = 0;
  state.points = 0;
  state.badges = 0;
  state.record = {};
  state.claimed = {};
  state.answered = {};
  state.ethics = {};
  state.walletClaims = [];
  saveState();
  render();
  explain("Progress reset for a fresh test.", "Start again with a category and daily question.");
}

loginButton.addEventListener("click", connectWithPi);
textSizeButton.addEventListener("click", toggleLargeText);
contrastButton.addEventListener("click", toggleContrast);
resetButton.addEventListener("click", resetProgress);
choiceButtons.forEach((button) => {
  button.addEventListener("click", () => chooseAge(button.dataset.age));
});
goalSelect.addEventListener("change", () => chooseGoal(goalSelect.value));
countrySelect.addEventListener("change", () => chooseCountry(countrySelect.value));
languageSelect.addEventListener("change", () => chooseLanguage(languageSelect.value));
tabs.forEach((tab) => {
  tab.addEventListener("click", () => selectTab(tab.dataset.tab));
});
pageTabs.forEach((tab) => {
  tab.addEventListener("click", () => openPage(tab.dataset.pageTarget));
});
pageJumpButtons.forEach((button) => {
  button.addEventListener("click", () => openPage(button.dataset.pageJump));
});
surpriseGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-open-page]");
  if (!card) return;
  openPage(card.dataset.openPage);
});
categoryGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-category]");
  if (!card) return;
  state.category = card.dataset.category;
  saveState();
  render();
  explain(`${currentCategory().title} lessons loaded.`, "Answer the daily brief first, then scroll through lessons in this category.");
});
dailyAnswerGrid.addEventListener("click", (event) => {
  const answer = event.target.closest("[data-daily-answer]");
  if (!answer) return;
  answerDaily(Number(answer.dataset.dailyAnswer));
});
if (dailyAnswerGridTop) {
  dailyAnswerGridTop.addEventListener("click", (event) => {
    const answer = event.target.closest("[data-daily-answer]");
    if (!answer) return;
    answerDaily(Number(answer.dataset.dailyAnswer));
  });
}
lessonGrid.addEventListener("click", (event) => {
  const answer = event.target.closest("[data-lesson]");
  if (!answer) return;
  answerLesson(answer.dataset.lesson, Number(answer.dataset.index));
});
toolGrid.addEventListener("click", (event) => {
  const tool = event.target.closest("[data-tool]");
  if (!tool) return;
  claimTool(tool.dataset.tool, Number(tool.dataset.points));
});
visualGrid.addEventListener("click", (event) => {
  const answer = event.target.closest("[data-visual]");
  if (!answer) return;
  answerVisual(answer.dataset.visual, Number(answer.dataset.index));
});
ethicsList.addEventListener("click", (event) => {
  const answer = event.target.closest("[data-ethics]");
  if (!answer) return;
  rateEthics(answer.dataset.ethics, Number(answer.dataset.value));
});
premiumGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-premium]");
  if (!card) return;
  state.selectedPremium = card.dataset.premium;
  saveState();
  render();
  explain("Premium learning area opened.", "Read the tips now; real 0.2 Pi access needs backend payment verification before launch.");
});
premiumDetail.addEventListener("click", (event) => {
  if (!event.target.closest("#premiumAccessButton")) return;
  const pack = premiumPacks.find((item) => item.key === state.selectedPremium) || premiumPacks[0];
  requestPremiumPayment(pack);
});
featuredLessonCard.addEventListener("click", (event) => {
  const button = event.target.closest("[data-open-featured]");
  if (!button) return;
  const key = button.dataset.openFeatured;
  const target = lessonGrid.querySelector(`[data-lesson="${key}"]`);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "center" });
  explain("Featured lesson selected.", "Answer the highlighted lesson below to keep your learning flow moving.");
});
claimWalletButton.addEventListener("click", () => {
  const alreadyClaimed = state.walletClaims.reduce((sum, claim) => sum + claim.points, 0);
  const claimable = Math.max(0, state.points - alreadyClaimed);
  if (claimable < 100) {
    explain("Not enough new points for a claim record.", "Earn at least 100 new points by answering lessons and tasks.");
    return;
  }
  state.walletClaims.push({ points: claimable, date: todayKey });
  saveState();
  render();
  explain("Reward claim record created.", "Real wallet transfer needs approved Pi backend payments and clear reward rules.");
});

userRecord();
render();
