import { buildPaginationMeta, normalizePagination } from './pagination';

describe('communication pagination utils', () => {
  it('normalizes invalid page and limit safely', () => {
    expect(normalizePagination({ page: -5, limit: 1000 })).toEqual({
      page: 1,
      limit: 100,
      skip: 0,
      take: 100,
    });
  });

  it('builds pagination metadata with next and previous flags', () => {
    expect(buildPaginationMeta(45, 2, 20)).toEqual({
      page: 2,
      limit: 20,
      total: 45,
      totalPages: 3,
      hasNext: true,
      hasPrev: true,
    });
  });
});
