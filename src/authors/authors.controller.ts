import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto/create-author.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo autor' })
  async create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.create(createAuthorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los autores con sus libros asociados' })
  async findAll() {
    return this.authorsService.findAll();
  }
}
