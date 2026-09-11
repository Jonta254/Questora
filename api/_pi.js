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

async function piRequest(pathname, options = {}) {
  const { method = "GET", body, token } = options;
  const headers = { "Content-Type": "application/json" };
  headers.Authorization = `Bearer ${token}`;

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

module.exports = {
  allowPostOnly,
  piRequest,
  readJsonBody,
  sendJson,
};
