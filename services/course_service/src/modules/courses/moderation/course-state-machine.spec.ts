import { BadRequestException } from '@nestjs/common';
import { CourseStatus } from '../../../common/prisma/prisma-client';
import { CourseStateMachine } from './course-state-machine';

describe('CourseStateMachine', () => {
  it('allows submit_for_review from draft', () => {
    expect(
      CourseStateMachine.canPerform('submit_for_review', CourseStatus.draft),
    ).toBe(true);
  });

  it('rejects publish from draft', () => {
    expect(() =>
      CourseStateMachine.assertCanPerform('publish', CourseStatus.draft),
    ).toThrow(BadRequestException);
  });

  it('allows publish only from approved', () => {
    expect(CourseStateMachine.canPerform('publish', CourseStatus.approved)).toBe(true);
    expect(CourseStateMachine.canPerform('publish', CourseStatus.pending_review)).toBe(false);
  });

  it('moves draft to in_progress on first edit', () => {
    expect(CourseStateMachine.resolveNextOnEdit(CourseStatus.draft)).toBe(
      CourseStatus.in_progress,
    );
    expect(CourseStateMachine.resolveNextOnEdit(CourseStatus.approved)).toBe(
      CourseStatus.approved,
    );
  });
});
