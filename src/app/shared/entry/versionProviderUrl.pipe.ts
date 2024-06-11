import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'versionProviderUrl',
  standalone: true,
})
export class VersionProviderUrlPipe implements PipeTransform {
  transform(providerUrl: string, versionName: string): any {
    if (providerUrl.includes('github.com') && versionName) {
      return providerUrl + '/tree/' + versionName;
    } else {
      return providerUrl;
    }
  }
}
