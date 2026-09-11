const { db,fail,mutation,sendJson }=require("../lib/db");
const {clearSession,readSession}=require("../lib/session");
async function questionSummaries(rows){const ids=rows.map(row=>row.question_id).filter(Boolean);if(!ids.length)return[];return db("questions?select=id,title,status,created_at&deleted_at=is.null&id=in.("+ids.map(encodeURIComponent).join(",")+")&order=created_at.desc")}
module.exports=async function handler(req,res){
  if(req.method==="POST"){
    const input=await mutation(req,res);if(!input)return;
    if(input.body?.action!=="delete_account"){sendJson(res,422,{ok:false,error:"Choose a valid account action."});return}
    try{await db("rpc/delete_questora_account",{method:"POST",prefer:"return=minimal",body:{target_uid:input.user.uid}});clearSession(res);sendJson(res,200,{ok:true})}catch(error){fail(res,error)}return;
  }
  if(req.method!=="GET"){sendJson(res,405,{ok:false,error:"Method not allowed."});return}
  const user=readSession(req);if(!user){sendJson(res,401,{ok:false,error:"Sign in with Pi to view your profile."});return}
  try{
    const uid=encodeURIComponent(user.uid),exporting=new URL(req.url,"https://questora.local").searchParams.get("export")==="1",limit=exporting?200:20;
    const [questions,answers,saves,follows]=await Promise.all([
      db("questions?select=id,title,context,language,status,created_at,updated_at&author_uid=eq."+uid+"&deleted_at=is.null&order=created_at.desc&limit="+limit),
      db("answers?select=id,body,question_id,created_at,updated_at&author_uid=eq."+uid+"&deleted_at=is.null&order=created_at.desc&limit="+limit),
      db("saves?select=question_id,created_at&user_uid=eq."+uid+"&order=created_at.desc&limit="+limit),
      db("follows?select=question_id,created_at&user_uid=eq."+uid+"&order=created_at.desc&limit="+limit)
    ]);
    if(exporting){sendJson(res,200,{ok:true,export:{generatedAt:new Date().toISOString(),account:{username:user.username},questions,answers,saves,follows}});return}
    const [saved,followed]=await Promise.all([questionSummaries(saves),questionSummaries(follows)]);
    sendJson(res,200,{ok:true,profile:{questions,answers,saved,followed}});
  }catch(error){fail(res,error)}
};
