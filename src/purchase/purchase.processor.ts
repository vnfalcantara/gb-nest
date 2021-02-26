
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { PurchaseService } from './purchase.service';
import { SetupService } from '../setup/setup.service';
import { SetupDocument } from '../setup/entities/setup.entity';
import { PurchaseStatus } from '../common/enum'

@Processor('PURCHASE')
export class PurchaseProcessor {

  constructor(
    private readonly purchaseService: PurchaseService,
    private readonly setupService: SetupService
  ) {
  }

  @Process('PURCHASE_VALIDATION')
  async handleValidation(job: Job, done) {
    let { data } = job
    let setup: SetupDocument

    try {
      setup = await this.setupService.getSetup()
    } catch (error) {
      done(error)
    }

    if (setup) {
      const {autoApprove = [], cashbackBands = []} = setup

      if (autoApprove.includes(data.user))
        data.status = PurchaseStatus.APPROVED

      cashbackBands.forEach(band => {
        if (data.price > band.min && data.price <= band.max)
          data.cashback = band.percent
      })
    }

    try {
      await this.purchaseService.create(data)
    } catch (error) {
      done(error)
    }

    done()
  }

}