const todayKey = new Date().toISOString().slice(0, 10);

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

const visualTasks = [
  {
    key: "safe-link",
    title: "What do you see?",
    scene: "phone",
    points: 35,
    prompt: "A phone shows a message promising instant rewards from an unknown link.",
    question: "What is the safest action?",
    answers: ["Open quickly", "Check the source first", "Share your passphrase"],
    correct: 1,
    lesson: "Unknown reward links can be risky. Check the source before tapping.",
  },
  {
    key: "family-plan",
    title: "Family learning moment",
    scene: "family",
    points: 30,
    prompt: "A family is planning device rules together at a table.",
    question: "What can they learn?",
    answers: ["Agree on safe rules", "Hide all problems", "Click every offer"],
    correct: 0,
    lesson: "Shared rules help kids, teens, and adults stay safer online.",
  },
  {
    key: "market-choice",
    title: "Marketplace decision",
    scene: "market",
    points: 35,
    prompt: "A user compares two offers before spending points or future Pi.",
    question: "What should the user check?",
    answers: ["Only bright colors", "Value and clear terms", "Pressure words"],
    correct: 1,
    lesson: "Good choices come from value, clear terms, and no pressure.",
  },
  {
    key: "stem-lab",
    title: "What is happening?",
    scene: "lab",
    points: 40,
    prompt: "A learner tests a plant near light and records what changes.",
    question: "What STEM skill are they using?",
    answers: ["Observation and testing", "Guessing without looking", "Copying a secret"],
    correct: 0,
    lesson: "STEM grows when you observe, test, record, and improve.",
  },
  {
    key: "pet-care",
    title: "Pet care check",
    scene: "pet",
    points: 40,
    prompt: "A house pet sits near a bowl, clean space, and care checklist.",
    question: "What should the owner check every day?",
    answers: ["Water, food, space, mood", "Only decorations", "Nothing until problems grow"],
    correct: 0,
    lesson: "Daily care helps pets stay safer, calmer, and healthier.",
  },
];

const healthJourneyAreas = [
  {
    title: "Hydration and meals",
    action: "Drink clean water and choose one balanced meal with a fruit, vegetable, grain, or protein when available.",
    why: "Small food and water checks support energy for learning.",
  },
  {
    title: "Movement",
    action: "Move your body for 5 to 20 minutes: walk, stretch, dance, tidy, or do gentle exercise.",
    why: "Movement supports focus, mood, and long-term health.",
  },
  {
    title: "Rest and recovery",
    action: "Plan a better sleep step: reduce noise, lower screen time, or rest your mind before bed.",
    why: "Rest helps memory, patience, and decision making.",
  },
  {
    title: "Mind and kindness",
    action: "Do one calm action: breathe slowly, write gratitude, help someone, or speak kindly.",
    why: "Mental wellbeing grows through repeatable small care.",
  },
  {
    title: "Home and hygiene",
    action: "Clean one small area, wash hands, check clothing, or improve your home safety today.",
    why: "Clean spaces and hygiene protect individuals, families, and pets.",
  },
];

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
  category: localStorage.getItem("questora-category") || "safety",
  userName: localStorage.getItem("questora-user-name") || "",
  record: JSON.parse(localStorage.getItem("questora-record") || "{}"),
  claimed: JSON.parse(localStorage.getItem("questora-claimed") || "{}"),
  answered: JSON.parse(localStorage.getItem("questora-answered") || "{}"),
  ethics: JSON.parse(localStorage.getItem("questora-ethics") || "{}"),
  highContrast: localStorage.getItem("questora-high-contrast") === "true",
  largeText: localStorage.getItem("questora-large-text") === "true",
  user: null,
};

const streakCount = document.querySelector("#streakCount");
const pointCount = document.querySelector("#pointCount");
const badgeCount = document.querySelector("#badgeCount");
const statusText = document.querySelector("#statusText");
const loginButton = document.querySelector("#loginButton");
const featurePanel = document.querySelector("#featurePanel");
const choiceButtons = [...document.querySelectorAll(".choice")];
const goalSelect = document.querySelector("#goalSelect");
const pathPill = document.querySelector("#pathPill");
const tabs = [...document.querySelectorAll(".tab")];
const textSizeButton = document.querySelector("#textSizeButton");
const contrastButton = document.querySelector("#contrastButton");
const resetButton = document.querySelector("#resetButton");
const recordName = document.querySelector("#recordName");
const recordLevel = document.querySelector("#recordLevel");
const recordToday = document.querySelector("#recordToday");
const healthDayPill = document.querySelector("#healthDayPill");
const healthJourneyCard = document.querySelector("#healthJourneyCard");
const completeHealthButton = document.querySelector("#completeHealthButton");
const healthFeedback = document.querySelector("#healthFeedback");
const dailyStatusPill = document.querySelector("#dailyStatusPill");
const categoryPill = document.querySelector("#categoryPill");
const categoryGrid = document.querySelector("#categoryGrid");
const dailyCard = document.querySelector("#dailyCard");
const dailyAnswerGrid = document.querySelector("#dailyAnswerGrid");
const dailyFeedback = document.querySelector("#dailyFeedback");
const lessonGrid = document.querySelector("#lessonGrid");
const rewardGrid = document.querySelector("#rewardGrid");
const visualGrid = document.querySelector("#visualGrid");
const ethicsList = document.querySelector("#ethicsList");
const toolGrid = document.querySelector("#toolGrid");
const yourRankLabel = document.querySelector("#yourRankLabel");
const yourRankPoints = document.querySelector("#yourRankPoints");

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
  localStorage.setItem("questora-category", state.category);
  localStorage.setItem("questora-user-name", state.userName);
  localStorage.setItem("questora-record", JSON.stringify(state.record));
  localStorage.setItem("questora-claimed", JSON.stringify(state.claimed));
  localStorage.setItem("questora-answered", JSON.stringify(state.answered));
  localStorage.setItem("questora-ethics", JSON.stringify(state.ethics));
  localStorage.setItem("questora-high-contrast", String(state.highContrast));
  localStorage.setItem("questora-large-text", String(state.largeText));
}

function addPoints(points, reason) {
  state.points += points;
  if (state.points >= 250 && state.badges < 1) state.badges = 1;
  if (state.points >= 500 && state.badges < 2) state.badges = 2;
  if (state.points >= 900 && state.badges < 3) state.badges = 3;
  saveState();
  render();
  statusText.textContent = reason;
}

function render() {
  const category = currentCategory();
  const record = userRecord();
  const dailyDone = record.lastDailyDate === todayKey;
  const healthDone = record.lastHealthDate === todayKey;
  const healthDay = Math.min(record.completedHealthDays + (healthDone ? 0 : 1), 500);
  const healthTask = buildHealthTask(Math.max(1, healthDay));

  streakCount.textContent = state.streak;
  pointCount.textContent = state.points;
  badgeCount.textContent = state.badges;
  pathPill.textContent = state.age;
  goalSelect.value = state.goal;
  recordName.textContent = state.userName || "Guest learner";
  recordLevel.textContent = `Level ${Math.max(1, Math.floor(state.points / 150) + 1)}`;
  recordToday.textContent = dailyDone ? "Done" : "Waiting";
  healthDayPill.textContent = healthDone ? `Day ${record.completedHealthDays}` : `Day ${healthDay}`;
  completeHealthButton.disabled = healthDone || record.completedHealthDays >= 500;
  completeHealthButton.textContent = healthDone
    ? "Health follow-up done"
    : record.completedHealthDays >= 500
      ? "500-day journey complete"
      : "Complete health follow-up";
  healthJourneyCard.innerHTML = `
    <p class="quest-label">${healthTask.area}</p>
    <h3>Day ${healthTask.day}: ${healthTask.title}</h3>
    <p>${healthTask.action}</p>
    <span>${healthTask.why}</span>
  `;
  healthFeedback.textContent = healthDone
    ? "Today's health follow-up is already saved. Come back tomorrow for the next serving."
    : "Complete this balanced daily serving to continue your 500-day journey.";
  dailyStatusPill.textContent = dailyDone ? "Completed" : "Available";
  categoryPill.textContent = category.title;
  yourRankPoints.textContent = state.points;
  yourRankLabel.textContent = state.userName || "You";

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

  dailyCard.className = `daily-card ${category.style}`;
  dailyCard.innerHTML = `
    <p class="quest-label">${category.title}</p>
    <h3>${category.daily.title}</h3>
    <p>${category.daily.body}</p>
  `;

  dailyAnswerGrid.innerHTML = category.daily.answers
    .map(
      (answer, index) => `
        <button class="answer" data-daily-answer="${index}" type="button" ${dailyDone ? "disabled" : ""}>${answer}</button>
      `,
    )
    .join("");
  dailyFeedback.textContent = dailyDone
    ? "Daily learning completed. Come back tomorrow for a new reward."
    : category.daily.question;

  lessonGrid.innerHTML = category.lessons
    .map((lesson) => {
      const key = `${category.key}::${lesson.key}`;
      const answered = state.answered[key];
      return `
        <article class="lesson-card styled-card ${category.style} ${answered ? "claimed" : ""}">
          <strong>${lesson.title}</strong>
          <p>${lesson.body}</p>
          <span>${lesson.reward} • +${lesson.points} pts</span>
          <div class="mini-question">
            <p>${lesson.question}</p>
            ${lesson.answers
              .map(
                (answer, index) => `
                  <button class="mini-answer" data-lesson="${key}" data-index="${index}" type="button" ${answered ? "disabled" : ""}>${answer}</button>
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
      return `
        <article class="reward-card ${unlocked ? "unlocked" : ""}">
          <strong>${reward.title}</strong>
          <p>${reward.value}</p>
          <span>${unlocked ? "Unlocked" : `${reward.need - state.points} pts left`}</span>
        </article>
      `;
    })
    .join("");

  visualGrid.innerHTML = visualTasks
    .map((task) => {
      const key = `visual::${task.key}`;
      const answered = state.answered[key];
      return `
        <article class="visual-card ${answered ? "claimed" : ""}">
          ${renderScene(task.scene)}
          <div class="visual-copy">
            <strong>${task.title}</strong>
            <p>${task.prompt}</p>
            <span>${answered ? task.lesson : `Earn +${task.points} pts`}</span>
          </div>
          <div class="mini-question">
            <p>${task.question}</p>
            ${task.answers
              .map(
                (answer, index) => `
                  <button class="mini-answer" data-visual="${task.key}" data-index="${index}" type="button" ${answered ? "disabled" : ""}>${answer}</button>
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
}

function buildHealthTask(day) {
  const cappedDay = Math.min(Math.max(day, 1), 500);
  const area = healthJourneyAreas[(cappedDay - 1) % healthJourneyAreas.length];
  const cycle = Math.floor((cappedDay - 1) / healthJourneyAreas.length) + 1;
  const minutes = 5 + ((cappedDay - 1) % 4) * 5;
  return {
    day: cappedDay,
    area: area.title,
    title: `Balanced serving ${cycle}`,
    action: `${area.action} Aim for about ${minutes} minutes if it is safe for you.`,
    why: area.why,
  };
}

function renderScene(scene) {
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
}

async function connectWithPi() {
  if (!window.Pi) {
    statusText.textContent =
      "Pi SDK is not available. Open this app from the Pi Browser sandbox.";
    return;
  }

  try {
    window.Pi.init({ version: "2.0", sandbox: true });
    const authResult = await window.Pi.authenticate(
      ["username"],
      onIncompletePaymentFound,
    );
    state.user = authResult.user;
    state.userName = state.user.username;
    userRecord();
    saveState();
    render();
    loginButton.textContent = "Connected";
    statusText.textContent = `Connected as ${state.userName}. Your learning record is saved.`;
  } catch (error) {
    console.error(error);
    statusText.textContent = "Pi login was not completed. Try again in Pi Browser.";
  }
}

function answerDaily(index) {
  const category = currentCategory();
  const record = userRecord();
  if (record.lastDailyDate === todayKey) {
    statusText.textContent = "You already earned today's daily learning reward.";
    return;
  }

  if (index !== category.daily.correct) {
    dailyFeedback.textContent = "Not yet. Read the lesson and choose the safest answer.";
    return;
  }

  record.lastDailyDate = todayKey;
  record.completedDays += 1;
  state.streak += 1;
  addPoints(category.daily.points, `Daily learning completed. You earned ${category.daily.points} points.`);
}

function answerLesson(key, index) {
  if (state.answered[key]) {
    statusText.textContent = "Lesson already completed.";
    return;
  }

  const [categoryKey, lessonKey] = key.split("::");
  const category = categories.find((item) => item.key === categoryKey);
  const lesson = category?.lessons.find((item) => item.key === lessonKey);
  if (!lesson) return;

  if (index !== lesson.correct) {
    statusText.textContent = "Good try. Read the card and answer again.";
    return;
  }

  state.answered[key] = true;
  const record = userRecord();
  record.completedLessons.push(key);
  addPoints(lesson.points, `${lesson.reward} unlocked. You earned ${lesson.points} points.`);
}

function answerVisual(taskKey, index) {
  const task = visualTasks.find((item) => item.key === taskKey);
  const answerKey = `visual::${taskKey}`;
  if (!task || state.answered[answerKey]) {
    statusText.textContent = "Visual task already completed.";
    return;
  }

  if (index !== task.correct) {
    statusText.textContent = "Look again and choose the safest learning answer.";
    return;
  }

  state.answered[answerKey] = true;
  addPoints(task.points, `${task.lesson} You earned ${task.points} points.`);
}

function rateEthics(statementKey, value) {
  const firstAnswer = state.ethics[statementKey] === undefined;
  state.ethics[statementKey] = value;

  if (firstAnswer) {
    addPoints(10, "Reflection saved. You earned 10 points for responsible thinking.");
    return;
  }

  saveState();
  render();
  statusText.textContent = "Reflection updated.";
}

function completeHealthFollowUp() {
  const record = userRecord();
  if (record.lastHealthDate === todayKey) {
    statusText.textContent = "Today's health follow-up is already complete.";
    return;
  }

  if (record.completedHealthDays >= 500) {
    statusText.textContent = "The 500-day health journey is complete.";
    return;
  }

  record.completedHealthDays += 1;
  record.lastHealthDate = todayKey;
  addPoints(20, `Health day ${record.completedHealthDays} saved. You earned 20 points.`);
}

function claimTool(toolKey, points) {
  if (state.claimed[toolKey]) {
    statusText.textContent = "Tool already used. Try another one.";
    return;
  }

  state.claimed[toolKey] = true;
  userRecord().completedTools.push(toolKey);
  addPoints(points, `Tool completed. You earned ${points} points.`);
}

function chooseAge(age) {
  state.age = age;
  saveState();
  render();
  statusText.textContent = `${state.age} path selected for ${state.goal}.`;
}

function chooseGoal(goal) {
  state.goal = goal;
  saveState();
  render();
  statusText.textContent = `${state.goal} is now your main goal.`;
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
  render();
  statusText.textContent = state.largeText ? "Bigger text is on." : "Bigger text is off.";
}

function toggleContrast() {
  state.highContrast = !state.highContrast;
  saveState();
  render();
  statusText.textContent = state.highContrast ? "High contrast is on." : "High contrast is off.";
}

function resetProgress() {
  state.streak = 0;
  state.points = 0;
  state.badges = 0;
  state.record = {};
  state.claimed = {};
  state.answered = {};
  state.ethics = {};
  saveState();
  render();
  statusText.textContent = "Progress reset for a fresh test.";
}

loginButton.addEventListener("click", connectWithPi);
textSizeButton.addEventListener("click", toggleLargeText);
contrastButton.addEventListener("click", toggleContrast);
resetButton.addEventListener("click", resetProgress);
completeHealthButton.addEventListener("click", completeHealthFollowUp);
choiceButtons.forEach((button) => {
  button.addEventListener("click", () => chooseAge(button.dataset.age));
});
goalSelect.addEventListener("change", () => chooseGoal(goalSelect.value));
tabs.forEach((tab) => {
  tab.addEventListener("click", () => selectTab(tab.dataset.tab));
});
categoryGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-category]");
  if (!card) return;
  state.category = card.dataset.category;
  saveState();
  render();
  statusText.textContent = `${currentCategory().title} lessons loaded.`;
});
dailyAnswerGrid.addEventListener("click", (event) => {
  const answer = event.target.closest("[data-daily-answer]");
  if (!answer) return;
  answerDaily(Number(answer.dataset.dailyAnswer));
});
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

userRecord();
render();
