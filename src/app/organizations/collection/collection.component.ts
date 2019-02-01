import { Component, OnInit, Inject } from '@angular/core';
import { CollectionService } from '../state/collection.service';
import { CollectionQuery } from '../state/collection.query';
import { Observable } from 'rxjs';
import { Collection } from '../../shared/swagger';
import { OrganizationQuery } from '../state/organization.query';
import { OrganizationService } from '../state/organization.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';
import { CreateCollectionComponent } from '../collections/create-collection/create-collection.component';

@Component({
  selector: 'collection-entry-confirm-remove',
  templateUrl: 'collection-entry-confirm-remove.html',
})
export class CollectionRemoveEntryDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CollectionRemoveEntryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
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
  constructor(private collectionQuery: CollectionQuery,
              private collectionService: CollectionService,
              private organizationQuery: OrganizationQuery,
              private organizationService: OrganizationService,
              public dialog: MatDialog
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

  /**
   * Opens a dialog which confirms the removal of an entry from a collection
   * @param organizationId
   * @param collectionId
   * @param entryId
   * @param collectionName
   * @param entryName
   */
  openRemoveEntryDialog(organizationId: number, collectionId: number, entryId: number, collectionName: string, entryName: string) {
    const dialogRef = this.dialog.open(CollectionRemoveEntryDialogComponent, {
      width: '500px',
      data: {
        collectionName: collectionName, entryName: entryName,
        collectionId: collectionId, entryId: entryId,
        organizationId: organizationId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.collectionService.removeEntryFromCollection(result.organizationId, result.collectionId, result.entryId, result.entryName);
      }
    });
  }

  editCollection(collection: Collection) {
    const collectionMap = { 'key': collection.id, 'value': collection};
    const dialogRef = this.dialog.open(CreateCollectionComponent, {data: {collection: collectionMap, mode: TagEditorMode.Edit},
      width: '600px'});

    dialogRef.afterClosed().subscribe(result => {
      this.collectionService.updateCollectionFromName();
      this.collection$ = this.collectionQuery.collection$;
    });
  }
}
