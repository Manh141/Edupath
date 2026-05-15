const TRUE_VALUES = new Set(["1", "true", "yes", "on"]);

function readBooleanFlag(value: string | undefined, fallback = false): boolean {
  if (!value) {
    return fallback;
  }

  return TRUE_VALUES.has(value.trim().toLowerCase());
}

export const enableFacebookLogin = readBooleanFlag(
  process.env.NEXT_PUBLIC_ENABLE_FACEBOOK_LOGIN,
  false,
);
