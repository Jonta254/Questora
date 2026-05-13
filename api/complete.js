const { allowPostOnly, ensureApiKey, piRequest, readJsonBody, sendJson } = require("./_pi");

module.exports = async function handler(req, res) {
  if (!allowPostOnly(req, res) || !ensureApiKey(res)) return;

  try {
    const body = await readJsonBody(req);
    const paymentId = body?.paymentId;
    const txid = body?.txid;

    if (!paymentId || !txid) {
      sendJson(res, 400, { ok: false, error: "Missing paymentId or txid." });
      return;
    }

    const completion = await piRequest(`/v2/payments/${paymentId}/complete`, {
      method: "POST",
      auth: "app",
      body: { txid },
    });

    if (!completion.ok) {
      sendJson(res, completion.status || 502, {
        ok: false,
        error: "Pi payment completion failed.",
        details: completion.data,
      });
      return;
    }

    sendJson(res, 200, {
      ok: true,
      payment: completion.data,
      serviceKey: body?.packKey || null,
    });
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      error: "Questora could not complete the Pi payment.",
      details: error.message,
    });
  }
};
