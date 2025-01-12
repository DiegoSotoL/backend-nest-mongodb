import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({ description: 'Nombre del autor' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Lista de IDs de libros asociados al autor (opcional)',
    type: [String],
    required: false,
  })
  @IsArray()
  books?: string[];
}
