import { Test, TestingModule } from '@nestjs/testing';
import { FinancialController } from './financial.controller.js';
import { SectorsService } from '../sectors/sectors.service.js';
import { AgentService } from '../agent/agent.service.js';

describe('FinancialController', () => {
  let controller: FinancialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinancialController],
      providers: [
        {
          provide: SectorsService,
          useValue: {
            getMultipleCompanyReports: vi.fn(),
            getPortfolioMarketData: vi.fn(),
            getCompanyReport: vi.fn(),
          },
        },
        {
          provide: AgentService,
          useValue: {
            generateStockComparison: vi.fn(),
            evaluatePortfolioRisk: vi.fn(),
            generateFinancialReport: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FinancialController>(FinancialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
