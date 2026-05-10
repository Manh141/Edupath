INSERT INTO "roles" ("name", "description", "createdAt", "updatedAt")
VALUES
  ('student', 'Default role for learners', NOW(), NOW()),
  ('instructor', 'Role for course creators', NOW(), NOW()),
  ('admin', 'System administrator', NOW(), NOW())
ON CONFLICT ("name") DO UPDATE
SET
  "description" = EXCLUDED."description",
  "updatedAt" = NOW();

UPDATE "auth_accounts"
SET "roleId" = (SELECT "id" FROM "roles" WHERE "name" = 'admin')
WHERE "roleId" IN (
  SELECT "id" FROM "roles" WHERE "name" = 'super_admin'
);

UPDATE "auth_accounts"
SET "roleId" = (SELECT "id" FROM "roles" WHERE "name" = 'student')
WHERE "roleId" IN (
  SELECT "id" FROM "roles" WHERE "name" = 'user'
);

DELETE FROM "auth_account_roles"
WHERE "roleId" IN (
  SELECT "id" FROM "roles"
  WHERE "name" NOT IN ('student', 'instructor', 'admin')
);

DELETE FROM "roles"
WHERE "name" NOT IN ('student', 'instructor', 'admin');
