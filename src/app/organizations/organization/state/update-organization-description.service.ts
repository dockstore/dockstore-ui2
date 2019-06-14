import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { finalize } from 'rxjs/operators';

import { OrganizationsService, Organization } from '../../../shared/swagger';
import { OrganizationQuery } from '../../state/organization.query';
import { OrganizationService } from '../../state/organization.service';
import { UpdateOrganizationOrCollectionDescriptionStore } from './update-organization-description.store';
import { CollectionsService } from '../../state/collections.service';

@Injectable({ providedIn: 'root' })
export class UpdateOrganizationOrCollectionDescriptionService {
  constructor(
    private updateOrganizationOrCollectionDescriptionStore: UpdateOrganizationOrCollectionDescriptionStore,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private organizationsService: OrganizationsService,
    private organizationQuery: OrganizationQuery,
    private organizationService: OrganizationService,
    private matDialog: MatDialog,
    private collectionsService: CollectionsService
  ) {}

  createForm(data: any): FormGroup {
    const description = data.description;
    const form = this.formBuilder.group({
      description: [description, []]
    });
    return form;
  }

  updateCollectionDescription(formGroup: FormGroup, collectionId: number): void {
    const newDescription = formGroup.get('description').value || '';
    const organizationID = this.organizationQuery.getSnapshot().organization.id;
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
        error => {
          this.updateOrganizationOrCollectionDescriptionStore.setError(true);
        }
      );
  }

  updateOrganizationDescription(formGroup: FormGroup): void {
    const newDescription = formGroup.get('description').value || '';
    const organizationID = this.organizationQuery.getSnapshot().organization.id;
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
        error => {
          this.updateOrganizationOrCollectionDescriptionStore.setError(true);
        }
      );
  }
}
