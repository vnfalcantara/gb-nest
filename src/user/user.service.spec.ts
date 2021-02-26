import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../user/entities/user.entity'
import { UserMock, ModelMock } from '../common/mock';

describe('UserService', () => {

  const mockId = '111111111111111111111111'
  const mockUpdate = { name: 'test' }
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User.name), useValue: ModelMock }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should insert a new document', () => {
      service.create(UserMock)
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
