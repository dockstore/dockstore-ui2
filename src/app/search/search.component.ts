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
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { applyTransaction, logAction } from '@datorama/akita';
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
  faShareAlt,
  faSortAlphaDown,
  faSortAlphaUp,
  faSortNumericDown,
  faSortNumericUp,
} from '@fortawesome/free-solid-svg-icons';
import { ExtendedGA4GHService } from 'app/shared/openapi';
import { SearchResponse } from 'elasticsearch';
import { forkJoin, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { AlertService } from '../shared/alert/state/alert.service';
import { formInputDebounceTime } from '../shared/constants';
import { AdvancedSearchObject, initialAdvancedSearchObject } from '../shared/models/AdvancedSearchObject';
import { CategorySort } from '../shared/models/CategorySort';
import { SubBucket } from '../shared/models/SubBucket';
import { AdvancedSearchQuery } from './advancedsearch/state/advanced-search.query';
import { QueryBuilderService } from './query-builder.service';
import { SearchQuery } from './state/search.query';
import { BucketMaps, Hit, SearchService } from './state/search.service';

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
  faShareAlt = faShareAlt;
  faAngleDoubleDown = faAngleDoubleDown;
  faAngleDoubleUp = faAngleDoubleUp;
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
  public selectedIndex$: Observable<number>;
  public showOverLimit: boolean = false;

  /*TODO: Bad coding...change this up later (init)..*/
  private setFilter = false;
  /** current set of search results
   * TODO: this stores all results, but the real implementation should limit results
   * and paginate to be scalable
   */
  public hits: Hit[];

  // extra +1 is used to see if there are > 200 results
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
  public filters$: Observable<Map<string, Set<string>>>;
  public hasFilters$: Observable<boolean>;
  /**
   * Friendly names for fields -> fields in elastic search
   * @type {Map<string, V>}
   */
  private bucketStubs: Map<string, string>;
  public friendlyNames: Map<string, string> = this.searchService.friendlyNames;
  public toolTips: Map<string, string> = this.searchService.tooltips;
  private entryOrder: Map<string, SubBucket>;
  public basicSearchText$: Observable<string>;
  private advancedSearchOptions = ['ANDSplitFilter', 'ANDNoSplitFilter', 'ORFilter', 'NOTFilter', 'searchMode'];
  public filterKeys$: Observable<Array<string>>;
  public suggestTerm$: Observable<string>;
  public values$: Observable<string>;

  // For search within facets
  public facetAutocompleteTerms$: Observable<Array<string>>;
  public hasFacetAutoCompleteTerms$: Observable<boolean>;
  public facetSearchText = '';
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
    private alertService: AlertService
  ) {
    this.shortUrl$ = this.searchQuery.shortUrl$;
    this.filterKeys$ = this.searchQuery.filterKeys$;
    this.suggestTerm$ = this.searchQuery.suggestTerm$;
    this.selectedIndex$ = this.searchQuery.savedTabIndex$;
    // Initialize mappings
    this.bucketStubs = this.searchService.initializeCommonBucketStubs();
    this.entryOrder = this.searchService.initializeEntryOrder();
  }

  getKeys(bucketMap: Map<any, any>): Array<string> {
    return Array.from(bucketMap.keys());
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.hasFilters$ = this.searchQuery.hasFilters$;
    this.filters$ = this.searchQuery.filters$;
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
    this.searchQuery.searchText$
      .pipe(debounceTime(formInputDebounceTime), distinctUntilChanged(), takeUntil(this.ngUnsubscribe))
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

    this.facetAutocompleteTerms$ = this.searchQuery.facetAutoCompleteTerms$;
    this.hasFacetAutoCompleteTerms$ = this.searchQuery.hasFacetAutoCompleteTerms$;
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
    }
    paramMap.keys.forEach((key) => {
      const value = paramMap.getAll(key);
      if (this.friendlyNames.get(key)) {
        value.forEach((categoryValue) => {
          categoryValue = decodeURIComponent(categoryValue);
          newFilters = this.searchService.updateFiltersFromParameter(key, categoryValue, newFilters);
        });
      } else if (key === 'entryType') {
        this.searchService.saveCurrentTab(SearchService.convertEntryTypeToTabIndex(value[0]));
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

    this.searchService.setFilters(newFilters);
    this.updateQuery();
  }

  /**===============================================
   *                SetUp Functions
   * ==============================================*/

  /**
   * Fully updates the bucket, fullyExpandMap, and checkboxMap data structures
   * based on the hits to update the search view
   * @param {*} hits The response hits from elastic search
   * @memberof SearchComponent
   */
  setupAllBuckets(hits: SearchResponse<Hit>) {
    this.checkboxMap = new Map<string, Map<string, boolean>>();
    const aggregations = hits.aggregations;
    const bucketMaps: BucketMaps = {
      fullyExpandMap: new Map(this.fullyExpandMap),
      sortModeMap: new Map(this.sortModeMap),
      checkboxMap: new Map(this.checkboxMap),
      filters: new Map(this.searchQuery.getValue().filters),
      entryOrder: new Map(this.entryOrder),
    };
    Object.entries(aggregations).forEach(([key, value]) => {
      if (value['buckets'] != null) {
        this.searchService.setupBuckets(this.searchService.aggregationNameToTerm(key), value['buckets'], bucketMaps, this.setFilter);
      }
      // look for second level buckets (with filtering)
      // If there are second level buckets,
      // the buckets will always be under a property with the same name as the root property
      if (value[key]) {
        this.searchService.setupBuckets(key, value[key].buckets, bucketMaps, this.setFilter);
      }
    });
    this.fullyExpandMap = bucketMaps.fullyExpandMap;
    this.sortModeMap = bucketMaps.sortModeMap;
    this.checkboxMap = bucketMaps.checkboxMap;
    this.entryOrder = bucketMaps.entryOrder;
    this.setFilter = true;
  }

  // Saves the current search filter and passes to search service for sharing with advanced search
  saveSearchFilter() {
    const advancedSearchObject: AdvancedSearchObject = this.advancedSearchQuery.getValue().advancedSearch;
    const values = this.searchQuery.getValue().searchText;
    const searchInfo = {
      filter: this.searchQuery.getFilters(),
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
      filter: this.searchQuery.getFilters(),
      searchValues: values,
      advancedSearchObject: advancedSearchObject,
      searchTerm: this.searchTerm,
      entryType: SearchService.convertTabIndexToEntryType(this.searchQuery.getValue().currentTabIndex),
    };
    const linkArray = this.searchService.createPermalinks(searchInfo);
    this.searchService.handleLink(linkArray);
  }

  /**===============================================
   *                Update Functions
   * ===============================================
   */

  // Called from one place which is only when the URL has parsed and query non-result state has been set
  updateQuery() {
    const tabIndex = SearchService.convertTabIndexToEntryType(this.searchQuery.getValue().currentTabIndex);
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
      this.searchQuery.getFilters(),
      this.sortModeMap,
      tabIndex
    );
    const tableQuery = this.queryBuilderService.getResultQuery(
      this.query_size,
      values,
      advancedSearchObject,
      this.searchTerm,
      this.searchQuery.getFilters(),
      tabIndex
    );
    this.sendQueries(sideBarQuery, tableQuery);
  }

  sendQueries(sidebarQuery: string, tableQuery: string) {
    const query1 = this.extendedGA4GHService.toolsIndexSearch(sidebarQuery);
    const query2 = this.extendedGA4GHService.toolsIndexSearch(tableQuery);
    const shortMessage = 'Performing search query';
    this.alertService.start(shortMessage);
    // This is a way of disabling the sidebar to prevent the user from rapidly selecting incompatible buckets
    this.orderedBuckets = new Map();
    forkJoin([query1, query2]).subscribe(
      ([sidebarHits, tableHits]: [any, any]) => {
        applyTransaction(() => {
          logAction('updateQuery2');
          this.alertService.simpleSuccess();
          this.resetEntryOrder();
          this.resetPageIndex();

          this.updateSideBar(sidebarHits);
          this.updateResultsTable(tableHits);
        });
      },
      (error: HttpErrorResponse) => {
        // TODO: Set state when there's an error
        this.alertService.detailedError(error, shortMessage);
      }
    );
  }

  updateSideBar(sidebarHits: any) {
    this.setupAllBuckets(sidebarHits);
    this.orderedBuckets = this.searchService.setupOrderBuckets(this.checkboxMap, this.orderedBuckets, this.entryOrder);
    this.showOverLimit =
      sidebarHits?.length > this.query_size - 1 &&
      this.searchService.hasNarrowedSearch(
        this.advancedSearchQuery.getValue().advancedSearch,
        this.searchTerm,
        sidebarHits,
        this.searchQuery.getFilters()
      );
  }

  /**
   * Updates the results table by sending an elastic search query
   *
   * @param {string} value the elastic search query
   * @memberof SearchComponent
   */
  updateResultsTable(hits: any) {
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
  }

  /**===============================================
   *                Reset Functions
   * ==============================================
   */
  resetFilters() {
    this.searchService.reset();
    this.facetSearchText = '';
  }

  resetEntryOrder() {
    this.entryOrder.clear();
    this.entryOrder = this.searchService.initializeEntryOrder();
    this.orderedBuckets.clear();
  }

  resetPageIndex() {
    this.searchService.setPageSizeAndIndex(this.searchQuery.getValue().pageSize, 0);
  }

  /**===============================================
   *                Event Functions
   * ==============================================
   */

  onKey(searchText: string) {
    /*TODO: FOR DEMO USE, make this better later...*/
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
    this.searchTerm = true;
    if (!searchText || 0 === searchText.length) {
      this.searchTerm = false;
    }
    this.updatePermalink();
  }

  searchSuggestTerm() {
    this.searchService.searchSuggestTerm();
  }
}
