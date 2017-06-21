import {Component, OnInit} from '@angular/core';
import {Client} from 'elasticsearch';
import {CommunicatorService} from '../shared/communicator.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  /** current set of search results
   * TODO: this stores all results, but the real implementation should limit results
   * and paginate to be scalable
   */
  private hits: Object[];
  private _client: Client;
  /** a map from a field (like _type or author) in elastic search to specific values for that field (tool, workflow) and how many
   results exist in that field after narrowing down based on search */
  private buckets: Map<string, Map<string, string>> = new Map<string, Map<string, string>>();
  // TODO: this needs to be improved, but this is the default "empty" query
  // tslint:disable-next-line
  private initialQuery = '{"aggs":{"_type":{"terms":{"field":"_type","size":10000}},"registry":{"terms":{"field":"registry","size":10000}},"private_access":{"terms":{"field":"private_access","size":10000}},"tags_verified":{"terms":{"field":"tags.verified","size":10000}},"author":{"terms":{"field":"author","size":10000}},"namespace":{"terms":{"field":"namespace","size":10000}},"labels_value":{"terms":{"field":"labels.value","size":10000}},"tags_verifiedSource":{"terms":{"field":"tags.verifiedSource","size":10000}}},"query":{"match_all":{}}}';

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
    ['Registry', 'registry'],
    ['Private Access', 'private_access'],
    ['Verified', 'tags.verified'],
    ['Author', 'author'],
    ['Organization', 'namespace'],
    ['Labels', 'labels.value'],
    ['Verified Source', 'tags.verifiedSource'],
  ]);
  /**
   * The current text search
   * @type {string}
   */
  private values = '';


  /**
   * This should be parameterised from src/app/shared/dockstore.model.ts
   * @param communicatorService
   */
  constructor(private communicatorService: CommunicatorService) {
    this._client = new Client({
      host: 'http://localhost:8080/api/ga4gh/v1/extended',
      apiVersion: '2.4',
      log: 'trace'
    });
  }


  ngOnInit() {
    this.onEnter(this.initialQuery);
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
      for (const property in hits.aggregations) {
        if (hits.aggregations.hasOwnProperty(property)) {
          // loop through contents buckets
          const category = hits.aggregations[property];
          // look for top level buckets (no filtering)
          if (category.buckets != null) {
            category.buckets.forEach(bucket => {
              if (this.buckets.get(property) == null) {
                this.buckets.set(property, new Map<string, string>());
              }
              this.buckets.get(property).set(bucket.key, bucket.doc_count);
            });
          }

          // look for second level buckets (with filtering)
          for (const nestedProperty in category) {
            if (category.hasOwnProperty(nestedProperty)) {
              // this is copied and pasted, make this better
              const nestedCategory = category[nestedProperty];
              // look for top level buckets (no filtering)
              if (nestedCategory != null && nestedCategory.buckets != null) {
                nestedCategory.buckets.forEach(bucket => {
                  if (this.buckets.get(nestedProperty) == null) {
                    this.buckets.set(nestedProperty, new Map<string, string>());
                  }
                  this.buckets.get(nestedProperty).set(bucket.key, bucket.doc_count);
                });
              }
            }
          }
        }
      }
    });
  }

  /**
   * This handles selection of one filter, either taking it out from the lsit of active filters
   * or adding it if not present
   * @param category
   * @param categoryValue
   */
  handleFilters(category: string, categoryValue: string) {
    console.log(category + ' ' + categoryValue);
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

  /**
   * This handles clicking a facet and doing the search
   * @param category
   * @param categoryValue
   */
  onClick(category: string, categoryValue: string) {
    if (category !== null && categoryValue !== null) {
      this.handleFilters(category, categoryValue);
    }
    // assemble a query and pretend to click
    const queryWrapper = new QueryWrapper();

    const t = {};

    // calculate number of filters
    let count = 0;
    this.filters.forEach(filter => {
      count += filter.size;
    });

    // this ugly code creates the objects representing an elastic search query
    // may be able to use the elastic search library or a better JSON library to clean this up
    const boolFilter = new BoolFilter();
    if (count === 1) {
      category = this.filters.keys().next().value.toString();
      categoryValue = this.filters.get(category).values().next().value.toString();
      const modifiedFilterValue = category.substring(0, 1) + category.substring(1).replace('_', '.');
      queryWrapper.filter = new SingleFilter();
      t[modifiedFilterValue] = [];
      t[modifiedFilterValue][0] = [];
      t[modifiedFilterValue][0] = categoryValue;
      queryWrapper.filter = {};
      queryWrapper.filter.terms = t;
    } else if (count > 1) {
      boolFilter.bool['must'] = [];
      for (const key of Array.from(this.filters.keys())){
        const filter = this.filters.get(key);
        filter.forEach(insideFilter => {
          const modifiedInnerFilterValue = key.substring(0, 1) + key.substring(1).replace('_', '.');
          const terms = {};
          terms[modifiedInnerFilterValue] = [];
          terms[modifiedInnerFilterValue].push(insideFilter);
          const termsWrapper = {};
          termsWrapper['terms'] = terms;
          boolFilter.bool['must'].push(termsWrapper);
        });
      }
      queryWrapper.filter = boolFilter;
    }

    // if there is a description search
    if (this.values.toString().length > 0) {
      queryWrapper['query'] = {};
      queryWrapper['query']['match'] = {};
      queryWrapper['query']['match']['description'] = {};
      queryWrapper['query']['match']['description']['query'] = this.values;
    } else {
      queryWrapper['query'] = new Query();
    }

    // go through buckets
    queryWrapper.aggs = {};

    this.bucketStubs.forEach(key => {
      const modifiedKey = key.replace('.', '_');
      queryWrapper.aggs[modifiedKey] = {};
      queryWrapper.aggs[modifiedKey].aggs = {};
      queryWrapper.aggs[modifiedKey].aggs[modifiedKey] = {};
      queryWrapper.aggs[modifiedKey].aggs[modifiedKey].terms = new AggTerms();
      queryWrapper.aggs[modifiedKey].aggs[modifiedKey].terms.field = key;
      queryWrapper.aggs[modifiedKey].filter = {};
      // next, add the filtering clauses
      if (count === 1) {
        queryWrapper.aggs[modifiedKey].filter.terms = t;
      } else if (count > 1) {
        queryWrapper.aggs[modifiedKey].filter = boolFilter;
      }
    });

    this.buckets.clear();
    const query = JSON.stringify(queryWrapper, null, 2);
    console.log(query);
    this.onEnter(query);
  }

  resetFilters() {
    this.filters.clear();
    this.onEnter(this.initialQuery);
  }


  sendToolInfo(tool) {
    this.communicatorService.setTool(tool);
  }

  onKey(value: string) {
    this.values = value;
    this.onClick(null, null);
  }

}


export class Match {
}

export class Query {
  match_all: Match = new Match();
}

export class AggTerms {
  field: String;
  size = 10000;
}

export class SingleFilter {
  terms = [];
}

export class BoolFilter {
  bool = {};
}


export class QueryWrapper {
  aggs;
  filter;
}
