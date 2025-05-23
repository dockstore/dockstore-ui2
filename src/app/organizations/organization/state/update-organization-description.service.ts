import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { Organization, OrganizationsService } from '../../../shared/openapi';
import { CollectionsService } from '../../state/collections.service';
import { OrganizationQuery } from '../../state/organization.query';
import { OrganizationService } from '../../state/organization.service';
import { UpdateOrganizationOrCollectionDescriptionStore } from './update-organization-description.store';

@Injectable({ providedIn: 'root' })
export class UpdateOrganizationOrCollectionDescriptionService {
  constructor(
    private updateOrganizationOrCollectionDescriptionStore: UpdateOrganizationOrCollectionDescriptionStore,
    private formBuilder: UntypedFormBuilder,
    private organizationsService: OrganizationsService,
    private organizationQuery: OrganizationQuery,
    private organizationService: OrganizationService,
    private matDialog: MatDialog,
    private collectionsService: CollectionsService
  ) {}

  createForm(data: any): UntypedFormGroup {
    const description = data.description;
    const form = this.formBuilder.group({
      description: [description, []],
    });
    return form;
  }

  updateCollectionDescription(formGroup: UntypedFormGroup, collectionId: number): void {
    const newDescription = formGroup.get('description').value || '';
    const organizationID = this.organizationQuery.getValue().organization.id;
    this.updateOrganizationOrCollectionDescriptionStore.setError(false);
    this.updateOrganizationOrCollectionDescriptionStore.setLoading(true);
    this.organizationsService
      .updateCollectionDescription(organizationID, collectionId, newDescription)
      .pipe(finalize(() => this.updateOrganizationOrCollectionDescriptionStore.setLoading(false)))
      .subscribe(
        () => {
          this.collectionsService.updateCollections(organizationID);
          this.matDialog.closeAll();
        },
        (error) => {
          this.updateOrganizationOrCollectionDescriptionStore.setError(true);
        }
      );
  }

  updateOrganizationDescription(formGroup: UntypedFormGroup): void {
    const newDescription = formGroup.get('description').value || '';
    const organizationID = this.organizationQuery.getValue().organization.id;
    this.updateOrganizationOrCollectionDescriptionStore.setError(false);
    this.updateOrganizationOrCollectionDescriptionStore.setLoading(true);
    this.organizationsService
      .updateOrganizationDescription(organizationID, newDescription)
      .pipe(finalize(() => this.updateOrganizationOrCollectionDescriptionStore.setLoading(false)))
      .subscribe(
        (updatedOrganization: Organization) => {
          this.organizationService.updateOrganizationFromID(organizationID);
          this.matDialog.closeAll();
        },
        (error) => {
          this.updateOrganizationOrCollectionDescriptionStore.setError(true);
        }
      );
  }
}
