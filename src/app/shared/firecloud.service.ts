import { Injectable } from '@angular/core';
import { Dockstore } from './dockstore.model';

@Injectable()
export class FireCloudService {

  private importRegEx: RegExp = new RegExp(/^\s*import\b/, 'm');

  constructor() { }

  /**
   * Simple test to see if wdl has any import statements.
   *
   * Look for any statement starting with the word `import` as the first non-blank characters at the beginning
   * of any line.
   *
   * @param {string} wdl
   * @returns {boolean}
   */
  wdlHasImports(wdl: string): boolean {
    if (wdl && wdl.length) {
      return this.importRegEx.test(wdl);
    }
    return false;
  }

  redirectUrl(path: string, version: string) {
    return `${Dockstore.FIRECLOUD_IMPORT_URL}/${path}:${version}`;
  }

}
