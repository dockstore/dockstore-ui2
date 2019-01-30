import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../state/collection.service';
import { CollectionQuery } from '../state/collection.query';
import { Observable } from 'rxjs';
import { Collection } from '../../shared/swagger';
import { OrganizationQuery } from '../state/organization.query';
import { OrganizationService } from '../state/organization.service';

@Component({
  selector: 'collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {
  collection$: Observable<Collection>;
  loadingCollection$: Observable<boolean>;

  organization$: Observable<Collection>;
  loadingOrganization$: Observable<boolean>;
  canEdit$: Observable<boolean>;
  constructor(private collectionQuery: CollectionQuery,
              private collectionService: CollectionService,
              private organizationQuery: OrganizationQuery,
              private organizationService: OrganizationService
  ) { }

  ngOnInit() {
    this.loadingCollection$ = this.collectionQuery.loading$;
    this.collectionService.updateCollectionFromName();
    this.collection$ = this.collectionQuery.collection$;

    this.loadingOrganization$ = this.organizationQuery.loading$;
    this.canEdit$ = this.organizationQuery.canEdit$;
    this.organizationService.updateOrganizationFromNameORID();
    this.organization$ = this.organizationQuery.organization$;
  }
}
