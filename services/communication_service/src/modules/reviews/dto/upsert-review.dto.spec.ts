import { validate } from 'class-validator';
import { UpsertReviewDto } from './upsert-review.dto';

describe('UpsertReviewDto', () => {
  it('accepts ratings from 1 to 5', async () => {
    const dto = Object.assign(new UpsertReviewDto(), { rating: 5 });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('rejects ratings lower than 1', async () => {
    const dto = Object.assign(new UpsertReviewDto(), { rating: 0 });

    const errors = await validate(dto);

    expect(errors[0]?.constraints).toHaveProperty('min');
  });

  it('rejects ratings greater than 5', async () => {
    const dto = Object.assign(new UpsertReviewDto(), { rating: 6 });

    const errors = await validate(dto);

    expect(errors[0]?.constraints).toHaveProperty('max');
  });
});
