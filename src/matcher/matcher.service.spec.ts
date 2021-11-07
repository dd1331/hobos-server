import { Test, TestingModule } from '@nestjs/testing';
import { MatcherService } from './matcher.service';

describe('MatcherService', () => {
  let service: MatcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatcherService],
    }).compile();

    service = module.get<MatcherService>(MatcherService);
  });

  const payload = {
    location: 'test',
    category: 'plogging',
  };
  describe('dd', () => {
    it('setRoomId should be defined as function and return string value', () => {
      expect(service.setRoomId).toBeDefined();
      expect(typeof service.setRoomId(payload)).toBe('string');
      expect(typeof service.setRoomId).toBe('function');
    });
    it('getRoomId should be defined as function and return string value', () => {
      expect(service.getRoomId).toBeDefined();
      expect(typeof service.getRoomId(payload)).toBe('string');
      expect(typeof service.getRoomId).toBe('function');
    });
  });
});
