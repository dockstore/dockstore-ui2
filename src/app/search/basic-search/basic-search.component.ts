import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Base } from '../../shared/base';
import { bootstrap4largeModalSize, formInputDebounceTime } from '../../shared/constants';
import { AdvancedSearchComponent } from '../advancedsearch/advancedsearch.component';
import { SearchQuery } from '../state/search.query';
import { SearchService } from '../state/search.service';

@Component({
  selector: 'app-basic-search',
  templateUrl: './basic-search.component.html',
})
export class BasicSearchComponent extends Base implements OnInit {
  constructor(private searchService: SearchService, private searchQuery: SearchQuery, private matDialog: MatDialog) {
    super();
  }
  public searchFormControl = new FormControl();
  public autocompleteTerms$: Observable<Array<string>>;
  public hasAutoCompleteTerms$: Observable<boolean>;
  @Output() changed: EventEmitter<string> = new EventEmitter<string>();
  @Output() submitted: EventEmitter<string> = new EventEmitter<string>();
  ngOnInit() {
    this.searchQuery.searchText$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((searchText) => {
      // This keeps the state and the view in sync but this is slightly awkward
      // Changes to the searchText$ state will change searchFormControl
      // TODO update the rest of this comment ^^^
      console.log("UPDATE '" + searchText + "'");
      this.searchFormControl.setValue(searchText);
    });
    this.autocompleteTerms$ = this.searchQuery.autoCompleteTerms$;
    this.hasAutoCompleteTerms$ = this.searchQuery.hasAutoCompleteTerms$;

    this.searchFormControl.valueChanges
      .pipe(debounceTime(formInputDebounceTime), distinctUntilChanged(), takeUntil(this.ngUnsubscribe))
      .subscribe((searchText) => {
        console.log("BS changed " + searchText);
        this.changed.emit(searchText);
      });
  }

  /**
   * Handles the clicking of the "Open Advanced Search" button
   * This sets up and opens the advanced search modal
   *
   * @memberof BasicSearchComponent
   */
  openAdvancedSearch(): void {
    this.matDialog.open(AdvancedSearchComponent, {
      width: bootstrap4largeModalSize,
      height: 'auto',
    });
  }

  submitSearch() {
    const searchText = this.searchFormControl.value;
    console.log("BS search " + searchText);
    this.submitted.emit(searchText);
  }

  clearSearch() {
    this.searchFormControl.setValue('');
    this.submitted.emit('');
  }
}
