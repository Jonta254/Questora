const { clearSession }=require("../lib/session");
const { allowPostOnly, sendJson }=require("../lib/pi");
module.exports=function handler(req,res){if(!allowPostOnly(req,res))return;clearSession(res);sendJson(res,200,{ok:true})};
