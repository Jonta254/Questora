const { allowPostOnly, ensureApiKey, piRequest, readJsonBody, sendJson } = require("./_pi");

// In-memory leaderboard seed — real version would use a database
const SEED_LEADERS = [
  { username: "PiNova254",    country: "Kenya",       points: 2840, rank: "Contributor", streak: 42 },
  { username: "SafeChain_NG", country: "Nigeria",     points: 2190, rank: "Contributor", streak: 31 },
  { username: "MinerLex",     country: "Philippines", points: 1720, rank: "Miner",       streak: 28 },
  { username: "TrustCircle",  country: "India",       points: 1450, rank: "Miner",       streak: 21 },
  { username: "PiKE_Brazil",  country: "Brazil",      points: 1180, rank: "Miner",       streak: 17 },
  { username: "SafeMiner_IN", country: "Indonesia",   points:  940, rank: "Miner",       streak: 14 },
  { username: "Pioneer_VN",   country: "Vietnam",     points:  720, rank: "Pioneer",     streak: 10 },
  { username: "QuestPH",      country: "Philippines", points:  610, rank: "Pioneer",     streak:  9 },
  { username: "Pi_SA",        country: "South Africa",points:  480, rank: "Pioneer",     streak:  7 },
  { username: "KindPioneer",  country: "Ghana",       points:  310, rank: "Pioneer",     streak:  5 },
];

module.exports = async function handler(req, res) {
  // Support both GET and POST
  if (req.method !== "GET" && req.method !== "POST") {
    sendJson(res, 405, { ok: false, error: "Use GET or POST." });
    return;
  }

  let userPoints = 0;
  let username = "";

  if (req.method === "POST") {
    try {
      const body = await readJsonBody(req);
      userPoints = Number(body?.points) || 0;
      username   = String(body?.username || "").slice(0, 32);
    } catch (_) {
      // ignore parse errors
    }
  }

  // Merge user into leaderboard if they have a username and points
  let leaders = [...SEED_LEADERS];
  if (username && userPoints > 0) {
    const existing = leaders.findIndex(l => l.username === username);
    const userEntry = {
      username,
      country: "Your region",
      points: userPoints,
      rank: getRank(userPoints),
      streak: 0,
      isYou: true,
    };
    if (existing >= 0) {
      leaders[existing] = { ...leaders[existing], ...userEntry };
    } else {
      leaders.push(userEntry);
    }
  }

  // Sort by points descending
  leaders.sort((a, b) => b.points - a.points);

  // Take top 10
  const top = leaders.slice(0, 10).map((l, i) => ({
    position: i + 1,
    username: l.username,
    country:  l.country,
    points:   l.points,
    rank:     l.rank,
    streak:   l.streak || 0,
    isYou:    l.isYou || false,
  }));

  sendJson(res, 200, {
    ok: true,
    leaderboard: top,
    total: leaders.length,
    updatedAt: new Date().toISOString(),
  });
};

function getRank(pts) {
  if (pts >= 3500) return "Ambassador";
  if (pts >= 1800) return "Contributor";
  if (pts >= 800)  return "Miner";
  if (pts >= 300)  return "Pioneer";
  return "Explorer";
}
