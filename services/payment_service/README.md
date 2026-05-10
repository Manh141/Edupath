# payment-service

Production-minded NestJS + Prisma payment service for EduPath.

## Responsibilities
- Cart management
- Coupon validation and redemption snapshots
- Order creation from cart
- Payment transaction tracking
- Internal callbacks / provider webhook processing
- Queue-backed async retry and enrollment fulfillment dispatch

## Recommended flow
1. User adds items to cart
2. User applies coupon
3. Service validates sellable courses and ownership via internal APIs
4. Service creates pending order + pending transaction inside a short database transaction
5. Provider callback/webhook marks transaction success
6. Service marks order paid and emits async fulfillment job

## Notes
- Keep payment jobs idempotent
- Keep transactions short
- Never trust client-side amount calculations
- Recalculate totals on the server before creating an order
