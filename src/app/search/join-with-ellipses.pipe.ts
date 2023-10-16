import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'joinWithEllipses',
})
export class JoinWithEllipses implements PipeTransform {
  transform(highlights: any): string {
    if (!highlights) {
      return '';
    }
    return highlights.join('...');
  }
}
