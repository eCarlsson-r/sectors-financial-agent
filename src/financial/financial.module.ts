import { Module } from '@nestjs/common';
import { FinancialController } from './financial.controller';
import { SectorsModule } from '../sectors/sectors.module';
import { AgentModule } from '../agent/agent.module';

@Module({
  imports: [SectorsModule, AgentModule],
  controllers: [FinancialController],
})
export class FinancialModule {}