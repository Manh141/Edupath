ALTER TABLE "auth_accounts"
ADD COLUMN "forcePasswordChange" BOOLEAN NOT NULL DEFAULT false;
