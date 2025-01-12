import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema/book.schema';
import {
  Author,
  AuthorDocument,
} from '../authors/schemas/author.schema/author.schema';
import { CreateBookDto } from './dto/create-book.dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>, // Modelo de Libros
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>, // Modelo de Autores
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    try {
      if (!createBookDto.authors || createBookDto.authors.length === 0) {
        throw new BadRequestException(
          'Debe asociar al menos un autor al libro.',
        );
      }

      const authors = createBookDto.authors.map(
        (authorId) => new Types.ObjectId(authorId),
      );
      const createdBook = new this.bookModel({ ...createBookDto, authors });
      const savedBook = await createdBook.save();

      // Actualizar autores
      const updatedAuthors = await this.authorModel.updateMany(
        { _id: { $in: authors } },
        { $push: { books: savedBook._id } },
      );

      if (updatedAuthors.modifiedCount === 0) {
        throw new NotFoundException(
          'No se encontraron autores para asociar al libro.',
        );
      }

      return savedBook;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('No se pudo crear el libro.');
    }
  }

  async findAll(): Promise<Book[]> {
    try {
      const books = await this.bookModel
        .find()
        .populate({ path: 'authors', select: 'name' })
        .exec(); // Excluye "books"

      if (!books || books.length === 0) {
        throw new NotFoundException('No se encontraron libros.');
      }
      return books;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener los libros.');
    }
  }

  async getPagesAverage(): Promise<
    { bookId: string; title: string; average: number }[]
  > {
    try {
      const books = await this.bookModel
        .find({}, '_id title chapters pages')
        .exec();

      if (!books || books.length === 0) {
        throw new NotFoundException(
          'No se encontraron libros para calcular el promedio.',
        );
      }

      return books.map((book) => ({
        bookId: book._id.toString(),
        title: book.title,
        average: parseFloat((book.pages / book.chapters).toFixed(2)),
      }));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al calcular el promedio de páginas.',
      );
    }
  }
}
