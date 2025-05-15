import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { mockUser } from '../users/mocks/user.mock';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByUsername: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);

    // Mock bcryptjs
    jest
      .spyOn(bcryptjs, 'hash')
      .mockImplementation(() => Promise.resolve('hashed-password'));
    jest.spyOn(bcryptjs, 'compare').mockImplementation((pass, hash) => {
      return Promise.resolve(
        pass === 'valid-password' && hash === mockUser.password,
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should throw if username already exists', async () => {
      usersService.findOneByUsername.mockResolvedValue(mockUser);

      await expect(
        service.register({ username: 'testuser', password: '123' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create a user if username does not exist', async () => {
      usersService.findOneByUsername.mockResolvedValue(null);
      usersService.create.mockResolvedValue(mockUser);

      const result = await service.register({
        username: 'newuser',
        password: '123',
      });

      expect(usersService.create).toHaveBeenCalledWith({
        username: 'newuser',
        password: 'hashed-password',
      });
      expect(result.message).toBe('Registration successful');
    });
  });

  describe('login', () => {
    it('should throw if user not found', async () => {
      usersService.findOneByUsername.mockResolvedValue(null);

      await expect(
        service.login({ username: 'ghost', password: '123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if password is invalid', async () => {
      usersService.findOneByUsername.mockResolvedValue(mockUser);

      const result = service.login({
        username: 'testuser',
        password: 'wrong-password',
      });

      await expect(result).rejects.toThrow(UnauthorizedException);
    });

    it('should return token and username if login is successful', async () => {
      usersService.findOneByUsername.mockResolvedValue(mockUser);
      jwtService.signAsync.mockResolvedValue('mocked-jwt');

      const result = await service.login({
        username: 'testuser',
        password: 'valid-password',
      });

      expect(result.result?.token).toBe('mocked-jwt');
      expect(result.result?.username).toBe('testuser');
    });
  });
});
