import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { finalize } from 'rxjs/operators';

import { OrganizationsService, Organization } from '../../../shared/swagger';
import { OrganizationQuery } from '../../state/organization.query';
import { OrganizationService } from '../../state/organization.service';
import { UpdateOrganizationDescriptionStore } from './update-organization-description.store';

@Injectable({ providedIn: 'root' })
export class UpdateOrganizationDescriptionService {

  constructor(private updateOrganizationDescriptionStore: UpdateOrganizationDescriptionStore,
    private http: HttpClient, private formBuilder: FormBuilder, private organizationsService: OrganizationsService,
    private organizationQuery: OrganizationQuery, private organizationService: OrganizationService, private matDialog: MatDialog) {
  }

  createForm(data: any): FormGroup {
    const description = data.description;
    const form = this.formBuilder.group({
      description: [description, []],
    });
    return form;
  }

  updateOrganizationDescription(formGroup: FormGroup): void {
    const newDescription = formGroup.get('description').value || '';
    const organizationID = this.organizationQuery.getSnapshot().organization.id;
    this.updateOrganizationDescriptionStore.setError(false);
    this.updateOrganizationDescriptionStore.setLoading(true);
    this.organizationsService.updateOrganizationDescription(organizationID, newDescription)
      .pipe(finalize(() => this.updateOrganizationDescriptionStore.setLoading(false)))
      .subscribe((updatedOrganization: Organization) => {
        this.organizationService.updateOrganizationFromID(organizationID);
        this.matDialog.closeAll();
      }, error => {
        this.updateOrganizationDescriptionStore.setError(true);
      });
  }

}
