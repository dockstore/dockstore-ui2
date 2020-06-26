import { Pipe, PipeTransform } from '@angular/core';
import { Version, VersionVerifiedPlatform } from '../openapi';

@Pipe({
  name: 'verifiedPlatforms'
})
export class VerifiedPlatformsPipe implements PipeTransform {
  transform(version: Version, versionVerifiedPlatform: Array<VersionVerifiedPlatform>): string {
    const platforms = new Set<string>();
    if (versionVerifiedPlatform) {
      versionVerifiedPlatform.forEach(value => {
        if (value.versionId === version.id) {
          platforms.add(value.source);
        }
      });
    }
    return Array.from(platforms).join(', ');
  }
}
