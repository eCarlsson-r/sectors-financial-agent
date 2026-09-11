import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { PortfolioItemDto } from '../financial/dto/portfolio-risk.dto';

@Injectable()
export class AgentService {
  private ai: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    this.ai = new GoogleGenAI({
      apiKey: this.configService.get<string>('GEMINI_API_KEY'),
    });
  }

  async generateStockComparison(
    marketDataList: any[],
    focusArea?: string,
  ): Promise<string | undefined> {
    try {
      const systemInstruction = `You are a senior equity research analyst specializing in the Indonesian Stock Exchange (IDX).
Analyze the provided multi-company Sectors.app dataset and produce a structured Markdown comparison report.

Structure your analysis as follows:
1. **Executive Summary**: Brief overall verdict.
2. **Key Financial Metrics Table**: Compare Valuation (PE, PBV), Profitability (ROE, Net Margin), and Growth across the companies.
3. **Focus Analysis**: Address the requested focus area (${focusArea || 'General Valuation and Growth'}).
4. **Final Investment Thesis & Recommendation**: Clearly highlight the strongest buy or holding option with risk caveats.`;

      const prompt = `Market Data Payload:\n${JSON.stringify(marketDataList, null, 2)}`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        config: { systemInstruction },
      });

      return response.text;
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Gemini Stock Comparison Agent error: ${error.message}`,
      );
    }
  }

  // Add this method inside AgentService
  async evaluatePortfolioRisk(
    items: PortfolioItemDto[],
    marketDataMap: Record<string, any>,
  ): Promise<string | undefined> {
    try {
      const systemInstruction = `You are a certified risk manager and quantitative financial analyst specializing in IDX portfolios.
  Analyze the user's weighted portfolio alongside the provided Sectors.app market data.

  Structure your evaluation into structured Markdown with the following:
  1. **Overall Portfolio Risk Score**: Provide a single risk score scale ($0-100$, where 0 is lowest risk, 100 is extreme risk) with a clear Risk Label (e.g., Conservative, Moderate, High Volatility).
  2. **Sector Concentration & Diversification Analysis**: Breakdown sector allocation weights and single-stock concentration risks.
  3. **Volatility & Downside Metrics**: Highlight beta, debt levels, and valuation risks present in the holdings.
  4. **Actionable Rebalancing Plan**: Bulleted list of strategic recommendations to mitigate identified risks.`;

      const payload = {
        portfolioWeights: items,
        marketData: marketDataMap,
      };

      const response = await this.ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `Portfolio Risk Assessment Data:\n${JSON.stringify(payload, null, 2)}` }],
          },
        ],
        config: { systemInstruction },
      });

      return response.text;
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Gemini Portfolio Risk Agent error: ${error.message}`,
      );
    }
  }
}