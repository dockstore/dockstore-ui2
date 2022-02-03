import { Injectable } from '@angular/core';

@Injectable()
export class OrgLogoService {
  // default org logo image URL, including enough parent directory references to ensure that '/assets' is always relative to the root
  readonly DEFAULT_URL = '../../../../assets/images/dockstore/default-org-logo.svg';
}
