-- CreateEnum
CREATE TYPE "AuthChallengePurpose" AS ENUM ('register_email', 'login_email');

-- CreateTable
CREATE TABLE "auth_account_roles" (
    "id" TEXT NOT NULL,
    "authAccountId" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "assignedByAuthAccountId" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_account_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_challenges" (
    "id" TEXT NOT NULL,
    "authAccountId" TEXT,
    "email" TEXT NOT NULL,
    "normalizedEmail" TEXT NOT NULL,
    "purpose" "AuthChallengePurpose" NOT NULL,
    "requestedRole" TEXT,
    "fullName" TEXT,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "resendCount" INTEGER NOT NULL DEFAULT 0,
    "lastSentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "auth_account_roles_roleId_idx" ON "auth_account_roles"("roleId");

-- CreateIndex
CREATE INDEX "auth_account_roles_assignedByAuthAccountId_idx" ON "auth_account_roles"("assignedByAuthAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "auth_account_roles_authAccountId_roleId_key" ON "auth_account_roles"("authAccountId", "roleId");

-- CreateIndex
CREATE INDEX "auth_challenges_authAccountId_idx" ON "auth_challenges"("authAccountId");

-- CreateIndex
CREATE INDEX "auth_challenges_normalizedEmail_purpose_idx" ON "auth_challenges"("normalizedEmail", "purpose");

-- CreateIndex
CREATE INDEX "auth_challenges_expiresAt_idx" ON "auth_challenges"("expiresAt");

-- AddForeignKey
ALTER TABLE "auth_account_roles" ADD CONSTRAINT "auth_account_roles_authAccountId_fkey" FOREIGN KEY ("authAccountId") REFERENCES "auth_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_account_roles" ADD CONSTRAINT "auth_account_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_account_roles" ADD CONSTRAINT "auth_account_roles_assignedByAuthAccountId_fkey" FOREIGN KEY ("assignedByAuthAccountId") REFERENCES "auth_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_challenges" ADD CONSTRAINT "auth_challenges_authAccountId_fkey" FOREIGN KEY ("authAccountId") REFERENCES "auth_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
