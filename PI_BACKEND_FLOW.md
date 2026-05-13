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

Required server environment:

- `PI_API_KEY`
- optional `PI_API_BASE`

Questora should only mark a premium service as unlocked after:

1. the user connects in Pi Browser,
2. the Pi Wallet creates the payment,
3. `/api/approve` succeeds,
4. blockchain submission returns a `txid`,
5. `/api/complete` succeeds.

Questora keeps premium Pi services separate from reward review records so users always know whether an action was a real Pi payment or only an in-app progress record.
