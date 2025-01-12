import { IsString, IsInt, Min, ArrayNotEmpty, IsArray } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsInt()
  @Min(1)
  chapters: number;

  @IsInt()
  @Min(1)
  pages: number;

  @IsArray()
  @ArrayNotEmpty()
  authors: string[];
}
