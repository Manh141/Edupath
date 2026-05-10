UPDATE "Course" c
SET "totalDurationSec" = COALESCE(
  (
    SELECT SUM(l."durationSec")
    FROM "Section" s
    JOIN "Lecture" l ON l."sectionId" = s.id
    WHERE s."courseId" = c.id
      AND l."isPublished" = true
  ),
  0
)
WHERE c.status = 'published';
