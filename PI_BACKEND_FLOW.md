# Questora Pi Pairing Flow

Questora follows the Pi demo app flow:

1. Frontend calls `Pi.init({ version: "2.0", sandbox })`.
2. Frontend calls `Pi.authenticate(["username", "payments"], onIncompletePaymentFound)`.
3. Backend must verify the returned access token with Pi Platform API `GET /v2/me`.
4. Premium access should use `Pi.createPayment()` only after backend endpoints are deployed.
5. Backend must approve payments with `/v2/payments/:paymentId/approve`.
6. Backend must complete payments with `/v2/payments/:paymentId/complete`.
7. Incomplete payments must be handled before a new payment is requested.

Current frontend endpoints expected later:

```text
POST /api/signin
POST /api/approve
POST /api/complete
POST /api/incomplete
```

Live Pi payments are intentionally disabled in `app.js` with:

```js
const PI_PAYMENTS_ENABLED = false;
```

Set this to `true` only after the backend uses the Pi Platform API as the source of truth and keeps the server API key private.
