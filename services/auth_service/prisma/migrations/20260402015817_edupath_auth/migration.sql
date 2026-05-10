-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('local', 'google', 'facebook');

-- CreateEnum
CREATE TYPE "AuthStatus" AS ENUM ('pending_verification', 'active', 'suspended', 'disabled');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('active', 'revoked', 'expired');

-- CreateEnum
CREATE TYPE "TokenPurpose" AS ENUM ('email_verification', 'password_reset');

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_accounts" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "normalizedEmail" TEXT NOT NULL,
    "passwordHash" TEXT,
    "roleId" INTEGER NOT NULL,
    "provider" "AuthProvider" NOT NULL DEFAULT 'local',
    "status" "AuthStatus" NOT NULL DEFAULT 'pending_verification',
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "passwordChangedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_provider_accounts" (
    "id" TEXT NOT NULL,
    "authAccountId" TEXT NOT NULL,
    "provider" "AuthProvider" NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "providerEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oauth_provider_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_sessions" (
    "id" TEXT NOT NULL,
    "authAccountId" TEXT NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'active',
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_tokens" (
    "id" TEXT NOT NULL,
    "authAccountId" TEXT NOT NULL,
    "purpose" "TokenPurpose" NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "auth_accounts_email_key" ON "auth_accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "auth_accounts_normalizedEmail_key" ON "auth_accounts"("normalizedEmail");

-- CreateIndex
CREATE INDEX "auth_accounts_roleId_idx" ON "auth_accounts"("roleId");

-- CreateIndex
CREATE INDEX "auth_accounts_status_idx" ON "auth_accounts"("status");

-- CreateIndex
CREATE INDEX "auth_accounts_provider_idx" ON "auth_accounts"("provider");

-- CreateIndex
CREATE INDEX "auth_accounts_normalizedEmail_idx" ON "auth_accounts"("normalizedEmail");

-- CreateIndex
CREATE INDEX "oauth_provider_accounts_authAccountId_idx" ON "oauth_provider_accounts"("authAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_provider_accounts_provider_providerUserId_key" ON "oauth_provider_accounts"("provider", "providerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "auth_sessions_refreshTokenHash_key" ON "auth_sessions"("refreshTokenHash");

-- CreateIndex
CREATE INDEX "auth_sessions_authAccountId_idx" ON "auth_sessions"("authAccountId");

-- CreateIndex
CREATE INDEX "auth_sessions_expiresAt_idx" ON "auth_sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "auth_sessions_status_idx" ON "auth_sessions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "auth_tokens_tokenHash_key" ON "auth_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "auth_tokens_authAccountId_idx" ON "auth_tokens"("authAccountId");

-- CreateIndex
CREATE INDEX "auth_tokens_purpose_idx" ON "auth_tokens"("purpose");

-- CreateIndex
CREATE INDEX "auth_tokens_expiresAt_idx" ON "auth_tokens"("expiresAt");

-- AddForeignKey
ALTER TABLE "auth_accounts" ADD CONSTRAINT "auth_accounts_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_provider_accounts" ADD CONSTRAINT "oauth_provider_accounts_authAccountId_fkey" FOREIGN KEY ("authAccountId") REFERENCES "auth_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_authAccountId_fkey" FOREIGN KEY ("authAccountId") REFERENCES "auth_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_tokens" ADD CONSTRAINT "auth_tokens_authAccountId_fkey" FOREIGN KEY ("authAccountId") REFERENCES "auth_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
