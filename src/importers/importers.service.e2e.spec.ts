import { Test, TestingModule } from '@nestjs/testing';
import { ImportersService } from './importers.service';

describe('ImportersService', () => {
  let service: ImportersService;
  let accessToken;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImportersService],
    }).compile();

    service = module.get<ImportersService>(ImportersService);
  });

  describe('', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
      expect(service.getAccessToken).toBeDefined();
      expect(service.getResidentInfo).toBeDefined();
    });
    it('should return errCd 0 and accessToken', async () => {
      const data = await service.getAccessToken();
      accessToken = data.result.accessToken;
      expect(data.result.accessToken).toBeTruthy();
      expect(data.errCd).toBe(0);
    });
  });
  describe('', () => {
    it('', async () => {
      const data = await service.getResidentInfo({
        accessToken,
        adm_cd: '3902011',
      });
      expect(data.errCd).toBe(0);
      console.log('data', data);
    });
  });
});
