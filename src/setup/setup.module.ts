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
export class SetupModule {

  constructor(private readonly setupService: SetupService) {
    this.bootStrap()
  }

  async bootStrap() {
    const setup = await this.setupService.getSetup()

    if (!setup)
      this.setupService.create({
        autoApprove: ['15350946056'],
        cashbackBands: [
          { min: 0, max: 1000, percent: 10 },
          { min: 1000, max: 1500, percent: 15 },
          { min: 1500, max: 999999999999, percent: 20 }
        ]
      })
  }

}