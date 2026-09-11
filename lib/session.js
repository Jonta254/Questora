"use strict";
const crypto=require("node:crypto");
const COOKIE="questora_session";
function secret(){const value=process.env.QUESTORA_SESSION_SECRET||"";return value.length>=32?value:null}
function encode(value){return Buffer.from(value).toString("base64url")}
function sign(payload,key){return crypto.createHmac("sha256",key).update(payload).digest("base64url")}
function createSession(user){const key=secret();if(!key)return null;const payload=encode(JSON.stringify({uid:user.uid,username:user.username||"Pioneer",exp:Date.now()+604800000}));return `${payload}.${sign(payload,key)}`}
function readSession(req){const key=secret();if(!key)return null;const match=String(req.headers.cookie||"").match(new RegExp(`(?:^|; )${COOKIE}=([^;]+)`));if(!match)return null;const [payload,signature]=match[1].split(".");if(!payload||!signature)return null;const expected=sign(payload,key);if(signature.length!==expected.length||!crypto.timingSafeEqual(Buffer.from(signature),Buffer.from(expected)))return null;try{const value=JSON.parse(Buffer.from(payload,"base64url").toString("utf8"));return typeof value.uid==="string"&&value.exp>Date.now()?value:null}catch{return null}}
function setSession(res,value){res.setHeader("Set-Cookie",`${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800${process.env.NODE_ENV==="production"?"; Secure":""}`)}
function clearSession(res){res.setHeader("Set-Cookie",`${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${process.env.NODE_ENV==="production"?"; Secure":""}`)}
module.exports={clearSession,createSession,readSession,setSession};
