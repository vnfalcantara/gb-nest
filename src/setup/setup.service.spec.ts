import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ModelMock } from '../common/mock';
import { Setup } from './entities/setup.entity';
import { SetupService } from './setup.service';

describe('SetupService', () => {

  let service: SetupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SetupService,
        { provide: getModelToken(Setup.name), useValue: ModelMock }
      ],
    }).compile();

    service = module.get<SetupService>(SetupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSetup', () => {
    it('should return the setup object', async () => {
      await service.getSetup()
    })
  })

});
