import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AgentService } from '../agent/agent.service';
import { SectorsService } from '../sectors/sectors.service';
import { StockComparisonDto } from './dto/stock-comparison.dto';
import { PortfolioRiskDto } from './dto/portfolio-risk.dto';
import { GenerateReportDto, ReportType } from './dto/generate-report.dto';

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

  @Post('risk-score')
  @HttpCode(HttpStatus.OK)
  async evaluateRisk(@Body() dto: PortfolioRiskDto) {
    // Extract unique tickers from portfolio items
    const tickers = dto.items.map((item) => item.ticker);

    // 1. Fetch market data for all holdings in parallel
    const marketDataMap = await this.sectorsService.getPortfolioMarketData(tickers);

    // 2. Perform AI risk evaluation via Gemini Agent
    const riskAnalysis = await this.agentService.evaluatePortfolioRisk(
      dto.items,
      marketDataMap,
    );

    return {
      success: true,
      totalHoldings: dto.items.length,
      timestamp: new Date().toISOString(),
      riskAnalysis,
    };
  }

  @Post('report')
  @HttpCode(HttpStatus.OK)
  async generateReport(@Body() dto: GenerateReportDto) {
    const rawMarketData = await this.sectorsService.getCompanyReport(dto.target);

    // 2. Synthesize institutional report using Gemini Agent
    const reportMarkdown = await this.agentService.generateFinancialReport(
      dto,
      rawMarketData,
    );

    return {
      success: true,
      target: dto.target.toUpperCase(),
      reportType: dto.reportType,
      generatedAt: new Date().toISOString(),
      report: reportMarkdown,
    };
  }
}