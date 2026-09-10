import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AgentService } from '../agent/agent.service';
import { SectorsService } from '../sectors/sectors.service';
import { StockComparisonDto } from './dto/stock-comparison.dto';

@Controller('api/financial')
export class FinancialController {
  constructor(
    private readonly sectorsService: SectorsService,
    private readonly agentService: AgentService,
  ) {}

  @Post('compare')
  @HttpCode(HttpStatus.OK)
  async compareStocks(@Body() dto: StockComparisonDto) {
    // 1. Fetch live market data in parallel for all requested tickers
    const marketData = await this.sectorsService.getMultipleCompanyReports(
      dto.tickers,
    );

    // 2. Synthesize comparison using Gemini Agent
    const analysis = await this.agentService.generateStockComparison(
      marketData,
      dto.focusArea,
    );

    return {
      success: true,
      comparedTickers: dto.tickers.map((t) => t.toUpperCase()),
      focusArea: dto.focusArea || 'general',
      timestamp: new Date().toISOString(),
      analysis,
    };
  }
}