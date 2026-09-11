# Questora

Questora is a mobile-first Pi Mini App foundation for asking practical questions, sharing lived experience, and finding useful community answers.

## Shipped state

Implemented: independent Questora interface; Home, Ask, Activity, and Profile navigation; public browsing; clearly labeled editorial prompts; search, topic, and transparent feed sorting; actionable duplicate-question suggestions; live question-readiness guidance; structured answer guidance; question preview; draft-only local storage with a return-to-draft prompt; offline notice; Pi SDK loading; server verification through Pi `/v2/me`; signed HTTP-only sessions; sign-out; reliable deep retrieval from Activity and Profile; useful saved, followed, and authored question collections; owner-verified accepted solutions and resolved threads; private server-validated content reporting; responsive safe areas; PostgreSQL migration; and environment-gated durable APIs for questions, answers, follows, saves, helpful votes, reports, activity, and contribution history.

Disabled: payments, promotion, rewards, points, streaks, referrals, and leaderboards. Moderation review UI, export, deletion, and notification delivery remain unavailable.

Requires configuration: values in `.env.example`, Pi Developer Portal URLs, and execution of `migrations/001_questora_foundation.sql` in Supabase PostgreSQL. The service-role key is server-only.

Not verified: physical Pi Browser testing, real Pi authentication, production database migration, concurrent database mutations, Mainnet, payments, and production support contacts.

## Local development

```powershell
python -m http.server 3314
```

Static API routes run on Vercel, not Python’s file server. Use `vercel dev` when testing authentication locally.

## Verification

```powershell
node --check app.js
Get-ChildItem api/*.js | ForEach-Object { node --check $_.FullName }
npm test
```
