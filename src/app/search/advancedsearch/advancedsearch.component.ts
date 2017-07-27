import { AdvancedSearchService } from './advanced-search.service';
import { Component, OnInit, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-advancedsearch',
  templateUrl: './advancedsearch.component.html',
  styleUrls: ['./advancedsearch.component.css']
})
export class AdvancedSearchComponent implements OnInit, AfterViewChecked {
  NOTFilter: string;
  ANDNoSplitFilter: string;
  ANDSplitFilter: string;
  ORFilter: string;

  constructor(private advancedSearchService: AdvancedSearchService) { }

  ngOnInit() {
    this.advancedSearchService.ANDNoSplitFilter$.subscribe((filter: string) => this.ANDNoSplitFilter = filter);
    this.advancedSearchService.ANDSplitFilter$.subscribe((filter: string) => this.ANDSplitFilter = filter);
    this.advancedSearchService.ORFilter$.subscribe((filter: string) => this.ORFilter = filter);
    this.advancedSearchService.NOTFilter$.subscribe((filter: string) => this.NOTFilter = filter);
  }

  advancedSearch(): void {
    this.advancedSearchService.setToAdvanceSearch(true);
  }

  ngAfterViewChecked() {
    this.advancedSearchService.setANDNoSplitFilter(this.ANDNoSplitFilter);
    this.advancedSearchService.setANDSplitFilter(this.ANDSplitFilter);
    this.advancedSearchService.setORFilter(this.ORFilter);
    this.advancedSearchService.setNOTFilter(this.NOTFilter);
  }

  clearAll(): void {
    this.advancedSearchService.setToAdvanceSearch(false);
    this.advancedSearchService.setANDNoSplitFilter('');
    this.advancedSearchService.setANDSplitFilter('');
    this.advancedSearchService.setORFilter('');
    this.advancedSearchService.setNOTFilter('');
  }
}
