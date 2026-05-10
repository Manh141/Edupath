export type ChecklistGroup =
  | 'basicInfo'
  | 'intendedLearners'
  | 'curriculum'
  | 'media'
  | 'pricing'
  | 'ownership';

export type ChecklistSeverity = 'error' | 'warning';

export interface ChecklistIssue {
  group: ChecklistGroup;
  code: string;
  message: string;
  field?: string;
  severity: ChecklistSeverity;
}

export interface ChecklistItem {
  group: ChecklistGroup;
  code: string;
  label: string;
  passed: boolean;
  severity: ChecklistSeverity;
  hint?: string;
}

export interface ChecklistGroupSummary {
  group: ChecklistGroup;
  total: number;
  passed: number;
}

export interface CourseValidationReport {
  courseId: string;
  canSubmit: boolean;
  completionPercent: number;
  totals: {
    requiredItems: number;
    passedRequiredItems: number;
    errors: number;
    warnings: number;
  };
  groups: ChecklistGroupSummary[];
  items: ChecklistItem[];
  issues: ChecklistIssue[];
  warnings: ChecklistIssue[];
  generatedAt: string;
}
