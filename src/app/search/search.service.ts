import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { URLSearchParams} from '@angular/http';
import { Dockstore } from '../shared/dockstore.model';

@Injectable()
export class SearchService {
  private searchInfoSource = new BehaviorSubject<any>(null);
  searchInfo$ = this.searchInfoSource.asObservable();
  /* Observable */
  public toolhit$ = new BehaviorSubject<any>(null);

  /* Observable */
  public workflowhit$ = new BehaviorSubject<any>(null);
  /**
   * These are the terms which use "must" filters
   * Example: Results returned can be private or public but never both
   * @private
   * @memberof SearchService
   */
  public exclusiveFilters = ['tags.verified', 'private_access'];
  setSearchInfo(searchInfo) {
    this.searchInfoSource.next(searchInfo);
  }
  constructor() {
  }
  /**
   * By default, bodybuilder will create a aggregation name called agg_<aggregationType>_<fieldToAggregate>
   * This converts it to just <fieldToAggregate>
   * @param {string} aggregationName the default aggregation name
   * @returns {string} the fieldToAggregate
   * @memberof SearchService
   */
  aggregationNameToTerm(aggregationName: string): string {
    return aggregationName.replace('agg_terms_', '');
  }

  createPermalinks(searchInfo) {
    const url = `${ Dockstore.LOCAL_URI }/search`;
    const params = new URLSearchParams();
    const filter = searchInfo.filter;
    filter.forEach(
      (value, key) => {
        value.forEach(subBucket => {
          params.append(key, subBucket);
        });
      }
    );

    if (searchInfo.searchTerm && !searchInfo.advancedSearchObject.toAdvanceSearch) {
      params.append('search', searchInfo.searchValues);
    } else {
      const advSearchKeys = Object.keys(searchInfo.advancedSearchObject);
      for (let index = 0; index < advSearchKeys.length; index++) {
        const key = advSearchKeys[index];
        const val = searchInfo.advancedSearchObject[key];
        if ((key.includes('Filter') || key === 'searchMode') && val !== '') {
          params.append(key, val);
        }
      }
    }
    return url + '?' + params.toString();
  }

  createURIParams(cururl) {
    const url = cururl.substr('/search'.length + 1);
    const params = new URLSearchParams(url);
    return params;
  }

  sortByAlphabet(orderedArray, orderMode): any {
    orderedArray = orderedArray.sort((a, b) => {
      if (orderMode) {
        return a.key > b.key ? 1 : -1;
      } else  {
        return a.key < b.key ? 1 : -1;
      }
    });
    return orderedArray;
  }

  sortByCount(orderedArray, orderMode): any {
    orderedArray = orderedArray.sort((a, b) => {
      if (a.value < b.value) {
        return !orderMode ? 1 : -1;
      } else if (a.value === b.value) {
        return a.key > b.key ? 1 : -1;
      } else {
        return !orderMode ? -1 : 1;
      }
    });
    return orderedArray;
  }
}
