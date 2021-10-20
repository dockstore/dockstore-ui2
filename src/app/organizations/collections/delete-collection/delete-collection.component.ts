import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CollectionsService } from '../../state/collections.service';

@Component({
  selector: 'app-collection-confirm-delete',
  templateUrl: './delete-collection.component.html',
})
export class DeleteCollectionDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: CollectionDialogData, private collectionsService: CollectionsService) {}
  deleteCollection() {
    console.log("delete collection "+this.data.collectionName);
  }
}

export interface CollectionDialogData {
  organizationId: number;
  collectionId: number;
  organizationName: string;
  collectionName: string;
}
