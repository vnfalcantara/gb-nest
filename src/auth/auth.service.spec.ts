import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { ServiceMock, UserMock } from '../common/mock';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {

  let authService: AuthService;
  let userService = ServiceMock
  let jwtService = ServiceMock
  let bcrypt = { compare: jest.fn() }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
        { provide: 'bcrypt', useValue: bcrypt },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate the user', async () => {
      const userFindOne = userService.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(UserMock)
      })

      const validatePassword = authService.validatePassword = jest.fn().mockResolvedValue(true)
      const response = await authService.validateUser('', '')

      expect(userFindOne).toBeCalled()
      expect(validatePassword).toBeCalled()
      expect(response.id).toBe(UserMock._id)
      expect(response.name).toBe(UserMock.name)
      expect(response.email).toBe(UserMock.email)
    })

    it('should not validate the user', async () => {
      const userFindOne = userService.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(UserMock)
      })

      const validatePassword = authService.validatePassword = jest.fn().mockResolvedValue(false)
      const response = await authService.validateUser('', '')

      expect(userFindOne).toBeCalled()
      expect(validatePassword).toBeCalled()
      expect(response).toBeNull()
    })
  })

  describe('validatePassword', () => {
    it('should validade the user password', async () => {
      const isValid = true
      const compare = bcrypt.compare.mockResolvedValue(isValid)
      const response = await authService.validatePassword('', '')

      expect(compare).toBeCalled()
      expect(response).toBe(isValid)
    })
  })

  describe('login', () => {
    it('should return the jwttoken', async () => {
      const token = '1111'
      const sign = jwtService.sign.mockReturnValue(token)
      const response = await authService.login(UserMock)

      expect(sign).toBeCalled()
      expect(response.access_token).toBe(token)
    })
  })

});
