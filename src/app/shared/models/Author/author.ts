import { BookDto } from '../DTO/BookDto';

export interface Author {
  authorId: number;
  name: string;
  lastName: string;
  isActive: boolean;
  books: BookDto[];
}
