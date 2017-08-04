import { AdvancedSearchObject } from './../../shared/models/AdvancedSearchObject';
import { AdvancedSearchService } from './advanced-search.service';
import { Component, OnInit, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-advancedsearch',
  templateUrl: './advancedsearch.component.html',
  styleUrls: ['./advancedsearch.component.css']
})
export class AdvancedSearchComponent implements OnInit {
  NOTFilter: string;
  ANDNoSplitFilter: string;
  ANDSplitFilter: string;
  ORFilter: string;
  isModalShown: boolean;
  searchMode = 'description';
  constructor(private advancedSearchService: AdvancedSearchService) { }

  ngOnInit() {
    this.advancedSearchService.advancedSearch$.subscribe((advancedSearch: AdvancedSearchObject) => {
      this.ANDNoSplitFilter = advancedSearch.ANDNoSplitFilter;
      this.ANDSplitFilter = advancedSearch.ANDSplitFilter;
      this.ORFilter = advancedSearch.ORFilter;
      this.NOTFilter = advancedSearch.NOTFilter;
      this.searchMode = advancedSearch.searchMode;
    });
    this.advancedSearchService.showModal$.subscribe((showModal: boolean) => this.isModalShown = showModal);
  }

  public onHidden(): void {
    this.advancedSearchService.setShowModal(false);
  }

  advancedSearch(): void {
    const advancedSearch: AdvancedSearchObject = {
      ANDNoSplitFilter: this.ANDNoSplitFilter,
      ANDSplitFilter: this.ANDSplitFilter,
      ORFilter: this.ORFilter,
      NOTFilter: this.NOTFilter,
      searchMode: this.searchMode,
      toAdvanceSearch: true
    };
    this.advancedSearchService.setAdvancedSearch(advancedSearch);
    this.onHidden();
  }

  clearAll(): void {
    const advancedSearch: AdvancedSearchObject = {
      ANDNoSplitFilter: '',
      ANDSplitFilter: '',
      ORFilter: '',
      NOTFilter: '',
      searchMode: 'description',
      toAdvanceSearch: false
    };
    this.advancedSearchService.setAdvancedSearch(advancedSearch);
    this.onHidden();
  }

  switchSearchMode(searchMode): void {
    this.searchMode = searchMode;
  }
}
