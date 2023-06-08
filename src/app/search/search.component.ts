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
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
  faCopy,
  faSortAlphaDown,
  faSortAlphaUp,
  faSortNumericDown,
  faSortNumericUp,
} from '@fortawesome/free-solid-svg-icons';
import { ExtendedGA4GHService } from 'app/shared/openapi';
import { SearchResponse } from 'elasticsearch';
import { forkJoin, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { AlertService } from '../shared/alert/state/alert.service';
import { AdvancedSearchObject, initialAdvancedSearchObject } from '../shared/models/AdvancedSearchObject';
import { CategorySort } from '../shared/models/CategorySort';
import { SubBucket } from '../shared/models/SubBucket';
import { AdvancedSearchQuery } from './advancedsearch/state/advanced-search.query';
import { QueryBuilderService } from './query-builder.service';
import { SearchQuery } from './state/search.query';
import { Hit, SearchService } from './state/search.service';
import { Dockstore } from 'app/shared/dockstore.model';

/**
 *
 * In general, the search works like this:
 * There's the "view" which is what the user clicks which includes facet checkboxes and tab (tools/workflows), etc
 * This causes some weird combination of the URL and/or Akita store and/or Angular global service to update
 * The URL change causes the URL to be parsed again which sets the state once more before triggering a new set of ES query
 *
 * Additional notes:
 * The URL is gospel so that that users with links will always work.
 * The only time the ES queries are performed is after the URL is parsed
 *
 * Some manual tests:
 * 1. Go to the home page and then click search and make sure there's 5 calls (2 tag cloud, 1 sidebar, 1 autocomplete, 1 table results)
 * 2. Switch to a different tab and there should be 2 calls (1 for sidebar, 1 for table results).
 * 3. Refresh page, should be 5 calls in total (same as 1.)
 *
 * TODO:
 * Test #1 from above currently fails because this.advancedSearchQuery.advancedSearch$ and this.searchQuery.searchText$ subscriptions
 * each triggers a parseParam which then causes the 2 more ES queries to get triggered
 * @export
 * @class SearchComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  Dockstore = Dockstore;
  faAngleDoubleDown = faAngleDoubleDown;
  faAngleDoubleUp = faAngleDoubleUp;
  faSortAlphaDown = faSortAlphaDown;
  faSortAlphaUp = faSortAlphaUp;
  faSortNumericDown = faSortNumericDown;
  faSortNumericUp = faSortNumericUp;
  faCopy = faCopy;
  private ngUnsubscribe: Subject<{}> = new Subject();
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  public advancedSearchObject$: Observable<AdvancedSearchObject>;
  public hasAdvancedSearchText$: Observable<boolean>;
  public shortUrl$: Observable<string>;
  public aNDSplitFilterText$: Observable<string>;
  public aNDNoSplitFilterText$: Observable<string>;
  public oRFilterText$: Observable<string>;
  public nOTFilterText$: Observable<string>;
  public selectedIndex$: Observable<number>;
  /** current set of search results
   * TODO: this stores all results, but the real implementation should limit results
   * and paginate to be scalable
   */
  /*TODO: Bad coding...change this up later (init)..*/
  private setFilter = false;
  public hits: Hit[];

  // extra +1 is used to see if there are > 200 results
  public readonly query_size = 201;
  searchTerm = false;
  public unsubmittedSearchText = '';

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
  private expandedPanels: Map<string, boolean>;
  private exclusiveFilters: Array<string>;
  public basicSearchText$: Observable<string>;
  private advancedSearchOptions = ['ANDSplitFilter', 'ANDNoSplitFilter', 'ORFilter', 'NOTFilter', 'searchMode'];
  public filterKeys$: Observable<Array<string>>;
  public suggestTerm$: Observable<string>;
  public values$: Observable<string>;

  // For search within facets
  public facetAutocompleteTerms$: Observable<Array<string>>;
  public hasFacetAutoCompleteTerms$: Observable<boolean>;
  public facetSearchTextMap: Map<string, string>;
  /**
   * This should be parameterised from src/app/shared/dockstore.model.ts
   * @param providerService
   */
  constructor(
    private queryBuilderService: QueryBuilderService,
    public searchService: SearchService,
    private searchQuery: SearchQuery,
    private advancedSearchQuery: AdvancedSearchQuery,
    private activatedRoute: ActivatedRoute,
    private extendedGA4GHService: ExtendedGA4GHService,
    private alertService: AlertService,
    private location: Location,
    private router: Router
  ) {
    this.shortUrl$ = this.searchQuery.shortUrl$;
    this.filterKeys$ = this.searchQuery.filterKeys$;
    this.suggestTerm$ = this.searchQuery.suggestTerm$;
    this.selectedIndex$ = this.searchQuery.savedTabIndex$;
    this.initializeMappings(0);
    this.clearFacetSearches();
  }

  private tabIndex: number | null = null;

  initializeMappings(newTabIndex: number) {
    if (newTabIndex !== this.tabIndex) {
      this.tabIndex = newTabIndex;
      this.bucketStubs = this.searchService.initializeCommonBucketStubs(newTabIndex);
      this.friendlyNames = this.searchService.initializeFriendlyNames(newTabIndex);
      this.entryOrder = this.searchService.initializeEntryOrder(newTabIndex);
      this.toolTips = this.searchService.initializeToolTips(newTabIndex);
      this.expandedPanels = this.searchService.initializeExpandedPanels(newTabIndex);
      this.exclusiveFilters = this.searchService.initializeExclusiveFilters(newTabIndex);
    }
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
    this.activatedRoute.queryParams.pipe(distinctUntilChanged(), takeUntil(this.ngUnsubscribe)).subscribe(() => this.parseParams());
    this.searchService.toSaveSearch$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((toSaveSearch) => {
      if (toSaveSearch) {
        this.saveSearchFilter();
        this.searchService.toSaveSearch$.next(false);
      }
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

    this.facetAutocompleteTerms$ = this.searchQuery.facetAutoCompleteTerms$;
    this.hasFacetAutoCompleteTerms$ = this.searchQuery.hasFacetAutoCompleteTerms$;
  }

  /**
   * Handle the popstate events generated by browser back/forward button presses.
   * If the destination page is also a search page, silently navigate to a nonexistent
   * url, then back to the destination page again, causing this component to
   * reinitialize, which terminates the previous search and loads the destination page
   * search, preventing the overlapping state changes that cause the self-DOS behavior.
   * See https://ucsc-cgl.atlassian.net/browse/SEAB-3792
   */
  @HostListener('window:popstate')
  handlePopstate() {
    const path = this.location.path();
    if (path.startsWith('/search')) {
      this.router
        .navigateByUrl('/NonexistentUrl', { skipLocationChange: true })
        .then(() => this.router.navigateByUrl(path, { replaceUrl: true }));
    }
  }

  /**
   * Only called when the tab is manually changed by the user
   */
  saveTabIndex(matTabChangeEvent: MatTabChangeEvent) {
    // This is to prevent an infinite loop.
    // Event is somehow triggered even though it's not the active tab
    if (matTabChangeEvent.tab.isActive) {
      this.searchService.saveCurrentTabAndClear(matTabChangeEvent.index);
    }
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
      this.unsubmittedSearchText = '';
    }
    if (paramMap.has('entryType')) {
      const value = paramMap.getAll('entryType');
      const tabIndex = SearchService.convertEntryTypeToTabIndex(value[0]);
      this.searchService.saveCurrentTab(tabIndex);
      this.initializeMappings(tabIndex);
    }
    paramMap.keys.forEach((key) => {
      const value = paramMap.getAll(key);
      if (this.friendlyNames.get(key)) {
        value.forEach((categoryValue) => {
          categoryValue = decodeURIComponent(categoryValue);
          newFilters = this.searchService.updateFiltersFromParameter(key, categoryValue, newFilters);
        });
      } else if (key === 'search') {
        this.searchTerm = true;
        this.searchService.setSearchText(value[0]);
        this.unsubmittedSearchText = value[0];
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

  handleChanged(searchText: string) {
    this.unsubmittedSearchText = searchText;
  }

  handleChangedDebounced(searchText: string) {
    this.doAutoComplete(searchText);
  }

  handleSubmitted(searchText: string) {
    this.doSearch(searchText);
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
    buckets.forEach((bucket) => {
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
        // skip the Entry Type bucket, which is only aggregated for filtering results between tabs
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
  setupAllBuckets(hits: SearchResponse<Hit>) {
    this.checkboxMap = new Map<string, Map<string, boolean>>();
    const aggregations = hits.aggregations;
    Object.entries(aggregations || {}).forEach(([key, value]) => {
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
      advancedSearchObject: advancedSearchObject,
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
      searchTerm: this.searchTerm,
      entryType: SearchService.convertTabIndexToEntryType(this.searchQuery.getValue().currentTabIndex),
    };
    const linkArray = this.searchService.createPermalinks(searchInfo);
    this.searchService.handleLink(linkArray, this.location.path());
  }

  /**===============================================
   *                Update Functions
   * ===============================================
   */
  // Called from one place which is only when the URL has parsed and query non-result state has been set
  updateQuery() {
    const tabIndex = this.searchQuery.getValue().currentTabIndex;
    const entryType = SearchService.convertTabIndexToEntryType(tabIndex);
    // Separating into 2 queries otherwise the queries interfere with each other (filter applied before aggregation)
    // The first query handles the aggregation and is used to update the sidebar buckets
    // The second query updates the result table
    const advancedSearchObject = this.advancedSearchQuery.getValue().advancedSearch;
    const values = this.advancedSearchQuery.getValue().searchText;
    const sideBarQuery = this.queryBuilderService.getSidebarAggregationQuery(
      values,
      advancedSearchObject,
      this.searchTerm,
      this.bucketStubs,
      this.filters,
      this.exclusiveFilters,
      this.sortModeMap,
      entryType
    );
    const tableQuery = this.queryBuilderService.getResultQuery(
      this.query_size,
      values,
      advancedSearchObject,
      this.searchTerm,
      this.filters,
      this.exclusiveFilters,
      entryType
    );
    this.resetEntryOrder();
    this.resetPageIndex();
    this.updateSideBar(sideBarQuery);
    this.updateResultsTable(tableQuery);
  }

  updateSideBar(value: string) {
    this.alertService.start('Updating side bar');
    this.extendedGA4GHService.toolsIndexSearch(value).subscribe(
      (hits: any) => {
        this.setupAllBuckets(hits);
        this.setupOrderBuckets();
        this.alertService.simpleSuccess();
      },
      (error: HttpErrorResponse) => {
        this.alertService.detailedError(error);
      }
    );
  }

  /**
   * Updates the results table by sending an elastic search query
   *
   * @param {string} value the elastic search query
   * @memberof SearchComponent
   */
  updateResultsTable(value: string) {
    this.alertService.start('Performing search request');
    this.extendedGA4GHService.toolsIndexSearch(value).subscribe(
      (hits: any) => {
        this.hits = hits.hits.hits;
        const filteredHits: [Array<Hit>, Array<Hit>, Array<Hit>] = this.searchService.filterEntry(this.hits, this.query_size);
        const searchText = this.searchQuery.getValue().searchText;
        this.searchService.setHits(filteredHits[0], filteredHits[1], filteredHits[2]);
        if (searchText.length > 0 && hits) {
          this.searchTerm = true;
        }
        if (this.searchTerm && this.hits.length === 0) {
          this.searchService.suggestSearchTerm(searchText);
        }
        this.alertService.simpleSuccess();
      },
      (error: HttpErrorResponse) => {
        this.alertService.detailedError(error);
      }
    );
  }

  /**
   * Updates the results table when there is no search term
   * We need to send one request per index
   * When each index returns its results, join the results into a single array and filter into table
   *
   * @param {string} toolsQuery the elastic search query for tools index
   * @param {string} workflowsQuery the elastic search query for workflows index
   * @memberof SearchComponent
   */
  updateResultsTableSeparately(toolsQuery: string, workflowsQuery: string) {
    const toolsObservable: Observable<any> = this.extendedGA4GHService.toolsIndexSearch(toolsQuery);
    const workflowsObservable: Observable<any> = this.extendedGA4GHService.toolsIndexSearch(workflowsQuery);
    forkJoin([toolsObservable, workflowsObservable]).subscribe((results: Array<any>) => {
      const toolHits = results[0].hits.hits;
      const workflowHits = results[1].hits.hits;
      this.hits = toolHits.concat(workflowHits);
      const filteredHits: [Array<Hit>, Array<Hit>, Array<Hit>] = this.searchService.filterEntry(this.hits, this.query_size);
      this.searchService.setHits(filteredHits[0], filteredHits[1], filteredHits[2]);
    });
  }

  /**===============================================
   *                Reset Functions
   * ==============================================
   */
  resetFilters() {
    this.searchService.reset();
    this.searchTerm = false;
    this.clearFacetSearches();
    this.unsubmittedSearchText = '';
  }

  resetEntryOrder() {
    this.entryOrder.clear();
    this.entryOrder = this.searchService.initializeEntryOrder(this.tabIndex);
    this.orderedBuckets.clear();
  }

  resetPageIndex() {
    this.searchService.setPageSizeAndIndex(this.searchQuery.getValue().pageSize, 0);
  }

  resetExpansionPanels() {
    this.clearExpandedPanelsState();
    this.expandedPanels = this.searchService.initializeExpandedPanels(this.tabIndex);
  }

  /**===============================================
   *                Event Functions
   * ==============================================
   */

  doAutoComplete(searchText: string) {
    const pattern = searchText + '.*';
    const body = {
      size: 0,
      aggs: {
        autocomplete: {
          terms: {
            field: 'description',
            size: 4,
            order: {
              _count: 'desc',
            },
            include: pattern,
          },
        },
      },
    };
    this.alertService.start('Performing search');
    this.extendedGA4GHService.toolsIndexSearch(JSON.stringify(body)).subscribe(
      (hits) => {
        this.searchService.setAutoCompleteTerms(hits);
        this.alertService.simpleSuccess();
      },
      (error: HttpErrorResponse) => {
        this.alertService.detailedError(error);
      }
    );
  }

  doSearch(searchText: string) {
    this.searchService.setSearchText(searchText);
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
    this.clearFacetSearches();
    this.searchService.setSearchText(this.unsubmittedSearchText);
    this.updatePermalink();
  }

  private clearFacetSearches() {
    this.facetSearchTextMap = new Map<string, string>([
      ['all_authors.name.keyword', ''],
      ['labels.value.keyword', ''],
      ['namespace', ''],
      ['organization', ''],
      ['categories.name.keyword', ''],
    ]);
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

  // Get autocomplete terms
  onFacetSearchKey(key) {
    const values = this.facetSearchTextMap.get(key).toLowerCase();
    const unfilteredItems = Array.from(this.orderedBuckets.get(key).Items.entries());
    const filteredItems = unfilteredItems.filter((item) => item[0].toLowerCase().includes(values)).map((item) => item[0]);
    this.searchService.setFacetAutocompleteTerms(filteredItems);
  }

  /**
   * Updates the state of the expansion panels on expand or collapse events
   * Saves state to local storage
   *
   * @param {string} key
   * @param {boolean} expanded
   * @memberof SearchComponent
   */
  updateExpandedPanels(key: string, expanded: boolean) {
    this.expandedPanels.set(key, expanded);
    this.clearExpandedPanelsState();
    this.saveExpandedPanelsState();
  }

  /**===============================================
   *                Helper Functions
   * ===============================================
   *
   */

  getBucketKeys(key: string) {
    return Array.from(this.orderedBuckets.get(key).SelectedItems.keys());
  }

  saveExpandedPanelsState() {
    localStorage.setItem(this.searchService.expandedPanelsStorageKey, JSON.stringify(Array.from(this.expandedPanels.entries())));
  }

  clearExpandedPanelsState() {
    localStorage.removeItem(this.searchService.expandedPanelsStorageKey);
  }
}
