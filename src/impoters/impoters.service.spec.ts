import { Test, TestingModule } from '@nestjs/testing';
import { ImpotersService } from './impoters.service';

describe('ImpotersService', () => {
  let service: ImpotersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImpotersService],
    }).compile();

    service = module.get<ImpotersService>(ImpotersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
