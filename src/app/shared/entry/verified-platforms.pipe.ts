import { Pipe, PipeTransform } from '@angular/core';

import { SourceFile } from '../swagger';

@Pipe({
  name: 'verifiedPlatforms'
})
export class VerifiedPlatformsPipe implements PipeTransform {

  transform(sourcefiles: SourceFile[]): string {
    const platforms = new Set<string>();
    sourcefiles.forEach(sourcefile => {
      Object.keys(sourcefile.verifiedBySource).forEach(platform => {
        platforms.add(platform);
      });
    });
    return Array.from(platforms).join(', ');
  }

}
