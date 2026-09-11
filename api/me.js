const { readSession }=require("../lib/session");
const { sendJson }=require("../lib/pi");
module.exports=function handler(req,res){if(req.method!=="GET"){sendJson(res,405,{ok:false,error:"Method not allowed. Use GET."});return}const user=readSession(req);if(!user){sendJson(res,401,{ok:false,error:"No active Questora session."});return}sendJson(res,200,{ok:true,user:{uid:user.uid,username:user.username}})};
