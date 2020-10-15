import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Base } from '../../shared/base';
import { SearchQuery } from '../state/search.query';
import { SearchService } from '../state/search.service';

@Component({
  selector: 'app-facet-search',
  templateUrl: './facet-search.component.html',
  styleUrls: ['./facet-search.component.scss'],
})
export class FacetSearchComponent extends Base implements OnInit {
  @Input() facet: string;
  constructor(private searchService: SearchService, private searchQuery: SearchQuery, private matDialog: MatDialog) {
    super();
  }
  public searchFormControl = new FormControl();
  public authorAutocompleteTerms$: Observable<Array<string>>;
  public hasAutoCompleteTerms$: Observable<boolean>;
  public inputDebounceTime = 500;

  ngOnInit() {
    this.searchQuery.facetSearchText$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((searchText) => {
      // This keeps the state and the view in sync but this is slightly awkward
      // Changes to the searchText$ state will change searchFormControl
      // However, changes to searchFormControl will change searchText$
      // The ONLY reason why this doesn't go infinite loop is because Akita doesn't emit when it's the same value
      // Ideally, we should probably be using AkitaFormManager because then there would only be one variable
      this.searchFormControl.setValue(searchText);
    });
    this.authorAutocompleteTerms$ = this.searchQuery.authorAutocompleteTerms$;
    this.hasAutoCompleteTerms$ = this.searchQuery.hasAutoCompleteTerms$;

    this.searchFormControl.valueChanges
      .pipe(debounceTime(this.inputDebounceTime), distinctUntilChanged(), takeUntil(this.ngUnsubscribe))
      .subscribe((searchText) => {
        this.searchService.setFacetSearchText(searchText);
      });
  }
}
