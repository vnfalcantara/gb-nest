import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from '@nestjs/testing';

import environmentConfig from '../src/config/environment.config';
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConfig } from '../src/config/database.config';

import { PurchaseModule } from '../src/purchase/purchase.module';
import { PurchaseService } from '../src/purchase/purchase.service'

import { PurchaseMock, SetupMock, UserMock } from '../src/common/mock'
import { PurchaseDocument } from "../src/purchase/entities/purchase.entity";
import * as request from 'supertest';
import { AuthModule } from "../src/auth/auth.module";
import { UserService } from "../src/user/user.service";
import { UserModule } from "../src/user/user.module";
import { SetupModule } from "../src/setup/setup.module";
import { SetupService } from "../src/setup/setup.service";
import { BullModule } from "@nestjs/bull";
import { QueueConfig } from "../src/config/queue.config";

// import { environmentSchema } from '../environment/environmentSchema';

describe('Purchase', () => {

    let module: TestingModule
    let app: INestApplication;
    let purchaseService: PurchaseService
    let userService: UserService
    let setupService: SetupService

    const purchase = { ...PurchaseMock, _id: undefined }
    const user = { ...UserMock, _id: undefined }
    const setup = { ...SetupMock, _id: undefined }

    let Authorization = ''
    const code = 'new_code'

    const warmup = async () => {
        purchaseService = module.get('PurchaseService')
        userService = module.get('UserService')
        setupService = module.get('SetupService')

        await purchaseService.wipe()
        await userService.wipe()
        await setupService.wipe()

        await purchaseService.create(purchase)
        await userService.create(user)
        await setupService.create(setup)
    }

    const login = async () => {
        const { body } = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: user.email, password: user.password })

        Authorization = `Bearer ${body.access_token}`
    }

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: './environment/test.env',
                    isGlobal: true,
                    load: [environmentConfig],

                    // validationSchema: environmentSchema
                }),

                MongooseModule.forRootAsync({
                    imports: [ConfigModule],
                    useClass: DatabaseConfig
                }),

                BullModule.forRootAsync({
                    imports: [ConfigModule],
                    useClass: QueueConfig
                }),

                PurchaseModule,
                AuthModule,
                UserModule,
                SetupModule
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();
        await warmup()
        await login()
    });

    describe('[create] POST /purchase', () => {
        it('should insert a new document', async () => {
            const { body } = await request(app.getHttpServer())
                .post('/purchase')
                .set('Authorization', Authorization)
                .send({ ...purchase, price: 1000, code })
                .expect(201)
        })

        it('should not insert a new document', async () => {
            const { body } = await request(app.getHttpServer())
                .post('/purchase')
                .set('Authorization', Authorization)
                .send({})
                .expect(400)
        })

        it('should be unauthorized', async () => {
            const { body } = await request(app.getHttpServer())
                .post('/purchase')
                .send({})
                .expect(401)
        })
    })

    describe('[findAll] GET /purchase', () => {
        it('should return all documents', async () => {
            let findAll: Array<PurchaseDocument> = await purchaseService.findAll({})

            const { body } = await request(app.getHttpServer())
                .get('/purchase')
                .set('Authorization', Authorization)
                .expect(200)

            expect(body.length).toBeGreaterThan(1)
            expect(body[0]._id.toString()).toBe(findAll[0]._id.toString())
        })

        it('should return one document', async () => {
            const query = { match: { code } }

            const { body } = await request(app.getHttpServer())
                .get(`/purchase?match[code]=${code}`)
                .set('Authorization', Authorization)
                .expect(200)

            expect(body.length).toBe(1)
            expect(body[0].code).toBe(code)
        })

        it('should return a lean document', async () => {
            const { body } = await request(app.getHttpServer())
                .get(`/purchase?match[code]=${code}&fields[code]=1`)
                .set('Authorization', Authorization)
                .expect(200)

            expect(body.length).toBe(1)
            expect(body[0].code).toBe(code)
            expect(body[0].price).toBeUndefined
        })

        it('should return a sorted list of documents', async () => {
            const { body } = await request(app.getHttpServer())
                .get('/purchase?options[sort]=-price')
                .set('Authorization', Authorization)
                .expect(200)

            expect(body.length).toBeGreaterThan(1)
            expect(body[0].price).toBeGreaterThan(body[1].price)
        })

        it('should skip the first document', async () => {
            const { body } = await request(app.getHttpServer())
                .get('/purchase?options[skip]=1&options[limit]=1')
                .set('Authorization', Authorization)
                .expect(200)

            expect(body.length).toBe(1)
            expect(body[0].code).toBe(code)
        })

        it('should limit the list', async () => {
            const { body } = await request(app.getHttpServer())
                .get('/purchase?options[limit]=1')
                .set('Authorization', Authorization)
                .expect(200)

            expect(body.length).toBe(1)
        })

        it('should be unauthorized', async () => {
            const { body } = await request(app.getHttpServer())
                .get('/purchase')
                .send({})
                .expect(401)
        })
    })

    describe('[count] GET /purchase/count', () => {
        it('should return the count of all documents', async () => {
            const { body } = await request(app.getHttpServer())
                .get('/purchase/count')
                .set('Authorization', Authorization)
                .expect(200)
        })

        it('should return the filtered count', async () => {
            const { body } = await request(app.getHttpServer())
                .get(`/purchase/count?match[name]=${code}`)
                .set('Authorization', Authorization)
                .expect(200)
        })

        it('should be unauthorized', async () => {
            const { body } = await request(app.getHttpServer())
                .get('/purchase/count')
                .send({})
                .expect(401)
        })
    })

    describe('[findOne] GET /purchase/:id', () => {
        it('should return the document by id', async () => {
            const { _id } = await purchaseService.findOne({})

            const { body } = await request(app.getHttpServer())
                .get(`/purchase/${_id}`)
                .set('Authorization', Authorization)
                .expect(200)

            expect(body._id.toString()).toBe(_id.toString())
        })

        it('should return the document by id', async () => {
            const { _id } = await purchaseService.findOne({})

            const { body } = await request(app.getHttpServer())
                .get(`/purchase/${_id}?fields[code]=1`)
                .set('Authorization', Authorization)
                .expect(200)

            expect(body._id.toString()).toBe(_id.toString())
            expect(body.code).toBeTruthy()
            expect(body.price).toBeUndefined()
        })

        it('should be unauthorized', async () => {
            const { body } = await request(app.getHttpServer())
                .get('/purchase/111111111111111111111111')
                .send({})
                .expect(401)
        })
    })

    describe('[update] PUT /purchase/:id', () => {
        it('should not update a document (wrong id)', async () => {
            const proerty = 'UPDATE'

            const { body } = await request(app.getHttpServer())
                .put('/purchase/000000000000000000000000')
                .set('Authorization', Authorization)
                .send({ proerty })
                .expect(400)
        })

        it('should not update a document (wrong property)', async () => {
            const proerty = 'UPDATE'
            let document

            document = await purchaseService.findOne({})

            const { body } = await request(app.getHttpServer())
                .put(`/purchase/${document._id}`)
                .set('Authorization', Authorization)
                .send({ proerty })
                .expect(400)
        })

        it('should update a document', async () => {
            const code = 'UPDATE'
            let document
            let updatedDocument

            document = await purchaseService.findOne({})

            const { body } = await request(app.getHttpServer())
                .put(`/purchase/${document._id}`)
                .set('Authorization', Authorization)
                .send({ code })
                .expect(200)

            updatedDocument = await purchaseService.findOne({ _id: document._id })

            expect(updatedDocument.code).toBe(code)
            expect(body.nModified).toBe(1)
        })

        it('should be unauthorized', async () => {
            const { body } = await request(app.getHttpServer())
                .put('/purchase/111111111111111111111111')
                .send({})
                .expect(401)
        })
    })

    describe('[remove] DELETE /purchase/:id', () => {
        it('should not remove a document', async () => {
            const { body } = await request(app.getHttpServer())
                .delete(`/purchase/000000000000000000000000`)
                .set('Authorization', Authorization)
                .expect(400)
        })

        it('should remove a document', async () => {
            const document = await purchaseService.findOne({})
            const count = await purchaseService.count({})
            let newCount

            const { body } = await request(app.getHttpServer())
                .delete(`/purchase/${document._id}`)
                .set('Authorization', Authorization)
                .expect(200)

            newCount = await purchaseService.count({})

            expect(body.nModified).toBe(1)
            expect(newCount).toBe(count - 1)
        })

        it('should be unauthorized', async () => {
            const { body } = await request(app.getHttpServer())
                .delete('/purchase/111111111111111111111111')
                .send({})
                .expect(401)
        })
    })

    afterAll(async () => {
        await purchaseService.wipe()
        await userService.wipe()
        await setupService.wipe()
        await app.close();
    });

})