// TODO add copyright
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CategoryLinkService {
  constructor(
  ) {}

  goToCategorySearch(categoryName: string, entryType: string) {
    window.location.href = '/search?categories.name.keyword=' + categoryName + '&searchMode=files&entryType=' + entryType;
  }
}
