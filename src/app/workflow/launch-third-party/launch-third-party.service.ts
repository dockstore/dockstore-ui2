import { Injectable } from '@angular/core';

@Injectable()
export class LaunchThirdPartyService {

  private importRegEx: RegExp = new RegExp(/^\s*import\s+"https?/, 'm');

  constructor() { }

  /**
   * Simple test to see if wdl has any Http(s) import statements.
   *
   * Look for any statement starting with the word `import` as the first non-blank characters at the beginning
   * of any line.
   *
   * @param {string} wdl
   * @returns {boolean}
   */
  wdlHasHttpImports(wdl: string): boolean {
    if (wdl && wdl.length) {
      return this.importRegEx.test(wdl);
    }
    return false;
  }

}
