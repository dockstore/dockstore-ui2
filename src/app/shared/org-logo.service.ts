import { Injectable } from '@angular/core';

@Injectable()
export class OrgLogoService {
  setDefault(img: any) {
    // Check/set a flag to ensure the default logo is set only once, to avoid an infinite load loop if the default org image is not loadable
    // IMPORTANT: BEFORE YOU CHANGE THE BELOW CODE, MAKE SURE YOU COMPLETELY UNDERSTAND IT!
    if (!img.changed) {
      img.changed = true;
      // Set the default org image, including enough parent directory references to ensure that '/assets' is always relative to the root
      img.src = '../../../../assets/images/dockstore/default-org-logo.svg';
    }
  }
}
