import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from '@nestjs/testing';

import environmentConfig from '../src/config/environment.config';
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConfig } from '../src/config/database.config';

import { UserModule } from '../src/user/user.module';
import { UserService } from '../src/user/user.service'

import { CashbackMock, UserMock } from '../src/common/mock'
import * as request from 'supertest';
import { AuthModule } from "../src/auth/auth.module";
import { CashbackModule } from "../src/cashback/cashback.module";

import * as nock from 'nock'

// import { environmentSchema } from '../environment/environmentSchema';

describe('User', () => {

    let module: TestingModule
    let app: INestApplication;
    let userService: UserService

    let Authorization = ''

    const warmup = async () => {
        const user = { ...UserMock, _id: undefined }

        userService = module.get('UserService')

        await userService.wipe({})
        await userService.create({ ...user, _id: undefined })
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
                AuthModule,
                CashbackModule
            ],
        }).compile();

        app = module.createNestApplication();

        await app.init();
        await warmup()
        await login()
    });

    describe('[getCahback] GET /cashback', () => {
        it('should return the cashback', async () => {
            nock('https://mdaqk8ek5j.execute-api.us-east-1.amazonaws.com/v1')
                .get('/cashback?cpf=12312312323')
                .reply(200, CashbackMock)

            const { body } = await request(app.getHttpServer())
                .get('/cashback')
                .set('Authorization', Authorization)
                .expect(200)

            expect(body.statusCode).toBe(CashbackMock.statusCode)
            expect(body.body.credit).toBe(CashbackMock.body.credit)
        })
    })

    afterAll(async () => {
        await userService.wipe({})
        await app.close();
    });

})