const PI_API_BASE = process.env.PI_API_BASE || "https://api.minepi.com";

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (!chunks.length) return {};
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function allowPostOnly(req, res) {
  if (req.method === "POST") return true;
  sendJson(res, 405, { ok: false, error: "Method not allowed. Use POST." });
  return false;
}

function ensureApiKey(res) {
  if (process.env.PI_API_KEY) return true;
  sendJson(res, 503, {
    ok: false,
    error: "PI_API_KEY is not configured on the server.",
  });
  return false;
}

async function piRequest(pathname, options = {}) {
  const { method = "GET", body, auth = "app", token } = options;
  const headers = { "Content-Type": "application/json" };

  if (auth === "app") {
    headers.Authorization = `Key ${process.env.PI_API_KEY}`;
  } else if (auth === "user") {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${PI_API_BASE}${pathname}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (error) {
    data = { raw: text };
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

function getPaymentId(payload) {
  return (
    payload?.paymentId ||
    payload?.payment?.identifier ||
    payload?.payment?.paymentId ||
    payload?.payment?.id ||
    ""
  );
}

module.exports = {
  allowPostOnly,
  ensureApiKey,
  getPaymentId,
  piRequest,
  readJsonBody,
  sendJson,
};
