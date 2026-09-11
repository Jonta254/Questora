const crypto=require("node:crypto");
const { db,fail,sendJson }=require("../lib/db");
const { readJsonBody }=require("../lib/pi");
function authorized(req){const expected=process.env.QUESTORA_MODERATOR_TOKEN||"",supplied=String(req.headers.authorization||"").replace(/^Bearer\s+/i,"");if(expected.length<32||supplied.length!==expected.length)return false;return crypto.timingSafeEqual(Buffer.from(supplied),Buffer.from(expected))}
module.exports=async function handler(req,res){
  if(!authorized(req)){sendJson(res,401,{ok:false,error:"Moderator authorization required."});return}
  try{
    if(req.method==="GET"){const reports=await db("reports?select=id,reporter_uid,target_type,target_id,reason,status,created_at&status=eq.open&order=created_at.asc&limit=100");sendJson(res,200,{ok:true,reports});return}
    if(req.method!=="POST"){sendJson(res,405,{ok:false,error:"Method not allowed."});return}
    const body=await readJsonBody(req),reportId=String(body?.reportId||""),decision=String(body?.decision||""),note=String(body?.note||"").trim();
    if(!reportId||!["dismiss","hide","remove"].includes(decision)||note.length>500){sendJson(res,422,{ok:false,error:"A valid report, decision, and short note are required."});return}
    const report=(await db("reports?select=id,target_type,target_id,status&id=eq."+encodeURIComponent(reportId)+"&limit=1"))[0];
    if(!report||report.status!=="open"){sendJson(res,404,{ok:false,error:"Open report not found."});return}
    if(decision!=="dismiss"){const table=report.target_type==="question"?"questions":report.target_type==="answer"?"answers":null;if(!table){sendJson(res,422,{ok:false,error:"Unsupported report target."});return}await db(table+"?id=eq."+encodeURIComponent(report.target_id),{method:"PATCH",prefer:"return=minimal",body:{moderation_status:decision==="hide"?"hidden":"removed",updated_at:new Date().toISOString()}})}
    await db("reports?id=eq."+encodeURIComponent(reportId),{method:"PATCH",prefer:"return=minimal",body:{status:decision==="dismiss"?"dismissed":"actioned",updated_at:new Date().toISOString()}});
    await db("moderation_actions",{method:"POST",prefer:"return=minimal",body:{report_id:reportId,decision,note}});
    sendJson(res,200,{ok:true,decision});
  }catch(error){fail(res,error)}
};
