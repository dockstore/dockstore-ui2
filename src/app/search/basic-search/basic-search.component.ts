import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, shareReplay, takeUntil } from 'rxjs/operators';
import { Base } from '../../shared/base';
import { bootstrap4largeModalSize, formInputDebounceTime } from '../../shared/constants';
import { AdvancedSearchComponent } from '../advancedsearch/advancedsearch.component';
import { SearchQuery } from '../state/search.query';
import { SearchService } from '../state/search.service';
import { MatLegacyOptionModule } from '@angular/material/legacy-core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-basic-search',
  templateUrl: './basic-search.component.html',
  styleUrls: ['./basic-search.component.scss'],
  standalone: true,
  imports: [
    MatExpansionModule,
    MatLegacyFormFieldModule,
    MatLegacyInputModule,
    MatLegacyAutocompleteModule,
    FormsModule,
    MatLegacyTooltipModule,
    ReactiveFormsModule,
    NgIf,
    MatLegacyButtonModule,
    MatIconModule,
    NgFor,
    MatLegacyOptionModule,
    AsyncPipe,
  ],
})
export class BasicSearchComponent extends Base implements OnInit {
  constructor(private searchService: SearchService, private searchQuery: SearchQuery, private matDialog: MatDialog) {
    super();
  }
  public searchFormControl = new UntypedFormControl();
  public autocompleteTerms$: Observable<Array<string>>;
  public hasAutoCompleteTerms$: Observable<boolean>;
  @Output() changed: EventEmitter<string> = new EventEmitter<string>();
  @Output() changedDebounced: EventEmitter<string> = new EventEmitter<string>();
  @Output() submitted: EventEmitter<string> = new EventEmitter<string>();
  ngOnInit() {
    this.searchQuery.searchText$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((searchText) => {
      // This keeps the state and the view in sync but this is slightly awkward
      // Changes to the searchText$ state may change searchFormControl
      // However, changes to searchFormControl may change searchText$
      // The ONLY reason why this doesn't go infinite loop is because Akita doesn't emit when it's the same value
      this.searchFormControl.setValue(searchText);
    });
    this.autocompleteTerms$ = this.searchQuery.autoCompleteTerms$;
    this.hasAutoCompleteTerms$ = this.searchQuery.hasAutoCompleteTerms$;

    const valueChanges = this.searchFormControl.valueChanges.pipe(takeUntil(this.ngUnsubscribe), shareReplay({ refCount: true }));

    valueChanges.subscribe((searchText) => {
      this.changed.emit(searchText);
    });
    valueChanges.pipe(debounceTime(formInputDebounceTime), distinctUntilChanged()).subscribe((searchText) => {
      this.changedDebounced.emit(searchText);
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
    this.submitted.emit(searchText);
  }

  clearSearch() {
    this.searchFormControl.setValue('');
    this.submitted.emit('');
  }
}
