import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class StockComparisonDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(2, { message: 'Provide at least 2 tickers for comparison' })
  @ArrayMaxSize(5, { message: 'Maximum 5 tickers allowed per comparison' })
  tickers: string[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  focusArea?: string; // e.g., 'valuation', 'dividend', 'growth'
}