import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { mockUser } from '../users/mocks/user.mock';
import { WeatherService } from '../weather/weather.service';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('FavoritesController', () => {
  let controller: FavoritesController;
  let service: FavoritesService;
  let guard: AuthGuard;

  const mockFavoritesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritesController],
      providers: [
        {
          provide: FavoritesService,
          useValue: mockFavoritesService,
        },
        {
          provide: WeatherService,
          useValue: {
            findByCity: jest.fn(),
            autocomplete: jest.fn(),
          },
        },
        AuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn().mockResolvedValue({ userId: 1 }),
          },
        },
      ],
    }).compile();

    controller = module.get<FavoritesController>(FavoritesController);
    service = module.get<FavoritesService>(FavoritesService);
    guard = module.get<AuthGuard>(AuthGuard);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct params', async () => {
      const dto: CreateFavoriteDto = { city: 'Madrid' };
      const expected = { success: true };
      mockFavoritesService.create.mockResolvedValue(expected);

      const result = await controller.create(dto, { user: mockUser });
      expect(result).toEqual(expected);
      expect(mockFavoritesService.create).toHaveBeenCalledWith(mockUser, dto);
    });
  });

  describe('findAll', () => {
    it('should return all favorites for the user', async () => {
      const expected = [{ city: 'Madrid' }];
      mockFavoritesService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll({ user: mockUser });
      expect(result).toEqual(expected);
      expect(mockFavoritesService.findAll).toHaveBeenCalledWith('testuser');
    });
  });

  describe('remove', () => {
    it('should remove a favorite city', async () => {
      const expected = { deleted: true };
      mockFavoritesService.remove.mockResolvedValue(expected);

      const result = await controller.remove('Madrid');
      expect(result).toEqual(expected);
      expect(mockFavoritesService.remove).toHaveBeenCalledWith('Madrid');
    });
  });
});
