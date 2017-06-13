import {Component, OnInit} from '@angular/core';
import { Client } from 'elasticsearch';
import SearchResponse = Elasticsearch.SearchResponse;


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  private _client: Client;
  private hits: Object[];

  constructor() {
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

}
