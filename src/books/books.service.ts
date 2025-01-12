import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema/book.schema';
import { Author, AuthorDocument } from '../authors/schemas/author.schema/author.schema';
import { CreateBookDto } from './dto/create-book.dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>, // Modelo de Libros
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>, // Modelo de Autores
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const createdBook = new this.bookModel(createBookDto);
    const savedBook = await createdBook.save();

    // Actualizar autores
    await this.authorModel.updateMany(
      { _id: { $in: createBookDto.authors } },
      { $push: { books: savedBook._id } },
    );

    return savedBook;
  }

  async findAll(): Promise<Book[]> {
    return this.bookModel.find().populate({ path: 'authors', select: 'name' }).exec();// Excluye "books"
  }
}
