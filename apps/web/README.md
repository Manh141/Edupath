# EduPath apps/web adaptation

This folder keeps the Learniverse UI you liked, but rewires auth to your backend:
- api-gateway: http://localhost:3000
- auth-service: http://localhost:3001
- access token via Authorization Bearer
- refresh/logout via refreshToken in request body

Notes:
- Landing, courses, categories, course detail, and parts of dashboard still use demo catalog data so the UI stays intact until course/enrollment/payment services are connected.
- Profile and auth screens are wired to the backend contract you provided.
- The FE dev server is set to port 3006 to avoid clashing with the gateway on port 3000.
