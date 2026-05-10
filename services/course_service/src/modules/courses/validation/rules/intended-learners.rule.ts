import type { ChecklistItem } from '../checklist.types';
import {
  type CourseValidationInput,
  type ValidationRule,
  MIN_OBJECTIVES,
  MIN_REQUIREMENTS,
  MIN_TARGET_AUDIENCES,
} from './types';

export const intendedLearnersRule: ValidationRule = (
  input: CourseValidationInput,
): ChecklistItem[] => [
  {
    group: 'intendedLearners',
    code: 'LEARNERS_OBJECTIVES',
    label: `At least ${MIN_OBJECTIVES} learning objectives`,
    severity: 'error',
    passed: input.objectivesCount >= MIN_OBJECTIVES,
    hint: `Current: ${input.objectivesCount}`,
  },
  {
    group: 'intendedLearners',
    code: 'LEARNERS_REQUIREMENTS',
    label: `At least ${MIN_REQUIREMENTS} prerequisite`,
    severity: 'error',
    passed: input.requirementsCount >= MIN_REQUIREMENTS,
  },
  {
    group: 'intendedLearners',
    code: 'LEARNERS_AUDIENCE',
    label: `At least ${MIN_TARGET_AUDIENCES} target audience`,
    severity: 'error',
    passed: input.targetAudiencesCount >= MIN_TARGET_AUDIENCES,
  },
];
