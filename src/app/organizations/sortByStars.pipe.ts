import { Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'sortByStars'
})

export class SortByStarsPipe implements PipeTransform {
  transform(value: any, ...args): any {
    return 1;
  }
}
