# Architecture

The shipped UI is a dependency-free static web app deployed with Vercel Functions. Public editorial content is bundled read-only. Pi identity is verified server-side and stored in a signed session cookie. Environment-gated Vercel Functions access Supabase PostgREST with a server-only service role for durable questions, answers, follows, saves, helpful votes, activity, and profile counts. `migrations/001_questora_foundation.sql` defines the database boundary. Browser storage is used only for the unpublished composer draft.
