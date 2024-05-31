import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'joinWithEllipses',
  standalone: true,
})
export class JoinWithEllipsesPipe implements PipeTransform {
  transform(fragments: any): string {
    if (!fragments || !Array.isArray(fragments)) {
      return '';
    }
    return fragments.join('...');
  }
}
