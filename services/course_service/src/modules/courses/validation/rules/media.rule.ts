import type { ChecklistItem } from '../checklist.types';
import type { CourseValidationInput, ValidationRule } from './types';

export const mediaRule: ValidationRule = (input: CourseValidationInput): ChecklistItem[] => [
  {
    group: 'media',
    code: 'MEDIA_THUMBNAIL',
    label: 'Course thumbnail uploaded',
    severity: 'error',
    passed: Boolean(input.thumbnailUrl && input.thumbnailUrl.trim().length > 0),
  },
  {
    group: 'media',
    code: 'MEDIA_TRAILER',
    label: 'Promo video uploaded (recommended)',
    severity: 'warning',
    passed: Boolean(input.trailerUrl && input.trailerUrl.trim().length > 0),
  },
];

export const ownershipRule: ValidationRule = (
  input: CourseValidationInput,
): ChecklistItem[] => [
  {
    group: 'ownership',
    code: 'OWNERSHIP_PRIMARY_INSTRUCTOR',
    label: 'Course has a primary instructor',
    severity: 'error',
    passed: Boolean(input.primaryInstructorId),
  },
];
