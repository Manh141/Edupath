import { BadRequestException } from '@nestjs/common';
import { CourseStatus } from '../../../common/prisma/prisma-client';

export type CourseAction =
  | 'create'
  | 'edit'
  | 'submit_for_review'
  | 'admin_start_review'
  | 'admin_approve'
  | 'admin_request_changes'
  | 'admin_reject'
  | 'publish'
  | 'archive'
  | 'soft_delete';

const HEAVY_EDIT_STATUSES: ReadonlySet<CourseStatus> = new Set([
  CourseStatus.draft,
  CourseStatus.in_progress,
  CourseStatus.changes_requested,
]);

const LIGHT_EDIT_STATUSES: ReadonlySet<CourseStatus> = new Set([
  ...HEAVY_EDIT_STATUSES,
  CourseStatus.pending_review,
  CourseStatus.approved,
  CourseStatus.published,
]);

const TRANSITIONS: Readonly<Record<CourseAction, ReadonlyArray<CourseStatus>>> = {
  create: [],
  edit: [...HEAVY_EDIT_STATUSES],
  submit_for_review: [
    CourseStatus.draft,
    CourseStatus.in_progress,
    CourseStatus.changes_requested,
  ],
  admin_start_review: [CourseStatus.pending_review],
  admin_approve: [CourseStatus.pending_review],
  admin_request_changes: [CourseStatus.pending_review],
  admin_reject: [CourseStatus.pending_review],
  publish: [CourseStatus.approved],
  archive: [CourseStatus.published, CourseStatus.approved, CourseStatus.rejected],
  soft_delete: [
    CourseStatus.draft,
    CourseStatus.in_progress,
    CourseStatus.changes_requested,
    CourseStatus.rejected,
  ],
};

export const CourseStateMachine = {
  canPerform(action: CourseAction, status: CourseStatus): boolean {
    return TRANSITIONS[action].includes(status);
  },

  assertCanPerform(action: CourseAction, status: CourseStatus): void {
    if (!CourseStateMachine.canPerform(action, status)) {
      throw new BadRequestException(
        `Action "${action}" is not allowed when course is "${status}".`,
      );
    }
  },

  isHeavyEditable(status: CourseStatus): boolean {
    return HEAVY_EDIT_STATUSES.has(status);
  },

  isLightEditable(status: CourseStatus): boolean {
    return LIGHT_EDIT_STATUSES.has(status);
  },

  resolveNextOnEdit(status: CourseStatus): CourseStatus {
    return status === CourseStatus.draft ? CourseStatus.in_progress : status;
  },
} as const;
