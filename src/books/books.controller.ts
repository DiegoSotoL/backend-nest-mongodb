import { Controller, Get, Post, Body } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto/create-book.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('books') // Categorizar este controlador como 'books' en Swagger
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo libro' }) 
  async create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los libros con sus autores' })
  async findAll() {
    return this.booksService.findAll();
  }

  @Get('pages-average')
  @ApiOperation({
    summary: 'Obtener el promedio de páginas por capítulo de los libros',
  })
  async getPagesAverage() {
    return this.booksService.getPagesAverage();
  }
}
