import { Pipe, PipeTransform } from '@angular/core';
import { BookDto } from '../models/DTO/BookDto';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform(array: BookDto[], text: string): any[] {
    if (text === '') {
      return array;
    }

    const normalizedText = this.normalizeText(text);

    const filteredArray = array.filter((item) => {
      const title = this.normalizeText(item?.title);
      const namesCategories = this.normalizeText(item?.namesCategories!);
      const namesAuthors = this.normalizeText(item?.namesAuthors!);
      const description = this.normalizeText(item?.description);
      const date = this.normalizeText(item?.publicationDate);
      return (
        (title ?? '').includes(normalizedText) ||
        (namesCategories ?? '').includes(normalizedText) ||
        (namesAuthors ?? '').includes(normalizedText) ||
        (description ?? '').includes(normalizedText) ||
        (date ?? '').includes(normalizedText)
      );
    });

    return filteredArray.length > 0 ? filteredArray : [];
  }
  parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  normalizeText(texto: string): string {
    return texto
      ? texto
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
      : '';
  }
}
