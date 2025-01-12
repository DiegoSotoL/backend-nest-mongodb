import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  const mockBooksService = {
    findAll: jest.fn(),
    create: jest.fn(),
    getPagesAverage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call BooksService.findAll and return a list of books', async () => {
      const books = [
        { title: 'Dune', chapters: 22, pages: 412 },
        { title: 'El Extranjero', chapters: 11, pages: 123 },
      ];
      mockBooksService.findAll.mockResolvedValue(books);

      const result = await controller.findAll();
      expect(result).toEqual(books);
      expect(mockBooksService.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should call BooksService.create and return the created book', async () => {
      const bookDto = {
        title: 'Dune',
        chapters: 22,
        pages: 412,
        authors: ['authorId1', 'authorId2'],
      };
      const createdBook = { ...bookDto, _id: 'newBookId' };

      mockBooksService.create.mockResolvedValue(createdBook);

      const result = await controller.create(bookDto);
      expect(result).toEqual(createdBook);
      expect(mockBooksService.create).toHaveBeenCalledWith(bookDto);
    });
  });

  describe('getPagesAverage', () => {
    it('should call BooksService.getPagesAverage and return averages', async () => {
      const averages = [
        { bookId: 'bookId1', title: 'Dune', average: 18.73 },
        { bookId: 'bookId2', title: 'El Extranjero', average: 11.18 },
      ];

      mockBooksService.getPagesAverage.mockResolvedValue(averages);

      const result = await controller.getPagesAverage();
      expect(result).toEqual(averages);
      expect(mockBooksService.getPagesAverage).toHaveBeenCalled();
    });
  });
});
