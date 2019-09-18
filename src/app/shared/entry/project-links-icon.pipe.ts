import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'projectIcon'
})
export class ProjectLinksIconPipe implements PipeTransform {
  transform(providerUrl: string): string {
    if (providerUrl.startsWith('https://github.com/')) {
      return 'fa fa-github';
    } else if (providerUrl.startsWith('http://bitbucket.org/')) {
      return 'fa fa-bitbucket';
    } else {
      return null;
    }
  }
}
