import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { Base } from '../../shared/base';
import { formInputDebounceTime } from '../../shared/constants';
import { AdvancedSearchService } from '../advancedsearch/advanced-search.service';
import { SearchQuery } from '../state/search.query';
import { SearchService } from '../state/search.service';

@Component({
  selector: 'app-basic-search',
  templateUrl: './basic-search.component.html',
  styleUrls: ['./basic-search.component.scss']
})
export class BasicSearchComponent extends Base implements OnInit {

  constructor(private advancedSearchService: AdvancedSearchService, private searchService: SearchService,
    private searchQuery: SearchQuery) {
      super();
    }
  public autocompleteTerms$: Observable<Array<string>>;
  public hasAutoCompleteTerms$: Observable<boolean>;
  // The local search text
  public searchText: string;
  // The local search text observable
  private searchText$ = new Subject<string>();
  ngOnInit() {
    this.searchQuery.searchText$.subscribe(searchText => this.searchText = searchText);
    this.autocompleteTerms$ = this.searchQuery.autoCompleteTerms$;
    this.hasAutoCompleteTerms$ = this.searchQuery.hasAutoCompleteTerms$;

    // Debouncing the local search text before modifying the state
    this.searchText$.pipe(
      debounceTime(formInputDebounceTime),
      distinctUntilChanged(),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(searchText => this.searchService.setSearchText(searchText));
  }

  /**
   * Handles the clicking of the "Open Advanced Search" button
   * This sets up and opens the advanced search modal
   *
   * @memberof BasicSearchComponent
   */
  openAdvancedSearch(): void {
    this.advancedSearchService.setShowModal(true);
  }

  /**
   * Really need to debounce this
   *
   * @param {*} event
   * @memberof BasicSearchComponent
   */
  onInputChange(event) {
    this.searchText$.next(event);
  }

}
