import { IsString, Matches } from 'class-validator';

export class AutocompleteDto {
  @IsString()
  @Matches(/^[a-zA-Z]+$/, {
    message: 'Query must contain only uppercase or lowercase letters.',
  })
  query: string;
}
