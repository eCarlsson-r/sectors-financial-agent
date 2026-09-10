import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

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
        model: 'gemini-2.5-flash',
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
}