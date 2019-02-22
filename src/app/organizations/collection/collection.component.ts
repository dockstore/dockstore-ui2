import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';
import { Collection, Organization } from '../../shared/swagger';
import { ActivatedRoute } from '../../test';
import { CreateCollectionComponent } from '../collections/create-collection/create-collection.component';
import { CollectionsQuery } from '../state/collections.query';
import { CollectionsService } from '../state/collections.service';
import { OrganizationQuery } from '../state/organization.query';
import { OrganizationService } from '../state/organization.service';
import { UserQuery } from '../../shared/user/user.query';


@Component({
  selector: 'collection-entry-confirm-remove',
  templateUrl: 'collection-entry-confirm-remove.html',
})
export class CollectionRemoveEntryDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private collectionsService: CollectionsService) {}
  deleteCollection() {
    this.collectionsService.removeEntryFromCollection(
      this.data.organizationId, this.data.collectionId, this.data.entryId, this.data.entryName);
  }


}

export interface DialogData {
  collectionName: string;
  collectionId: number;
  entryName: string;
  entryId: number;
  organizationId: number;
}

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
  pendingEnum = Organization.StatusEnum.PENDING;

  isAdmin$: Observable<boolean>;
  isCurator$: Observable<boolean>;
  constructor(private collectionsQuery: CollectionsQuery,
              private organizationQuery: OrganizationQuery,
              private organizationService: OrganizationService,
              private collectionsService: CollectionsService,
              public dialog: MatDialog, private activatedRoute: ActivatedRoute,
              private userQuery: UserQuery
  ) { }

  ngOnInit() {
    const organizationId = this.activatedRoute.snapshot.paramMap.get('id');
    const collectionId = this.activatedRoute.snapshot.paramMap.get('cid');
    this.loadingCollection$ = this.collectionsQuery.loading$;
    this.collection$ = this.collectionsQuery.selectActive();
    this.loadingOrganization$ = this.organizationQuery.loading$;
    this.canEdit$ = this.organizationQuery.canEdit$;
    this.organization$ = this.organizationQuery.organization$;
    this.organizationService.updateOrganizationFromNameORID(organizationId);
    this.collectionsService.updateCollectionFromName(organizationId, collectionId);
    this.isAdmin$ = this.userQuery.isAdmin$;
    this.isCurator$ = this.userQuery.isCurator$;
  }

  /**
   * Opens a dialog which confirms the removal of an entry from a collection
   * @param organizationId
   * @param collectionId
   * @param entryId
   * @param collectionName
   * @param entryName
   */
  openRemoveEntryDialog(organizationId: number, collectionId: number, entryId: number, collectionName: string, entryName: string) {
    this.dialog.open(CollectionRemoveEntryDialogComponent, {
      width: '500px',
      data: {
        collectionName: collectionName, entryName: entryName,
        collectionId: collectionId, entryId: entryId,
        organizationId: organizationId
      }
    });
  }

  editCollection(collection: Collection) {
    const collectionMap = { 'key': collection.id, 'value': collection};
    const dialogRef = this.dialog.open(CreateCollectionComponent, {data: {collection: collectionMap, mode: TagEditorMode.Edit},
      width: '600px'});
  }
}
