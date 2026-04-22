const state = {
  streak: Number(localStorage.getItem("questora-streak") || 0),
  points: Number(localStorage.getItem("questora-points") || 0),
  badges: Number(localStorage.getItem("questora-badges") || 0),
  age: localStorage.getItem("questora-age") || "Kids",
  goal: localStorage.getItem("questora-goal") || "Pi safety",
  quizDone: localStorage.getItem("questora-quiz-done") === "true",
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
}

function saveStats() {
  localStorage.setItem("questora-streak", String(state.streak));
  localStorage.setItem("questora-points", String(state.points));
  localStorage.setItem("questora-badges", String(state.badges));
  localStorage.setItem("questora-age", state.age);
  localStorage.setItem("questora-goal", state.goal);
  localStorage.setItem("questora-quiz-done", String(state.quizDone));
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

loginButton.addEventListener("click", connectWithPi);
completeQuestButton.addEventListener("click", completeQuest);
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
