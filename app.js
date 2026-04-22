const state = {
  streak: Number(localStorage.getItem("questora-streak") || 0),
  points: Number(localStorage.getItem("questora-points") || 0),
  badges: Number(localStorage.getItem("questora-badges") || 0),
  age: localStorage.getItem("questora-age") || "Kids",
  goal: localStorage.getItem("questora-goal") || "Pi safety",
  quizDone: localStorage.getItem("questora-quiz-done") === "true",
  claimed: JSON.parse(localStorage.getItem("questora-claimed") || "{}"),
  highContrast: localStorage.getItem("questora-high-contrast") === "true",
  largeText: localStorage.getItem("questora-large-text") === "true",
  user: null,
};

const streakCount = document.querySelector("#streakCount");
const pointCount = document.querySelector("#pointCount");
const badgeCount = document.querySelector("#badgeCount");
const statusText = document.querySelector("#statusText");
const loginButton = document.querySelector("#loginButton");
const completeQuestButton = document.querySelector("#completeQuestButton");
const featurePanel = document.querySelector("#featurePanel");
const choiceButtons = [...document.querySelectorAll(".choice")];
const goalSelect = document.querySelector("#goalSelect");
const pathPill = document.querySelector("#pathPill");
const answerButtons = [...document.querySelectorAll(".answer")];
const quizFeedback = document.querySelector("#quizFeedback");
const yourRankLabel = document.querySelector("#yourRankLabel");
const yourRankPoints = document.querySelector("#yourRankPoints");
const tabs = [...document.querySelectorAll(".tab")];
const textSizeButton = document.querySelector("#textSizeButton");
const contrastButton = document.querySelector("#contrastButton");
const resetButton = document.querySelector("#resetButton");
const boosterButtons = [...document.querySelectorAll(".booster")];
const lessonGrid = document.querySelector("#lessonGrid");
const toolGrid = document.querySelector("#toolGrid");

const lessons = [
  {
    key: "wallet-safety",
    title: "Wallet safety basics",
    body: "Learn what never to share and how to protect your passphrase.",
    points: 35,
  },
  {
    key: "mainnet-ready",
    title: "Mainnet readiness",
    body: "Understand why real utility, trust, and clear rules matter.",
    points: 30,
  },
  {
    key: "family-digital",
    title: "Family digital safety",
    body: "Simple safety habits for kids, teens, parents, and guardians.",
    points: 25,
  },
  {
    key: "money-basics",
    title: "Money basics",
    body: "Practice saving goals, spending choices, and reward planning.",
    points: 25,
  },
];

const tools = [
  {
    key: "scam-checker",
    title: "Scam checker",
    body: "Review a claim and decide if it sounds safe, risky, or fake.",
    points: 30,
  },
  {
    key: "goal-planner",
    title: "Goal planner",
    body: "Pick one weekly learning goal and turn it into small quests.",
    points: 25,
  },
  {
    key: "streak-builder",
    title: "Streak builder",
    body: "Choose a simple daily action that helps you return tomorrow.",
    points: 20,
  },
  {
    key: "invite-builder",
    title: "Invite builder",
    body: "Create a friendly reason for someone to join Questora.",
    points: 20,
  },
];

const tabContent = {
  learn: {
    title: "Pi safety lessons",
    body: "Short lessons teach users how to avoid scams, protect wallets, and use ecosystem apps with confidence.",
  },
  family: {
    title: "Family-friendly quests",
    body: "Kids, teens, adults, and parents get simple positive missions that build safe habits and daily progress.",
  },
  rank: {
    title: "Global leaderboards",
    body: "Users can compare points by country, streak, and quest category while keeping privacy controls simple.",
  },
};

function renderStats() {
  streakCount.textContent = state.streak;
  pointCount.textContent = state.points;
  badgeCount.textContent = state.badges;
  pathPill.textContent = state.age;
  goalSelect.value = state.goal;
  yourRankPoints.textContent = state.points;
  yourRankLabel.textContent = state.user?.username || "You";

  choiceButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.age === state.age);
  });

  if (state.quizDone) {
    quizFeedback.textContent = "Quiz completed. Come back tomorrow for a new one.";
  }

  document.documentElement.classList.toggle("high-contrast", state.highContrast);
  document.documentElement.classList.toggle("large-text", state.largeText);

  boosterButtons.forEach((button) => {
    button.classList.toggle("claimed", Boolean(state.claimed[button.dataset.key]));
  });

  renderRewardCards(lessonGrid, lessons, "lesson");
  renderRewardCards(toolGrid, tools, "tool");
}

function saveStats() {
  localStorage.setItem("questora-streak", String(state.streak));
  localStorage.setItem("questora-points", String(state.points));
  localStorage.setItem("questora-badges", String(state.badges));
  localStorage.setItem("questora-age", state.age);
  localStorage.setItem("questora-goal", state.goal);
  localStorage.setItem("questora-quiz-done", String(state.quizDone));
  localStorage.setItem("questora-claimed", JSON.stringify(state.claimed));
  localStorage.setItem("questora-high-contrast", String(state.highContrast));
  localStorage.setItem("questora-large-text", String(state.largeText));
}

function renderRewardCards(container, items, type) {
  container.innerHTML = items
    .map((item) => {
      const claimed = Boolean(state.claimed[item.key]);
      const label = claimed ? "Completed" : `Earn +${item.points} pts`;
      return `
        <button class="${type}-card ${claimed ? "claimed" : ""}" data-reward="${item.key}" data-points="${item.points}" type="button">
          <strong>${item.title}</strong>
          <p>${item.body}</p>
          <span>${label}</span>
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
    yourRankLabel.textContent = state.user.username;
    statusText.textContent = `Connected as ${state.user.username}.`;
    loginButton.textContent = "Connected";
  } catch (error) {
    console.error(error);
    statusText.textContent = "Pi login was not completed. Try again in Pi Browser.";
  }
}

function chooseAge(age) {
  state.age = age;
  saveStats();
  renderStats();
  statusText.textContent = `${state.age} path selected for ${state.goal}.`;
}

function chooseGoal(goal) {
  state.goal = goal;
  saveStats();
  renderStats();
  statusText.textContent = `${state.goal} is now your main goal.`;
}

function completeQuest() {
  state.streak += 1;
  state.points += 25;

  if (state.streak === 3 || state.streak === 7 || state.streak % 10 === 0) {
    state.badges += 1;
  }

  saveStats();
  renderStats();
  completeQuestButton.textContent = "Quest complete";
  statusText.textContent = "Nice work. Your daily progress was saved on this device.";
}

function claimReward(key, points, message) {
  if (state.claimed[key]) {
    statusText.textContent = "Already completed. Try another learning task.";
    return;
  }

  state.claimed[key] = true;
  state.points += points;

  if (Object.keys(state.claimed).length === 4 || Object.keys(state.claimed).length === 8) {
    state.badges += 1;
  }

  saveStats();
  renderStats();
  statusText.textContent = message;
}

function answerQuiz(button) {
  if (state.quizDone) {
    return;
  }

  const isCorrect = button.dataset.correct === "true";
  button.classList.add(isCorrect ? "correct" : "wrong");

  if (!isCorrect) {
    quizFeedback.textContent = "Good try. Pick the answer that avoids fake promises and protects users.";
    return;
  }

  state.quizDone = true;
  state.points += 15;
  quizFeedback.textContent = "Correct. Safety and trust are what will earn strong ratings.";
  saveStats();
  renderStats();
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
  saveStats();
  renderStats();
  statusText.textContent = state.largeText ? "Bigger text is on." : "Bigger text is off.";
}

function toggleContrast() {
  state.highContrast = !state.highContrast;
  saveStats();
  renderStats();
  statusText.textContent = state.highContrast ? "High contrast is on." : "High contrast is off.";
}

function resetProgress() {
  state.streak = 0;
  state.points = 0;
  state.badges = 0;
  state.quizDone = false;
  state.claimed = {};
  answerButtons.forEach((button) => button.classList.remove("correct", "wrong"));
  completeQuestButton.textContent = "Finish quest";
  quizFeedback.textContent = "Pick the safest answer.";
  saveStats();
  renderStats();
  statusText.textContent = "Progress reset for a fresh test.";
}

loginButton.addEventListener("click", connectWithPi);
completeQuestButton.addEventListener("click", completeQuest);
textSizeButton.addEventListener("click", toggleLargeText);
contrastButton.addEventListener("click", toggleContrast);
resetButton.addEventListener("click", resetProgress);
boosterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    claimReward(
      button.dataset.key,
      Number(button.dataset.points),
      `Point booster completed. You earned ${button.dataset.points} points.`,
    );
  });
});
lessonGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-reward]");
  if (!card) return;
  claimReward(
    card.dataset.reward,
    Number(card.dataset.points),
    `Lesson completed. You earned ${card.dataset.points} points.`,
  );
});
toolGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-reward]");
  if (!card) return;
  claimReward(
    card.dataset.reward,
    Number(card.dataset.points),
    `Tool completed. You earned ${card.dataset.points} points.`,
  );
});
choiceButtons.forEach((button) => {
  button.addEventListener("click", () => chooseAge(button.dataset.age));
});
goalSelect.addEventListener("change", () => chooseGoal(goalSelect.value));
answerButtons.forEach((button) => {
  button.addEventListener("click", () => answerQuiz(button));
});
tabs.forEach((tab) => {
  tab.addEventListener("click", () => selectTab(tab.dataset.tab));
});

renderStats();
