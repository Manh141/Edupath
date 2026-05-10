import { validate } from 'class-validator';
import { SendMessageDto } from './send-message.dto';

describe('SendMessageDto', () => {
  it('accepts a valid message payload', async () => {
    const dto = Object.assign(new SendMessageDto(), {
      content: 'Hello there',
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('rejects messages longer than 4000 characters', async () => {
    const dto = Object.assign(new SendMessageDto(), {
      content: 'a'.repeat(4001),
    });

    const errors = await validate(dto);

    expect(errors[0]?.constraints).toHaveProperty('maxLength');
  });
});
