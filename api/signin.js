const { allowPostOnly, piRequest, readJsonBody, sendJson } = require("./_pi");

module.exports = async function handler(req, res) {
  if (!allowPostOnly(req, res)) return;

  try {
    const body = await readJsonBody(req);
    const accessToken = body?.authResult?.accessToken;

    if (!accessToken) {
      sendJson(res, 400, { ok: false, error: "Missing authResult.accessToken." });
      return;
    }

    const verification = await piRequest("/v2/me", {
      method: "GET",
      auth: "user",
      token: accessToken,
    });

    if (!verification.ok) {
      sendJson(res, verification.status || 502, {
        ok: false,
        error: "Pi user verification failed.",
        details: verification.data,
      });
      return;
    }

    sendJson(res, 200, {
      ok: true,
      user: verification.data,
    });
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      error: "Questora could not verify the Pi user.",
      details: error.message,
    });
  }
};
