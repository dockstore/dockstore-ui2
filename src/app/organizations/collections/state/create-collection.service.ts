import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AkitaNgFormsManager } from '@datorama/akita-ng-forms-manager';
import { finalize } from 'rxjs/operators';

import { TagEditorMode } from '../../../shared/enum/tagEditorMode.enum';
import { Collection, OrganisationsService } from '../../../shared/swagger';
import { CollectionsService } from '../../state/collections.service';
import { OrganizationQuery } from '../../state/organization.query';
import { CreateCollectionStore } from './create-collection.store';

export interface FormsState {
  createOrUpdateCollection: {
    name: string;
    description: string;
  };
}

@Injectable({ providedIn: 'root' })
export class CreateCollectionService {

  constructor(private createCollectionStore: CreateCollectionStore, private organisationsService: OrganisationsService,
    private organizationQuery: OrganizationQuery, private matDialog: MatDialog, private matSnackBar: MatSnackBar,
    private collectionsService: CollectionsService, private builder: FormBuilder, private formsManager: AkitaNgFormsManager<FormsState>) {
  }

  clearState() {
    // Initially set to false, loading is only after the user has filled in the form and clicked the button
    this.createCollectionStore.setLoading(false);
  }

  /**
   * Create a new collection
   *
   * @param {FormsState['createOrUpdateCollection']} collectionFormState
   * @memberof CreateCollectionService
   */
  createCollection(collectionFormState: FormsState['createOrUpdateCollection']) {
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
        this.collectionsService.updateCollections();
      }, error => {
        this.createCollectionStore.setError(true);
        this.matSnackBar.open('Creating collection failed');
      });

  }

  /**
   * Create or update collection based on mode
   *
   * @param {*} data
   * @param {FormGroup} createCollectionForm
   * @memberof CreateCollectionService
   */
  createOrUpdateCollection(data: any, createCollectionForm: FormGroup) {
    if (data.mode === TagEditorMode.Add) {
      this.createCollection(createCollectionForm.value);
    } else {
      this.updateCollection(createCollectionForm.value, data.collection.value.id);
    }
  }

  /**
   * Creates the collection (create and update) form based on the mode given
   *
   * @param {*} data
   * @returns {FormGroup}
   * @memberof CreateCollectionService
   */
  createForm(formsManager: AkitaNgFormsManager<FormsState>, data: any): FormGroup {
    const mode: TagEditorMode = data.mode;
    let name = null;
    let description = null;
    formsManager.remove('createOrUpdateCollection');
    if (mode !== TagEditorMode.Add) {
      const collection: Collection = data.collection.value;
      name = collection.name;
      description = collection.description;
    }
    const createOrUpdateCollectionForm = this.builder.group({
      name: [name, [Validators.required, Validators.maxLength(39), Validators.minLength(3), Validators.pattern(/^[a-zA-Z][a-zA-Z\d]*$/)]],
      description: [description]
    });
    formsManager.upsert('createOrUpdateCollection', createOrUpdateCollectionForm);
    return createOrUpdateCollectionForm;
  }

  /**
   * Sets the title based on the mode
   *
   * @param {*} data  Data object during dialog component creation
   * @memberof CreateCollectionService
   */
  setTitle(data: any): void {
    const mode: TagEditorMode = data.mode;
    const title = mode === TagEditorMode.Add ? 'Create Collection' : 'Edit Collection';
    this.createCollectionStore.setState(state => {
      return {
        ...state,
        title: title
      };
    });
  }

  /**
   * Update the collection
   *
   * @param {FormsState['createOrUpdateCollection']} collectionFormState
   * @param {number} collectionID  ID of the collection to update
   * @memberof CreateCollectionService
   */
  updateCollection(collectionFormState: FormsState['createOrUpdateCollection'], collectionID: number) {
    let collection: Collection;
    collection = {
      name: collectionFormState.name,
      description: collectionFormState.description
    };
    const organizationID = this.organizationQuery.getSnapshot().organization.id;
    this.createCollectionStore.setLoading(true);
    this.organisationsService.updateCollection(organizationID, collectionID, collection).pipe(
      finalize(() => this.createCollectionStore.setLoading(false)))
      .subscribe((newCollection: Collection) => {
        this.createCollectionStore.setError(false);
        this.matDialog.closeAll();
        this.matSnackBar.open('Updating collection successful');
        this.collectionsService.updateCollections();
      }, error => {
        this.createCollectionStore.setError(true);
        this.matSnackBar.open('Updating collection failed');
      });
  }

}
