const { clearSession }=require("./_session");
const { allowPostOnly, sendJson }=require("./_pi");
module.exports=function handler(req,res){if(!allowPostOnly(req,res))return;clearSession(res);sendJson(res,200,{ok:true})};
