import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CashbackMock } from '../common/mock';
import { CashbackService } from './cashback.service';

describe('CashbackService', () => {
  
  let service: CashbackService;
  let httpService = { get: jest.fn() }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CashbackService,

        { provide: HttpService, useValue: httpService }
      ]
    }).compile();

    service = module.get<CashbackService>(CashbackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find', () => {
    it('should get the cashback', async () => {
      const httpGet = httpService.get.mockReturnValue({
        toPromise: jest.fn().mockResolvedValue(CashbackMock)
      })
      const response = await service.find()

      expect(httpGet).toBeCalled()
      expect(response).toEqual(CashbackMock)
    })
  })

});
