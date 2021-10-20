import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CollectionsService } from '../../state/collections.service';

@Component({
  selector: 'app-collection-confirm-remove',
  templateUrl: './remove-collection.component.html',
})
export class RemoveCollectionDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: CollectionDialogData, private collectionsService: CollectionsService) {}
  removeCollection() {
    this.collectionsService.deleteCollection(this.data.organizationId, this.data.collectionId, this.data.organizationName, this.data.collectionName);
  }
}

export interface CollectionDialogData {
  organizationId: number;
  collectionId: number;
  organizationName: string;
  collectionName: string;
}
