# Baseline report

Recorded 2026-09-07 from clean `main` at `d9d3f35` before implementation.

The product was a static quests-and-learning app with client-side points, streaks, badges, reward claims, referrals, a synthetic leaderboard, ten paid services, and Pi payment callbacks. State was authoritative in localStorage. Pi `/v2/me` verification existed, but it issued no durable session. Payment approval and completion endpoints did not validate expected amount, purpose, user, app, network, direction, idempotency, or entitlements. There was no durable Q&A data model, moderation workflow, account export/deletion, meaningful activity feed, or production test suite. The UI used Pi-like purple/gold styling and Pi-symbol app icons. The README called the frontend starter a Mainnet concept while key backend controls were absent.

Baseline commands: no package manifest, lint script, typecheck, unit tests, or build command existed. `python -m http.server` was the only documented local command. Visual baseline was not captured before replacement. Pi Browser, authentication, payments, accessibility, and Mainnet were not verified.
