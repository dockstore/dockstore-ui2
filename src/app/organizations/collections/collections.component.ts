import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CollectionsService } from '../state/collections.service';
import { CollectionsQuery } from '../state/collections.query';
import { Observable } from 'rxjs';
import { OrganizationQuery } from '../state/organization.query';
import { MatDialog } from '@angular/material';
import { CreateCollectionComponent } from './create-collection/create-collection.component';

@Component({
  selector: 'collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit, OnChanges {
  @Input() organizationID: number;
  canEdit$: Observable<boolean>;
  constructor(private collectionsQuery: CollectionsQuery, private organizationQuery: OrganizationQuery,
              private collectionsService: CollectionsService, private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.canEdit$ = this.organizationQuery.canEdit$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.collectionsService.updateCollections(this.organizationID);
  }

  createCollection() {
    this.matDialog.open(CreateCollectionComponent, {width: '600px'});
  }
}
