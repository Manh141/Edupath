-- Extend CourseStatus enum with workflow states
ALTER TYPE "CourseStatus" ADD VALUE IF NOT EXISTS 'in_progress';
ALTER TYPE "CourseStatus" ADD VALUE IF NOT EXISTS 'pending_review';
ALTER TYPE "CourseStatus" ADD VALUE IF NOT EXISTS 'changes_requested';
ALTER TYPE "CourseStatus" ADD VALUE IF NOT EXISTS 'approved';

-- New enums
CREATE TYPE "CourseReviewSubmissionStatus" AS ENUM (
  'pending',
  'in_review',
  'approved',
  'changes_requested',
  'rejected',
  'superseded'
);

CREATE TYPE "CourseStatusActorType" AS ENUM ('instructor', 'admin', 'system');

-- Course audit columns
ALTER TABLE "Course"
  ADD COLUMN IF NOT EXISTS "submittedAt"      TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "changesRequested" TEXT,
  ADD COLUMN IF NOT EXISTS "createdBy"        TEXT,
  ADD COLUMN IF NOT EXISTS "updatedBy"        TEXT;

-- Course review submissions
CREATE TABLE "CourseReviewSubmission" (
  "id"               TEXT PRIMARY KEY,
  "courseId"         TEXT NOT NULL REFERENCES "Course"("id") ON DELETE CASCADE,
  "version"          INTEGER NOT NULL DEFAULT 1,
  "status"           "CourseReviewSubmissionStatus" NOT NULL DEFAULT 'pending',
  "submittedBy"      TEXT NOT NULL,
  "submittedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewedBy"       TEXT,
  "reviewedAt"       TIMESTAMP(3),
  "decisionNote"     TEXT,
  "contentSnapshot"  JSONB NOT NULL,
  "validationReport" JSONB NOT NULL,
  "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"        TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX "CourseReviewSubmission_courseId_version_key"
  ON "CourseReviewSubmission" ("courseId", "version");
CREATE INDEX "CourseReviewSubmission_courseId_status_idx"
  ON "CourseReviewSubmission" ("courseId", "status");
CREATE INDEX "CourseReviewSubmission_status_submittedAt_idx"
  ON "CourseReviewSubmission" ("status", "submittedAt");
CREATE INDEX "CourseReviewSubmission_submittedBy_idx"
  ON "CourseReviewSubmission" ("submittedBy");

-- Course status history
CREATE TABLE "CourseStatusHistory" (
  "id"         TEXT PRIMARY KEY,
  "courseId"   TEXT NOT NULL REFERENCES "Course"("id") ON DELETE CASCADE,
  "fromStatus" "CourseStatus",
  "toStatus"   "CourseStatus" NOT NULL,
  "reason"     TEXT,
  "metadata"   JSONB,
  "actorType"  "CourseStatusActorType" NOT NULL,
  "actorId"    TEXT,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "CourseStatusHistory_courseId_createdAt_idx"
  ON "CourseStatusHistory" ("courseId", "createdAt");
CREATE INDEX "CourseStatusHistory_toStatus_idx"
  ON "CourseStatusHistory" ("toStatus");
