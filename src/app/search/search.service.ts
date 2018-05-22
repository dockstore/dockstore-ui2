/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { URLSearchParams} from '@angular/http';
import { Dockstore } from '../shared/dockstore.model';
import { SubBucket } from '../shared/models/SubBucket';

@Injectable()
export class SearchService {
  private searchInfoSource = new BehaviorSubject<any>(null);
  public toSaveSearch$ = new BehaviorSubject<boolean>(false);
  public values$ = new BehaviorSubject<string>('');
  public searchTerm$ = new BehaviorSubject<boolean>(false);
  public tagClicked$ = new BehaviorSubject<boolean>(false);
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
  public exclusiveFilters = ['tags.verified', 'private_access', '_type'];
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


  haveNoHits(object: Object[]): boolean {
    if (!object || object.length === 0) {
      return true;
    } else {
      return false;
    }
  }
  // Given a search info object, will create the permalink for the current search
  createPermalinks(searchInfo) {
    // For local testing, use LOCAL_URI, else use HOSTNAME
    const url = `${ Dockstore.HOSTNAME }/search`;
    const params = new URLSearchParams();
    const filter = searchInfo.filter;
    filter.forEach(
      (value, key) => {
        value.forEach(subBucket => {
          params.append(key, subBucket);
        });
      }
    );

    if (searchInfo.searchTerm && (!searchInfo.advancedSearchObject || !searchInfo.advancedSearchObject.toAdvanceSearch)) {
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
    return [url, params.toString()];
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

  parseOrderBy(key, sortModeMap): any {
    let order: any;
    if (sortModeMap.has(key)) {
      switch (sortModeMap.get(key).SortBy) {
        case true: {
          order = {
            _count: sortModeMap.get(key).CountOrderBy ? 'asc' : 'desc'
          };
          break;
        }
        case false: {
          order = {
            _term: sortModeMap.get(key).AlphabetOrderBy ? 'asc' : 'desc'
          };
          break;
        }
        default: {
          order = {
            _count: 'desc'
          };
          break;
        }
      }
    } else {
      order = {
        _count: 'desc'
      };
    }
    return order;
  }

  /**
   * This handles selection of one filter, either taking it out from the list of active filters
   * or adding it if not present
   * @param category
   * @param categoryValue
   * @param filter
   */
  handleFilters(category: string, categoryValue: string, filters: any) {
    if (typeof(categoryValue) === 'number') {
      categoryValue = String(categoryValue);
    }
    if (filters.has(category) && filters.get(category).has(categoryValue)) {
      filters.get(category).delete(categoryValue);
      // wipe out the category if empty
      if (filters.get(category).size === 0) {
        filters.delete(category);
      }
    } else {
      if (!filters.has(category)) {
        filters.set(category, new Set<string>());
      }
      filters.get(category).add(categoryValue);
    }
    return filters;
  }

  sortCategoryValue(valueMap: any, sortMode: boolean, orderMode: boolean): any {
    let orderedArray = <any>[];
    valueMap.forEach(
      (value, key) => {
        orderedArray.push(
          {
            key: key,
            value: value
          });
      });
    if (!sortMode) {
      orderedArray = this.sortByAlphabet(orderedArray, orderMode);
    } else {
      orderedArray = this.sortByCount(orderedArray, orderMode);
    }
    const tempMap: Map<string, string> = new Map<string, string>();
    orderedArray.forEach(
      entry => {
        tempMap.set(entry.key, entry.value);
      });
    return tempMap;
  }

  // Initialization Functions
  initializeCommonBucketStubs() {
    return new Map([
      ['Entry Type', '_type'],
      ['Language', 'descriptorType'],
      ['Registry', 'registry'],
      ['Private Access', 'private_access'],
      ['VerifiedTool', 'tags.verified'],
      ['Author', 'author'],
      ['Namespace', 'namespace'],
      ['Labels', 'labels.value.keyword'],
      ['VerifiedSourceTool', 'tags.verifiedSource'],
      ['VerifiedSourceWorkflow', 'workflowVersions.verifiedSource.keyword'],
      ['Organization', 'organization']
    ]);
  }

  initializeFriendlyNames() {
    return new Map([
      ['_type', 'Entry Type'],
      ['descriptorType', 'Language'],
      ['registry', 'Registry'],
      ['private_access', 'Tool: Private Access'], // Workflow has no counterpart
      ['tags.verified', 'Verified'],
      ['author', 'Author'],
      ['namespace', 'Tool: Namespace'],
      ['labels.value.keyword', 'Labels'],
      ['tags.verifiedSource', 'Tool: Verified Source'],
      ['workflowVersions.verifiedSource.keyword', 'Workflow: Verified Source'],
      ['organization', 'Workflow: Organization']
    ]);
  }

  initializeEntryOrder() {
    return new Map([
      ['_type', new SubBucket],
      ['descriptorType', new SubBucket],
      ['author', new SubBucket],
      ['registry', new SubBucket],
      ['namespace', new SubBucket],
      ['organization', new SubBucket],
      ['labels.value.keyword', new SubBucket],
      ['private_access', new SubBucket],
      ['tags.verified', new SubBucket],
      ['tags.verifiedSource', new SubBucket],
      ['workflowVersions.verifiedSource.keyword', new SubBucket]
    ]);
  }

  initializeFriendlyValueNames() {
    return new Map([
     ['workflowVersions.verified', new Map([
       ['1', 'verified'], ['0', 'non-verified']
     ])],
     ['tags.verified', new Map([
      ['1', 'verified'], ['0', 'non-verified']
    ])],
     ['private_access', new Map([
       ['1', 'private'], ['0', 'public']
     ])],
     ['registry', new Map([
       ['QUAY_IO', 'Quay.io'], ['DOCKER_HUB', 'Docker Hub'], ['GITLAB', 'GitLab'],
       ['AMAZON_ECR', 'Amazon ECR'], ['SEVEN_BRIDGES', 'Seven Bridges']
     ])]
   ]);
  }

  // Functions called from HTML
  /**
  * Returns true if either basic search is set and has results, or advanced search is set
  * (though not just the searchMode, which is set by default)
  */
  hasSearchText(advancedSearchObject: any, searchTerm: boolean, hits: any) {
    let advSearchSet;
    if (!advancedSearchObject) {
      advSearchSet = false;
    } else {
      advSearchSet = ((advancedSearchObject.toAdvanceSearch) &&
        (advancedSearchObject.ANDSplitFilter || advancedSearchObject.ANDNoSplitFilter
          || advancedSearchObject.ORFilter || advancedSearchObject.NOTFilter));
    }
    return (this.hasResults(searchTerm, hits) || advSearchSet);
  }

  /**
  * Returns true if basic search has no results
  */
  noResults(searchTerm: boolean, hits: any) {
    return searchTerm && hits && hits.length === 0;
  }

  /**
  * Returns true if basic search has results
  */
  hasResults(searchTerm: boolean, hits: any) {
    return searchTerm && hits && hits.length > 0;
  }

  /**
  * Returns true if at least one filter is set
  */
  hasFilters(filters: any) {
    let count = 0;
      filters.forEach(filter => {
        count += filter.size;
      });
      return count > 0;
  }

  /**
  * Returns true if any search filters have been applied, false otherwise
  */
  hasNarrowedSearch(advancedSearchObject: any, searchTerm: boolean, hits: any, filters: any) {
    return this.hasSearchText(advancedSearchObject, searchTerm, hits) || this.hasFilters(filters);
  }

  joinComma(searchTerm: string): string {
    return searchTerm.trim().split(' ').join(', ');
  }

  mapFriendlyValueNames(key: any, subBucket: any, friendlyValueNames: any) {
    if (friendlyValueNames.has(key)) {
      return friendlyValueNames.get(key).get(subBucket.toString());
    } else {
      return subBucket;
    }
  }

}
