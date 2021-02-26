import { Test, TestingModule } from '@nestjs/testing'
import { PurchaseProcessor } from './purchase.processor'
import { PurchaseService } from './purchase.service'
import { PurchaseMock, ServiceMock, SetupMock } from '../common/mock'
import { SetupService } from '../setup/setup.service'
import Bull from 'bull'

const purchaseService = ServiceMock
const setupService = { getSetup: jest.fn() }

describe('TagmeNestModelsService', () => {
  
  let processor: PurchaseProcessor

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseProcessor,
        { provide: PurchaseService, useValue: purchaseService },
        { provide: SetupService, useValue: setupService }
      ],
    }).compile()

    processor = module.get<PurchaseProcessor>(PurchaseProcessor)
  })

  it('should be defined', () => {
    expect(processor).toBeDefined()
  })

  describe('handleValidation', () => {
    it('should process a purchase with status "Aprovado"', async () => {
      const getSetup = setupService.getSetup.mockResolvedValue(SetupMock)
      const purchaseCreate = purchaseService.create.mockResolvedValue({})
      const job = {
        data: {
          ...PurchaseMock,
          user: SetupMock.autoApprove[0]
        }
      } as Bull.Job

      await processor.handleValidation(job, jest.fn())
    })

    it('should process a purchase with status "Em validação"', async () => {
      const getSetup = setupService.getSetup.mockResolvedValue(SetupMock)
      const purchaseCreate = purchaseService.create.mockResolvedValue({})
      const job = {
        data: {
          ...PurchaseMock,
          user: '00000000000'
        }
      } as Bull.Job

      await processor.handleValidation(job, jest.fn())
    })

    it('should return a error on "setupService.getSetup"', async done => {
      const getSetup = setupService.getSetup.mockRejectedValue({})
      const job = {
        data: {
          ...PurchaseMock,
          user: SetupMock.autoApprove[0]
        }
      } as Bull.Job

      try {
        await processor.handleValidation(job, jest.fn())
      } catch (error) {
        done()
      }
    })

    it('should not insert a purchase', async () => {
      const getSetup = setupService.getSetup.mockResolvedValue(SetupMock)
      const purchaseCreate = purchaseService.create.mockRejectedValue({})
      const job = {
        data: {
          ...PurchaseMock,
          user: SetupMock.autoApprove[0]
        }
      } as Bull.Job

      await processor.handleValidation(job, jest.fn())
    })
  })

})
