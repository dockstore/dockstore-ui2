import { Injectable } from '@angular/core';
import { AdvancedSearchObject } from 'app/shared/models/AdvancedSearchObject';
import { AdvancedSearchStore } from './advanced-search.store';

@Injectable({ providedIn: 'root' })
export class AdvancedSearchService {
  constructor(private advancedSearchStore: AdvancedSearchStore) {}

  setAdvancedSearch(advancedSearch: AdvancedSearchObject): void {
    this.advancedSearchStore.update(state => {
      return {
        ...state,
        advancedSearch: advancedSearch
      };
    });
  }

  setShowModal(showModal: boolean): void {
    this.advancedSearchStore.update(state => {
      return {
        ...state,
        showModal: showModal
      };
    });
  }

  clear(): void {
    this.advancedSearchStore.reset();
  }
}
