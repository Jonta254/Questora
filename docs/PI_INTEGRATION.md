# Pi integration

The client reads `/api/config`, initializes Pi SDK v2 with Sandbox unless `PI_NETWORK=mainnet`, and requests only `username`. `/api/signin` verifies the access token with Pi `/v2/me`; the returned app-specific `uid` is signed into an HTTP-only, Secure-in-production, SameSite=Strict cookie. `/api/me` reads the trusted session and `/api/logout` clears it. Authentication does not imply KYC, location, expertise, or trust. Real Sandbox and Mainnet authentication are not verified. Payments are disabled.
