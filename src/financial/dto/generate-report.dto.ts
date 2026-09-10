import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum ReportType {
  EQUITY_RESEARCH = 'EQUITY_RESEARCH',
  SECTOR_OVERVIEW = 'SECTOR_OVERVIEW',
  EXECUTIVE_SUMMARY = 'EXECUTIVE_SUMMARY',
}

export class GenerateReportDto {
  @IsString()
  @IsNotEmpty()
  target: string; // Ticker symbol or sector name

  @IsEnum(ReportType)
  reportType: ReportType;

  @IsOptional()
  @IsString()
  customInstructions?: string;
}