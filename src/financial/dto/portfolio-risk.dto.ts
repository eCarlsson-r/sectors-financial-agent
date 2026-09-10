import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class PortfolioItemDto {
  @IsString()
  @IsNotEmpty()
  ticker: string;

  @IsNumber()
  @Min(0.01)
  @Max(1.0)
  weight: number; // Decimal weight summing to 1.0 (e.g., 0.4 for 40%)
}

export class PortfolioRiskDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PortfolioItemDto)
  @ArrayMinSize(1, { message: 'Portfolio must contain at least one position' })
  items: PortfolioItemDto[];
}