export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function generateUniqueSlug(
  baseValue: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const baseSlug = slugify(baseValue);
  let candidate = baseSlug;
  let counter = 1;

  while (await exists(candidate)) {
    counter += 1;
    candidate = `${baseSlug}-${counter}`;
  }

  return candidate;
}
