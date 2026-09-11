import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SectorsService {
  constructor(private readonly configService: ConfigService) {}

  private get baseUrl() {
    return this.configService.get<string>('SECTORS_BASE_URL');
  }

  private get headers() {
    return {
      Authorization: this.configService.get<string>('SECTORS_API_KEY'),
    };
  }

  async getMultipleCompanyReports(tickers: string[]) {
    try {
      const requests = tickers.map((ticker) =>
        axios.get(
          `${this.baseUrl}/company/report/${ticker.toUpperCase()}/`,
          { headers: this.headers },
        ),
      );

      const responses = await Promise.all(requests);
      return responses.map((res) => res.data);
    } catch (error: any) {
      console.info(error);
      throw new HttpException(
        `Failed to fetch market data from Sectors API: ${error.response?.data?.detail || error.message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getPortfolioMarketData(tickers: string[]) {
    try {
      const requests = tickers.map((ticker) =>
        axios.get(
          `${this.baseUrl}/company/report/${ticker.toUpperCase()}/`,
          { headers: this.headers },
        ),
      );
      const responses = await Promise.all(requests);
      return responses.reduce((acc, res, index) => {
        acc[tickers[index].toUpperCase()] = res.data;
        return acc;
      }, {} as Record<string, any>);
    } catch (error: any) {
      throw new HttpException(
        `Failed to fetch portfolio market data: ${error.response?.data?.detail || error.message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getCompanyReport(ticker: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/company/report/${ticker.toUpperCase()}/`,
        { headers: this.headers },
      );
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        `Failed to fetch company report for ${ticker}: ${error.response?.data?.detail || error.message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}