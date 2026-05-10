# Enrollment Schema Review

## Overall verdict

The schema is **good enough to continue**, especially for a first production iteration of an LMS-style enrollment service.
It already has the correct high-level boundaries:

- `Enrollment` = ownership / access
- `CourseProgress` = aggregate progress
- `LectureProgress` = per-lecture progress
- `Wishlist` = saved courses
- `Certificate` = completion artifact

## Changes applied in the scaffold

1. Added `createdAt` / `updatedAt` where operationally useful
2. Added `refundedAt` and `revokedAt` on `Enrollment`
3. Added `courseSlug` snapshot on `Enrollment` and `Wishlist`
4. Added index on `orderId`
5. Added index on `(userId, status)` and `(userId, enrolledAt)`
6. Added `completedAt` on `LectureProgress`
7. Added `createdAt` on `CourseProgress`
8. Kept `@@unique([userId, courseId])` because it fits a Udemy-like ownership model

## Important business note

If you want to allow:
- re-purchase after refund as a brand-new ownership record
- multiple purchases of the same course
- bundles or seat licenses with repeated access rows

then you should remove `@@unique([userId, courseId])` and replace it with:
- a normal index on `(userId, courseId)`
- a more explicit access model

For now, the scaffold keeps the unique constraint because it is simpler and safer for a course platform where ownership is usually unique per user/course.

## Production advice

- Create enrollments only from trusted internal endpoints
- Do not trust frontend for `userId`
- Recompute aggregate progress inside a DB transaction
- Generate certificates only after completion
- Keep payment truth in `payment-service`
- Keep course structure truth in `course-service`
- Treat `Enrollment`, `Wishlist`, and `Certificate` as snapshot-heavy read models when needed
