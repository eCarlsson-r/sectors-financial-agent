import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SectorsService } from './sectors.service.js';

describe('SectorsService', () => {
  let service: SectorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SectorsService,
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn((key: string) => {
              if (key === 'SECTORS_BASE_URL') return 'https://api.sectors.app/v2';
              if (key === 'SECTORS_API_KEY') return 'test-key';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<SectorsService>(SectorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
