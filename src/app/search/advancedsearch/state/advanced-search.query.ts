import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { SearchState, SearchStore } from 'app/search/state/search.store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AdvancedSearchQuery extends Query<SearchState> {
  advancedSearch$ = this.select((state) => state.advancedSearch);
  hasAdvancedSearchText$: Observable<boolean> = this.advancedSearch$.pipe(
    map((advancedSearchObject) => {
      if (
        advancedSearchObject &&
        (advancedSearchObject.ANDSplitFilter ||
          advancedSearchObject.ANDNoSplitFilter ||
          advancedSearchObject.ORFilter ||
          advancedSearchObject.NOTFilter)
      ) {
        return true;
      } else {
        return false;
      }
    })
  );
  aNDSplitFilterText$ = this.advancedSearch$.pipe(map((advancedSearchObject) => this.joinComma(advancedSearchObject.ANDSplitFilter)));
  aNDNoSplitFilterText$ = this.advancedSearch$.pipe(map((advancedSearchObject) => advancedSearchObject.ANDNoSplitFilter));
  oRFilterText$ = this.advancedSearch$.pipe(map((advancedSearchObject) => this.joinComma(advancedSearchObject.ORFilter)));
  nOTFilterText$ = this.advancedSearch$.pipe(map((advancedSearchObject) => this.joinComma(advancedSearchObject.NOTFilter)));
  constructor(protected store: SearchStore) {
    super(store);
  }

  joinComma(searchTerm: string): string {
    return searchTerm.trim().split(' ').join(', ');
  }
}
