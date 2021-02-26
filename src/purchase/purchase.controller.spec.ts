import { Test, TestingModule } from '@nestjs/testing';
import { RequestQueryMock } from '../common/mock';
import { RequestQuery } from '../common/dto/request-query.dto';
import { PurchaseController } from './purchase.controller';
import { Purchase } from './dto/purchase.dto';
import { PurchaseMock, UserMock, ServiceMock } from '../common/mock'
import { PurchaseService } from './purchase.service';
import { UserService } from '../user/user.service';
import { doesNotMatch } from 'assert';

describe('PurchaseController', () => {


  const mockId = '111111111111111111111111'
  const requestQuery: RequestQuery = RequestQueryMock
  const body: Purchase = { ...PurchaseMock, _id: undefined }
  const req = { user: { id: '' } }
  let queueMock = { add: jest.fn() }
  let userService = ServiceMock
  let purchaseService = ServiceMock

  let controller: PurchaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseController],

      providers: [
        { provide: UserService, useValue: userService },
        { provide: PurchaseService, useValue: purchaseService },
        { provide: 'BullQueue_PURCHASE', useValue: queueMock }
      ]
    }).compile();

    controller = module.get<PurchaseController>(PurchaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should send to queue', async () => {
      const userFindOne = userService.findOne.mockResolvedValue(UserMock)

      await controller.create(req, body)

      expect(userFindOne).toBeCalled()
      expect(queueMock.add).toBeCalled()
    })

    it('should return error on "this.userService.findOne"', async done => {
      const userFindOne = userService.findOne.mockRejectedValue({})

      try {
        await controller.create(req, body)
      } catch (error) {
        expect(userFindOne).toBeCalled()
        done()
      }
    })

    it('should not found a user', async done => {
      const userFindOne = userService.findOne.mockResolvedValue(null)

      try {
        await controller.create(req, body)
      } catch (error) {
        expect(userFindOne).toBeCalled()
        done()
      }
    })
  })

  describe('findAll', () => {
    it('should return a list of documents', async () => {
      const purchaseFindAll = purchaseService.findAll.mockResolvedValue([{}])

      await controller.findAll({ ...requestQuery, fields: { name: 1 } })

      expect(purchaseFindAll).toBeCalled()
    })

    it('should return error on service.findAll', async done => {
      const purchaseFindAll = purchaseService.findAll.mockRejectedValue({ message: 'test' })

      try {
        await controller.findAll(requestQuery)
      } catch (error) {
        expect(purchaseFindAll).toBeCalled()
        done()
      }
    })
  })

  describe('findOne', () => {
    it('should return a document by id', async () => {
      const purchaseFindById = purchaseService.findById.mockResolvedValue({})

      await controller.findOne(mockId, { ...requestQuery, fields: { name: 1 } })

      expect(purchaseFindById).toBeCalled()
    })

    it('should return a error on service.findById', async done => {
      const purchaseFindById = purchaseService.findById.mockRejectedValue({})

      try {
        await controller.findOne(mockId, requestQuery)
      } catch (error) {
        expect(purchaseFindById).toBeCalled()
        done()
      }
    })
  })

  describe('count', () => {
    it('should return a number', async () => {
      const purchaseCount = purchaseService.count.mockResolvedValue(2)
      let count = await controller.count(requestQuery)

      expect(purchaseCount).toBeCalled()
      expect(count).toBe(2)
    })

    it('shoud return a error on service.count', async done => {
      const purchaseCount = purchaseService.count.mockRejectedValue({})

      try {
        await controller.count(requestQuery)
      } catch (error) {
        expect(purchaseCount).toBeCalled()
        done()
      }
    })
  })

  describe('update', () => {
    it('should update a document', async () => {
      const purchaseUpdate = purchaseService.updateById.mockResolvedValue({ nModified: 1 })
      const updateStatus = await controller.update(mockId, { code: 'qwerty' })

      expect(purchaseUpdate).toBeCalled()
      expect(updateStatus.nModified).toBe(1)
    })

    it('should not update a document', async done => {
      const purchaseUpdate = purchaseService.updateById.mockResolvedValue({ nModified: 0 })
      
      try {
        await controller.update(mockId, { code: 'qwerty' })
      } catch (error) {
        expect(purchaseUpdate).toBeCalled()
        done()
      }
    })

    it('should return error on service.updateById', async done => {
      const purchaseUpdate = purchaseService.updateById.mockRejectedValue({})

      try {
        await controller.update(mockId, { code: 'qwerty' })
      } catch (error) {
        expect(purchaseUpdate).toBeCalled()
        done()
      }
    })
  })

  describe('remove', () => {
    it('should remove a document', async () => {
      const purchaseUpdate = purchaseService.updateById.mockResolvedValue({ nModified: 1 })
      const updateStatus = await controller.remove(mockId)

      expect(purchaseUpdate).toBeCalled()
      expect(updateStatus.nModified).toBe(1)
    })

    it('should not remove a document', async done => {
      const purchaseUpdate = purchaseService.updateById.mockResolvedValue({ nModified: 0 })
      
      try {
        await controller.remove(mockId)
      } catch (error) {
        expect(purchaseUpdate).toBeCalled()
        done()  
      }
    })

    it('should return error on service.removeById', async done => {
      const purchaseUpdate = purchaseService.updateById.mockRejectedValue({ nModified: 1 })

      try {
        await controller.remove(mockId)
      } catch (error) {
        expect(purchaseUpdate).toBeCalled()
        done()  
      }
    })
  })

});
