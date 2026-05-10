import type { ChecklistItem } from '../checklist.types';
import type { CourseValidationInput, ValidationRule } from './types';

const MIN_TITLE = 10;
const MAX_TITLE = 120;
const MIN_SUBTITLE = 10;
const MIN_SHORT_DESCRIPTION = 20;
const MIN_DESCRIPTION = 200;

export const basicInfoRule: ValidationRule = (input: CourseValidationInput): ChecklistItem[] => {
  const titleLen = input.title.trim().length;
  const subtitleLen = input.subtitle.trim().length;
  const shortDescLen = input.shortDescription.trim().length;
  const descLen = input.description.trim().length;

  return [
    {
      group: 'basicInfo',
      code: 'BASIC_TITLE',
      label: `Title between ${MIN_TITLE} and ${MAX_TITLE} characters`,
      severity: 'error',
      passed: titleLen >= MIN_TITLE && titleLen <= MAX_TITLE,
      hint: `Current length: ${titleLen}`,
    },
    {
      group: 'basicInfo',
      code: 'BASIC_SUBTITLE',
      label: `Subtitle at least ${MIN_SUBTITLE} characters`,
      severity: 'error',
      passed: subtitleLen >= MIN_SUBTITLE,
    },
    {
      group: 'basicInfo',
      code: 'BASIC_SHORT_DESCRIPTION',
      label: `Short description at least ${MIN_SHORT_DESCRIPTION} characters`,
      severity: 'warning',
      passed: shortDescLen >= MIN_SHORT_DESCRIPTION,
      hint: `Current length: ${shortDescLen}`,
    },
    {
      group: 'basicInfo',
      code: 'BASIC_DESCRIPTION',
      label: `Full description at least ${MIN_DESCRIPTION} characters`,
      severity: 'error',
      passed: descLen >= MIN_DESCRIPTION,
      hint: `Current length: ${descLen}`,
    },
    {
      group: 'basicInfo',
      code: 'BASIC_CATEGORY',
      label: 'Category and subcategory selected',
      severity: 'error',
      passed: Boolean(input.categoryId && input.subcategoryId),
    },
    {
      group: 'basicInfo',
      code: 'BASIC_LANGUAGE',
      label: 'Course language selected',
      severity: 'error',
      passed: Boolean(input.language && input.language.trim().length > 0),
    },
    {
      group: 'basicInfo',
      code: 'BASIC_LEVEL',
      label: 'Course level selected',
      severity: 'error',
      passed: Boolean(input.level && input.level.trim().length > 0),
    },
  ];
};
