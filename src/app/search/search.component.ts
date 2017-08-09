import { AdvancedSearchObject } from './../shared/models/AdvancedSearchObject';
import { AdvancedSearchService } from './advancedsearch/advanced-search.service';
import { SearchService } from './search.service';
import bodybuilder from 'bodybuilder';
import { Client } from 'elasticsearch';
import { Component, OnInit, ViewChild, enableProdMode, ElementRef } from '@angular/core';
import { ProviderService } from '../shared/provider.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Dockstore } from '../shared/dockstore.model';
import { CloudData, CloudOptions } from 'angular-tag-cloud-module';
import { CategorySort } from '../shared/models/CategorySort';
import { SubBucket } from '../shared/models/SubBucket';

/** TODO: ExpressionChangedAfterItHasBeenCheckedError is indicator that something is wrong with the bindings,
 *  so you shouldn't just dismiss it, but try to figure out why it's happening...
 **/
enableProdMode();

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  private advancedSearchObject: AdvancedSearchObject;

  /** current set of search results
   * TODO: this stores all results, but the real implementation should limit results
   * and paginate to be scalable
   */
  @ViewChild('box') searchTermBox: ElementRef;
  /* Observable */
  private toolSource = new BehaviorSubject<any>(null);
  toolhit$ = this.toolSource.asObservable();

  /* Observable */
  private workflowSource = new BehaviorSubject<any>(null);
  workflowhit$ = this.workflowSource.asObservable();

  /*TODO: Bad coding...change this up later (init)..*/
  private setFilter = false;
  public browseToolsTab = 'browseToolsTab';
  public browseWorkflowsTab = 'browseWorkflowsTab';
  private toolHits: Object[];
  private workflowHits: Object[];
  private hits: Object[];
  private _client: Client;
  private shard_size = 10000;
  private activeToolBar = true;

  // Possibly 100 workflows and 100 tools
  private query_size = 200;
  expandAll = true;
  showToolTagCloud = true;
  showWorkflowTagCloud = true;
  searchTerm = false;
  options: CloudOptions = {
    width: 600,
    height: 200,
    overflow: false,
  };
  data: Array<CloudData> = [
    { text: 'Docker', weight: 10, color: '#ffaaee' },
    { text: 'PCAWG', weight: 9 },
    { text: 'Tool', weight: 8 },
    { text: 'Weight-7-link', weight: 7, link: 'https://google.com' },
    { text: 'Weight-6-link', weight: 5, link: 'https://google.com' },
    { text: 'cancer', weight: 5, },
    { text: 'Weight-4-link', weight: 4, link: 'https://google.com' },
    { text: 'Weight-3-link', weight: 3, link: 'https://google.com' },
    { text: 'Weight-2-link', weight: 2, link: 'https://google.com' },
    { text: 'Weight-1-link', weight: 1, link: 'https://google.com' },
  ];

  data2: Array<CloudData> = [
    { text: 'Weight-10-link', weight: 10, link: 'https://google.com' },
    { text: 'Weight-9-link', weight: 9, link: 'https://google.com' },
    { text: 'Weight-8-link', weight: 8, link: 'https://google.com' },
    { text: 'Weight-7-link', weight: 7, link: 'https://google.com' },
    { text: 'Weight-6-link', weight: 5, link: 'https://google.com' },
    { text: 'Weight-5-link', weight: 5, link: 'https://google.com' },
    { text: 'Weight-4-link', weight: 4, link: 'https://google.com' },
    { text: 'Weight-3-link', weight: 3, link: 'https://google.com' },
    { text: 'Weight-2-link', weight: 2, link: 'https://google.com' },
    { text: 'Weight-1-link', weight: 1, link: 'https://google.com' },
  ];
  /** a map from a field (like _type or author) in elastic search to specific values for that field (tool, workflow) and how many
   results exist in that field after narrowing down based on search */
  /** TODO: Note that the key (the name) might not be unique...*/
  private orderedBuckets: Map<string, SubBucket> = new Map<string, SubBucket>();
  // Shows which of the categories (registry, author, etc) are expanded to show all available buckets
  private fullyExpandMap: Map<string, boolean> = new Map<string, boolean>();

  // Shows the sorting mode for the categories
  // true: sort by count (default); false: sort by alphabet
  private sortModeMap: Map<string, CategorySort> = new Map<string, CategorySort>();

  // Shows which of the buckets are current selected
  private checkboxMap: Map<string, Map<string, boolean>> = new Map<string, Map<string, boolean>>();
  /**
   * this stores the set of active (non-text search) filters
   * Maps from filter -> values that have been chosen to filter by
   * @type {Map<String, Set<string>>}
   */
  private filters: Map<String, Set<string>> = new Map<String, Set<string>>();
  /**
   * Friendly names for fields -> fields in elastic search
   * @type {Map<string, V>}
   */
  private bucketStubs = new Map([
    ['Entry Type', '_type'],
    ['Registry', 'registry'], /*WRONG*/
    ['Private Access', 'private_access'],
    ['Verified', 'tags.verified'],
    ['Author', 'author'],
    ['Organization', 'namespace'],
    ['Labels', 'labels.value.keyword'],
    ['Verified Source', 'tags.verifiedSource'],
  ]);
  private friendlyNames = new Map([
    ['_type', 'Entry Type'],
    ['registry', 'Registry'],
    ['private_access', 'Private Access'],
    ['tags.verified', 'Verified'],
    ['author', 'Author'],
    ['namespace', 'Organization'],
    ['labels.value.keyword', 'Labels'],
    ['tags.verifiedSource', 'Verified Source'],
  ]);
  private entryOrder = new Map([
    ['_type', new SubBucket],
    ['author', new SubBucket],
    ['registry', new SubBucket],
    ['namespace', new SubBucket],
    ['labels.value.keyword', new SubBucket],
    ['private_access', new SubBucket],
    ['tags.verified', new SubBucket],
    ['tags.verifiedSource', new SubBucket]
  ]);
  private friendlyValueNames = new Map([
    ['tags.verified', new Map([
      ['1', 'verified'], ['0', 'non-verified']
    ])],
    ['private_access', new Map([
      ['1', 'private'], ['0', 'public']
    ])],
    ['registry', new Map([
      ['QUAY_IO', 'Quay.io'], ['DOCKER_HUB', 'Docker Hub'], ['GITLAB', 'GitLab'], ['AMAZON_ECR', 'Amazon ECR']
    ])]
  ]);
  private nonverifiedcount: number;

  /**
   * The current text search
   * @type {string}
   */
  private values = '';
  /**
   * This should be parameterised from src/app/shared/dockstore.model.ts
   * @param providerService
   */
  constructor(private providerService: ProviderService,
              private searchService: SearchService,
              private advancedSearchService: AdvancedSearchService) {
    this._client = new Client({
      host: Dockstore.API_URI + '/api/ga4gh/v1/extended',
      apiVersion: '5.x',
      log: 'debug'
    });
  }
  ngOnInit() {
    this.searchService.searchInfo$.subscribe(
      searchInfo => {
        if (searchInfo) {
          if (searchInfo.filter) {
            this.filters = searchInfo.filter;
          }
          if (searchInfo.searchValues) {
            this.values = searchInfo.searchValues;
            this.searchTermBox.nativeElement.value = searchInfo.searchValues;
          }
          if (searchInfo.checkbox) {
            this.checkboxMap = searchInfo.checkbox;
          }
          if (searchInfo.sortModeMap) {
            this.sortModeMap = searchInfo.sortModeMap;
          }
          if (searchInfo.advancedSearchObject) {
            this.advancedSearchObject = searchInfo.advancedSearchObject;
          }
        }
        this.updateQuery();
      });
    this.advancedSearchService.advancedSearch$.subscribe((advancedSearch: AdvancedSearchObject) => {
      this.advancedSearchObject = advancedSearch;
      this.updateQuery();
    });
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
      if (this.checkboxMap.get(key)) {
        if (doc_count > 0) {
          if (!this.checkboxMap.get(key).get(bucket.key)) {
            this.checkboxMap.get(key).set(bucket.key, false);
            this.entryOrder.get(key).Items.set(bucket.key, doc_count);
          } else if (this.checkboxMap.get(key).get(bucket.key)) {
            this.entryOrder.get(key).SelectedItems.set(bucket.key, doc_count);
          }
        }
      } else {
        this.checkboxMap.set(key, new Map<string, boolean>());
      }
    });
  }

  /** This function takes care of the problem of non-verified items containing the set of verified items.
   * this function calls a third elastic query which will get the correct number count of the non-verified items
   * (without the set of verified items). So the non-verified bucket of the sidebar is getting the correct number.
   *
   * However, this might not be the best way to do it, a better way would be to merge this third query into the other two.
   *
   * **/
  setupNonVerifiedBucketCount() {
    let bodyNotVerified = bodybuilder().size(this.query_size);
    bodyNotVerified = this.appendQuery(bodyNotVerified);
    const key = 'tags.verified';
    bodyNotVerified =  bodyNotVerified.filter('term', key, false).notFilter('term', key, true);
    bodyNotVerified = this.appendFilter(bodyNotVerified, null);
    const builtBodyNotVerified = bodyNotVerified.build();
    const queryBodyNotVerified = JSON.stringify(builtBodyNotVerified);
    this._client.search({
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

  /**===============================================
   *                Update Functions
   * ==============================================e
   */
  updateQuery() {
    // calculate number of filters
    let count = 0;
    this.filters.forEach(filter => {
      count += filter.size;
    });
    let body = bodybuilder()
      .size(this.query_size);
    // Seperating into 2 queries otherwise the queries interfere with each other (filter applied before aggregation)
    // The first query handles the aggregation and is used to update the sidebar buckets
    // The second query updates the result table
    body = this.appendQuery(body);
    body = this.appendAggregations(count, body);
    let body2 = bodybuilder().size(this.query_size);
    body2 = this.appendQuery(body2);
    body2 = this.appendFilter(body2, null);
    this.resetEntryOrder();
    const builtBody = body.build();
    const builtBody2 = body2.build();
    const query = JSON.stringify(builtBody);
    const query2 = JSON.stringify(builtBody2);
    this.setupNonVerifiedBucketCount();
    this.updateSideBar(query);
    this.updateResultsTable(query2);
    console.log(query2);
  }

  updateSideBar(value: string) {
    this._client.search({
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
    this._client.search({
      index: 'tools',
      type: 'entry',
      body: value
    }).then(hits => {
      this.hits = hits.hits.hits;
      this.workflowHits = [];
      this.toolHits = [];
      this.filterEntry();
      this.toolSource.next(this.toolHits);
      this.workflowSource.next(this.workflowHits);
      if (this.values.length > 0 && hits) {
        this.searchTerm = true;
      }
      this.setTabActive();
    });
  }

  /**===============================================
   *                Reset Functions
   * ==============================================
   */
  resetFilters() {
    this.filters.clear();
    this.values = '';
    this.checkboxMap.clear();
    this.sortModeMap.clear();
    this.setFilter = false;
    this.searchTerm = false;
    this.searchTermBox.nativeElement.value = '';
    this.hits = [];
    this.workflowHits = [];
    this.toolHits = [];
    this.searchService.setSearchInfo(null);
    this.resetEntryOrder();
    this.advancedSearchService.clear();
  }

  resetEntryOrder() {
    this.entryOrder.clear();
    this.entryOrder = new Map([
      ['_type', new SubBucket],
      ['author', new SubBucket],
      ['registry', new SubBucket],
      ['namespace', new SubBucket],
      ['labels.value.keyword', new SubBucket],
      ['private_access', new SubBucket],
      ['tags.verified', new SubBucket],
      ['tags.verifiedSource', new SubBucket]
    ]);
    this.orderedBuckets.clear();
  }
  /**===============================================
   *                Append Functions
   * ==============================================
   */
  /**
   * Append filters to a body builder object in order to add filter functionality to the overall elastic search query
   * This is used to add to query object as well as each individual aggregation
   * @param {*} body
   * @returns the new body builder object with filter applied
   * @memberof SearchComponent
   */
  appendFilter(body: any, aggKey: string): any {
    this.filters.forEach((value: Set<string>, key: string) => {
      value.forEach(insideFilter => {
        if (aggKey === key && !this.searchService.exclusiveFilters.includes(key)) {
          // Return some garbage filter because we've decided to append a filter, there's no turning back
          // return body;  // <--- this does not work
          body = body.notFilter('term', 'some garbage term that hopefully never gets matched', insideFilter);
        } else {
          if (value.size > 1) {
            body = body.orFilter('term', key, insideFilter);
          } else {
            if (key === 'tags.verified' && !insideFilter) {
              body =  body.notFilter('term', key, !insideFilter);
            } else {
              body = body.filter('term', key, insideFilter);
            }
          }
        }
      });
    });
    return body;
  }

  /**
   * Append the query to a body builder object in order to add query functionality to the overall elastic search query
   *
   * @param {*} body the body build object
   * @returns {*} the new body builder object
   * @memberof SearchComponent
   */
  appendQuery(body: any): any {
    if (this.values.toString().length > 0) {
      if (this.advancedSearchObject) {
        this.advancedSearchObject.ORFilter = this.values;
        this.advancedSearchFiles(body);
      }
    } else {
      body = body.query('match_all', {});
    }
    if (this.advancedSearchObject) {
      if (this.advancedSearchObject.toAdvanceSearch) {
        if (this.advancedSearchObject.searchMode === 'description') {
          this.advancedSearchDescription(body);
        } else if (this.advancedSearchObject.searchMode === 'files') {
          this.advancedSearchFiles(body);
        }
      }
    }
    return body;
  }
  advancedSearchDescription(body: any) {
    if (this.advancedSearchObject.ANDSplitFilter) {
      const filters = this.advancedSearchObject.ANDSplitFilter.split(' ');
      filters.forEach(filter => body = body.filter('match', 'description', filter));
    }
    if (this.advancedSearchObject.ANDNoSplitFilter) {
      body = body.query('match_phrase', 'description', this.advancedSearchObject.ANDNoSplitFilter);
    }
    if (this.advancedSearchObject.ORFilter) {
      const filters = this.advancedSearchObject.ORFilter.split(' ');
      filters.forEach(filter => body = body.orFilter('match', 'description', filter));
    }
    if (this.advancedSearchObject.NOTFilter) {
      const filters = this.advancedSearchObject.NOTFilter.split(' ');
      filters.forEach(filter => body = body.notQuery('match', 'description', filter));
    }
  }

  advancedSearchFiles(body: any) {
    if (this.advancedSearchObject.ANDSplitFilter) {
      const filters = this.advancedSearchObject.ANDSplitFilter.split(' ');
      let insideFilter_tool = bodybuilder();
      filters.forEach(filter => {
        insideFilter_tool = insideFilter_tool.filter('term', 'tags.sourceFiles.content', filter);
      });
      let insideFilter_workflow = bodybuilder();
      filters.forEach(filter => {
        insideFilter_workflow = insideFilter_workflow.filter('term', 'workflowVersions.sourceFiles.content', filter);
      });
      body = body.filter('bool', filter => filter
        .orFilter('bool', toolfilter => toolfilter = insideFilter_tool)
        .orFilter('bool', workflowfilter => workflowfilter = insideFilter_workflow));
    }
    if (this.advancedSearchObject.ANDNoSplitFilter) {
      body = body.filter('bool', filter => filter
        .orFilter('bool', toolfilter => toolfilter
          .filter('match_phrase', 'tags.sourceFiles.content', this.advancedSearchObject.ANDNoSplitFilter))
        .orFilter('bool', workflowfilter => workflowfilter
          .filter('match_phrase', 'workflowVersions.sourceFiles.content', this.advancedSearchObject.ANDNoSplitFilter)));
    }
    if (this.advancedSearchObject.ORFilter) {
      const filters = this.advancedSearchObject.ORFilter.split(' ');
      filters.forEach(filter => {
        body = body.orFilter('match', 'tags.sourceFiles.content', filter);
        body = body.orFilter('match', 'workflowVersions.sourceFiles.content', filter);
      });
    }
    if (this.advancedSearchObject.NOTFilter) {
      const filters = this.advancedSearchObject.NOTFilter.split(' ');
      body = body.notQuery('terms', 'tags.sourceFiles.content', filters)
        .notQuery('terms', 'workflowVersions.sourceFiles.content', filters);
    }
  }

  appendORFilter(body: any) {
    const filters = this.advancedSearchObject.ORFilter.split(' ');
    filters.forEach(filter => body = body.filter('term', 'description', filter));
    return body;
  }

  /**
   * Append aggregations to a body builder object in order to add aggregation functionality to the overall elastic search query
   *
   * @param {number} count number of filters
   * @param {*} body the body builder object
   * @returns {*} the new body builder object
   * @memberof SearchComponent
   */
  appendAggregations(count: number, body: any): any {
    // go through buckets
    this.bucketStubs.forEach(key => {
      const order = this.parseOrderBy(key);
      if (count > 0) {
        body = body.agg('filter', key, key, (a) => {
          return this.appendFilter(a, key).aggregation('terms', key, key, { size: this.shard_size, order});
        });
      } else {
        body = body.agg('terms', key, key, { size: this.shard_size, order});
      }
    });
    return body;
  }

  /**===============================================
   *                Event Functions
   * ==============================================
   */
  onKey(value: string) {
    /* TODO: might need to check for safety injection */
    this.values = value;
    this.searchTerm = true;
    if ((!value || 0 === value.length)) {
      this.searchTerm = false;
    }
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
      this.handleFilters(category, categoryValue);
    }
    this.updateQuery();
  }
  /**
   * Handles the clicking of the "Open Advanced Search" button
   * This sets up and opens the advanced search modal
   * @memberof SearchComponent
   */
  openAdvancedSearch(): void {
    if (this.values) {
      const newAdvancedSearchObject = this.advancedSearchObject;
      newAdvancedSearchObject.ORFilter = this.values;
      this.advancedSearchService.setAdvancedSearch(newAdvancedSearchObject);
    }
    this.advancedSearchService.setShowModal(true);
  }
  clickExpand(key: string) {
    const isExpanded = this.fullyExpandMap.get(key);
    this.fullyExpandMap.set(key, !isExpanded);
  }
  logClicked(clicked: CloudData) {
    this.searchTerm = true;
    this.values = clicked.text;
    this.searchTermBox.nativeElement.value = '';
    this.onClick(null, null);
  }
  switchExpandAll() {
    this.expandAll = !this.expandAll;
  }
  clickTagCloudBtn(type: string) {
    if (type === 'tool') {
      this.showToolTagCloud = !this.showToolTagCloud;
    } else {
      this.showWorkflowTagCloud = !this.showWorkflowTagCloud;
    }
  }
  clickSortMode(category: string, sortMode: boolean) {
    let orderedMap2;
    if (this.sortModeMap.get(category).SortBy === sortMode) {
      let orderBy: boolean;
      if (this.sortModeMap.get(category).SortBy) { // Sort by Count
        orderBy = this.sortModeMap.get(category).CountOrderBy;
        this.sortModeMap.get(category).CountOrderBy = !orderBy;
      } else  {
        orderBy = this.sortModeMap.get(category).AlphabetOrderBy;
        this.sortModeMap.get(category).AlphabetOrderBy = !orderBy;
      }
    }
    if (sortMode) {
      /* Reorder the bucket map by count */
      orderedMap2 = this.sortCategoryValue(this.orderedBuckets.get(category).Items, sortMode,
                                           this.sortModeMap.get(category).CountOrderBy);
    } else {
      /* Reorder the bucket map by alphabet */
      orderedMap2 = this.sortCategoryValue(this.orderedBuckets.get(category).Items, sortMode,
                                           this.sortModeMap.get(category).AlphabetOrderBy);
    }
    this.orderedBuckets.get(category).Items = orderedMap2;
    this.sortModeMap.get(category).SortBy = sortMode;
  }
  /**===============================================
   *                Helper Functions
   * ==============================================
   */
  mapFriendlyValueNames(key, subBucket) {
    if (this.friendlyValueNames.has(key)) {
      return this.friendlyValueNames.get(key).get(subBucket.toString());
    } else {
      return subBucket;
    }
  }
  filterEntry() {
    this.workflowHits = [];
    this.toolHits = [];
    for (const hit of this.hits) {
      /**TODO: this is not good, make it faster.../
       */
      hit['_source'] = this.providerService.setUpProvider(hit['_source']);
      if (hit['_type'] === 'tool') {
        this.toolHits.push(hit);
      } else if (hit['_type'] === 'workflow') {
        this.workflowHits.push(hit);
      }
    }
  }
  parseOrderBy(key): any {
    let order: any;
    if (this.sortModeMap.has(key)) {
      switch (this.sortModeMap.get(key).SortBy) {
        case true: {
          order = {
            _count: this.sortModeMap.get(key).CountOrderBy ? 'asc' : 'desc'
          };
          break;
        }
        case false: {
          order = {
            _term: this.sortModeMap.get(key).AlphabetOrderBy ? 'asc' : 'desc'
          };
          break;
        }
        default: {
          order = {
            _count: 'desc'
          };
          break;
        }
      }
    } else {
      order = {
        _count: 'desc'
      };
    }
    return order;
  }
  /**
   * This handles selection of one filter, either taking it out from the list of active filters
   * or adding it if not present
   * @param category
   * @param categoryValue
   */
  handleFilters(category: string, categoryValue: string) {
    if (this.filters.has(category) && this.filters.get(category).has(categoryValue)) {
      this.filters.get(category).delete(categoryValue);
      // wipe out the category if empty
      if (this.filters.get(category).size === 0) {
        this.filters.delete(category);
      }
    } else {
      if (!this.filters.has(category)) {
        this.filters.set(category, new Set<string>());
      }
      this.filters.get(category).add(categoryValue);
    }
  }
  sortByAlphabet(orderedArray, orderMode): any {
    orderedArray = orderedArray.sort((a, b) => {
      if (orderMode) {
        return a.key > b.key ? 1 : -1;
      } else  {
        return a.key < b.key ? 1 : -1;
      }
    });
    return orderedArray;
  }

  sortByCount(orderedArray, orderMode): any {
    orderedArray = orderedArray.sort((a, b) => {
      if (a.value < b.value) {
        return !orderMode ? 1 : -1;
      } else if (a.value === b.value) {
        return a.key > b.key ? 1 : -1;
      } else {
        return !orderMode ? -1 : 1;
      }
    });
    return orderedArray;
  }

  sortCategoryValue (valueMap: any, sortMode: boolean, orderMode: boolean): any {
    let orderedArray = <any>[];
    valueMap.forEach(
      (value, key) => {
        orderedArray.push(
          {
            key: key,
            value: value
          });
      });
    if (!sortMode) {
      orderedArray = this.sortByAlphabet(orderedArray, orderMode);
    } else {
      orderedArray = this.sortByCount(orderedArray, orderMode);
    };
    const tempMap: Map<string, string> = new Map<string, string>();
    orderedArray.forEach(
      entry => {
        tempMap.set(entry.key, entry.value);
      });
    return tempMap;
  }

  setTabActive() {
    if (this.toolHits.length === 0 && this.workflowHits.length > 0) {
      this.activeToolBar = false;
    } else if (this.workflowHits.length === 0 && this.toolHits.length > 0) {
      this.activeToolBar = true;
    } else {
      this.activeToolBar = true;
    }
  }
}
