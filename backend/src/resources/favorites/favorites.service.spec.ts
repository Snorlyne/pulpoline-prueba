import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { mockUser } from '../users/mocks/user.mock';
import { mockLoggedUser } from '../../../core/mocks/loggedUser.mock';
import { WeatherService } from '../weather/weather.service';
import { IWeather } from '../weather/interfaces/weather.interface';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let favoriteRepository: jest.Mocked<Repository<Favorite>>;
  let usersService: jest.Mocked<UsersService>;
  let weatherService: jest.Mocked<WeatherService>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: getRepositoryToken(Favorite),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            softRemove: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: WeatherService,
          useValue: {
            findByCity: jest.fn(),
            autocomplete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
    favoriteRepository = module.get(getRepositoryToken(Favorite));
    usersService = module.get(UsersService);
    weatherService = module.get(WeatherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of favorites for the user', async () => {
      const favorites = [{ city: 'Paris' }] as Favorite[];

      favoriteRepository.find.mockResolvedValue(favorites);

      weatherService.findByCity.mockResolvedValue({
        statusCode: 200,
        result: {} as IWeather,
        message: 'Data retrieved successfully.',
      });

      const result = await service.findAll(mockLoggedUser);

      expect(result).toEqual({
        message: 'Favorites found.',
        result: [{}] as IWeather[],
        statusCode: 200,
      });

      expect(favoriteRepository.find).toHaveBeenCalledWith({
        where: { user: { id: mockLoggedUser.id } },
      });

      expect(weatherService.findByCity).toHaveBeenCalledWith('Paris');
    });
  });

  describe('create', () => {
    it('should create a favorite when user exists', async () => {
      const dto: CreateFavoriteDto = { city: 'Berlin' };
      const createdFavorite = { city: 'Berlin', user: mockUser } as Favorite;

      usersService.findOne.mockResolvedValue(mockUser);
      favoriteRepository.create.mockReturnValue(createdFavorite);
      favoriteRepository.save.mockResolvedValue(createdFavorite);

      const result = await service.create(mockLoggedUser, dto);
      expect(result).toEqual({
        message: 'Favorite created successfully.',
        result: createdFavorite,
        statusCode: 201,
      });
      expect(result.statusCode).toBe(201);
      expect(usersService.findOne).toHaveBeenCalledWith(mockLoggedUser.id);
      expect(favoriteRepository.save).toHaveBeenCalledWith(createdFavorite);
    });

    it('should return 404 if user not found', async () => {
      usersService.findOne.mockResolvedValue(null);

      const result = await service.create(mockLoggedUser, { city: 'Rome' });
      expect(result.statusCode).toBe(404);
      expect(result.message).toBe('User not found.');
    });
  });

  describe('remove', () => {
    it('should remove the favorite city if it exists', async () => {
      const city = 'London';
      const favorite = { id: 1, city } as Favorite;

      favoriteRepository.findOne.mockResolvedValue(favorite);
      favoriteRepository.softRemove.mockResolvedValue(favorite);

      const result = await service.remove(city);
      expect(result.statusCode).toBe(200);
      expect(result).toEqual({
        message: 'Favorite deleted successfully.',
        result: favorite,
        statusCode: 200,
      });
      expect(favoriteRepository.softRemove).toHaveBeenCalledWith(favorite);
    });

    it('should return 404 if favorite not found', async () => {
      favoriteRepository.findOne.mockResolvedValue(null);

      const result = await service.remove('Nowhere');
      expect(result.statusCode).toBe(404);
      expect(result).toEqual({
        message: 'Favorite not found.',
        result: null,
        statusCode: 404,
      });
    });
  });
});
