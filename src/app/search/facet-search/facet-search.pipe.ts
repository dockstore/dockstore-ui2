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
  transform(items: Array<any>, searchText: string, facet: string): Array<any> {
    if (
      !items ||
      !searchText ||
      (facet !== 'author' &&
        facet !== 'organization' &&
        facet !== 'labels.value.keyword' &&
        facet !== 'namespace' &&
        facet !== 'categories.name.keyword')
    ) {
      return items;
    }
    const value = searchText.toLowerCase();
    const filteredItems = items.filter((item) => item.toLowerCase().includes(value));
    return filteredItems;
  }
}
