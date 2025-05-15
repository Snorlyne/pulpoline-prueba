import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { IAutocomplete, IWeather } from './interfaces/weather.interface';
import ErrorHandler from '../../../core/helper/errorHandler';
import CustomeResponse from '../../../core/interfaces/customeResponse';
@Injectable()
export class WeatherService {
  private apiKey: string | undefined;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('WEATHER_API_KEY');
  }

  async findByCity(city: string): Promise<CustomeResponse<IWeather | null>> {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${this.apiKey}&q=${city}&lang=en`,
        {},
      );
      const data: IWeather = response.data;
      return new CustomeResponse(data, 200, 'Data retrieved successfully.');
    } catch (error) {
      return ErrorHandler.handle(error);
    }
  }
  async autocomplete(
    query: string,
  ): Promise<CustomeResponse<IAutocomplete[] | null>> {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/search.json?key=${this.apiKey}&q=${query}&lang=en`,
        {},
      );
      const data: IAutocomplete[] = response.data;
      return new CustomeResponse(data, 200, 'Data retrieved successfully.');
    } catch (error) {
      return ErrorHandler.handle(error);
    }
  }
}
