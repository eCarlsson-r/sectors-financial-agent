import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SectorsService } from './sectors.service';

@Module({
  imports: [ConfigModule],
  providers: [SectorsService],
  exports: [SectorsService], // Exported to be injected into FinancialModule
})
export class SectorsModule {}