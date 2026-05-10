DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'CoursePricingTier'
  ) THEN
    CREATE TYPE "CoursePricingTier" AS ENUM (
      'free',
      'tier_99k',
      'tier_199k',
      'tier_299k',
      'tier_499k',
      'tier_799k',
      'tier_1299k',
      'tier_1999k',
      'custom'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "CoursePricing" (
  "id"                   TEXT NOT NULL,
  "courseId"             TEXT NOT NULL,
  "tier"                 "CoursePricingTier" NOT NULL DEFAULT 'free',
  "price"                INTEGER NOT NULL DEFAULT 0,
  "compareAtPrice"       INTEGER,
  "currency"             TEXT NOT NULL DEFAULT 'VND',
  "eligibilityCheckedAt" TIMESTAMP(3),
  "eligibilitySnapshot"  JSONB,
  "updatedBy"            TEXT,
  "createdAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CoursePricing_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "CoursePricing_courseId_key"
  ON "CoursePricing"("courseId");

CREATE INDEX IF NOT EXISTS "CoursePricing_tier_idx"
  ON "CoursePricing"("tier");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'CoursePricing_courseId_fkey'
  ) THEN
    ALTER TABLE "CoursePricing"
      ADD CONSTRAINT "CoursePricing_courseId_fkey"
      FOREIGN KEY ("courseId") REFERENCES "Course"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
