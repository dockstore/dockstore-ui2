import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Query } from '@datorama/akita';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppTool, DockstoreTool, Workflow, Notebook } from '../../shared/openapi';
import { SearchState, SearchStore } from './search.store';

export interface SearchResult<T = AppTool | DockstoreTool | Workflow | Notebook> {
  source: T;
  highlight: any;
}

@Injectable({ providedIn: 'root' })
export class SearchQuery extends Query<SearchState> {
  public workflowhit$: Observable<any> = this.select((state) => state.workflowhit);
  public toolhit$: Observable<any> = this.select((state) => state.toolhit);
  public notebookhit$: Observable<any> = this.select((state) => state.notebookhit);
  public shortUrl$: Observable<string> = this.select((state) => state.shortUrl);
  public workflows$: Observable<Array<SearchResult<Workflow>>> = this.getSearchResultsFromHits<Workflow>(this.workflowhit$);
  public tools$: Observable<Array<SearchResult<DockstoreTool | AppTool>>> = this.getSearchResultsFromHits<DockstoreTool | AppTool>(
    this.toolhit$
  );
  public notebooks$: Observable<Array<SearchResult<Notebook>>> = this.getSearchResultsFromHits<Notebook>(this.notebookhit$);
  public savedTabIndex$: Observable<number> = this.select((state) => state.currentTabIndex);
  public noToolHits$: Observable<boolean> = this.tools$.pipe(
    map((tools: Array<SearchResult<DockstoreTool | AppTool>>) => this.haveNoHits(tools))
  );
  public noWorkflowHits$: Observable<boolean> = this.workflows$.pipe(
    map((workflows: Array<SearchResult<Workflow>>) => this.haveNoHits(workflows))
  );
  public noNotebookHits$: Observable<boolean> = this.notebooks$.pipe(
    map((notebooks: Array<SearchResult<Notebook>>) => this.haveNoHits(notebooks))
  );
  public searchText$: Observable<string> = this.select((state) => state.searchText);
  public basicSearchText$: Observable<string> = this.searchText$.pipe(map((searchText) => this.joinComma(searchText)));
  public showToolTagCloud$: Observable<boolean> = this.select((state) => state.showToolTagCloud);
  public showWorkflowTagCloud$: Observable<boolean> = this.select((state) => state.showWorkflowTagCloud);
  public showNotebookTagCloud$: Observable<boolean> = this.select((state) => state.showNotebookTagCloud);
  public filterKeys$: Observable<Array<string>> = this.select((state) => state.filterKeys);
  public autoCompleteTerms$: Observable<Array<string>> = this.select((state) => state.autocompleteTerms);
  public hasAutoCompleteTerms$: Observable<boolean> = this.autoCompleteTerms$.pipe(map((terms) => terms.length > 0));
  public facetAutoCompleteTerms$: Observable<Array<string>> = this.select((state) => state.facetAutocompleteTerms);
  public hasFacetAutoCompleteTerms$: Observable<boolean> = this.facetAutoCompleteTerms$.pipe(map((terms) => terms.length > 0));
  public suggestTerm$: Observable<string> = this.select((state) => state.suggestTerm);
  public pageSize$: Observable<number> = this.select((state) => state.pageSize);
  public pageIndex$: Observable<number> = this.select((state) => state.pageIndex);
  public noBasicSearchHits$: Observable<boolean> = combineLatest([
    this.noToolHits$,
    this.noWorkflowHits$,
    this.noNotebookHits$,
    this.searchText$,
  ]).pipe(
    map(([noToolHits, noWorkflowHits, noNotebookHits, searchText]) => {
      if (!searchText) {
        return false;
      } else {
        return noToolHits && noWorkflowHits && noNotebookHits;
      }
    })
  );

  constructor(protected store: SearchStore, private route: ActivatedRoute) {
    super(store);
  }

  haveNoHits(object: Array<any>): boolean {
    return !object || object.length === 0;
  }

  joinComma(searchTerm: string): string {
    return searchTerm.trim().split(' ').join(', ');
  }

  /**
   * Transforms ElasticSearch hits to SearchResult objects
   * @param entryHits$
   * @returns
   */
  getSearchResultsFromHits<T>(entryHits$: Observable<any>): Observable<Array<SearchResult<T>>> | null {
    return entryHits$.pipe(
      map((elasticSearchResults: Array<any>) =>
        elasticSearchResults
          ? elasticSearchResults.map((elasticSearchResult) => {
              return { source: elasticSearchResult._source, highlight: elasticSearchResult.highlight } as SearchResult<T>;
            })
          : null
      )
    );
  }
}
