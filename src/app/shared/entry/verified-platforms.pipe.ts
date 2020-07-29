import { Pipe, PipeTransform } from '@angular/core';
import { VersionVerifiedPlatform } from '../openapi';

@Pipe({
  name: 'verifiedPlatforms'
})
export class VerifiedPlatformsPipe implements PipeTransform {
  transform(versionid: number, versionVerifiedPlatform: Array<VersionVerifiedPlatform>): string {
    const platforms = new Set<string>();
    if (versionVerifiedPlatform && versionid) {
      versionVerifiedPlatform.forEach(value => {
        if (value.versionId === versionid) {
          platforms.add(value.source);
        }
      });
    }
    return Array.from(platforms).join(', ');
  }
}
