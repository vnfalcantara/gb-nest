import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RequestQuery } from '../common/dto/request-query.dto'
import { User } from './dto/user.dto';
import { UserMock, RequestQueryMock } from '../common/mock';

describe('UserController', () => {

  let service = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    count: jest.fn(),
    updateById: jest.fn(),
    removeById: jest.fn()
  }

  const mockId = '111111111111111111111111'
  const requestQuery: RequestQuery = RequestQueryMock
  const body: User = { ...UserMock, _id: undefined }
  
  let controller: UserController;

  beforeEach(async () => { 
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      
      providers: [
        { provide: UserService, useValue: service }
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should insert a new document', async () => {
      const create = service.create.mockResolvedValue(UserMock)
      const data = await controller.create(body)
      
      expect(create).toBeCalled()
      expect(data).toEqual(UserMock)
    })

    it('should return error on service.create', async done => {
      const create = service.create.mockRejectedValue({ message: 'test' })

      try {
        await controller.create(body)
      } catch (error) {
        expect(create).toBeCalled()
        done()
      }
    })
  })

  describe('findAll', () => {
    it('should return a list of documents', async () => {
      const findAll = service.findAll.mockResolvedValue([UserMock])
      const data = await controller.findAll({ ...requestQuery, fields: {name: 1} })

      expect(findAll).toBeCalled()
      expect(data[0]).toEqual(UserMock)
    })

    it('should return error on service.findAll', async done => {
      const findAll = service.findAll.mockRejectedValue({ message: 'test' })

      try {
        await controller.findAll(requestQuery)
      } catch (error) {
        expect(findAll).toBeCalled()
        done()
      }
    })
  })

  describe('findOne', () => {
    it('should return a document by id', async () => {
      const findById = service.findById.mockResolvedValue(UserMock)
      const data = await controller.findOne(mockId, { ...requestQuery, fields: {name: 1} })

      expect(findById).toBeCalled()
      expect(data).toEqual(UserMock)
    })

    it('should return a error on service.findById', async done => {
      const findById = service.findById.mockRejectedValue({})

      try {
        await controller.findOne(mockId, requestQuery)
      } catch (error) {
        expect(findById).toBeCalled()
        done()
      }
    })
  })

  describe('count', () => {
    it('should return a number', async () => {
      const quantity = 2
      const count = service.count.mockResolvedValue(quantity)
      const data = await controller.count(requestQuery)

      expect(count).toBeCalled()
      expect(data).toBe(quantity)
    })

    it('shoud return a error on service.count', async done => {
      const count = service.count.mockRejectedValue({})

      try {
        await controller.count(requestQuery)
      } catch (error) {
        expect(count).toBeCalled()
        done()
      }
    })
  })

  describe('update', () => {
    it('should update a document', async () => {
      const updateStatus = { nModified: 1 }
      const updateById = service.updateById.mockResolvedValue(updateStatus)
      const data = await controller.update(mockId, { ...body, name: 'Foolaninho' })

      expect(updateById).toBeCalled()
      expect(data).toEqual(updateStatus)
    })

    it('should return error on service.updateById', async done => {
      const updateById = service.updateById.mockRejectedValue({})

      try {
        await controller.update(mockId, { ...body, name: 'Foolaninho' })
      } catch (error) {
        expect(updateById).toBeCalled()
        done()
      }
    })
  })

  describe('remove', () => {
    it('should remove a document', async () => {
      const updateStatus = { nModified: 1 }
      const updateById = service.updateById.mockResolvedValue(updateStatus)
      const data = await controller.remove(mockId)

      expect(updateById).toBeCalled()
      expect(data).toEqual(updateStatus)
    })

    it('should return error on service.removeById', async done => {
      const updateById = service.updateById.mockRejectedValue({})

      try {
        await controller.remove(mockId)
      } catch (error) {
        expect(updateById).toBeCalled()
        done()
      }
    })
  })
  
});
