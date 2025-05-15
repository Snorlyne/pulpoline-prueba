import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { ILoggedUser } from '../../../core/interfaces/loggedUser';

@ApiTags('Favorites')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized. Token missing or invalid.' })
@ApiForbiddenResponse({ description: 'Forbidden. You do not have access.' })
@UseGuards(AuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new favorite',
    description: 'Creates a favorite item for the authenticated user.',
  })
  @ApiBody({ type: CreateFavoriteDto })
  @ApiCreatedResponse({ description: 'The favorite has been successfully created.' })
  @ApiBadRequestResponse({ description: 'Bad Request. Invalid data.' })
  @ApiConflictResponse({ description: 'Conflict. Favorite already exists.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  create(@Body() createFavoriteDto: CreateFavoriteDto, @Request() req) {
    const user: ILoggedUser = req.user;
    return this.favoritesService.create(user, createFavoriteDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all favorites',
    description: 'Retrieves all favorite cities for the authenticated user.',
  })
  @ApiOkResponse({ description: 'Successfully retrieved favorites.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  findAll(@Request() req) {
    const user: ILoggedUser = req.user;
    return this.favoritesService.findAll(user);
  }

  @Delete(':city')
  @ApiOperation({
    summary: 'Delete a favorite by city',
    description: 'Removes a favorite city from the list for the authenticated user.',
  })
  @ApiParam({ name: 'city', type: String, description: 'City name to remove' })
  @ApiOkResponse({ description: 'Favorite successfully removed.' })
  @ApiBadRequestResponse({ description: 'Bad Request. Invalid city name.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  remove(@Param('city') city: string) {
    return this.favoritesService.remove(city);
  }
}
