import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseService } from './purchase.service';
import { ModelMock, PurchaseMock } from '../common/mock'
import { getModelToken } from '@nestjs/mongoose';
import { Purchase } from './entities/purchase.entity';

describe('PurchaseService', () => {

  const mockId = '111111111111111111111111'
  const mockUpdate = { code: 'update' }
  let service: PurchaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseService,
        { provide: getModelToken(Purchase.name), useValue: ModelMock }
      ],
    }).compile();

    service = module.get<PurchaseService>(PurchaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should insert a new document', () => {
      service.create(PurchaseMock)
    })
  })

  describe('findAll', () => {
    it('should get all documents', () => {
      service.findAll({})
    })
  })

  describe('findOne', () => {
    it('should get one document', () => {
      service.findOne({})
    })
  })

  describe('findById', () => {
    it('should get a document by id', () => {
      service.findById(mockId)
    })
  })

  describe('count', () => {
    it('should return the count of documents', () => {
      service.count({})
    })
  })

  describe('update', () => {
    it('should update a document', () => {
      service.update({}, mockUpdate)
    })
  })

  describe('updateById', () => {
    it('should update a document by id', () => {
      service.updateById(mockId, mockUpdate)
    })
  })

  describe('remove', () => {
    it('should remove a document', () => {
      service.remove({})
    })
  })

  describe('removeById', () => {
    it('should remove a document by id', () => {
      service.removeById(mockId)
    })
  })

});
