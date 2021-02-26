import { Module } from '@nestjs/common';
import { SetupService } from './setup.service';

import { MongooseModule } from '@nestjs/mongoose';
import { Setup, SetupSchema } from './entities/setup.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Setup.name, schema: SetupSchema }]),
  ],
  providers: [SetupService],
  exports: [SetupService]
})
export class SetupModule {}
