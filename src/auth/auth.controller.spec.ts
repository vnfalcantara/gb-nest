import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/user/dto/user.dto';
import { ServiceMock, UserMock } from '../common/mock';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  
  let controller: AuthController;
  let service = ServiceMock

  const req = {
    user: UserMock
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: service }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('profile', () => {
    it('should return the logged user', async () => {
      const response = await controller.profile(req)

      expect(response).toEqual(req.user)
    })
  })

  describe('login', () => {
    it('should login', async () => {
      const login = service.login.mockReturnValue(UserMock)
      const response = await controller.login({ email: '', password: '' })

      expect(login).toBeCalled()
      expect(response).toEqual(UserMock)
    })
  })

});
