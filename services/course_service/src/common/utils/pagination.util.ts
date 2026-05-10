export function normalizePagination(page = 1, limit = 12): {
  page: number;
  limit: number;
  skip: number;
  take: number;
} {
  const normalizedPage = Number.isFinite(page) && page > 0 ? page : 1;
  const normalizedLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 12;

  return {
    page: normalizedPage,
    limit: normalizedLimit,
    skip: (normalizedPage - 1) * normalizedLimit,
    take: normalizedLimit,
  };
}
