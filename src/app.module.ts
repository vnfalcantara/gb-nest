import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConfig } from './config/database.config';
import { ConfigModule } from '@nestjs/config'
import { BullModule } from '@nestjs/bull';
import { QueueConfig } from './config/queue.config';
import environmentConfig from './config/environment.config';

import { UserModule } from './user/user.module';
import { PurchaseModule } from './purchase/purchase.module';
import { SetupModule } from './setup/setup.module';
import { CashbackModule } from './cashback/cashback.module';
import { AuthModule } from './auth/auth.module';

const { NODE_ENV } = process.env;
const prod = !NODE_ENV || NODE_ENV === 'production';

@Module({
  imports: [
    ConfigModule.forRoot({
			envFilePath: !prod ? `./environment/${process.env.NODE_ENV}.env` : '',
			isGlobal: true,
			load: [environmentConfig],

			// validationSchema: environmentSchema
    }),

    MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useClass: DatabaseConfig
    }),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      useClass: QueueConfig
    }),

    UserModule,

    PurchaseModule,

    SetupModule,

    CashbackModule,

    AuthModule
  ],
  controllers: [],

  providers: [],
})
export class AppModule {}
