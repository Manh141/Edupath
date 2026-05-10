# Communication Service

EduPath communication microservice — handles:

- **Chat** (private direct messages between student / instructor / admin) with realtime over Socket.IO
- **Discussions / Q&A** scoped to a course, section, or lecture (top-level + replies, instructor-flagged)
- **Course Reviews** (1–5 stars + content, one per student per course, update allowed, enrollment-checked)
- **Instructor Performance** dashboards: overview, students by course, reviews by course, average rating, rating distribution

## Endpoints (mounted under `/api`)

### Chat
- `GET    /conversations` — list my conversations + last message + unread
- `GET    /conversations/unread-summary`
- `POST   /conversations` — create direct/group conversation
- `POST   /conversations/direct/:userId` — get-or-create direct
- `GET    /conversations/:id` — detail (with participants)
- `GET    /conversations/:id/messages` — list messages (paginated)
- `POST   /conversations/:id/messages` — send message
- `POST   /conversations/:id/read` — mark seen (sets unread to 0)
- `PATCH  /conversations/:id/archive` / `unarchive`
- `DELETE /conversations/messages/:messageId` — soft-delete
- `GET    /instructor/communication/conversations` — instructor inbox

### Discussions / Q&A
- `GET    /discussions?courseId=&sectionId=&lectureId=&search=&status=` (public)
- `GET    /discussions/:id` (public)
- `GET    /discussions/:id/replies` (public)
- `POST   /discussions` — create (auth)
- `PATCH  /discussions/:id` — owner / instructor / admin
- `DELETE /discussions/:id`
- `POST   /discussions/:id/replies` — reply (one-level, can also reference a parent reply)
- `DELETE /discussions/replies/:replyId`

### Reviews
- `GET    /reviews/courses/:courseId` (public, filter & pagination)
- `GET    /reviews/courses/:courseId/aggregate` (public)
- `GET    /reviews/courses/:courseId/me` — my review
- `PUT    /reviews/courses/:courseId/me` — create or update (enrollment-checked)
- `DELETE /reviews/courses/:courseId/me` — soft-delete
- `PATCH  /admin/communication/reviews/:reviewId/visibility` — admin moderation

### Instructor Performance
- `GET /instructor/performance/overview`
- `GET /instructor/performance/courses` — dropdown source
- `GET /instructor/performance/students?courseId=&search=`
- `GET /instructor/performance/reviews?courseId=&rating=&search=&sort=`
- `GET /instructor/performance/rating-distribution?courseId=`

## Realtime (Socket.IO)
- Namespace: `/chat`
- Auth: `auth.token` or `Authorization: Bearer ...` (JWT)
- Client → server events: `conversation.join`, `conversation.leave`, `message.send`, `message.read`, `typing`
- Server → client events: `message.created`, `message.deleted`, `message.read`, `conversation.created`, `conversation.updated`, `typing`

## Local development

```bash
pnpm install
cp .env.example .env
pnpm prisma:generate
pnpm prisma:migrate
pnpm start:dev
```

Swagger UI: `http://localhost:3007/docs`
