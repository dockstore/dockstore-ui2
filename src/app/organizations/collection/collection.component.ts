import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../state/collection.service';
import { CollectionQuery } from '../state/collection.query';
import { Observable } from 'rxjs';
import { Collection } from '../../shared/swagger';

@Component({
  selector: 'collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {
  collection$: Observable<Collection>;
  loading$: Observable<boolean>;
  constructor(private collectionQuery: CollectionQuery,
              private collectionService: CollectionService
  ) { }

  ngOnInit() {
    this.loading$ = this.collectionQuery.loading$;
    this.collectionService.updateCollectionFromName();
    this.collection$ = this.collectionQuery.collection$;
  }
}
