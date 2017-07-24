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

  click(): void {
    this.advancedSearchService.toAdvanceSearch$.next(true);
  }

  ngAfterViewChecked() {
    this.advancedSearchService.ANDNoSplitFilter$.next(this.ANDNoSplitFilter);
    this.advancedSearchService.ANDSplitFilter$.next(this.ANDSplitFilter);
    this.advancedSearchService.ORFilter$.next(this.ORFilter);
    this.advancedSearchService.NOTFilter$.next(this.NOTFilter);
  }
}
