import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ description: 'Título del libro' }) // Descripción para Swagger
  @IsString()
  title: string;

  @ApiProperty({ description: 'Número de capítulos del libro' })
  @IsInt()
  @Min(1)
  chapters: number;

  @ApiProperty({ description: 'Número de páginas del libro' })
  @IsInt()
  @Min(1)
  pages: number;

  @ApiProperty({
    description: 'Lista de IDs de autores asociados al libro',
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  authors: string[];
}
