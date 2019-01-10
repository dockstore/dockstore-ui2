import { Injectable } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { finalize } from 'rxjs/operators';

import { Collection, OrganisationsService } from '../../../shared/swagger';
import { OrganizationQuery } from '../../state/organization.query';
import { FormsState } from '../create-collection/create-collection.component';
import { CreateCollectionStore } from './create-collection.store';

@Injectable({ providedIn: 'root' })
export class CreateCollectionService {

  constructor(private createCollectionStore: CreateCollectionStore, private organisationsService: OrganisationsService,
    private organizationQuery: OrganizationQuery, private matDialog: MatDialog, private matSnackBar: MatSnackBar) {
  }

  clearState() {
    // Initially set to false, loading is only after the user has filled in the form and clicked the button
    this.createCollectionStore.setLoading(false);
  }

  createCollection(collectionFormState: FormsState['createCollection']) {
    let collection: Collection;
    collection = {
      name: collectionFormState.name,
      description: collectionFormState.description
    };
    const organizationID = this.organizationQuery.getSnapshot().organization.id;
    this.createCollectionStore.setLoading(true);
    this.organisationsService.createCollection(organizationID, collection).pipe(
      finalize(() => this.createCollectionStore.setLoading(false)))
      .subscribe((newCollection: Collection) => {
        this.createCollectionStore.setError(false);
        this.matDialog.closeAll();
        this.matSnackBar.open('Creating collection successful');
      }, error => {
        this.createCollectionStore.setError(true);
        this.matSnackBar.open('Creating collection failed');
      });

  }

}
