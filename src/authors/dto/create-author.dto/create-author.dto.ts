import { IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  books: string[]; // IDs de libros relacionados
}
