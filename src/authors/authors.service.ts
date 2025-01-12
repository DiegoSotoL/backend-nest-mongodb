import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Author } from './schemas/author.schema/author.schema';
import { ERROR_MESSAGES } from '../../common/error-messages';

@Injectable()
export class AuthorsService {
  constructor(@InjectModel(Author.name) private authorModel: Model<Author>) {}

  async findAll(): Promise<Author[]> {
    try {
      const authors = await this.authorModel
        .find()
        .populate('books', 'title chapters pages')
        .exec();
      if (!authors || authors.length === 0) {
        throw new InternalServerErrorException(
          ERROR_MESSAGES.AUTHORS_NOT_FOUND,
        );
      }
      return authors;
    } catch (error) {
      throw new InternalServerErrorException(ERROR_MESSAGES.AUTHORS_NOT_FOUND);
    }
  }

  async create(createAuthorDto): Promise<Author> {
    try {
      const createdAuthor = new this.authorModel(createAuthorDto);
      return await createdAuthor.save();
    } catch (error) {
      throw new InternalServerErrorException(
        ERROR_MESSAGES.AUTHOR_CREATION_FAILED,
      );
    }
  }
}
