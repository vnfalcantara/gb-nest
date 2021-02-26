import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from '@nestjs/testing';

import environmentConfig from '../src/config/environment.config';
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConfig } from '../src/config/database.config';

import { UserModule } from '../src/user/user.module';
import { UserService } from '../src/user/user.service'

import { UserMock } from '../src/common/mock'
import { UserDocument } from "src/user/entities/user.entity";
import * as request from 'supertest';
import { AuthModule } from "../src/auth/auth.module";

// import { environmentSchema } from '../environment/environmentSchema';

describe('User', () => {

    const names = ['Mock1', 'Mock2', 'Mock3']

    let module: TestingModule
    let app: INestApplication;
    let userService: UserService

    let Authorization = ''

    const warmup = async () => {
        const user = { ...UserMock, _id: undefined }

        userService = module.get('UserService')

        await userService.wipe({})
        await userService.create({ ...user, name: names[0] })
    }

    const login = async () => {
        const { body } = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: UserMock.email, password: UserMock.password })

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

                UserModule,
                AuthModule
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();
        await warmup()
        await login()
    });

    describe('[create] POST /user', () => {
        it('should insert a new document', async () => {
            let oldCount: number = 0
            let newCount: number = 0

            oldCount = await userService.count({})

            const { body } = await request(app.getHttpServer())
                .post('/user')
                .set('Authorization', Authorization)
                .send({
                    name: names[2],
                    cpf: '00000000000',
                    email: 'mock@email.com',
                    password: '123456'
                })
                .expect(201)

            newCount = await userService.count({})

            expect(newCount).toBe(oldCount + 1)
        })

        it('should not insert a new document', async () => {
            // TODO: VALIDACAO DE CAMPOS

            const { body } = await request(app.getHttpServer())
                .post('/user')
                .set('Authorization', Authorization)
                .send({})
                .expect(400)
        })

        it('should be unauthorized', async () => {
            const { body } = await request(app.getHttpServer())
                .post('/user')
                .send({})
                .expect(401)
        })
    })

    describe('[findAll] GET /user', () => {
        it('should return all documents', async () => {
            let findAll: Array<UserDocument> = await userService.findAll({})

            const { body } = await request(app.getHttpServer())
                .get('/user')
                .set('Authorization', Authorization)
                .expect(200)

            expect(body.length).toBe(2)
        })

        it('should return one document', async () => {
            const query = { match: { name: names[0] } }

            const { body } = await request(app.getHttpServer())
                .get('/user')
                .set('Authorization', Authorization)
                .query(query)
                .expect(200)

            expect(body.length).toBe(1)
            expect(body[0].name).toBe(names[0])
        })

        it('should return a lean document', async () => {
            const { body } = await request(app.getHttpServer())
                .get(`/user?match[name]=${names[0]}&fields[name]=1`)
                .set('Authorization', Authorization)
                .expect(200)

            expect(body.length).toBe(1)
            expect(body[0].name).toBe(names[0])
            expect(body[0].code).toBeUndefined
        })

        it('should return a sorted list of documents', async () => {
            const { body } = await request(app.getHttpServer())
                .get('/user?options[sort]=-name')
                .set('Authorization', Authorization)
                .expect(200)

            expect(body.length).toBe(2)
            expect(body[0].name).toBe(names[2])
        })

        it('should skip the first document', async () => {
            const { body } = await request(app.getHttpServer())
                .get('/user?options[skip]=1&options[limit]=1')
                .set('Authorization', Authorization)
                .expect(200)

            expect(body.length).toBe(1)
            expect(body[0].name).toBe(names[2])
        })

        it('should limit the list', async () => {
            const { body } = await request(app.getHttpServer())
                .get('/user?options[limit]=1')
                .set('Authorization', Authorization)
                .expect(200)

            expect(body.length).toBe(1)
            expect(body[0].name).toBe(names[0])
        })

        it('should be unauthorized', async () => {
            const { body } = await request(app.getHttpServer())
                .get('/user')
                .send({})
                .expect(401)
        })
    })

    describe('[count] GET /user/count', () => {
        it('should return the count of all documents', async () => {
            const { body } = await request(app.getHttpServer())
                .get('/user/count')
                .set('Authorization', Authorization)
                .expect(200)
        })

        it('should return the filtered count', async () => {
            const { body } = await request(app.getHttpServer())
                .get(`/user/count?match[name]=${names[1]}`)
                .set('Authorization', Authorization)
                .expect(200)
        })

        it('should be unauthorized', async () => {
            const { body } = await request(app.getHttpServer())
                .get('/user/count')
                .send({})
                .expect(401)
        })
    })

    describe('[findOne] GET /user/:id', () => {
        it('should return the document by id', async () => {
            const { _id } = await userService.findOne({})

            const { body } = await request(app.getHttpServer())
                .get(`/user/${_id}`)
                .set('Authorization', Authorization)
                .expect(200)

            expect(body._id.toString()).toBe(_id.toString())
        })

        it('should return the document by id', async () => {
            const { _id } = await userService.findOne({})

            const { body } = await request(app.getHttpServer())
                .get(`/user/${_id}?fields[name]=1`)
                .set('Authorization', Authorization)
                .expect(200)

            expect(body._id.toString()).toBe(_id.toString())
            expect(body.name).toBeTruthy()
            expect(body.cpf).toBeUndefined()
        })

        it('should be unauthorized', async () => {
            const { body } = await request(app.getHttpServer())
                .get('/user/111111111111111111111111')
                .send({})
                .expect(401)
        })
    })

    describe('[update] PUT /user/:id', () => {
        it('should not update a document (wrong id)', async () => {
            const proerty = 'UPDATE'

            const { body } = await request(app.getHttpServer())
                .put('/user/111111111111111111111111')
                .set('Authorization', Authorization)
                .send({ proerty })
                .expect(200)

            expect(body.nModified).toBe(0)
        })

        it('should not update a document (wrong property)', async () => {
            const proerty = 'UPDATE'
            let document

            document = await userService.findOne({})

            const { body } = await request(app.getHttpServer())
                .put(`/user/${document._id}`)
                .set('Authorization', Authorization)
                .send({ proerty })
                .expect(200)

            expect(body.nModified).toBe(0)
        })

        it('should update a document', async () => {
            const name = 'UPDATE'
            let document
            let updatedDocument

            document = await userService.findOne({})

            const { body } = await request(app.getHttpServer())
                .put(`/user/${document._id}`)
                .set('Authorization', Authorization)
                .send({ name })
                .expect(200)

            updatedDocument = await userService.findOne({ _id: document._id })

            expect(updatedDocument.name).toBe(name)
            expect(body.nModified).toBe(1)
        })

        it('should be unauthorized', async () => {
            const { body } = await request(app.getHttpServer())
                .put('/user/111111111111111111111111')
                .send({})
                .expect(401)
        })
    })

    describe('[remove] DELETE /user/:id', () => {
        it('should not remove a document', async () => {
            const { body } = await request(app.getHttpServer())
                .delete(`/user/111111111111111111111111`)
                .set('Authorization', Authorization)
                .expect(200)

            expect(body.nModified).toBe(0)
        })

        it('should remove a document', async () => {
            const document = await userService.findOne({})
            const count = await userService.count({})
            let newCount

            const { body } = await request(app.getHttpServer())
                .delete(`/user/${document._id}`)
                .set('Authorization', Authorization)
                .expect(200)

            newCount = await userService.count({})

            expect(body.nModified).toBe(1)
            expect(newCount).toBe(count - 1)
        })

        it('should be unauthorized', async () => {
            const { body } = await request(app.getHttpServer())
                .delete('/user/111111111111111111111111')
                .send({})
                .expect(401)
        })
    })

    afterAll(async () => {
        await userService.wipe({})
        await app.close();
    });

})