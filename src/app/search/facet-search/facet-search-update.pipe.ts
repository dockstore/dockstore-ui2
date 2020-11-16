import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getFacetSearchUpdate',
})
/**
 * This pipe updates the number of hidden items in the facet when a search is completed
 *
 * @param {Array<any>} items The items in the facet
 * @param {string} searchText The search text entered
 * @returns {string} The numbers of hidden items in the facet
 * @memberof GetFacetSearchResultsPipe
 */
export class GetFacetSearchUpdatePipe implements PipeTransform {
  transform(unfilteredItems: Array<any>, searchText: string): string | null {
    let hiddenFilteredSize;
    const value = searchText.toLowerCase();
    const itemsDisplayed = 5;
    if (!searchText && unfilteredItems.length > itemsDisplayed) {
      hiddenFilteredSize = unfilteredItems.length - itemsDisplayed;
      return hiddenFilteredSize.toString() + ' more';
    }
    const filteredSize = unfilteredItems.filter((item) => item.toLowerCase().includes(value)).length;
    if (filteredSize < 5) {
      return null;
    }
    hiddenFilteredSize = filteredSize - itemsDisplayed;
    return hiddenFilteredSize.toString() + ' more';
  }
}
