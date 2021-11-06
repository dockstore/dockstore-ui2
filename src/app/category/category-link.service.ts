// TODO add copyright
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../shared/openapi';

@Injectable({ providedIn: 'root' })
export class CategoryLinkService {
  constructor(
    private router: Router,
  ) {}

  goToCategoryPage(category: Category, entryType: string) {
    this.router.navigate(['/search'], {'queryParams': {'categories.name.keyword': category.name, 'entryType': entryType, 'searchMode': 'files'}});
  }
}
