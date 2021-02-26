import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { UserModule } from '../user/user.module';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { PurchaseProcessor } from './purchase.processor';

import { MongooseModule } from '@nestjs/mongoose';
import { Purchase, PurchaseSchema } from './entities/purchase.entity';
import { SetupModule } from '../setup/setup.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Purchase.name, schema: PurchaseSchema }]),

    BullModule.registerQueue({ name: 'PURCHASE' }),

    UserModule,
    SetupModule,
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService, PurchaseProcessor]
})
export class PurchaseModule {
  constructor() {}
}
