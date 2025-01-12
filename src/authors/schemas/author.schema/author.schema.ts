import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthorDocument = HydratedDocument<Author>;

@Schema()
export class Author {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: String, ref: 'Book' }] }) // Relación con libros
  books: string[];
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
