import bodybuilder from 'bodybuilder';
import { Client } from 'elasticsearch';
import { CommunicatorService } from '../shared/communicator.service';
import {Component, OnInit, ViewChild, enableProdMode, ElementRef} from '@angular/core';
import { ProviderService } from '../shared/provider.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Dockstore } from '../shared/dockstore.model';
import { CloudData, CloudOptions } from 'angular-tag-cloud-module';

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
  // Possibly 100 workflows and 100 tools
  private query_size = 200;
  expandAll = true;
  showToolTagCloud = true;
  showWorkflowTagCloud = true;
  searchTerm = false;
  options: CloudOptions = {
    width : 600,
    height : 200,
    overflow: false,
  };
  data: Array<CloudData> = [
    {text: 'Docker', weight: 10, color: '#ffaaee'},
    {text: 'PCAWG', weight: 9},
    {text: 'Tool', weight: 8},
    {text: 'Weight-7-link', weight: 7, link: 'https://google.com'},
    {text: 'Weight-6-link', weight: 5, link: 'https://google.com'},
    {text: 'cancer', weight: 5, },
    {text: 'Weight-4-link', weight: 4, link: 'https://google.com'},
    {text: 'Weight-3-link', weight: 3, link: 'https://google.com'},
    {text: 'Weight-2-link', weight: 2, link: 'https://google.com'},
    {text: 'Weight-1-link', weight: 1, link: 'https://google.com'},
  ];

  data2: Array<CloudData> = [
    {text: 'Weight-10-link', weight: 10, link: 'https://google.com'},
    {text: 'Weight-9-link', weight: 9, link: 'https://google.com'},
    {text: 'Weight-8-link', weight: 8, link: 'https://google.com'},
    {text: 'Weight-7-link', weight: 7, link: 'https://google.com'},
    {text: 'Weight-6-link', weight: 5, link: 'https://google.com'},
    {text: 'Weight-5-link', weight: 5, link: 'https://google.com'},
    {text: 'Weight-4-link', weight: 4, link: 'https://google.com'},
    {text: 'Weight-3-link', weight: 3, link: 'https://google.com'},
    {text: 'Weight-2-link', weight: 2, link: 'https://google.com'},
    {text: 'Weight-1-link', weight: 1, link: 'https://google.com'},
  ];
  /** a map from a field (like _type or author) in elastic search to specific values for that field (tool, workflow) and how many
   results exist in that field after narrowing down based on search */
  /** TODO: Note that the key (the name) might not be unique...*/
  private buckets: Map<string, Map<string, string>> = new Map<string, Map<string, string>>();

  // Shows which of the categories (registry, author, etc) are expanded to show all available buckets
  private fullyExpandMap: Map<string, boolean> = new Map<string, boolean>();

  // Shows which of the buckets are current selected
  private checkboxMap: Map<string, Map<string, boolean>> = new Map<string, Map<string, boolean>>();
  private initialQuery: string;
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
    ['Organization', 'namespace'], /**WRONG*/
    ['Labels', 'labels.value.keyword'], /*WRONG*/
    ['Verified Source', 'tags.verifiedSource']
  ]);
  private friendlyNames = new Map([
    ['_type', 'Entry Type'],
    ['registry', 'Registry'],
    ['private_access', 'Private Access'],
    ['tags_verified', 'Verified'],
    ['author', 'Author'],
    ['namespace', 'Organization'],
    ['labels_value_keyword', 'Labels'],
    ['tags_verifiedSource', 'Verified Source'],
  ]);
  private friendlyValueNames = new Map([
    ['tags_verified', new Map([
      [1, 'verified'], [0, 'non-verified']
    ])],
    ['private_access', new Map([
      [1, 'private'], [0, 'public']
    ])]
  ]);
  /**
   * The current text search
   * @type {string}
   */
  private values = '';
  /**
   * This should be parameterised from src/app/shared/dockstore.model.ts
   * @param providerService
   */
  constructor(private providerService: ProviderService) {
    this._client = new Client({
      host: Dockstore.API_URI + '/api/ga4gh/v1/extended',
      apiVersion: '5.x',
      log: 'trace'
    });
    const body = bodybuilder()
      .aggregation('terms', '_type', { size: this.shard_size }, '_type')
      .aggregation('terms', 'registry', { size: this.shard_size }, 'registry')
      .aggregation('terms', 'private_access', { size: this.shard_size }, 'private_access')
      .aggregation('terms', 'tags.verified', { size: this.shard_size }, 'tags_verified')
      .aggregation('terms', 'author', { size: this.shard_size }, 'author')
      .aggregation('terms', 'namespace', { size: this.shard_size }, 'namespace')
      .aggregation('terms', 'labels.value.keyword', { size: this.shard_size }, 'labels_value_keyword')
      .aggregation('terms', 'tags.verifiedSource', { size: this.shard_size }, 'tags_verifiedSource')
      .query('match_all', {})
      .size(this.query_size);
    // TODO: this needs to be improved, but this is the default "empty" query
    this.initialQuery = JSON.stringify(body.build());
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
  logClicked(clicked: CloudData) {
    this.searchTerm = true;
    this.values = clicked.text;
    this.searchTermBox.nativeElement.value = '';
    this.onClick(null, null);
  }
  ngOnInit() {
    this.onEnter(this.initialQuery);
  }
  mapFriendlyValueNames(key, subBucket) {
    if (key === 'tags_verified' || key === 'private_access') {
      return this.friendlyValueNames.get(key).get(subBucket);
    } else {
      subBucket = subBucket.replace('_', '.');
      subBucket = subBucket.replace('_', '.');
      return subBucket;
    }
  }
  resetSearchTerm() {
    this.searchTerm = false;
    this.searchTermBox.nativeElement.value = '';
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

  /**
   * This ugly function looks at what hits came back from a search and creates
   * data structures (buckets) needed for displaying the results
   * @param value
   */
  onEnter(value: string) {
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
      this.setupAllBuckets(hits);
    });
  }

  /**
   * Partially updates the buckets, fullyExpandMap, and checkboxMap data structures
   * based on one set of the hit's buckets to update the search view
   * @param {any} key The aggregation
   * @param {*} buckets The buckets inside the aggregation
   * @memberof SearchComponent
   */
  setupBuckets(key, buckets: any) {
    buckets.forEach(bucket => {
      if (this.buckets.get(key) == null) {
        this.buckets.set(key, new Map<string, string>());
        if (!this.setFilter) {
          this.fullyExpandMap.set(key, false);
          this.checkboxMap.set(key, new Map<string, boolean>());
        }
      }
      this.buckets.get(key).set(bucket.key, bucket.doc_count);
      if (!this.setFilter) {
        this.checkboxMap.get(key).set(bucket.key, false);
      }
    });
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
          this.setupBuckets(key, value.buckets);
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
  clickExpand(key: string) {
    const isExpanded = this.fullyExpandMap.get(key);
    this.fullyExpandMap.set(key, !isExpanded);
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

    // calculate number of filters
    let count = 0;
    this.filters.forEach(filter => {
      count += filter.size;
    });
    let body = bodybuilder()
      .size(this.query_size);
    body = this.appendQuery(body);
    body = this.appendFilter(body);
    body = this.appendAggregations(count, body);
    this.buckets.clear();
    const builtBody = body.build();
    const query = JSON.stringify(builtBody);
    this.onEnter(query);
  }
  resetFilters() {
    this.filters.clear();
    this.setFilter = false;
    this.hits = [];
    this.workflowHits = [];
    this.toolHits = [];
    this.values = '';
    this.resetSearchTerm();
    this.onEnter(this.initialQuery);
  }
  onKey(value: string) {
    /* TODO: might need to check for safety injection */
    this.values = value;
    this.searchTerm = true;
    if ((!value || 0 === value.length)) {
      this.searchTerm = false;
    }
    this.onClick(null, null);
  }

  /**
   * Append filters to a body builder object in order to add filter functionality to the overall elastic search query
   * This is used to add to query object as well as each individual aggregation
   * @param {*} body
   * @returns the new body builder object with filter applied
   * @memberof SearchComponent
   */
  appendFilter(body: any): any {
    this.filters.forEach((value: Set<string>, key: string) => {
      value.forEach(insideFilter => {
        let modifiedInnerFilterValue = key;
        // private_access is the only category we do not want modify
        if (key === 'labels_value_keyword') {
          modifiedInnerFilterValue = key.replace(/_/g, '.');
        } else {
          if (key !== 'private_access') {
            modifiedInnerFilterValue = key.substring(0, 1) + key.substring(1).replace('_', '.');
          }
        } body = body.filter('term', modifiedInnerFilterValue, insideFilter);
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
    // if there is a description search
    if (this.values.toString().length > 0) {
      body = body.query('match', 'description', this.values);
    } else {
      body = body.query('match_all', {});
    }
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
      const modifiedKey = key.replace(/\./g, '_');
      if (count > 0) {
        body = body.agg('filter', modifiedKey, modifiedKey, (a) => {
          return this.appendFilter(a).aggregation('terms', key, modifiedKey, { size: this.shard_size });
        });
      } else {
        body = body.agg('terms', key, modifiedKey, { size: this.shard_size });
      }
    });
    return body;
  }
}
