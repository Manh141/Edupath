export function assertSameCurrency(values: string[]): void {
  const unique = new Set(values.filter(Boolean));
  if (unique.size > 1) {
    throw new Error('Mixed currencies are not supported in one order');
  }
}
