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
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { faSortAlphaDown, faSortAlphaUp, faSortNumericDown, faSortNumericUp } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { formInputDebounceTime } from '../shared/constants';
import { AdvancedSearchObject, initialAdvancedSearchObject } from '../shared/models/AdvancedSearchObject';
import { CategorySort } from '../shared/models/CategorySort';
import { SubBucket } from '../shared/models/SubBucket';
import { AdvancedSearchQuery } from './advancedsearch/state/advanced-search.query';
import { ELASTIC_SEARCH_CLIENT } from './elastic-search-client';
import { QueryBuilderService } from './query-builder.service';
import { SearchQuery } from './state/search.query';
import { Hit, SearchService } from './state/search.service';

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
  faSortAlphaDown = faSortAlphaDown;
  faSortAlphaUp = faSortAlphaUp;
  faSortNumericDown = faSortNumericDown;
  faSortNumericUp = faSortNumericUp;
  private ngUnsubscribe: Subject<{}> = new Subject();
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  public advancedSearchObject$: Observable<AdvancedSearchObject>;
  public hasAdvancedSearchText$: Observable<boolean>;
  public shortUrl$: Observable<string>;
  public aNDSplitFilterText$: Observable<string>;
  public aNDNoSplitFilterText$: Observable<string>;
  public oRFilterText$: Observable<string>;
  public nOTFilterText$: Observable<string>;
  /** current set of search results
   * TODO: this stores all results, but the real implementation should limit results
   * and paginate to be scalable
   */
  /*TODO: Bad coding...change this up later (init)..*/
  private setFilter = false;
  public hits: Hit[];

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
   * This is temporary and UI only. Modifying this should immediately cause a route change which changes everything
   * @type {Map<string, Set<string>>}
   */
  public filters: Map<string, Set<string>> = new Map<string, Set<string>>();
  /**
   * Friendly names for fields -> fields in elastic search
   * @type {Map<string, V>}
   */
  private bucketStubs: Map<string, string>;
  public friendlyNames: Map<string, string>;
  public toolTips: Map<string, string>;
  private entryOrder: Map<string, SubBucket>;
  public basicSearchText$: Observable<string>;
  private advancedSearchOptions = ['ANDSplitFilter', 'ANDNoSplitFilter', 'ORFilter', 'NOTFilter', 'searchMode'];

  public filterKeys$: Observable<Array<string>>;
  public suggestTerm$: Observable<string>;
  public values$: Observable<string>;
  /**
   * This should be parameterised from src/app/shared/dockstore.model.ts
   * @param providerService
   */
  constructor(
    private queryBuilderService: QueryBuilderService,
    public searchService: SearchService,
    private searchQuery: SearchQuery,
    private advancedSearchQuery: AdvancedSearchQuery,
    private activatedRoute: ActivatedRoute
  ) {
    this.shortUrl$ = this.searchQuery.shortUrl$;
    this.filterKeys$ = this.searchQuery.filterKeys$;
    this.suggestTerm$ = this.searchQuery.suggestTerm$;
    // Initialize mappings
    this.bucketStubs = this.searchService.initializeCommonBucketStubs();
    this.friendlyNames = this.searchService.initializeFriendlyNames();
    this.entryOrder = this.searchService.initializeEntryOrder();
    this.toolTips = this.searchService.initializeToolTips();
  }

  getKeys(bucketMap: Map<any, any>): Array<string> {
    return Array.from(bucketMap.keys());
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.advancedSearchObject$ = this.advancedSearchQuery.advancedSearch$;
    this.hasAdvancedSearchText$ = this.advancedSearchQuery.hasAdvancedSearchText$;
    this.values$ = this.searchQuery.searchText$;
    this.basicSearchText$ = this.searchQuery.basicSearchText$;
    this.activatedRoute.queryParams.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => this.parseParams());
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
      .subscribe((searchText: string) => {
        this.onKey(searchText);
      });
    this.hits = [];

    this.aNDSplitFilterText$ = this.advancedSearchQuery.aNDSplitFilterText$;
    this.aNDNoSplitFilterText$ = this.advancedSearchQuery.aNDNoSplitFilterText$;
    this.oRFilterText$ = this.advancedSearchQuery.oRFilterText$;
    this.nOTFilterText$ = this.advancedSearchQuery.nOTFilterText$;
    // The reason why we have this here is because the updatePermalink function isn't in a service...
    // because the function modifies something that's in this component and not in the state.
    // TODO:move it to the state
    this.advancedSearchQuery.advancedSearch$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.updatePermalink();
    });
  }

  /**
   * Applies parameters from the permalink to the search
   */
  parseParams() {
    const paramMap: ParamMap = this.activatedRoute.snapshot.queryParamMap;
    if (!paramMap) {
      return;
    }
    // Spread operator for assigning the initialAdvancedSearchObject must be used due to an issue occurring with
    // only non-prod mode.
    const newAdvancedSearchObject: AdvancedSearchObject = { ...initialAdvancedSearchObject };
    let newFilters: Map<string, Set<string>> = new Map<string, Set<string>>();
    // URL is gospel, if it doesn't have a search term, then there's no search term
    if (!paramMap.has('search')) {
      this.searchService.setSearchText('');
    }
    paramMap.keys.forEach(key => {
      const value = paramMap.getAll(key);
      if (this.friendlyNames.get(key)) {
        value.forEach(categoryValue => {
          categoryValue = decodeURIComponent(categoryValue);
          newFilters = this.searchService.updateFiltersFromParameter(key, categoryValue, newFilters);
        });
      } else if (key === 'search') {
        this.searchTerm = true;
        this.searchService.setSearchText(value[0]);
      } else if (this.advancedSearchOptions.indexOf(key) > -1) {
        this.searchTerm = false;
        if (key.includes('Filter')) {
          newAdvancedSearchObject[key] = value[0];
        } else if (key === 'searchMode') {
          // If it's description, change to description. Otherwise, leave it as the 'files' default
          if (value[0] === 'description') {
            newAdvancedSearchObject.searchMode = 'description';
          }
        } else {
          console.error('Unexpected query parameter that does not match the known advanced search query parameters');
        }
        const currentAdvancedSearchObject = this.advancedSearchQuery.getValue().advancedSearch;
        if (JSON.stringify(currentAdvancedSearchObject) !== JSON.stringify(newAdvancedSearchObject)) {
          this.searchService.setAdvancedSearch(newAdvancedSearchObject);
        }
      }
    });

    this.filters = newFilters;
    this.searchService.setFilterKeys(this.filters);
    this.updateQuery();
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
    this.checkboxMap = new Map<string, Map<string, boolean>>();
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
    const advancedSearchObject: AdvancedSearchObject = this.advancedSearchQuery.getValue().advancedSearch;
    const values = this.searchQuery.getValue().searchText;
    const searchInfo = {
      filter: this.filters,
      searchValues: values,
      checkbox: this.checkboxMap,
      sortModeMap: this.sortModeMap,
      advancedSearchObject: advancedSearchObject
    };
    this.searchService.setSearchInfo(searchInfo);
  }

  // Updates the permalink to reflect changes to search
  updatePermalink() {
    const advancedSearchObject = this.advancedSearchQuery.getValue().advancedSearch;
    const values = this.searchQuery.getValue().searchText;
    const searchInfo = {
      filter: this.filters,
      searchValues: values,
      advancedSearchObject: advancedSearchObject,
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
    // Separating into 2 queries otherwise the queries interfere with each other (filter applied before aggregation)
    // The first query handles the aggregation and is used to update the sidebar buckets
    // The second query updates the result table
    const advancedSearchObject = this.advancedSearchQuery.getValue().advancedSearch;
    const values = this.advancedSearchQuery.getValue().searchText;
    const sideBarQuery = this.queryBuilderService.getSidebarQuery(
      this.query_size,
      values,
      advancedSearchObject,
      this.searchTerm,
      this.bucketStubs,
      this.filters,
      this.sortModeMap
    );
    const tableQuery = this.queryBuilderService.getResultQuery(
      this.query_size,
      values,
      advancedSearchObject,
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
        const filteredHits: [Array<Hit>, Array<Hit>] = this.searchService.filterEntry(this.hits, this.query_size);
        const searchText = this.searchQuery.getValue().searchText;
        this.searchService.setHits(filteredHits[0], filteredHits[1]);
        if (searchText.length > 0 && hits) {
          this.searchTerm = true;
        }
        if (this.searchTerm && this.hits.length === 0) {
          this.searchService.suggestSearchTerm(searchText);
        }
      })
      .catch(error => console.log(error));
  }

  /**===============================================
   *                Reset Functions
   * ==============================================
   */
  resetFilters() {
    this.searchService.reset();
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

  onKey(searchText: string) {
    /*TODO: FOR DEMO USE, make this better later...*/
    const pattern = searchText + '.*';
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
    this.searchTerm = true;
    if (!searchText || 0 === searchText.length) {
      this.searchTerm = false;
    }
    this.updatePermalink();
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
    this.updatePermalink();
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
