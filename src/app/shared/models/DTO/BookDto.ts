export interface BookDto {
  bookId: number;
  title: string;
  description: string;
  publicationDate: string;
  urlImageBook: string;
  isActive: boolean;
  namesAuthors?: string;
  namesCategories?: string;
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
export interface BookSetDto {
  title: string;
  description: string;
  publicationDate: string;
  urlImageBook: string;
  isActive: boolean;
  authorIds: number[];
  categoryIds: number[];
}
