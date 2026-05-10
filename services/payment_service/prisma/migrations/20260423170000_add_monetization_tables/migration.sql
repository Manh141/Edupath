DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'MonetizationStatus'
  ) THEN
    CREATE TYPE "MonetizationStatus" AS ENUM (
      'not_started',
      'in_progress',
      'pending_payout',
      'active',
      'suspended'
    );
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'OnboardingStepStatus'
  ) THEN
    CREATE TYPE "OnboardingStepStatus" AS ENUM ('pending', 'completed', 'skipped');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'PayoutAccountProvider'
  ) THEN
    CREATE TYPE "PayoutAccountProvider" AS ENUM (
      'bank_transfer_vn',
      'paypal',
      'stripe_connect'
    );
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'PayoutAccountStatus'
  ) THEN
    CREATE TYPE "PayoutAccountStatus" AS ENUM (
      'draft',
      'pending_review',
      'active',
      'rejected',
      'disabled'
    );
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'InstructorIdentityStatus'
  ) THEN
    CREATE TYPE "InstructorIdentityStatus" AS ENUM (
      'not_started',
      'pending',
      'verified',
      'rejected'
    );
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'TaxFormStatus'
  ) THEN
    CREATE TYPE "TaxFormStatus" AS ENUM (
      'not_required',
      'required',
      'submitted',
      'accepted',
      'rejected'
    );
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS "InstructorMonetizationProfile" (
  "id"                    TEXT NOT NULL,
  "instructorId"          TEXT NOT NULL,
  "legalName"             TEXT,
  "companyName"           TEXT,
  "publicHeadline"        TEXT,
  "shortBio"              TEXT,
  "profileImageUrl"       TEXT,
  "acceptedTermsVersion"  TEXT,
  "acceptedTermsAt"       TIMESTAMP(3),
  "acceptedPromotional"   BOOLEAN NOT NULL DEFAULT false,
  "acceptedPromotionalAt" TIMESTAMP(3),
  "status"                "MonetizationStatus" NOT NULL DEFAULT 'not_started',
  "identityStatus"        "InstructorIdentityStatus" NOT NULL DEFAULT 'not_started',
  "taxFormStatus"         "TaxFormStatus" NOT NULL DEFAULT 'not_required',
  "createdAt"             TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"             TIMESTAMP(3) NOT NULL,

  CONSTRAINT "InstructorMonetizationProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "OnboardingStepProgress" (
  "id"          TEXT NOT NULL,
  "profileId"   TEXT NOT NULL,
  "stepKey"     TEXT NOT NULL,
  "status"      "OnboardingStepStatus" NOT NULL DEFAULT 'pending',
  "completedAt" TIMESTAMP(3),
  "payload"     JSONB,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL,

  CONSTRAINT "OnboardingStepProgress_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PayoutAccount" (
  "id"               TEXT NOT NULL,
  "profileId"        TEXT NOT NULL,
  "provider"         "PayoutAccountProvider" NOT NULL,
  "status"           "PayoutAccountStatus" NOT NULL DEFAULT 'draft',
  "displayName"      TEXT NOT NULL,
  "holderNameCipher" TEXT,
  "accountRefCipher" TEXT,
  "accountRefMasked" TEXT,
  "bankCode"         TEXT,
  "country"          TEXT NOT NULL DEFAULT 'VN',
  "currency"         TEXT NOT NULL DEFAULT 'VND',
  "submittedAt"      TIMESTAMP(3),
  "activatedAt"      TIMESTAMP(3),
  "rejectedReason"   TEXT,
  "isDefault"        BOOLEAN NOT NULL DEFAULT false,
  "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"        TIMESTAMP(3) NOT NULL,

  CONSTRAINT "PayoutAccount_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "SellerEligibilitySnapshot" (
  "id"          TEXT NOT NULL,
  "profileId"   TEXT NOT NULL,
  "canSellPaid" BOOLEAN NOT NULL DEFAULT false,
  "reasons"     JSONB NOT NULL,
  "computedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "SellerEligibilitySnapshot_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "InstructorMonetizationProfile_instructorId_key"
  ON "InstructorMonetizationProfile"("instructorId");

CREATE INDEX IF NOT EXISTS "InstructorMonetizationProfile_status_idx"
  ON "InstructorMonetizationProfile"("status");

CREATE UNIQUE INDEX IF NOT EXISTS "OnboardingStepProgress_profileId_stepKey_key"
  ON "OnboardingStepProgress"("profileId", "stepKey");

CREATE INDEX IF NOT EXISTS "OnboardingStepProgress_profileId_idx"
  ON "OnboardingStepProgress"("profileId");

CREATE INDEX IF NOT EXISTS "PayoutAccount_profileId_status_idx"
  ON "PayoutAccount"("profileId", "status");

CREATE INDEX IF NOT EXISTS "SellerEligibilitySnapshot_profileId_computedAt_idx"
  ON "SellerEligibilitySnapshot"("profileId", "computedAt");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'OnboardingStepProgress_profileId_fkey'
  ) THEN
    ALTER TABLE "OnboardingStepProgress"
      ADD CONSTRAINT "OnboardingStepProgress_profileId_fkey"
      FOREIGN KEY ("profileId")
      REFERENCES "InstructorMonetizationProfile"("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'PayoutAccount_profileId_fkey'
  ) THEN
    ALTER TABLE "PayoutAccount"
      ADD CONSTRAINT "PayoutAccount_profileId_fkey"
      FOREIGN KEY ("profileId")
      REFERENCES "InstructorMonetizationProfile"("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'SellerEligibilitySnapshot_profileId_fkey'
  ) THEN
    ALTER TABLE "SellerEligibilitySnapshot"
      ADD CONSTRAINT "SellerEligibilitySnapshot_profileId_fkey"
      FOREIGN KEY ("profileId")
      REFERENCES "InstructorMonetizationProfile"("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE;
  END IF;
END
$$;
