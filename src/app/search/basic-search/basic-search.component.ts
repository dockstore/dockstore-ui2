import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
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
  public searchFormControl = new FormControl();
  public autocompleteTerms$: Observable<Array<string>>;
  public hasAutoCompleteTerms$: Observable<boolean>;
  ngOnInit() {
    this.searchQuery.searchText$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(searchText => {
      // This keeps the state and the view in sync but this is slightly awkward
      // Changes to the searchText$ state will change searchFormControl
      // However, changes to searchFormControl will change searchText$
      // The ONLY reason why this doesn't go infinite loop is because Akita doesn't emit when it's the same value
      // Ideally, we should probably be using AkitaFormManager because then there would only be one variable
      this.searchFormControl.setValue(searchText);
    });
    this.autocompleteTerms$ = this.searchQuery.autoCompleteTerms$;
    this.hasAutoCompleteTerms$ = this.searchQuery.hasAutoCompleteTerms$;

    this.searchFormControl.valueChanges.pipe(
      debounceTime(formInputDebounceTime),
      distinctUntilChanged(),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(searchText => {
      this.searchService.setSearchText(searchText);
    });
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
}
