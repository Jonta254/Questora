const { sendJson }=require("./_pi");
const { configured,publishingEnabled }=require("./_db");
module.exports=function handler(req,res){if(req.method!=="GET"){sendJson(res,405,{ok:false,error:"Method not allowed. Use GET."});return}sendJson(res,200,{ok:true,piSandbox:process.env.PI_NETWORK!=="mainnet",dataReady:configured(),publishingEnabled:publishingEnabled()})};
