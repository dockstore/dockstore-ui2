import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Query } from '@datorama/akita';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppTool, DockstoreTool, Workflow } from '../../shared/swagger';
import { SearchState, SearchStore } from './search.store';

@Injectable({ providedIn: 'root' })
export class SearchQuery extends Query<SearchState> {
  public workflowhit$: Observable<any> = this.select((state) => state.workflowhit);
  public toolhit$: Observable<any> = this.select((state) => state.toolhit);
  public shortUrl$: Observable<string> = this.select((state) => state.shortUrl);
  public workflows$: Observable<Array<Workflow>> = this.workflowhit$.pipe(
    map((elasticSearchResults: Array<any>) =>
      elasticSearchResults ? elasticSearchResults.map((elasticSearchResult) => elasticSearchResult._source) : null
    )
  );
  public tools$: Observable<Array<DockstoreTool> | Array<AppTool>> = this.toolhit$.pipe(
    map((elasticSearchResults: Array<any>) =>
      elasticSearchResults ? elasticSearchResults.map((elasticSearchResult) => elasticSearchResult._source) : null
    )
  );
  public savedTabIndex$: Observable<number> = this.select((state) => state.currentTabIndex);
  public noToolHits$: Observable<boolean> = this.tools$.pipe(map((tools: Array<DockstoreTool>) => this.haveNoHits(tools)));
  public noWorkflowHits$: Observable<boolean> = this.workflows$.pipe(map((workflows: Array<Workflow>) => this.haveNoHits(workflows)));
  public searchText$: Observable<string> = this.select((state) => state.searchText);
  public basicSearchText$: Observable<string> = this.searchText$.pipe(map((searchText) => this.joinComma(searchText)));
  public showToolTagCloud$: Observable<boolean> = this.select((state) => state.showToolTagCloud);
  public showWorkflowTagCloud$: Observable<boolean> = this.select((state) => state.showWorkflowTagCloud);
  public filters$: Observable<Map<string, Set<string>>> = this.select((state) => state.filters);
  public filterKeys$: Observable<Array<string>> = this.filters$.pipe(map((filters) => this.getFilterKeys(filters)));
  public autoCompleteTerms$: Observable<Array<string>> = this.select((state) => state.autocompleteTerms);
  public hasAutoCompleteTerms$: Observable<boolean> = this.autoCompleteTerms$.pipe(map((terms) => terms.length > 0));
  public facetAutoCompleteTerms$: Observable<Array<string>> = this.select((state) => state.facetAutocompleteTerms);
  public hasFacetAutoCompleteTerms$: Observable<boolean> = this.facetAutoCompleteTerms$.pipe(map((terms) => terms.length > 0));
  public suggestTerm$: Observable<string> = this.select((state) => state.suggestTerm);
  public pageSize$: Observable<number> = this.select((state) => state.pageSize);
  public pageIndex$: Observable<number> = this.select((state) => state.pageIndex);
  public hasFilters$: Observable<boolean> = this.filters$.pipe(map((filters) => this.hasFilters(filters)));
  public noBasicSearchHits$: Observable<boolean> = combineLatest([this.noToolHits$, this.noWorkflowHits$, this.searchText$]).pipe(
    map(([noToolHits, noWorkflowHits, searchText]) => {
      if (!searchText) {
        return false;
      } else {
        return noToolHits && noWorkflowHits;
      }
    })
  );

  constructor(protected store: SearchStore, private route: ActivatedRoute) {
    super(store);
  }

  /**
   * Returns true if at least one filter is set
   */
  hasFilters(filters: Map<string, Set<string>>) {
    let count = 0;
    filters.forEach((filter) => {
      count += filter.size;
    });
    return count > 0;
  }

  getFilters(): Map<string, Set<string>> {
    return this.getValue().filters;
  }

  getFilterKeys(filters: Map<string, Set<string>>): Array<string> {
    return filters ? Array.from(filters.keys()) : [];
  }

  haveNoHits(object: Array<any>): boolean {
    return !object || object.length === 0;
  }

  joinComma(searchTerm: string): string {
    return searchTerm.trim().split(' ').join(', ');
  }
}
