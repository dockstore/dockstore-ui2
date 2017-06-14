import { Component, OnInit } from '@angular/core';
import { Client } from 'elasticsearch';
import SearchResponse = Elasticsearch.SearchResponse;
import {CommunicatorService} from '../shared/communicator.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  private _client: Client;
  private hits: Object[];
  private aggs: Object;


  constructor( private communicatorService: CommunicatorService) {
    this._client = new Client({
      host: 'http://localhost:8080/api/ga4gh/v1/extended',
      apiVersion: '2.4',
      log: 'trace'
    });
  }

  getContent(): void {
    this._client.search({
      index: 'tools',
      type: 'entry',
      body: {
        query: {
          match_all : {}
        }
      }
    }).then(hits => this.hits = hits.hits.hits);
  }

  ngOnInit() {
    this.getContent();
  }

  /* use this as an example query
   {"aggs":{"_type_0":{"terms":{"field":"_type","size":10000}},"registry_1":{"terms":{"field":"registry","size":10000}},"private_access_2":{"terms":{"field":"private_access","size":10000}},"tags_verified_3":{"terms":{"field":"tags.verified","size":10000}},"author_4":{"terms":{"field":"author","size":10000}},"namespace_5":{"terms":{"field":"namespace","size":10000}},"labels_value_6":{"terms":{"field":"labels.value","size":10000}},"tags_verifiedSource_7":{"terms":{"field":"tags.verifiedSource","size":10000}}},"query":{"match_all":{}}}

   or (one author only)

   {"aggs":{"filtered__type_0":{"filter":{"terms":{"author":["Andrey Kartashov"]}},"aggs":{"_type_0":{"terms":{"field":"_type","size":10000}}}},"filtered_registry_1":{"filter":{"terms":{"author":["Andrey Kartashov"]}},"aggs":{"registry_1":{"terms":{"field":"registry","size":10000}}}},"filtered_private_access_2":{"filter":{"terms":{"author":["Andrey Kartashov"]}},"aggs":{"private_access_2":{"terms":{"field":"private_access","size":10000}}}},"filtered_tags_verified_3":{"filter":{"terms":{"author":["Andrey Kartashov"]}},"aggs":{"tags_verified_3":{"terms":{"field":"tags.verified","size":10000}}}},"filtered_author_4":{"filter":{"terms":{"author":["Andrey Kartashov"]}},"aggs":{"author_4":{"terms":{"field":"author","size":10000}}}},"filtered_namespace_5":{"filter":{"terms":{"author":["Andrey Kartashov"]}},"aggs":{"namespace_5":{"terms":{"field":"namespace","size":10000}}}},"filtered_labels_value_6":{"filter":{"terms":{"author":["Andrey Kartashov"]}},"aggs":{"labels_value_6":{"terms":{"field":"labels.value","size":10000}}}},"filtered_tags_verifiedSource_7":{"filter":{"terms":{"author":["Andrey Kartashov"]}},"aggs":{"tags_verifiedSource_7":{"terms":{"field":"tags.verifiedSource","size":10000}}}}},"filter":{"terms":{"author":["Andrey Kartashov"]}},"query":{"match_all":{}}}
   */
  onEnter(value: string) {
    this._client.search({
      index: 'tools',
      type: 'entry',
      body: value
    }).then(hits => {
      this.hits = hits.hits.hits; this.aggs = JSON.stringify(hits.aggregations, null, 2);
    });
  }

  sendToolInfo(tool) {
    this.communicatorService.setTool(tool);
  }
}
