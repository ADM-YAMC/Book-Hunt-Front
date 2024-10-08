import { BookDto } from '../DTO/BookDto';

export interface Category {
  categoryId: number;
  name: string;
  isActive: boolean;
  books: BookDto[];
}
