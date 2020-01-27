import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AkitaNgFormsManager } from '@datorama/akita-ng-forms-manager';
import { finalize } from 'rxjs/operators';
import { AlertService } from '../../../shared/alert/state/alert.service';
import { TagEditorMode } from '../../../shared/enum/tagEditorMode.enum';
import { Collection, OrganizationsService } from '../../../shared/swagger';
import { CollectionsService } from '../../state/collections.service';
import { OrganizationQuery } from '../../state/organization.query';
import { CreateCollectionStore } from './create-collection.store';

export interface FormsState {
  createOrUpdateCollection: {
    name: string;
    topic: string;
    displayName: string;
  };
}

@Injectable({ providedIn: 'root' })
export class CreateCollectionService {
  constructor(
    private createCollectionStore: CreateCollectionStore,
    private organizationsService: OrganizationsService,
    private organizationQuery: OrganizationQuery,
    private matDialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private collectionsService: CollectionsService,
    private builder: FormBuilder,
    private alertService: AlertService
  ) {}

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
      topic: collectionFormState.topic,
      displayName: collectionFormState.displayName
    };
    const organizationID = this.organizationQuery.getValue().organization.id;
    this.beforeCall();
    this.alertService.start('Creating collection');
    this.organizationsService
      .createCollection(organizationID, collection)
      .pipe(finalize(() => this.createCollectionStore.setLoading(false)))
      .subscribe(
        (newCollection: Collection) => {
          this.createCollectionStore.setError(false);
          this.matDialog.closeAll();
          this.alertService.detailedSuccess();
          this.collectionsService.updateCollections();
        },
        (error: HttpErrorResponse) => {
          this.createCollectionStore.setError(true);
          this.alertService.detailedError(error);
        }
      );
  }

  private beforeCall() {
    this.createCollectionStore.setLoading(true);
    this.createCollectionStore.setError(false);
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
      this.updateCollection(createCollectionForm.value, data.collection.value.id, data.collection.value.description);
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
    let topic = null;
    let displayName = null;
    let description = null;
    formsManager.remove('createOrUpdateCollection');
    if (mode !== TagEditorMode.Add) {
      const collection: Collection = data.collection.value;
      name = collection.name;
      topic = collection.topic;
      displayName = collection.displayName;
      description = collection.description;
    }

    const createOrUpdateCollectionForm = this.builder.group({
      name: [name, [Validators.required, Validators.maxLength(39), Validators.minLength(3), Validators.pattern(/^[a-zA-Z][a-zA-Z\d]*$/)]],
      displayName: [
        displayName,
        [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(/^[a-zA-Z\d ,_\-&()']*$/)]
      ],
      topic: [topic]
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
    this.createCollectionStore.update(state => {
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
   * @param {string} collectionDescripton The unedited description because formState isn't updating description and doesn't know it
   * @memberof CreateCollectionService
   */
  updateCollection(collectionFormState: FormsState['createOrUpdateCollection'], collectionID: number, collectionDescripton: string) {
    let collection: Collection;
    collection = {
      name: collectionFormState.name,
      topic: collectionFormState.topic,
      displayName: collectionFormState.displayName,
      description: collectionDescripton
    };
    const organizationID = this.organizationQuery.getValue().organization.id;
    this.beforeCall();
    this.alertService.start('Updating collection');
    this.organizationsService
      .updateCollection(organizationID, collectionID, collection)
      .pipe(finalize(() => this.createCollectionStore.setLoading(false)))
      .subscribe(
        (newCollection: Collection) => {
          this.createCollectionStore.setError(false);
          this.matDialog.closeAll();
          this.alertService.detailedSuccess();
          this.collectionsService.updateCollections();
        },
        error => {
          this.createCollectionStore.setError(true);
          this.alertService.detailedError(error);
        }
      );
  }
}
