const { sendJson } = require("./_pi");

module.exports = async function handler(req, res) {
  const hasApiKey = Boolean(process.env.PI_API_KEY);

  sendJson(res, 200, {
    ok:        true,
    app:       "Questora",
    version:   "2.0.0",
    piReady:   hasApiKey,
    timestamp: new Date().toISOString(),
    message:   hasApiKey
      ? "Pi API key is configured. Backend is ready for payments and user verification."
      : "PI_API_KEY is not set. Add it in Vercel environment variables to enable payments.",
  });
};
