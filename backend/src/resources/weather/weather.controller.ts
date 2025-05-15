import { Controller, Get, Param, Delete, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CacheTTL } from '@nestjs/cache-manager';

@ApiTags('Weather')
@CacheTTL(60)
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @ApiOperation({
    summary: 'Get current weather by city name',
    description: 'Returns current weather data for a given city.',
  })
  @ApiQuery({ name: 'city', required: true, example: 'New York' })
  @ApiOkResponse({ description: 'Current weather retrieved successfully.' })
  @ApiBadRequestResponse({ description: 'City query is missing or invalid.' })
  @ApiInternalServerErrorResponse({ description: 'Weather API error.' })
  findByCity(@Query('city') city: string) {
    return this.weatherService.findByCity(city);
  }

  @Get('autocomplete')
  @ApiOperation({
    summary: 'Autocomplete city search',
    description:
      'Returns a list of city suggestions that match the query string.',
  })
  @ApiQuery({ name: 'query', required: true, example: 'New' })
  @ApiOkResponse({
    description: 'Autocomplete results retrieved successfully.',
  })
  @ApiBadRequestResponse({ description: 'Query parameter is missing.' })
  @ApiInternalServerErrorResponse({ description: 'Weather API error.' })
  autocomplete(@Query('query') query: string) {
    return this.weatherService.autocomplete(query);
  }
}
