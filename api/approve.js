const { allowPostOnly, ensureApiKey, piRequest, readJsonBody, sendJson } = require("./_pi");

module.exports = async function handler(req, res) {
  if (!allowPostOnly(req, res) || !ensureApiKey(res)) return;

  try {
    const body = await readJsonBody(req);
    const paymentId = body?.paymentId;

    if (!paymentId) {
      sendJson(res, 400, { ok: false, error: "Missing paymentId." });
      return;
    }

    const approval = await piRequest(`/v2/payments/${paymentId}/approve`, {
      method: "POST",
      auth: "app",
    });

    if (!approval.ok) {
      sendJson(res, approval.status || 502, {
        ok: false,
        error: "Pi payment approval failed.",
        details: approval.data,
      });
      return;
    }

    sendJson(res, 200, {
      ok: true,
      payment: approval.data,
      serviceKey: body?.packKey || null,
    });
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      error: "Questora could not approve the Pi payment.",
      details: error.message,
    });
  }
};
