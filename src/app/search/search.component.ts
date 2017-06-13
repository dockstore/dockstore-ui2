import {Component, OnInit} from '@angular/core';
import { Client } from 'elasticsearch';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  private _client: Client;

  constructor() {
    this._client = new Client({
      host: 'http://localhost:8080/api/ga4gh/v1/extended',
      apiVersion: '2.4',
      log: 'trace'
    });

    this._client.search({
      index: 'tools',
      type: 'entry',
      body: {
        query: {
          match_all : {}
        }
      }
    }).then(function (resp) {
      const hits = resp.hits.hits;
      console.log(hits.length);
    }, function (err) {
      console.log(err.message);
    });
  }

  ngOnInit() {}

}
