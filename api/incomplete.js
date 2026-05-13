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
    const body = await readJsonBody(req);
    const paymentId = getPaymentId(body);

    if (!paymentId) {
      sendJson(res, 200, {
        ok: true,
        message: "No payment identifier was provided for incomplete-payment review.",
      });
      return;
    }

    const payment = await piRequest(`/v2/payments/${paymentId}`, {
      method: "GET",
      auth: "app",
    });

    if (!payment.ok) {
      sendJson(res, payment.status || 502, {
        ok: false,
        error: "Pi incomplete-payment lookup failed.",
        details: payment.data,
      });
      return;
    }

    sendJson(res, 200, {
      ok: true,
      payment: payment.data,
    });
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      error: "Questora could not review the incomplete payment.",
      details: error.message,
    });
  }
};
