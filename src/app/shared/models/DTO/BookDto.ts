export interface BookDto {
  bookId: number;
  title: string;
  description: string;
  publicationDate: string;
  isActive: boolean;
  authors: AuthorDto[];
  categories: CategoryDto[];
}

export interface AuthorDto {
  authorId: number;
  name: string;
  isActive: boolean;
}

export interface CategoryDto {
  categoryId: number;
  name: string;
  isActive: boolean;
}
