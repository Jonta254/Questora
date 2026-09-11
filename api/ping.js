const { sendJson } = require("./_pi");

module.exports = async function handler(req, res) {
  const hasSessionSecret = Boolean(process.env.QUESTORA_SESSION_SECRET?.length >= 32);

  sendJson(res, 200, {
    ok:        true,
    app:       "Questora",
    version:   "3.0.0-foundation",
    piReady:   hasSessionSecret,
    paymentsEnabled: false,
    timestamp: new Date().toISOString(),
    message:   hasSessionSecret
      ? "Signed Pi sessions are configured. Payments remain disabled."
      : "QUESTORA_SESSION_SECRET is not configured. Public browsing remains available.",
  });
};
