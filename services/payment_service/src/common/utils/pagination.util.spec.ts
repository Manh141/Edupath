/// <reference types="jest" />
import { buildPaginationMeta } from './pagination.util';

describe('payment pagination util', () => {
  it('builds pagination metadata correctly', () => {
    expect(buildPaginationMeta(2, 10, 35)).toEqual({
      page: 2,
      limit: 10,
      total: 35,
      totalPages: 4,
    });
  });

  it('handles zero totals safely', () => {
    expect(buildPaginationMeta(1, 10, 0)).toEqual({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    });
  });
});
