import { Injectable } from '@angular/core';
import { WorkflowVersion, Tag, VerificationInformation } from './swagger';

@Injectable({
  providedIn: 'root'
})
export class VerifiedByService {

  constructor() { }

  getVerifiedByString(version: (WorkflowVersion | Tag)): Array<string> {
    const verifiedSourceArray = new Map<string, Set<string>>();
    if (version && version.sourceFiles) {
      version.sourceFiles.forEach(sourceFile => {
        const verifiedBySource = sourceFile.verifiedBySource;
        if (verifiedBySource) {
          const array = Object.entries(verifiedBySource);
          array.forEach(arrayElement => {
            const platform: string = arrayElement[0];
            if (!verifiedSourceArray[platform]) {
              verifiedSourceArray[platform] = new Set<string>();
            }
            verifiedSourceArray[platform].add(arrayElement[1].metadata);
            console.log(typeof(verifiedSourceArray[platform]));
          });
        }
      });
      const array2 = Object.entries(verifiedSourceArray);
      const verifiedByStringArray: Array<string> = [];
      array2.forEach(arrayElement => {
        const thing: Set<string> = arrayElement[1];
        const arrayOfVerifiers = Array.from(thing);
        verifiedByStringArray.push(arrayElement[0] + ' via ' + arrayOfVerifiers.join(', '));
      });
      return verifiedByStringArray;
    } else {
      return null;
    }
  }

}


