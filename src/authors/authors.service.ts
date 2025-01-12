import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Author, AuthorDocument } from './schemas/author.schema/author.schema';
import { CreateAuthorDto } from './dto/create-author.dto/create-author.dto';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    try {
      if (!createAuthorDto.name || createAuthorDto.name.trim() === '') {
        throw new BadRequestException('El nombre del autor es obligatorio.');
      }

      const createdAuthor = new this.authorModel(createAuthorDto);
      return await createdAuthor.save();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('No se pudo crear el autor.');
    }
  }

  async findAll(): Promise<Author[]> {
    try {
      const authors = await this.authorModel
        .find()
        .populate('books', 'title chapters pages')
        .exec();
      if (!authors || authors.length === 0) {
        throw new NotFoundException('No se encontraron autores.');
      }
      return authors;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener los autores.');
    }
  }
}
