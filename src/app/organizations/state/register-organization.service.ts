import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { AlertService } from '../../shared/alert/state/alert.service';
import { Organisation, OrganisationsService } from '../../shared/swagger';
import { FormsState } from '../registerOrganization/register-organization.component';

@Injectable({ providedIn: 'root' })
export class RegisterOrganizationService {

  // Regex found from https://gist.github.com/dperini/729294 which validator.js uses
  // tslint:disable-next-line:max-line-length
  // readonly urlRegex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  readonly urlRegex = new RegExp(
    '^' +
        // protocol identifier (optional) + //
        '(?:(?:https?:)?//)?' +
        // user:pass authentication (optional)
        '(?:\\S+(?::\\S*)?@)?' +
        // host (optional) + domain + tld
        '(?:(?!-)[-a-z0-9\\u00a1-\\uffff]*[a-z0-9\\u00a1-\\uffff]+(?!./|\\.$)\\.?){2,}' +
        // server port number (optional)
        '(?::\\d{2,5})?' +
        // resource path (optional)
        '(?:/\\S*)?' +
    '$', 'i'
);
  // readonly urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
  readonly organizationNameRegex = /^[a-zA-Z][a-zA-Z\d]*$/;
  constructor(private organisationsService: OrganisationsService, private alertService: AlertService, private matDialog: MatDialog,
    private router: Router) {
  }

  /**
   * Add not yet approved organization to Dockstore
   *
   * @param {FormsState['organization']} organizationFormState  The organization form state
   * @memberof RegisterOrganizationService
   */
  addOrganization(organizationFormState: FormsState['registerOrganization']): void {
    if (!organizationFormState) {
      console.error('Something has gone terribly wrong with the form manager');
      return;
    } else {
      let newOrganization: Organisation;
      newOrganization = {
        name: organizationFormState.name,
        description: organizationFormState.description,
        link: organizationFormState.link,
        location: organizationFormState.location,
        email: organizationFormState.contactEmail,
        // Setting approved to true to appease compiler.  Webservice should completely ignore this.
        approved: true
      };
      this.alertService.start('Adding organization');
      this.organisationsService.createOrganisation(newOrganization).subscribe((organization: Organisation) => {
        this.matDialog.closeAll();
        if (organization) {
          this.router.navigate(['/organizations', organization.name]);
          this.alertService.simpleSuccess();
        } else {
          console.error('No idea how it would successfully return no organization');
          this.alertService.simpleError();
        }
      }, (error: HttpErrorResponse) => {
        this.alertService.detailedError(error);
      });
    }
  }
}
