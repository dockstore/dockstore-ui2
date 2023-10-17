import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'joinWithEllipses',
})
export class JoinWithEllipses implements PipeTransform {
  transform(fragments: any): string {
    if (!fragments || !Array.isArray(fragments)) {
      return '';
    }
    return fragments.join('...');
  }
}
