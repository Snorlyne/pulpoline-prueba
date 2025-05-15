import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Test, TestingModule } from '@nestjs/testing';
import CustomeResponse from '../../../core/interfaces/customeResponse';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest
      .fn()
      .mockResolvedValue(
        new CustomeResponse(null, 201, 'Registration successful'),
      ),
    login: jest
      .fn()
      .mockResolvedValue(
        new CustomeResponse(
          { token: 'mock-token', username: 'mockUser' },
          200,
          'Login successful',
        ),
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user and return a success message', async () => {
      const dto: RegisterDto = {
        username: 'testuser',
        password: 'password123',
      };

      const result = await controller.register(dto);

      expect(service.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(
        new CustomeResponse(null, 201, 'Registration successful'),
      );
    });
  });

  describe('login', () => {
    it('should login a user and return a token and username', async () => {
      const dto: LoginDto = { username: 'testuser', password: 'password123' };

      const result = await controller.login(dto);

      expect(service.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(
        new CustomeResponse(
          { token: 'mock-token', username: 'mockUser' },
          200,
          'Login successful',
        ),
      );
    });
  });
});
