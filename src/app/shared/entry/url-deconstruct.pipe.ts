import { Pipe, PipeTransform } from '@angular/core';

@ Pipe({
  name: 'urlDeconstruct'
})
export class UrlDeconstructPipe implements PipeTransform {

  transform(providerUrl: string, versionName: string): any {
    if (providerUrl.includes('github.com') && versionName !== '') {
      return (new URL(providerUrl).pathname).substr(1) + '/tree/' + versionName;
    }
    if (providerUrl.includes('bitbucket.org') && versionName !== '') {
      return (new URL(providerUrl).pathname).substr(1) + '/src/' + versionName;
    }
    return (new URL(providerUrl).pathname).substr(1);
  }
}
