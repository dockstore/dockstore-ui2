import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'versionProviderUrl'
})
export class VersionProviderUrlPipe implements PipeTransform {

  transform(providerUrl: string, versionName: string): any {
    console.log(providerUrl);
    console.log(versionName);
    if (providerUrl.includes('github.com') && versionName) {
      return providerUrl + '/tree/' + versionName;
    } else {
      return providerUrl;
    }
  }
}
