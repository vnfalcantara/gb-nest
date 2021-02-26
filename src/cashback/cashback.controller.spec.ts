import { Test, TestingModule } from '@nestjs/testing';
import { CashbackMock, ServiceMock } from '../common/mock';
import { CashbackController } from './cashback.controller';
import { CashbackService } from './cashback.service';

describe('CashbackController', () => {

  let controller: CashbackController;
  const cashbackService = ServiceMock

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashbackController],
      providers: [
        { provide: CashbackService, useValue: cashbackService }
      ]
    }).compile();

    controller = module.get<CashbackController>(CashbackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCashback', () => {
    it('should return the cashback', async () => {
      const find = cashbackService.find.mockResolvedValue({ data: CashbackMock })
      const response = await controller.getCashback()

      expect(find).toBeCalled()
      expect(response).toEqual(CashbackMock)
    })

    it('should return error on "cashbackService.find"', async done => {
      const find = cashbackService.find.mockRejectedValue({})

      try {
        await controller.getCashback()
      } catch (error) {
        expect(find).toBeCalled()
        done()
      }
    })
  })

});
