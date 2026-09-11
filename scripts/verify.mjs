import{execFileSync}from"node:child_process";import{readFileSync,readdirSync}from"node:fs";
for(const file of["app.js","sw.js",...readdirSync("api").filter(x=>x.endsWith(".js")).map(x=>`api/${x}`)])execFileSync(process.execPath,["--check",file],{stdio:"inherit"});
const html=readFileSync("index.html","utf8"),app=readFileSync("app.js","utf8");
if((html.match(/data-nav=/g)||[]).length!==4)throw Error("Questora must expose exactly four primary destinations.");
if(/createPayment|leaderboard|streak|referral/i.test(html+app))throw Error("A removed product concept remains in the production client.");
if(!app.includes('localStorage.setItem("questora-question-draft"'))throw Error("Draft storage contract missing.");
console.log("Questora static verification passed.");
