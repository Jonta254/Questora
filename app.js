const state = {
  streak: Number(localStorage.getItem("questora-streak") || 0),
  points: Number(localStorage.getItem("questora-points") || 0),
  badges: Number(localStorage.getItem("questora-badges") || 0),
  user: null,
};

const streakCount = document.querySelector("#streakCount");
const pointCount = document.querySelector("#pointCount");
const badgeCount = document.querySelector("#badgeCount");
const statusText = document.querySelector("#statusText");
const loginButton = document.querySelector("#loginButton");
const completeQuestButton = document.querySelector("#completeQuestButton");
const featurePanel = document.querySelector("#featurePanel");
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
}

function saveStats() {
  localStorage.setItem("questora-streak", String(state.streak));
  localStorage.setItem("questora-points", String(state.points));
  localStorage.setItem("questora-badges", String(state.badges));
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
    statusText.textContent = `Connected as ${state.user.username}.`;
    loginButton.textContent = "Connected";
  } catch (error) {
    console.error(error);
    statusText.textContent = "Pi login was not completed. Try again in Pi Browser.";
  }
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

function selectTab(selectedTab) {
  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === selectedTab);
  });

  const content = tabContent[selectedTab];
  featurePanel.innerHTML = `<h2>${content.title}</h2><p>${content.body}</p>`;
}

loginButton.addEventListener("click", connectWithPi);
completeQuestButton.addEventListener("click", completeQuest);
tabs.forEach((tab) => {
  tab.addEventListener("click", () => selectTab(tab.dataset.tab));
});

renderStats();
