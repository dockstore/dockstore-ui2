import { Injectable } from '@angular/core';

import { SourceFile, Tag, WorkflowVersion } from './swagger';

@Injectable({
  providedIn: 'root'
})
export class VerifiedByService {

  constructor() { }

  /**
   * This converts the verified source in a version's sourcefiles into a an array of strings
   * to be display in the right sidebar of an entry component
   *
   * @param {((WorkflowVersion | Tag))} version  The versions of an entry
   * @returns {Array<string>}                    An array of strings to be displayed seperated by newlines
   * @memberof VerifiedByService
   */
  getVerifiedByString(version: (WorkflowVersion | Tag)): Array<string> {
    const verifiedSourceMap = new Map<string, Set<string>>();
    if (version && version.sourceFiles) {
      version.sourceFiles.forEach(sourceFile => {
        const verifiedBySource = sourceFile.verifiedBySource;
        if (verifiedBySource) {
          const verifiedBySourceArray = Object.entries(verifiedBySource);
          verifiedBySourceArray.forEach(arrayElement => {
            const platform: string = arrayElement[0];
            if (!verifiedSourceMap[platform]) {
              verifiedSourceMap[platform] = new Set<string>();
            }
            verifiedSourceMap[platform].add(arrayElement[1].metadata);
          });
        }
      });
      const verifiedSourceArray = Object.entries(verifiedSourceMap);
      const verifiedByStringArray: Array<string> = [];
      verifiedSourceArray.forEach(arrayElement => {
        const verifiers: Set<string> = arrayElement[1];
        const arrayOfVerifiers = Array.from(verifiers);
        verifiedByStringArray.push(arrayElement[0] + ' via ' + arrayOfVerifiers.join(', '));
      });
      return verifiedByStringArray;
    } else {
      return null;
    }
  }
}


