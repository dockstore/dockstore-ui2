import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commitUrl'
})
export class CommitUrlPipe implements PipeTransform {

  transform(commitId: string, providerUrl: string): string {
    if (providerUrl.startsWith('https://github.com/')) {
      return providerUrl + '/tree/' + commitId;
    } else {
      if (providerUrl.startsWith('http://bitbucket.org/')) {
        return providerUrl + 'src/' + commitId;
      } else {
        return null;
      }
    }
  }
}
