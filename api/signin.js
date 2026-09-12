const { allowPostOnly, piRequest, readJsonBody, sendJson } = require("../lib/pi");
const { createSession, setSession } = require("../lib/session");

module.exports = async function handler(req, res) {
  if (!allowPostOnly(req, res)) return;

  try {
    const body = await readJsonBody(req);
    const accessToken = body?.accessToken;

    if (typeof accessToken!=="string"||accessToken.length<20||accessToken.length>4096) {
      sendJson(res, 400, { ok: false, error: "A valid Pi access token is required." });
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
      });
      return;
    }

    const user={uid:verification.data?.uid,username:verification.data?.username||"Pioneer"};
    if(typeof user.uid!=="string"||!user.uid){sendJson(res,502,{ok:false,error:"Pi returned an unexpected identity response."});return}
    const session=createSession(user);
    if(!session){sendJson(res,503,{ok:false,error:"Questora sign-in is not configured."});return}
    setSession(res,session);
    sendJson(res, 200, {
      ok: true,
      user,
    });
  } catch (error) {
    const status=Number(error?.status);
    sendJson(res, [413,415].includes(status)?status:502, {
      ok: false,
      error: status===413?"Request body is too large.":status===415?"Send this request as JSON.":"Pi sign-in is temporarily unavailable. Try again safely.",
    });
  }
};
