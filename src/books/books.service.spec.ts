import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './schemas/book.schema/book.schema';
import { Author } from '../authors/schemas/author.schema/author.schema';
import { ERROR_MESSAGES } from '../../common/error-messages';

describe('BooksService', () => {
  let service: BooksService;
  let bookModel: Model<Book>;
  let authorModel: Model<Author>;

  const mockBookModel = {
    find: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    create: jest.fn(),
    updateMany: jest.fn(),
  };

  const mockAuthorModel = {
    updateMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken('Book'),
          useValue: mockBookModel,
        },
        {
          provide: getModelToken('Author'),
          useValue: mockAuthorModel,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    bookModel = module.get<Model<Book>>(getModelToken('Book'));
    authorModel = module.get<Model<Author>>(getModelToken('Author'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all books', async () => {
      const books = [{ title: 'Dune', chapters: 22, pages: 412, authors: [] }];
      mockBookModel.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(books),
      });

      const result = await service.findAll();
      expect(result).toEqual(books);
    });

    it('should throw an exception if no books are found', async () => {
      mockBookModel.exec.mockResolvedValue([]);

      await expect(service.findAll()).rejects.toThrow(
        ERROR_MESSAGES.BOOKS_NOT_FOUND,
      );
    });
  });

  describe('create', () => {
    it('should create a new book and update authors', async () => {
      const bookDto = {
        title: 'Dune',
        chapters: 22,
        pages: 412,
        authors: ['authorId1', 'authorId2'],
      };
      const createdBook = { ...bookDto, _id: 'bookId1' };
      const updatedAuthors = { nModified: 2 };

      mockBookModel.create.mockResolvedValue(createdBook);
      mockAuthorModel.updateMany.mockResolvedValue(updatedAuthors);

      const result = await service.create(bookDto);
      expect(result).toEqual(createdBook);
      expect(mockBookModel.create).toHaveBeenCalledWith({
        ...bookDto,
        authors: ['authorId1', 'authorId2'],
      });
      expect(mockAuthorModel.updateMany).toHaveBeenCalledWith(
        { _id: { $in: bookDto.authors } },
        { $push: { books: createdBook._id } },
      );
    });

    it('should throw an exception if authors are not found', async () => {
      const bookDto = {
        title: 'Dune',
        chapters: 22,
        pages: 412,
        authors: ['authorId1', 'authorId2'],
      };
      mockBookModel.create.mockResolvedValue({ ...bookDto, _id: 'bookId1' });
      mockAuthorModel.updateMany.mockResolvedValue({ nModified: 0 });

      await expect(service.create(bookDto)).rejects.toThrow(
        ERROR_MESSAGES.BOOK_CREATION_FAILED,
      );
    });
  });
});
