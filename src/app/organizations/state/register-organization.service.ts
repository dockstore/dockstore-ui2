import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AkitaNgFormsManager } from '@datorama/akita-ng-forms-manager';

import { AlertService } from '../../shared/alert/state/alert.service';
import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';
import { Organization, OrganizationsService } from '../../shared/swagger';
import { OrganizationService } from './organization.service';

// This is recorded into the Akita state
export interface FormsState {
  registerOrganization: {
    name: string;
    displayName: string;
    topic: string;
    link: string;
    location: string;
    contactEmail: string;
    avatarUrl: string;
  };
}

/**
 * This handles CU operations for organizations.
 * It does not uses the standard Akita store (using Akita forms manager instead) but it should've used both
 *
 * @export
 * @class RegisterOrganizationService
 */
@Injectable({ providedIn: 'root' })
export class RegisterOrganizationService {
  // Regex found from https://gist.github.com/dperini/729294 which validator.js uses except using a more simple version and enforce http(s)
  readonly urlRegex = new RegExp(
    '^' +
      // protocol identifier (optional) + //
      '(?:(?:https?:)?//)' +
      // user:pass authentication (optional)
      '(?:\\S+(?::\\S*)?@)?' +
      // host (optional) + domain + tld
      '(?:(?!-)[-a-z0-9\\u00a1-\\uffff]*[a-z0-9\\u00a1-\\uffff]+(?!./|\\.$)\\.?){2,}' +
      // server port number (optional)
      '(?::\\d{2,5})?' +
      // resource path (optional)
      '(?:/\\S*)?' +
      '$',
    'i'
  );
  // The old regex in case needed
  // readonly urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
  readonly organizationNameRegex = /^[a-zA-Z][a-zA-Z\d]*$/;
  readonly organizationDisplayNameRegex = /^[a-zA-Z\d ,_\-&()']*$/;

  readonly logoUrlRegex = new RegExp('^' + '([^\\s]+)(.jpg|.jpeg|.png|.gif)$', 'i');

  constructor(
    private organizationsService: OrganizationsService,
    private alertService: AlertService,
    private matDialog: MatDialog,
    private router: Router,
    private organizationService: OrganizationService,
    private builder: FormBuilder
  ) {}

  /**
   * Create or update organization based on mode
   *
   * @param {*} data
   * @param {FormGroup} form
   * @memberof RegisterOrganizationService
   */
  createOrUpdateOrganization(data: any, form: FormGroup) {
    if (data.mode === TagEditorMode.Add) {
      this.createOrganization(form.value);
    } else {
      this.updateOrganization(form.value, data.organization.id, data.organization.description);
    }
  }

  /**
   * Creates the organization (create and update) form based on the mode given
   *
   * @param {AkitaNgFormsManager<FormsState>} formsManager
   * @param {*} data
   * @returns {FormGroup}
   * @memberof RegisterOrganizationService
   */
  createForm(formsManager: AkitaNgFormsManager<FormsState>, data: any): FormGroup {
    formsManager.remove('registerOrganization');
    let name = null;
    let displayName = null;
    let topic = null;
    let link = null;
    let location = null;
    let contactEmail = null;
    let avatarUrl = null;
    if (data.mode !== TagEditorMode.Add) {
      const organization: Organization = data.organization;
      name = organization.name;
      displayName = organization.displayName;
      topic = organization.topic;
      link = organization.link;
      location = organization.location;
      contactEmail = organization.email;
      avatarUrl = organization.avatarUrl;
    }
    const registerOrganizationForm = this.builder.group({
      name: [
        name,
        [Validators.required, Validators.maxLength(39), Validators.minLength(3), Validators.pattern(this.organizationNameRegex)]
      ],
      displayName: [
        displayName,
        [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern(this.organizationDisplayNameRegex)]
      ],
      topic: [topic, Validators.required],
      link: [link, Validators.pattern(this.urlRegex)],
      location: [location],
      contactEmail: [contactEmail, [Validators.email]],
      avatarUrl: [avatarUrl, Validators.pattern(this.logoUrlRegex)]
    });
    formsManager.upsert('registerOrganization', registerOrganizationForm);
    return registerOrganizationForm;
  }

  /**
   * Get the title based on the mode
   *
   * @param {*} data
   * @returns {string}
   * @memberof RegisterOrganizationService
   */
  getTitle(data: any): string {
    const mode: TagEditorMode = data.mode;
    return mode === TagEditorMode.Add ? 'Create Organization Request' : 'Update Organization';
  }

  /**
   * Add not yet approved organization to Dockstore
   *
   * @param {FormsState['organization']} organizationFormState  The organization form state
   * @memberof RegisterOrganizationService
   */
  createOrganization(organizationFormState: FormsState['registerOrganization']): void {
    if (!organizationFormState) {
      console.error('Something has gone terribly wrong with the form manager');
      return;
    } else {
      let newOrganization: Organization;
      newOrganization = {
        name: organizationFormState.name,
        displayName: organizationFormState.displayName,
        topic: organizationFormState.topic,
        link: organizationFormState.link,
        location: organizationFormState.location,
        email: organizationFormState.contactEmail,
        status: Organization.StatusEnum.PENDING,
        avatarUrl: organizationFormState.avatarUrl || null,
        users: []
      };
      this.alertService.start('Adding organization');
      this.organizationsService.createOrganization(newOrganization).subscribe(
        (organization: Organization) => {
          this.matDialog.closeAll();
          if (organization) {
            this.router.navigate(['/organizations', organization.name]);
            this.alertService.simpleSuccess();
          } else {
            console.error('No idea how it would successfully return no organization');
            this.alertService.simpleError();
          }
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
        }
      );
    }
  }

  /**
   * Update the organization
   * TODO: change URL when the organization name changes
   *
   * @param {FormsState['registerOrganization']} organizationFormState
   * @param {number} organizationId
   * @returns {void}
   * @memberof RegisterOrganizationService
   */
  updateOrganization(
    organizationFormState: FormsState['registerOrganization'],
    organizationId: number,
    organizationDescription: string
  ): void {
    if (!organizationFormState) {
      console.error('Something has gone terribly wrong with the form manager');
      return;
    } else {
      const editedOrganization: Organization = {
        name: organizationFormState.name,
        displayName: organizationFormState.displayName,
        topic: organizationFormState.topic,
        link: organizationFormState.link,
        location: organizationFormState.location,
        email: organizationFormState.contactEmail,
        status: Organization.StatusEnum.PENDING,
        avatarUrl: organizationFormState.avatarUrl || null,
        description: organizationDescription,
        users: []
      };
      this.alertService.start('Updating organization');
      this.organizationsService.updateOrganization(organizationId, editedOrganization).subscribe(
        (organization: Organization) => {
          this.matDialog.closeAll();
          if (organization) {
            this.alertService.detailedSuccess();
            // Watch out if this function is executed on Dockstore UI where it's not /organizations/{organizationId}
            this.router.navigate(['/organizations', editedOrganization.name]);
            this.organizationService.updateOrganizationFromID(organizationId);
          } else {
            console.error('No idea how it would successfully return no organization');
            this.alertService.simpleError();
          }
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
        }
      );
    }
  }
}
