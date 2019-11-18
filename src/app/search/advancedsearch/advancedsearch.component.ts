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
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Base } from '../../shared/base';
import { AdvancedSearchObject } from './../../shared/models/AdvancedSearchObject';
import { AdvancedSearchService } from './state/advanced-search.service';
import { AdvancedSearchQuery } from './state/advanced-search.query';

@Component({
  selector: 'app-advancedsearch',
  templateUrl: './advancedsearch.component.html',
  styleUrls: ['./advancedsearch.component.css']
})
export class AdvancedSearchComponent extends Base implements OnInit {
  NOTFilter: string;
  ANDNoSplitFilter: string;
  ANDSplitFilter: string;
  ORFilter: string;
  isModalShown$: Observable<boolean>;
  searchMode = 'files';
  constructor(private advancedSearchService: AdvancedSearchService, private advancedSearchQuery: AdvancedSearchQuery) {
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
    this.isModalShown$ = this.advancedSearchQuery.showModal$;
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
      searchMode: 'files',
      toAdvanceSearch: false
    };
    this.advancedSearchService.setAdvancedSearch(advancedSearch);
    this.onHidden();
  }

  switchSearchMode(searchMode): void {
    this.searchMode = searchMode;
  }
}
