import { Test, TestingModule } from '@nestjs/testing';
import { MatcherGateway } from './matcher.gateway';

describe('MatcherGateway', () => {
  let gateway: MatcherGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatcherGateway],
    }).compile();

    gateway = module.get<MatcherGateway>(MatcherGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
