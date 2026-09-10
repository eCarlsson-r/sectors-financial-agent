import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AgentService } from './agent.service';

@Module({
  imports: [ConfigModule],
  providers: [AgentService],
  exports: [AgentService], // Exported to be injected into FinancialModule
})
export class AgentModule {}