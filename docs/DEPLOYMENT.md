# Deployment

Deploy with Vercel over HTTPS. Set `QUESTORA_SESSION_SECRET` and set `PI_NETWORK=sandbox` outside production. Use `PI_NETWORK=mainnet` only after approval. Register the exact Sandbox and production URLs with Pi, validate `validation-key.txt`, run the SQL migration in a controlled database, and verify headers. Do not enable Mainnet or publishing until the checklist passes. `PI_API_KEY` is not needed while payments remain disabled.
