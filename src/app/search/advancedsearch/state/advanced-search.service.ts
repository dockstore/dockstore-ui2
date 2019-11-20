import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from 'app/search/state/search.service';
import { AdvancedSearchObject } from 'app/shared/models/AdvancedSearchObject';
import { AdvancedSearchStore } from './advanced-search.store';

@Injectable()
export class AdvancedSearchService {
  constructor(private advancedSearchStore: AdvancedSearchStore, private router: Router, private searchService: SearchService) {}

  setAdvancedSearch(advancedSearch: AdvancedSearchObject): void {
    this.advancedSearchStore.update(state => {
      return {
        ...state,
        advancedSearch: advancedSearch
      };
    });
    this.searchService.setSearchText('');
  }

  setShowModal(showModal: boolean): void {
    this.advancedSearchStore.update(state => {
      return {
        ...state,
        showModal: showModal
      };
    });
  }

  goToCleanSearch() {
    this.router.navigateByUrl('search');
  }

  clear(): void {
    this.advancedSearchStore.reset();
  }
}
