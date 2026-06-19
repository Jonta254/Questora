const {
  allowPostOnly,
  ensureApiKey,
  getPaymentId,
  piRequest,
  readJsonBody,
  sendJson,
} = require("./_pi");

module.exports = async function handler(req, res) {
  if (!allowPostOnly(req, res) || !ensureApiKey(res)) return;

  try {
    const body      = await readJsonBody(req);
    const paymentId = getPaymentId(body);

    if (!paymentId) {
      sendJson(res, 200, { ok: true, message: "No incomplete payment to handle." });
      return;
    }

    // Fetch the payment from Pi Platform
    const lookup = await piRequest(`/v2/payments/${paymentId}`, {
      method: "GET",
      auth:   "app",
    });

    if (!lookup.ok) {
      sendJson(res, lookup.status || 502, {
        ok: false, error: "Pi incomplete-payment lookup failed.", details: lookup.data,
      });
      return;
    }

    const payment = lookup.data;
    const txid    = payment?.transaction?.txid;

    // If payment is already on the blockchain, complete it now
    if (txid && !payment.status?.developer_completed) {
      const completion = await piRequest(`/v2/payments/${paymentId}/complete`, {
        method: "POST",
        auth:   "app",
        body:   { txid },
      });
      sendJson(res, 200, {
        ok:      true,
        action:  "completed",
        payment: completion.data || payment,
      });
      return;
    }

    // Payment exists but has no txid yet — just return it so the SDK can resume
    sendJson(res, 200, { ok: true, action: "reviewed", payment });
  } catch (error) {
    sendJson(res, 500, {
      ok: false, error: "Questora could not review the incomplete payment.", details: error.message,
    });
  }
};
