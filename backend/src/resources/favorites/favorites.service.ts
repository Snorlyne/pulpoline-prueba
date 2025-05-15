import { Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Favorite } from './entities/favorite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { IWeather } from '../weather/interfaces/weather.interface';
import { WeatherService } from '../weather/weather.service';
import ErrorHandler from '../../../core/helper/errorHandler';
import CustomeResponse from '../../../core/interfaces/customeResponse';
import { ILoggedUser } from '../../../core/interfaces/loggedUser';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    private readonly userService: UsersService,
    private readonly weatherService: WeatherService,
  ) {}
  async findAll(
    cuerrentUser: ILoggedUser,
  ): Promise<CustomeResponse<IWeather[] | null>> {
    try {
      const data: IWeather[] = [];
      const favorites = await this.favoriteRepository.find({
        where: { user: { id: cuerrentUser.id } },
      });

      for (const fav of favorites) {
        const res = await this.weatherService.findByCity(fav.city);
        if (res.statusCode !== 200) {
          continue;
        }
        data.push(res.result as IWeather);
      }

      return new CustomeResponse(data, 200, 'Favorites found.');
    } catch (error) {
      return ErrorHandler.handle(error);
    }
  }

  async create(
    currentUser: ILoggedUser,
    createFavoriteDto: CreateFavoriteDto,
  ): Promise<CustomeResponse<Favorite | null>> {
    try {
      const user = await this.userService.findOne(currentUser.id);

      if (!user) {
        return new CustomeResponse(null, 404, 'User not found.');
      }

      const favorite = this.favoriteRepository.create(createFavoriteDto);

      favorite.user = user;

      await this.favoriteRepository.save(favorite);

      return new CustomeResponse(
        favorite,
        201,
        'Favorite created successfully.',
      );
    } catch (error) {
      return ErrorHandler.handle(error);
    }
  }

  async remove(city: string): Promise<CustomeResponse<Favorite | null>> {
    try {
      const favorite = await this.favoriteRepository.findOne({
        where: { city },
      });

      if (!favorite) {
        return new CustomeResponse(null, 404, 'Favorite not found.');
      }

      await this.favoriteRepository.softRemove(favorite);

      return new CustomeResponse(
        favorite,
        200,
        'Favorite deleted successfully.',
      );
    } catch (error) {
      return ErrorHandler.handle(error);
    }
  }
}
