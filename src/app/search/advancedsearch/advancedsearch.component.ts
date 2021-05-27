/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Base } from '../../shared/base';
import { SearchService } from '../state/search.service';
import { AdvancedSearchObject } from './../../shared/models/AdvancedSearchObject';
import { AdvancedSearchQuery } from './state/advanced-search.query';

@Component({
  selector: 'app-advancedsearch',
  templateUrl: './advancedsearch.component.html',
  styleUrls: ['./advancedsearch.component.scss'],
})
export class AdvancedSearchComponent extends Base implements OnInit {
  NOTFilter: string;
  ANDNoSplitFilter: string;
  ANDSplitFilter: string;
  ORFilter: string;
  searchMode = 'files';
  constructor(private searchService: SearchService, private advancedSearchQuery: AdvancedSearchQuery, private dialog: MatDialog) {
    super();
  }

  ngOnInit() {
    this.advancedSearchQuery.advancedSearch$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((advancedSearch: AdvancedSearchObject) => {
      this.ANDNoSplitFilter = advancedSearch.ANDNoSplitFilter;
      this.ANDSplitFilter = advancedSearch.ANDSplitFilter;
      this.ORFilter = advancedSearch.ORFilter;
      this.NOTFilter = advancedSearch.NOTFilter;
      this.searchMode = advancedSearch.searchMode;
    });
  }

  advancedSearch(): void {
    const advancedSearch: AdvancedSearchObject = {
      ANDNoSplitFilter: this.ANDNoSplitFilter,
      ANDSplitFilter: this.ANDSplitFilter,
      ORFilter: this.ORFilter,
      NOTFilter: this.NOTFilter,
      searchMode: this.searchMode,
    };
    this.searchService.setAdvancedSearch(advancedSearch);
    this.dialog.closeAll();
  }

  clearAll(): void {
    this.searchService.clear();
    // No easy and correct way to get searchInfo for `this.searchService.createPermalinks(searchInfo)` without major changes
    // because it's not in the state
    this.searchService.goToCleanSearch();
    this.closeDialog();
  }

  switchSearchMode(searchMode: string): void {
    this.searchMode = searchMode;
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }
}
