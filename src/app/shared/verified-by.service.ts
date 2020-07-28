import { Injectable } from '@angular/core';
import { VersionVerifiedPlatform } from './openapi';
import { SourceFile, Tag, WorkflowVersion } from './swagger';

@Injectable({
  providedIn: 'root'
})
export class VerifiedByService {
  constructor() {}

  /**
   * This converts the verified source in a version's sourcefiles into a an array of strings
   * to be display in the right sidebar of an entry component
   *
   * @param {Array<SourceFile>} sourceFiles  The sourcesfiles of an entry's version
   * @returns {Array<string>}                    An array of strings to be displayed seperated by newlines
   * @memberof VerifiedByService
   */

  getVerifiedByString(verifiedSources: Array<VersionVerifiedPlatform>, versionid: number): Array<string> {
    const verifiedSourceMap = new Map<string, Set<string>>();
    if (versionid && verifiedSources) {
      verifiedSources
        .filter((vs: VersionVerifiedPlatform) => vs.versionId === versionid)
        .forEach(vs => {
          if (vs.verified) {
            const platform: string = vs.source;
            const platformVersion: string = vs.platformVersion;
            if (!verifiedSourceMap[platform]) {
              verifiedSourceMap[platform] = new Set<string>();
            }
            if (platformVersion) {
              verifiedSourceMap[platform].add(platformVersion);
            }
          }
        });
      const verifiedSourceArray = Object.entries(verifiedSourceMap);
      const verifiedByStringArray: Array<string> = [];
      verifiedSourceArray.forEach(arrayElement => {
        const platformVersions: Set<string> = arrayElement[1];
        const arrayOfPlatformVersions = Array.from(platformVersions);
        verifiedByStringArray.push(arrayElement[0] + ' ' + arrayOfPlatformVersions.join(', '));
      });
      return verifiedByStringArray;
    } else {
      return [];
    }
  }
}
