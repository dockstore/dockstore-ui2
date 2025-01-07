import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, shareReplay, takeUntil } from 'rxjs/operators';
import { Base } from '../../shared/base';
import { bootstrap4largeModalSize, formInputDebounceTime } from '../../shared/constants';
import { AdvancedSearchComponent } from '../advancedsearch/advancedsearch.component';
import { SearchQuery } from '../state/search.query';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-basic-search',
  templateUrl: './basic-search.component.html',
  styleUrls: ['./basic-search.component.scss'],
  standalone: true,
  imports: [
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    FormsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    NgIf,
    MatButtonModule,
    MatIconModule,
    NgFor,
    MatOptionModule,
    AsyncPipe,
  ],
})
export class BasicSearchComponent extends Base implements OnInit {
  constructor(private searchQuery: SearchQuery, private matDialog: MatDialog) {
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
