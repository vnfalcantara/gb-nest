
import { User } from '../user/dto/user.dto'
import { Purchase } from '../purchase/dto/purchase.dto'
import { PurchaseStatus } from './enum'

export const UserMock: User = {
	_id: '111111111111111111111111',
	name: 'Foolano da Silva',
	cpf: '111.111.111-11',
	email: 'foolano@email.com',
	password: '123456',
	created_at: new Date()
}

export const PurchaseMock: Purchase = {
	_id: '111111111111111111111111',
	code: 'mock',
	price: 999,
	status: PurchaseStatus.IN_VALIDATION,
	cashback: 10,
	cashbackValue: 99.9,
	user: '11111111111',
	created_at: new Date()
}

export const RequestQueryMock = {
	match: {},
	fields: {},
	options: {}
}

export const SetupMock = {
	_id: '111111111111111111111111',
	autoApprove: ["15350946056"],
	cashbackBands: [
		{
			min: 0,
			max: 1000,
			percent: 10
		},
		{
			min: 1000,
			max: 1500,
			percent: 15
		},
		{
			min: 1500,
			max: Infinity,
			percent: 20
		}
	]
}

export const CashbackMock = {
	statusCode: 200,
	body: {
		credit: 1725
	}
}

export let ServiceMock = {
	create: jest.fn(),
	find: jest.fn(),
	findOne: jest.fn(),
	findAll: jest.fn(),
	findById: jest.fn(),
	count: jest.fn(),
	updateById: jest.fn(),
	removeById: jest.fn(),
	validateUser: jest.fn(),
	validatePassword: jest.fn(),
	login: jest.fn(),
	sign: jest.fn()
}

export class ModelMock {
	private dto: any

	constructor(dto: any) {
		this.dto = dto
	}

	save() { return jest.fn() }

	static find() {
		const sort = jest.fn();
		const skip = jest.fn();
		const limit = jest.fn();
		const chain = { sort, skip, limit };

		sort.mockImplementation(() => chain);
		skip.mockImplementation(() => chain);
		limit.mockImplementation(() => chain);

		return chain
	}

	static findOne() { return jest.fn() }
	static count() { return jest.fn() }
	static updateMany() { return jest.fn() }
	static updateOne() { return jest.fn() }
	static deleteMany() { return jest.fn() }
	static deleteOne() { return jest.fn() }

}