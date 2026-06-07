const { allowPostOnly, piRequest, readJsonBody, sendJson } = require("./_pi");

module.exports = async function handler(req, res) {
  if (!allowPostOnly(req, res)) return;

  try {
    const body        = await readJsonBody(req);
    const accessToken = body?.authResult?.accessToken || body?.accessToken;

    if (!accessToken) {
      sendJson(res, 400, { ok: false, error: "Missing accessToken." });
      return;
    }

    // Verify with Pi Platform API
    const verification = await piRequest("/v2/me", {
      method: "GET",
      auth:   "user",
      token:  accessToken,
    });

    if (!verification.ok) {
      sendJson(res, verification.status || 502, {
        ok:    false,
        error: "Pi user verification failed.",
        details: verification.data,
      });
      return;
    }

    const piUser = verification.data;

    // Return safe profile — never return the access token back
    sendJson(res, 200, {
      ok: true,
      user: {
        uid:        piUser?.uid        || "",
        username:   piUser?.username   || "",
        roles:      piUser?.roles      || [],
        credentials: piUser?.credentials || {},
      },
      questoraProfile: {
        isVerified:   true,
        connectedAt:  new Date().toISOString(),
        tip:          "Complete KYC in the Pi app to unlock Mainnet migration.",
      },
    });
  } catch (error) {
    sendJson(res, 500, {
      ok:    false,
      error: "Could not retrieve Pioneer profile.",
      details: error.message,
    });
  }
};
