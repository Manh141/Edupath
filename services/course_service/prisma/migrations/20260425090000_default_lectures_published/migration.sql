ALTER TABLE "Lecture"
  ALTER COLUMN "isPublished" SET DEFAULT true;

UPDATE "Lecture" l
SET "isPublished" = true
FROM "Section" s
JOIN "Course" c ON c.id = s."courseId"
WHERE l."sectionId" = s.id
  AND c.status = 'published'
  AND l."isPublished" = false;
