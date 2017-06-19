import {Component, OnInit} from '@angular/core';
import {Client} from 'elasticsearch';
import {CommunicatorService} from '../shared/communicator.service';
import SearchResponse = Elasticsearch.SearchResponse;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  private _client: Client;
  private hits: Object[];
  private aggs: Object;
  private buckets: Map<string, Map<string, string>> = new Map<string, Map<string, string>>();
  private initialQuery = '{"aggs":{"_type":{"terms":{"field":"_type","size":10000}},"registry":{"terms":{"field":"registry","size":10000}},"private_access":{"terms":{"field":"private_access","size":10000}},"tags_verified":{"terms":{"field":"tags.verified","size":10000}},"author":{"terms":{"field":"author","size":10000}},"namespace":{"terms":{"field":"namespace","size":10000}},"labels_value":{"terms":{"field":"labels.value","size":10000}},"tags_verifiedSource":{"terms":{"field":"tags.verifiedSource","size":10000}}},"query":{"match_all":{}}}';
  private filters: Map<String, String> = new Map<String, String>();
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


  onEnter(value: string) {
    this._client.search({
      index: 'tools',
      type: 'entry',
      body: value
    }).then(hits => {
      this.hits = hits.hits.hits;
      this.aggs = JSON.stringify(hits.aggregations, null, 2);
      for (const property in hits.aggregations) {
        if (hits.aggregations.hasOwnProperty(property)) {
          // loop through contents buckets
          console.log(property);
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

  onClick(value1: string, value2: string) {
    console.log(value1 + ' ' + value2);
    if (this.filters.has(value1)) {
      this.filters.delete(value1);
    } else {
      this.filters.set(value1, value2);
    }
    // assemble a query and pretend to click
    const queryWrapper = new QueryWrapper();

    if (this.filters.size === 1) {
      queryWrapper.filter = new SingleFilter();
      const t = {};
      const modifiedFilterValue = value1.substring(0, 1) + value1.substring(1).replace('_', '.')
      t[modifiedFilterValue] = [];
      t[modifiedFilterValue][0] = [];
      t[modifiedFilterValue][0] = value2;
      queryWrapper.filter.terms = t;
      // go through buckets
      queryWrapper.aggs = {};

      this.bucketStubs.forEach( key => {
        const modifiedKey = key.replace('.', '_');
        queryWrapper.aggs[modifiedKey] = {};
        queryWrapper.aggs[modifiedKey].aggs = {};
        queryWrapper.aggs[modifiedKey].aggs[modifiedKey] = {};
        queryWrapper.aggs[modifiedKey].aggs[modifiedKey].terms = new AggTerms();
        queryWrapper.aggs[modifiedKey].aggs[modifiedKey].terms.field = key;
        // next, add the filtering clauses
        queryWrapper.aggs[modifiedKey].filter = {};
        queryWrapper.aggs[modifiedKey].filter.terms = t;
      });
    } else if (this.filters.size > 1) {

    }
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


}



export class Match {}

export class Query {
  match_all: Match = new Match();
}

export class NestedTerms {
  terms: AggTerms[] = [];
}

export class AggTerms {
  field: String;
  size = 10000;
}

export class SingleFilter {
  terms = [];
}

export class BoolFilter {

}


export class QueryWrapper {
  aggs;
  filter;
  query = new Query();
}
