import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(() => {
    controller = new HealthController();
  });

  it('returns the expected liveness payload', () => {
    expect(controller.getHealth()).toEqual({
      service: 'user-service',
      status: 'ok',
    });
  });
});
