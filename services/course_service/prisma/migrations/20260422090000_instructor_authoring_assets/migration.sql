-- Make draft creation compatible with Udemy-like authoring where category can be selected later.
ALTER TABLE "Course"
  ADD COLUMN IF NOT EXISTS "shortDescription" TEXT NOT NULL DEFAULT '',
  ALTER COLUMN "subcategoryId" DROP NOT NULL;

-- Course-level and lecture-level upload metadata.
CREATE TYPE "CourseAssetType" AS ENUM (
  'thumbnail',
  'promo_video',
  'lecture_video',
  'lecture_resource'
);

CREATE TYPE "CourseAssetStatus" AS ENUM (
  'uploaded',
  'processing',
  'ready',
  'failed',
  'deleted'
);

CREATE TABLE "CourseAsset" (
  "id"              TEXT NOT NULL,
  "courseId"        TEXT NOT NULL,
  "type"            "CourseAssetType" NOT NULL,
  "status"          "CourseAssetStatus" NOT NULL DEFAULT 'ready',
  "storageProvider" TEXT NOT NULL DEFAULT 's3',
  "bucket"          TEXT,
  "storageKey"      TEXT NOT NULL,
  "publicUrl"       TEXT NOT NULL,
  "originalName"    TEXT NOT NULL DEFAULT '',
  "mimeType"        TEXT NOT NULL DEFAULT '',
  "sizeBytes"       INTEGER,
  "durationSec"     INTEGER,
  "width"           INTEGER,
  "height"          INTEGER,
  "createdBy"       TEXT,
  "updatedBy"       TEXT,
  "deletedAt"       TIMESTAMP(3),
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CourseAsset_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CourseAsset_courseId_type_status_idx"
  ON "CourseAsset"("courseId", "type", "status");
CREATE INDEX "CourseAsset_storageKey_idx"
  ON "CourseAsset"("storageKey");
CREATE INDEX "CourseAsset_deletedAt_idx"
  ON "CourseAsset"("deletedAt");

ALTER TABLE "CourseAsset"
  ADD CONSTRAINT "CourseAsset_courseId_fkey"
  FOREIGN KEY ("courseId") REFERENCES "Course"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "LectureAsset"
  ADD COLUMN IF NOT EXISTS "storageProvider" TEXT NOT NULL DEFAULT 'external',
  ADD COLUMN IF NOT EXISTS "bucket" TEXT,
  ADD COLUMN IF NOT EXISTS "storageKey" TEXT,
  ADD COLUMN IF NOT EXISTS "mimeType" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "durationSec" INTEGER,
  ADD COLUMN IF NOT EXISTS "status" "CourseAssetStatus" NOT NULL DEFAULT 'ready',
  ADD COLUMN IF NOT EXISTS "createdBy" TEXT,
  ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX "LectureAsset_storageKey_idx"
  ON "LectureAsset"("storageKey");
CREATE INDEX "LectureAsset_deletedAt_idx"
  ON "LectureAsset"("deletedAt");
