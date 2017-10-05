import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router/';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { CategorySort } from '../shared/models/CategorySort';
import { SubBucket } from '../shared/models/SubBucket';
import { ProviderService } from '../shared/provider.service';
import { AdvancedSearchObject } from './../shared/models/AdvancedSearchObject';
import { AdvancedSearchService } from './advancedsearch/advanced-search.service';
import { ELASTIC_SEARCH_CLIENT } from './elastic-search-client';
import { QueryBuilderService } from './query-builder.service';
import { SearchService } from './search.service';

/** TODO: ExpressionChangedAfterItHasBeenCheckedError is indicator that something is wrong with the bindings,
 *  so you shouldn't just dismiss it, but try to figure out why it's happening...
 **/
// enableProdMode();
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  public advancedSearchObject: AdvancedSearchObject;
  private routeSub: Subscription;
  public permalink: string;
  /** current set of search results
   * TODO: this stores all results, but the real implementation should limit results
   * and paginate to be scalable
   */
  /* Observable */
  private toolSource = new BehaviorSubject<any>(null);
  private curURL = '';
  toolhit$ = this.toolSource.asObservable();
  _timeout = false;
  /*TODO: Bad coding...change this up later (init)..*/
  private setFilter = false;
  public toolHits: Object[] = [];
  public workflowHits: Object[] = [];
  public hits: Object[];
  private shard_size = 10000;
  public suggestTerm = '';
  private firstInit = true;
  location: Location;


  // Possibly 100 workflows and 100 tools (extra +1 is used to see if there are > 200 results)
  public query_size = 201;
  expandAll = true;
  searchTerm = false;

  autocompleteTerms: Array<string> = new Array<string>();
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
  public filters: Map<String, Set<string>> = new Map<String, Set<string>>();
  /**
   * Friendly names for fields -> fields in elastic search
   * @type {Map<string, V>}
   */
  private bucketStubs: Map<string, string>;
  public friendlyNames: Map<string, string>;
  private entryOrder: Map<string, SubBucket>;
  private friendlyValueNames: Map<string, Map<string, string>>;
  private nonverifiedcount: number;

  private advancedSearchOptions = [
    'ANDSplitFilter',
    'ANDNoSplitFilter',
    'ORFilter',
    'NOTFilter',
    'searchMode',
    'toAdvanceSearch'
  ];

  /**
   * The current text search
   * @type {string}
   */
  public values = '';
  /**
   * This should be parameterised from src/app/shared/dockstore.model.ts
   * @param providerService
   */
  constructor(private providerService: ProviderService, private queryBuilderService: QueryBuilderService,
    public searchService: SearchService,
    private advancedSearchService: AdvancedSearchService,
    private router: Router,
    private Location: Location) {
    this.location = Location;
  }

  getKeys(map: Map<any, any>): Array<string> {
    return Array.from(map.keys());
  }

  ngOnInit() {
    // Initialize mappings
    this.bucketStubs = this.searchService.initializeBucketStubs();
    this.friendlyNames = this.searchService.initializeFriendlyNames();
    this.entryOrder = this.searchService.initializeEntryOrder();
    this.friendlyValueNames = this.searchService.initializeFriendlyValueNames();
    this.searchService.toSaveSearch$.subscribe(toSaveSearch => {
      if (toSaveSearch) {
        this.saveSearchFilter();
        this.searchService.toSaveSearch$.next(false);
      }
    });
    this.searchService.values$.subscribe(values => {
      this.values = values;
      if (this.values) {
        this.tagClicked();
      }
    });
    this.hits = [];
    this.curURL = this.router.url;
    this.advancedSearchObject = {
      ANDSplitFilter: '',
      ANDNoSplitFilter: '',
      ORFilter: '',
      NOTFilter: '',
      searchMode: 'files',
      toAdvanceSearch: false
    };
    this.parseParams();
    this.updateQuery();

    this.advancedSearchService.advancedSearch$.subscribe((advancedSearch: AdvancedSearchObject) => {
      this.advancedSearchObject = advancedSearch;
      this.updateQuery();
    });
  }

  /**
  * Applies parameters from the permalink to the search
  */
  parseParams() {
    let useAdvSearch = false;
    const URIParams = this.searchService.createURIParams(this.curURL);
    if (!URIParams.paramsMap) {
      return;
    }
    URIParams.paramsMap.forEach(((value, key) => {
      if (this.friendlyNames.get(key)) {
        value.forEach(categoryValue => {
          categoryValue = decodeURIComponent(categoryValue);
          this.filters = this.searchService.handleFilters(key, categoryValue, this.filters);
        });
        this.firstInit = false;
      } else if (key === 'search') {
        this.searchTerm = true;
        this.advancedSearchObject.toAdvanceSearch = false;
        this.values = value[0];
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
    }));

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
      let doc_count = bucket.doc_count;
      if (key === 'tags.verified' && !bucket.key) {
        doc_count = this.nonverifiedcount;
      }
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

  tagClicked(): void {
    this.searchTerm = true;
    this.updateQuery();
  }

  /** This function takes care of the problem of non-verified items containing the set of verified items.
   * this function calls a third elastic query which will get the correct number count of the non-verified items
   * (without the set of verified items). So the non-verified bucket of the sidebar is getting the correct number.
   *
   * However, this might not be the best way to do it, a better way would be to merge this third query into the other two.
   *
   * **/
  setupNonVerifiedBucketCount() {
    const queryBodyNotVerified = this.queryBuilderService.getNonVerifiedQuery(this.query_size, this.values,
      this.advancedSearchObject, this.searchTerm, this.filters);
    ELASTIC_SEARCH_CLIENT.search({
      index: 'tools',
      type: 'entry',
      body: queryBodyNotVerified
    }).then(nonVerifiedHits => {
      this.nonverifiedcount = nonVerifiedHits.hits.total;
    });
  }

  setupOrderBuckets() {
    this.entryOrder.forEach(
      (value, key) => {
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
    Object.entries(aggregations).forEach(
      ([key, value]) => {
        if (value.buckets != null) {
          this.setupBuckets(this.searchService.aggregationNameToTerm(key), value.buckets);
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
      advancedSearchObject: this.advancedSearchObject,
      searchTerm: this.searchTerm
    };
    this.permalink = this.searchService.createPermalinks(searchInfo);
  }

  /**===============================================
   *                Update Functions
   * ===============================================
   */

  // Called when any change to the search is made to update the results
  updateQuery() {
    this.updatePermalink();
    // calculate number of filters
    let count = 0;
    this.filters.forEach(filter => {
      count += filter.size;
    });
    // Seperating into 2 queries otherwise the queries interfere with each other (filter applied before aggregation)
    // The first query handles the aggregation and is used to update the sidebar buckets
    // The second query updates the result table
    const sideBarQuery = this.queryBuilderService.getSidebarQuery(this.query_size, this.values, this.advancedSearchObject,
      this.searchTerm, this.bucketStubs, this.filters, this.sortModeMap);
    const tableQuery = this.queryBuilderService.getResultQuery(this.query_size, this.values, this.advancedSearchObject,
      this.searchTerm, this.filters);
    this.resetEntryOrder();
    this.setupNonVerifiedBucketCount();
    this.updateSideBar(sideBarQuery);
    this.updateResultsTable(tableQuery);
  }

  updateSideBar(value: string) {
    ELASTIC_SEARCH_CLIENT.search({
      index: 'tools',
      type: 'entry',
      body: value
    }).then(hits => {
      this.setupAllBuckets(hits);
      this.setupOrderBuckets();
    });
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
    }).then(hits => {
      this.hits = hits.hits.hits;
      this.workflowHits = [];
      this.toolHits = [];
      this.filterEntry();
      this.searchService.toolhit$.next(this.toolHits);
      this.searchService.workflowhit$.next(this.workflowHits);
      if (this.values.length > 0 && hits) {
        this.searchTerm = true;
      }
      if (this.searchTerm && this.hits.length === 0) {
        this.suggestKeyTerm();
      }
    });
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
    this.workflowHits = [];
    this.toolHits = [];
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
        'size': 0,
        'aggs': {
          'autocomplete': {
            'terms': {
              'field': 'description',
              'size': 4,
              'order': {
                '_count': 'desc'
              },
              'include': {
                'pattern': pattern
              }
            }
          }
        }
      }
    }).then(hits => {
      this.autocompleteTerms = [];
      hits.aggregations.autocomplete.buckets.forEach(
        term => {
          this.autocompleteTerms.push(term.key);
        }
      );
    });
    if (!this._timeout) {
      this.advancedSearchObject.toAdvanceSearch = false;
      this.searchTerm = true;
      this._timeout = true;
      console.log('asdf');
      window.setTimeout(() => {
        if ((!this.values || 0 === this.values.length)) {
          this.searchTerm = false;
        }
        this.updateQuery();
        this._timeout = false;
      }, 500);
    }
  }
  /*TODO: FOR DEMO USE, make this better later...*/
  suggestKeyTerm() {
    ELASTIC_SEARCH_CLIENT.search({
      index: 'tools',
      type: 'entry',
      body: {
        'suggest': {
          'do_you_mean': {
            'text': this.values,
            'term': {
              'field': 'description'
            }
          }
        }
      }
    }).then(hits => {
      if (hits['suggest']['do_you_mean'][0].options.length > 0) {
        this.suggestTerm = hits['suggest']['do_you_mean'][0].options[0].text;
      } else {
        this.suggestTerm = '';
      }
    });
  }

  searchSuggestTerm() {
    this.values = this.suggestTerm;
    this.updateQuery();
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
  /**
   * Handles the clicking of the "Open Advanced Search" button
   * This sets up and opens the advanced search modal
   * @memberof SearchComponent
   */
  openAdvancedSearch(): void {
    this.advancedSearchService.setShowModal(true);
  }
  clickExpand(key: string) {
    const isExpanded = this.fullyExpandMap.get(key);
    this.fullyExpandMap.set(key, !isExpanded);
  }

  switchExpandAll() {
    this.expandAll = !this.expandAll;
  }

  clickSortMode(category: string, sortMode: boolean) {
    let orderedMap2;
    if (this.sortModeMap.get(category).SortBy === sortMode) {
      let orderBy: boolean;
      if (this.sortModeMap.get(category).SortBy) { // Sort by Count
        orderBy = this.sortModeMap.get(category).CountOrderBy;
        this.sortModeMap.get(category).CountOrderBy = !orderBy;
      } else {
        orderBy = this.sortModeMap.get(category).AlphabetOrderBy;
        this.sortModeMap.get(category).AlphabetOrderBy = !orderBy;
      }
    }
    if (sortMode) {
      /* Reorder the bucket map by count */
      orderedMap2 = this.searchService.sortCategoryValue(this.orderedBuckets.get(category).Items, sortMode,
        this.sortModeMap.get(category).CountOrderBy);
    } else {
      /* Reorder the bucket map by alphabet */
      orderedMap2 = this.searchService.sortCategoryValue(this.orderedBuckets.get(category).Items, sortMode,
        this.sortModeMap.get(category).AlphabetOrderBy);
    }
    this.orderedBuckets.get(category).Items = orderedMap2;
    this.sortModeMap.get(category).SortBy = sortMode;
  }
  /**===============================================
   *                Helper Functions
   * ===============================================
   *
   */

  filterEntry() {
    this.workflowHits = [];
    this.toolHits = [];
    let counter = 0;
    for (const hit of this.hits) {
      /**TODO: this is not good, make it faster.../
       */
      // Do not add 201st result if it exists
      if (!(counter === this.hits.length - 1 && this.hits.length === this.query_size)) {
        hit['_source'] = this.providerService.setUpProvider(hit['_source']);
        if (hit['_type'] === 'tool') {
          this.toolHits.push(hit);
        } else if (hit['_type'] === 'workflow') {
          this.workflowHits.push(hit);
        }
      }

      counter++;
    }
  }
}
