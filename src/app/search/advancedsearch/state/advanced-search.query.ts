import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { map } from 'rxjs/operators';
import { AdvancedSearchState, AdvancedSearchStore } from './advanced-search.store';

@Injectable({ providedIn: 'root' })
export class AdvancedSearchQuery extends Query<AdvancedSearchState> {
  advancedSearch$ = this.select(state => state.advancedSearch);
  showModal$ = this.select(state => state.showModal);
  aNDSplitFilterText$ = this.advancedSearch$.pipe(map(advancedSearchObject => this.joinComma(advancedSearchObject.ANDSplitFilter)));
  aNDNoSplitFilterText$ = this.advancedSearch$.pipe(map(advancedSearchObject => this.joinComma(advancedSearchObject.ANDNoSplitFilter)));
  oRFilterText$ = this.advancedSearch$.pipe(map(advancedSearchObject => this.joinComma(advancedSearchObject.ORFilter)));
  nOTFilterText$ = this.advancedSearch$.pipe(map(advancedSearchObject => this.joinComma(advancedSearchObject.NOTFilter)));
  constructor(protected store: AdvancedSearchStore) {
    super(store);
  }

  joinComma(searchTerm: string): string {
    return searchTerm
      .trim()
      .split(' ')
      .join(', ');
  }
}
