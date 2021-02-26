import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpConfigService } from './cashback-http.config';
import { CashbackController } from './cashback.controller';
import { CashbackService } from './cashback.service'

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useClass: HttpConfigService
    })
  ],
  controllers: [CashbackController],
  providers: [
    CashbackService
  ],
  exports: [CashbackService]
})

export class CashbackModule {}
