export const DEFAULT_STUDENT_ROLE = 'student';
export const DEFAULT_INSTRUCTOR_ROLE = 'instructor';
export const DEFAULT_ADMIN_ROLE = 'admin';

export const AUTH_MESSAGES = {
  ACCOUNT_NOT_VERIFIED: 'Your email has not been verified yet.',
  ACCOUNT_SUSPENDED: 'Your account has been temporarily suspended.',
  ACCOUNT_DISABLED: 'Your account has been disabled.',
  INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token.',
  INVALID_AUTH_CHALLENGE: 'Invalid or expired verification code challenge.',
  INVALID_AUTH_CODE: 'Invalid verification code.',
  AUTH_CODE_SENT: 'A verification code has been sent to your email.',
  AUTH_CODE_RESENT: 'A new verification code has been sent to your email.',
} as const;

export const AUTH_CHALLENGE_CODE_LENGTH = 6;
