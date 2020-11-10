import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getFacetSearchUpdate',
})
/**
 * This pipe filters results in the facet according to the facet search text
 *
 * @param {Array<any>} items The items in the facet
 * @param {string} searchText The search text entered
 * @returns {string} The numbers of hidden items in the facet
 * @memberof GetFacetSearchResultsPipe
 */
export class GetFacetSearchUpdatePipe implements PipeTransform {
  transform(unfilteredItems: Array<any>, searchText: string): string {
    let hiddenFilteredSize;
    if (!searchText && unfilteredItems.length > 5) {
      hiddenFilteredSize = unfilteredItems.length - 5;
      return hiddenFilteredSize.toString() + ' more';
    }
    const filteredSize = unfilteredItems.filter((item) => item.toLowerCase().includes(searchText)).length;
    if (filteredSize < 5) {
      return null;
    }
    hiddenFilteredSize = filteredSize - 5;
    return hiddenFilteredSize.toString() + ' more';
  }
}
