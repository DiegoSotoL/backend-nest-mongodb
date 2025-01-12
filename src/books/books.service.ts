import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Book } from './schemas/book.schema/book.schema';
import { Author } from '../authors/schemas/author.schema/author.schema';
import { ERROR_MESSAGES } from '../../common/error-messages';
import { CreateBookDto } from './dto/create-book.dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<Book>,
    @InjectModel(Author.name) private authorModel: Model<Author>,
  ) {}

  async findAll(): Promise<Book[]> {
    try {
      const books = await this.bookModel
        .find()
        .populate('authors', 'name')
        .exec();
      if (!books || books.length === 0) {
        throw new InternalServerErrorException(ERROR_MESSAGES.BOOKS_NOT_FOUND);
      }
      return books;
    } catch (error) {
      throw new InternalServerErrorException(ERROR_MESSAGES.BOOKS_NOT_FOUND);
    }
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    try {
      const authors = createBookDto.authors.map(
        (authorId) => new Types.ObjectId(authorId),
      );
      const createdBook = new this.bookModel({ ...createBookDto, authors });
      const savedBook = await createdBook.save();

      const updatedAuthors = await this.authorModel.updateMany(
        { _id: { $in: authors } },
        { $push: { books: savedBook._id } },
      );

      if (updatedAuthors.modifiedCount === 0) {
        throw new InternalServerErrorException(
          ERROR_MESSAGES.AUTHORS_NOT_ASSOCIATED,
        );
      }

      return savedBook;
    } catch (error) {
      if (error.message === ERROR_MESSAGES.AUTHORS_NOT_ASSOCIATED) {
        throw error;
      }
      throw new InternalServerErrorException(
        ERROR_MESSAGES.BOOK_CREATION_FAILED,
      );
    }
  }

  async getPagesAverage(): Promise<
    { bookId: string; title: string; average: number }[]
  > {
    try {
      const books = await this.bookModel
        .find({}, '_id title chapters pages')
        .exec();
      return books.map((book) => ({
        bookId: book._id.toString(),
        title: book.title,
        average: parseFloat((book.pages / book.chapters).toFixed(2)),
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al calcular el promedio de páginas.',
      );
    }
  }
}
