import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getFacetSearchResults',
})
/**
 * This pipe filters results in the facet according to the facet search text
 *
 * @param {Array<any>} items The items in a facet
 * @param {string} searchText The search text entered
 * @param {string} facet The facet the search applies to
 * @returns {Array<any>} The results that match the search
 * @memberof GetFacetSearchResultsPipe
 */
export class GetFacetSearchResultsPipe implements PipeTransform {
  transform(items: Array<any>, searchText: string, facet: string): any {
    if (!items || !searchText || facet !== 'author') {
      return items;
    }
    return items.filter((item) => item.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
  }
}
