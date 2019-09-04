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
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material';
import { faSort, faSortAlphaDown, faSortAlphaUp, faSortNumericDown, faSortNumericUp } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { formInputDebounceTime } from '../shared/constants';
import { AdvancedSearchObject } from '../shared/models/AdvancedSearchObject';
import { CategorySort } from '../shared/models/CategorySort';
import { SubBucket } from '../shared/models/SubBucket';
import { AdvancedSearchService } from './advancedsearch/advanced-search.service';
import { ELASTIC_SEARCH_CLIENT } from './elastic-search-client';
import { QueryBuilderService } from './query-builder.service';
import { SearchQuery } from './state/search.query';
import { SearchService } from './state/search.service';

/**
 * There are a total of 5 calls per search.
 * 2 calls are from the tag cloud (1 for tool, 1 for workflow)
 * 1 calls are for the sidebar bucket count
 * 1 call for the autocomplete
 * 1 call for the actual results
 *
 * @export
 * @class SearchComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  faSort = faSort;
  faSortAlphaDown = faSortAlphaDown;
  faSortAlphaUp = faSortAlphaUp;
  faSortNumericDown = faSortNumericDown;
  faSortNumericUp = faSortNumericUp;
  private ngUnsubscribe: Subject<{}> = new Subject();
  @ViewChild(MatAccordion) accordion: MatAccordion;
  public advancedSearchObject: AdvancedSearchObject;
  public shortUrl$: Observable<string>;
  /** current set of search results
   * TODO: this stores all results, but the real implementation should limit results
   * and paginate to be scalable
   */
  /*TODO: Bad coding...change this up later (init)..*/
  private setFilter = false;
  public hits: Object[];

  // Possibly 100 workflows and 100 tools (extra +1 is used to see if there are > 200 results)
  public readonly query_size = 201;
  searchTerm = false;

  /** a map from a field (like _type or author) in elastic search to specific values for that field (tool, workflow) and how many
   results exist in that field after narrowing down based on search */
  /** TODO: Note that the key (the name) might not be unique...*/
  public orderedBuckets: Map<string, SubBucket> = new Map<string, SubBucket>();
  // Shows which of the categories (registry, author, etc) are expanded to show all available buckets
  public fullyExpandMap: Map<string, boolean> = new Map<string, boolean>();

  // Shows the sorting mode for the categories
  // true: sort by count (default); false: sort by alphabet
  public sortModeMap: Map<string, CategorySort> = new Map<string, CategorySort>();

  // Shows which of the buckets are current selected
  public checkboxMap: Map<string, Map<string, boolean>> = new Map<string, Map<string, boolean>>();
  /**
   * this stores the set of active (non-text search) filters
   * Maps from filter -> values that have been chosen to filter by
   * @type {Map<String, Set<string>>}
   */
  public filters: Map<String, Set<string>> = new Map<string, Set<string>>();
  /**
   * Friendly names for fields -> fields in elastic search
   * @type {Map<string, V>}
   */
  private bucketStubs: Map<string, string>;
  public friendlyNames: Map<string, string>;
  private entryOrder: Map<string, SubBucket>;

  private advancedSearchOptions = ['ANDSplitFilter', 'ANDNoSplitFilter', 'ORFilter', 'NOTFilter', 'searchMode', 'toAdvanceSearch'];

  public filterKeys$: Observable<Array<string>>;
  public suggestTerm$: Observable<string>;
  /**
   * The current text search
   * @type {string}
   */
  public values = '';

  /**
   * This should be parameterised from src/app/shared/dockstore.model.ts
   * @param providerService
   */
  constructor(
    private queryBuilderService: QueryBuilderService,
    public searchService: SearchService,
    private searchQuery: SearchQuery,
    private advancedSearchService: AdvancedSearchService
  ) {
    this.shortUrl$ = this.searchQuery.shortUrl$;
    this.filterKeys$ = this.searchQuery.filterKeys$;
    this.suggestTerm$ = this.searchQuery.suggestTerm$;
    // Initialize mappings
    this.bucketStubs = this.searchService.initializeCommonBucketStubs();
    this.friendlyNames = this.searchService.initializeFriendlyNames();
    this.entryOrder = this.searchService.initializeEntryOrder();
  }

  getKeys(map: Map<any, any>): Array<string> {
    return Array.from(map.keys());
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.searchService.toSaveSearch$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(toSaveSearch => {
      if (toSaveSearch) {
        this.saveSearchFilter();
        this.searchService.toSaveSearch$.next(false);
      }
    });
    this.searchQuery.searchText$
      .pipe(
        debounceTime(formInputDebounceTime),
        distinctUntilChanged(),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((value: string) => {
        this.values = value;
        this.onKey();
      });
    this.hits = [];
    this.advancedSearchObject = {
      ANDSplitFilter: '',
      ANDNoSplitFilter: '',
      ORFilter: '',
      NOTFilter: '',
      searchMode: 'files',
      toAdvanceSearch: false
    };
    this.parseParams();

    this.advancedSearchService.advancedSearch$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((advancedSearch: AdvancedSearchObject) => {
      this.advancedSearchObject = advancedSearch;
      // Upon init, the user did not want to do an advanced search, but this triggers anyways.  Using toAdvanceSearch to stop it.
      if (advancedSearch.toAdvanceSearch) {
        this.updateQuery();
      }
    });
  }

  /**
   * Applies parameters from the permalink to the search
   */
  parseParams() {
    let useAdvSearch = false;
    const URIParams = this.searchService.createURIParams();
    if (!URIParams.paramsMap) {
      return;
    }
    URIParams.paramsMap.forEach((value, key) => {
      if (this.friendlyNames.get(key)) {
        value.forEach(categoryValue => {
          categoryValue = decodeURIComponent(categoryValue);
          this.filters = this.searchService.handleFilters(key, categoryValue, this.filters);
        });
      } else if (key === 'search') {
        this.searchTerm = true;
        this.advancedSearchObject.toAdvanceSearch = false;
        this.searchService.setSearchText(value[0]);
      } else if (this.advancedSearchOptions.indexOf(key) > -1) {
        if (key.includes('Filter')) {
          useAdvSearch = true;
          this.advancedSearchObject[key] = value[0];
        } else if (key === 'searchMode') {
          useAdvSearch = true;
          if (value[0] !== 'files' && value[0] !== 'description') {
            this.advancedSearchObject[key] = 'files';
          } else {
            this.advancedSearchObject[key] = value[0];
          }
        }
      }
    });

    if (useAdvSearch) {
      this.searchTerm = false;
      this.advancedSearchObject.toAdvanceSearch = true;
      this.advancedSearchService.setAdvancedSearch(this.advancedSearchObject);
    }
  }

  /**===============================================
   *                SetUp Functions
   * ==============================================*/
  /**
   * Partially updates the buckets, fullyExpandMap, and checkboxMap data structures
   * based on one set of the hit's buckets to update the search view
   * @param {any} key The aggregation
   * @param {*} buckets The buckets inside the aggregation
   * @memberof SearchComponent
   */
  setupBuckets(key, buckets: any) {
    buckets.forEach(bucket => {
      if (!this.setFilter) {
        this.fullyExpandMap.set(key, false);
      }
      if (buckets.length > 10) {
        if (!this.sortModeMap.get(key)) {
          const sortby: CategorySort = new CategorySort(true, false, true);
          this.sortModeMap.set(key, sortby);
        }
      }
      const doc_count = bucket.doc_count;
      if (doc_count > 0) {
        if (!this.checkboxMap.get(key)) {
          this.checkboxMap.set(key, new Map<string, boolean>());
        }
        if (!this.checkboxMap.get(key).get(bucket.key)) {
          this.checkboxMap.get(key).set(bucket.key, false);
          if (this.filters.has(key)) {
            if (this.filters.get(key).has(bucket.key.toString())) {
              this.checkboxMap.get(key).set(bucket.key, true);
            }
          }
        }
        if (this.checkboxMap.get(key).get(bucket.key)) {
          this.entryOrder.get(key).SelectedItems.set(bucket.key, doc_count);
        } else {
          this.entryOrder.get(key).Items.set(bucket.key, doc_count);
        }
      }
    });
  }

  setupOrderBuckets() {
    this.entryOrder.forEach((value, key) => {
      if (value.Items.size > 0 || value.SelectedItems.size > 0) {
        this.orderedBuckets.set(key, value);
      }
    });
    this.retainZeroBuckets();
  }

  /**
   * Fully updates the bucket, fullyExpandMap, and checkboxMap data structures
   * based on the hits to update the search view
   * @param {*} hits The response hits from elastic search
   * @memberof SearchComponent
   */
  setupAllBuckets(hits: any) {
    const aggregations = hits.aggregations;
    Object.entries(aggregations).forEach(([key, value]) => {
      if (value['buckets'] != null) {
        this.setupBuckets(this.searchService.aggregationNameToTerm(key), value['buckets']);
      }
      // look for second level buckets (with filtering)
      // If there are second level buckets,
      // the buckets will always be under a property with the same name as the root property
      if (value[key]) {
        this.setupBuckets(key, value[key].buckets);
      }
    });
    this.setFilter = true;
  }
  /**
   * For buckets that were checked earlier, retain them even if there is 0 hits.
   *
   * @memberof SearchComponent
   */
  retainZeroBuckets() {
    this.checkboxMap.forEach((value: Map<string, boolean>, key: string) => {
      value.forEach((innerValue: boolean, innerKey: string) => {
        if (innerValue && this.orderedBuckets.get(key)) {
          if (!this.orderedBuckets.get(key).SelectedItems.get(innerKey)) {
            this.orderedBuckets.get(key).SelectedItems.set(innerKey, '0');
          }
        }
      });
    });
  }

  // Saves the current search filter and passes to search service for sharing with advanced search
  saveSearchFilter() {
    const searchInfo = {
      filter: this.filters,
      searchValues: this.values,
      checkbox: this.checkboxMap,
      sortModeMap: this.sortModeMap,
      advancedSearchObject: this.advancedSearchObject
    };
    this.searchService.setSearchInfo(searchInfo);
  }

  // Updates the permalink to reflect changes to search
  updatePermalink() {
    const searchInfo = {
      filter: this.filters,
      searchValues: this.values,
      advancedSearchObject: Object.assign({}, this.advancedSearchObject),
      searchTerm: this.searchTerm
    };
    const linkArray = this.searchService.createPermalinks(searchInfo);
    this.searchService.handleLink(linkArray);
  }

  /**===============================================
   *                Update Functions
   * ===============================================
   */

  // Called when any change to the search is made to update the results
  updateQuery() {
    this.updatePermalink();
    // Separating into 2 queries otherwise the queries interfere with each other (filter applied before aggregation)
    // The first query handles the aggregation and is used to update the sidebar buckets
    // The second query updates the result table
    const sideBarQuery = this.queryBuilderService.getSidebarQuery(
      this.query_size,
      this.values,
      this.advancedSearchObject,
      this.searchTerm,
      this.bucketStubs,
      this.filters,
      this.sortModeMap
    );
    const tableQuery = this.queryBuilderService.getResultQuery(
      this.query_size,
      this.values,
      this.advancedSearchObject,
      this.searchTerm,
      this.filters
    );
    this.resetEntryOrder();
    this.updateSideBar(sideBarQuery);
    this.updateResultsTable(tableQuery);
  }

  updateSideBar(value: string) {
    ELASTIC_SEARCH_CLIENT.search({
      index: 'tools',
      type: 'entry',
      body: value
    })
      .then(hits => {
        this.setupAllBuckets(hits);
        this.setupOrderBuckets();
      })
      .catch(error => console.log(error));
  }

  /**
   * Updates the results table by sending an elastic search query
   *
   * @param {string} value the elastic search query
   * @memberof SearchComponent
   */
  updateResultsTable(value: string) {
    ELASTIC_SEARCH_CLIENT.search({
      index: 'tools',
      type: 'entry',
      body: value
    })
      .then(hits => {
        this.hits = hits.hits.hits;
        const filteredHits: [Array<any>, Array<any>] = this.searchService.filterEntry(this.hits, this.query_size);
        this.searchService.setHits(filteredHits[0], filteredHits[1]);
        if (this.values.length > 0 && hits) {
          this.searchTerm = true;
        }
        if (this.searchTerm && this.hits.length === 0) {
          this.searchService.suggestSearchTerm(this.values);
        }
      })
      .catch(error => console.log(error));
  }

  /**===============================================
   *                Reset Functions
   * ==============================================
   */
  resetFilters() {
    this.values = '';
    this.searchTerm = false;
    this.filters.clear();
    this.checkboxMap.clear();
    this.sortModeMap.clear();
    this.setFilter = false;
    this.hits = [];
    this.searchService.setSearchInfo(null);
    this.resetEntryOrder();
    this.advancedSearchService.clear();
  }

  resetEntryOrder() {
    this.entryOrder.clear();
    this.entryOrder = this.searchService.initializeEntryOrder();
    this.orderedBuckets.clear();
  }

  /**===============================================
   *                Event Functions
   * ==============================================
   */

  onKey() {
    /*TODO: FOR DEMO USE, make this better later...*/
    const pattern = this.values + '.*';
    ELASTIC_SEARCH_CLIENT.search({
      index: 'tools',
      type: 'entry',
      body: {
        size: 0,
        aggs: {
          autocomplete: {
            terms: {
              field: 'description',
              size: 4,
              order: {
                _count: 'desc'
              },
              include: {
                pattern: pattern
              }
            }
          }
        }
      }
    })
      .then(hits => {
        this.searchService.setAutoCompleteTerms(hits);
      })
      .catch(error => console.log(error));
    this.advancedSearchObject = { ...this.advancedSearchObject, toAdvanceSearch: false };
    this.searchTerm = true;
    if (!this.values || 0 === this.values.length) {
      this.searchTerm = false;
    }
    this.updateQuery();
  }

  searchSuggestTerm() {
    this.searchService.searchSuggestTerm();
  }
  /**
   * This handles clicking a facet and doing the search
   * @param category
   * @param categoryValue
   */
  onClick(category: string, categoryValue: string) {
    if (category !== null && categoryValue !== null) {
      const checked = this.checkboxMap.get(category).get(categoryValue);
      this.checkboxMap.get(category).set(categoryValue, !checked);
      this.filters = this.searchService.handleFilters(category, categoryValue, this.filters);
    }
    this.updateQuery();
  }

  clickExpand(key: string) {
    const isExpanded = this.fullyExpandMap.get(key);
    this.fullyExpandMap.set(key, !isExpanded);
  }

  clickSortMode(category: string, sortMode: boolean) {
    let orderedMap2;
    if (this.sortModeMap.get(category).SortBy === sortMode) {
      let orderBy: boolean;
      if (this.sortModeMap.get(category).SortBy) {
        // Sort by Count
        orderBy = this.sortModeMap.get(category).CountOrderBy;
        this.sortModeMap.get(category).CountOrderBy = !orderBy;
      } else {
        orderBy = this.sortModeMap.get(category).AlphabetOrderBy;
        this.sortModeMap.get(category).AlphabetOrderBy = !orderBy;
      }
    }
    if (sortMode) {
      /* Reorder the bucket map by count */
      orderedMap2 = this.searchService.sortCategoryValue(
        this.orderedBuckets.get(category).Items,
        sortMode,
        this.sortModeMap.get(category).CountOrderBy
      );
    } else {
      /* Reorder the bucket map by alphabet */
      orderedMap2 = this.searchService.sortCategoryValue(
        this.orderedBuckets.get(category).Items,
        sortMode,
        this.sortModeMap.get(category).AlphabetOrderBy
      );
    }
    this.orderedBuckets.get(category).Items = orderedMap2;
    this.sortModeMap.get(category).SortBy = sortMode;
  }

  /**===============================================
   *                Helper Functions
   * ===============================================
   *
   */

  getBucketKeys(key: string) {
    return Array.from(this.orderedBuckets.get(key).SelectedItems.keys());
  }
}
