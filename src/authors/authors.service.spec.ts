import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from './authors.service';
import { getModelToken } from '@nestjs/mongoose';
import { ERROR_MESSAGES } from '../../common/error-messages';

describe('AuthorsService', () => {
  let service: AuthorsService;

  const mockAuthorModel = {
    find: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: getModelToken('Author'),
          useValue: mockAuthorModel,
        },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
  });

  it('should return all authors', async () => {
    const authors = [{ _id: '1', name: 'Author 1', books: [] }];
    mockAuthorModel.exec.mockResolvedValue(authors);

    const result = await service.findAll();
    expect(result).toEqual(authors);
  });

  it('should throw an exception if no authors are found', async () => {
    mockAuthorModel.exec.mockResolvedValue([]);

    await expect(service.findAll()).rejects.toThrow(
      ERROR_MESSAGES.AUTHORS_NOT_FOUND,
    );
  });
});
