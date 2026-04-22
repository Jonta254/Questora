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
];

const rewards = [
  { key: "starter", title: "Starter Chest", need: 100, value: "Unlocks beginner tips" },
  { key: "safety", title: "Safety Shield", need: 250, value: "Unlocks safety checklist" },
  { key: "family", title: "Family Pack", need: 400, value: "Unlocks family quest ideas" },
  { key: "premium", title: "Future Premium", need: 700, value: "Preview for optional Pi utility packs" },
];

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
const dailyStatusPill = document.querySelector("#dailyStatusPill");
const categoryPill = document.querySelector("#categoryPill");
const categoryGrid = document.querySelector("#categoryGrid");
const dailyCard = document.querySelector("#dailyCard");
const dailyAnswerGrid = document.querySelector("#dailyAnswerGrid");
const dailyFeedback = document.querySelector("#dailyFeedback");
const lessonGrid = document.querySelector("#lessonGrid");
const rewardGrid = document.querySelector("#rewardGrid");
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
    unlockedRewards: [],
  };
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

  streakCount.textContent = state.streak;
  pointCount.textContent = state.points;
  badgeCount.textContent = state.badges;
  pathPill.textContent = state.age;
  goalSelect.value = state.goal;
  recordName.textContent = state.userName || "Guest learner";
  recordLevel.textContent = `Level ${Math.max(1, Math.floor(state.points / 150) + 1)}`;
  recordToday.textContent = dailyDone ? "Done" : "Waiting";
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
  saveState();
  render();
  statusText.textContent = "Progress reset for a fresh test.";
}

loginButton.addEventListener("click", connectWithPi);
textSizeButton.addEventListener("click", toggleLargeText);
contrastButton.addEventListener("click", toggleContrast);
resetButton.addEventListener("click", resetProgress);
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

userRecord();
render();
