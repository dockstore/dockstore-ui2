/*
 *    Copyright 2018 OICR
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
import { URLSearchParams } from '@angular/http';
import { Router } from '@angular/router/';
import { BehaviorSubject } from 'rxjs';
import { Dockstore } from '../../shared/dockstore.model';
import { SubBucket } from '../../shared/models/SubBucket';
import { ProviderService } from '../../shared/provider.service';
import { ELASTIC_SEARCH_CLIENT } from '../elastic-search-client';
import { SearchQuery } from './search.query';
import { SearchStore } from './search.store';
import { ImageProviderService } from '../../shared/image-provider.service';

@Injectable()
export class SearchService {
  private searchInfoSource = new BehaviorSubject<any>(null);
  public toSaveSearch$ = new BehaviorSubject<boolean>(false);
  public searchTerm$ = new BehaviorSubject<boolean>(false);
  public tagClicked$ = new BehaviorSubject<boolean>(false);
  searchInfo$ = this.searchInfoSource.asObservable();

  /**
   * These are the terms which use "must" filters
   * Example: Results returned can be private or public but never both
   * @private
   * @memberof SearchService
   */
  public exclusiveFilters = ['verified', 'private_access', '_type', 'has_checker'];

  constructor(
    private searchStore: SearchStore,
    private searchQuery: SearchQuery,
    private providerService: ProviderService,
    private router: Router,
    private imageProviderService: ImageProviderService
  ) {}

  // Given a URL, will attempt to shorten it
  // TODO: Find another method for shortening URLs
  setShortUrl(url: string) {
    this.searchStore.setState(state => {
      return {
        ...state,
        shortUrl: url
      };
    });
  }

  setPageSize(pageSize: number) {
    this.searchStore.setState(state => {
      return {
        ...state,
        pageSize: pageSize
      };
    });
  }

  setSearchText(text: string) {
    this.searchStore.setState(state => {
      return {
        ...state,
        searchText: text
      };
    });
  }

  searchSuggestTerm() {
    const suggestTerm = this.searchQuery.getSnapshot().suggestTerm;
    this.setSearchText(suggestTerm);
  }

  setShowTagCloud(entryType: 'tool' | 'workflow') {
    if (entryType === 'tool') {
      const showTagCloud: boolean = this.searchQuery.getSnapshot().showToolTagCloud;
      this.searchStore.setState(state => {
        return {
          ...state,
          showToolTagCloud: !showTagCloud
        };
      });
    } else {
      const showTagCloud: boolean = this.searchQuery.getSnapshot().showWorkflowTagCloud;
      this.searchStore.setState(state => {
        return {
          ...state,
          showWorkflowTagCloud: !showTagCloud
        };
      });
    }
  }

  /**
   * Seperates the 'hits' object into 'toolHits' and 'workflowHits'
   * Also sets up provider information
   * @param {Array<any>} hits
   * @param {number} query_size
   * @memberof SearchService
   */
  filterEntry(hits: Array<any>, query_size: number): [Array<any>, Array<any>] {
    const workflowHits = [];
    const toolHits = [];
    hits.forEach(hit => {
      hit['_source'] = this.providerService.setUpProvider(this.imageProviderService.setUpImageProvider(hit['_source']));
      if (workflowHits.length + toolHits.length < query_size - 1) {
        if (hit['_type'] === 'tool') {
          toolHits.push(hit);
        } else if (hit['_type'] === 'workflow') {
          workflowHits.push(hit);
        }
      }
    });
    return [toolHits, workflowHits];
    //this.setHits(toolHits, workflowHits);
  }

  setHits(toolHit: any, workflowHit: any) {
    this.searchStore.setState(state => {
      return {
        ...state,
        toolhit: toolHit,
        workflowhit: workflowHit
      };
    });
  }

  setFilterKeys(filters: Map<string, Set<string>>) {
    this.searchStore.setState(state => {
      return {
        ...state,
        filterKeys: filters ? Array.from(filters.keys()) : []
      };
    });
  }

  suggestSearchTerm(searchText: string) {
    ELASTIC_SEARCH_CLIENT.search({
      index: 'tools',
      type: 'entry',
      body: {
        suggest: {
          do_you_mean: {
            text: searchText,
            term: {
              field: 'description'
            }
          }
        }
      }
    })
      .then(hits => {
        if (hits['suggest']['do_you_mean'][0].options.length > 0) {
          this.setSuggestTerm(hits['suggest']['do_you_mean'][0].options[0].text);
        } else {
          this.setSuggestTerm('');
        }
      })
      .catch(error => console.log(error));
  }

  setSuggestTerm(suggestTerm: string) {
    this.searchStore.setState(state => {
      return {
        ...state,
        suggestTerm: suggestTerm
      };
    });
  }

  setAutoCompleteTerms(hits: any) {
    let autocompleteTerms;
    try {
      autocompleteTerms = hits.aggregations.autocomplete.buckets.map(term => term.key);
    } catch (error) {
      console.error('Could not retrieve autocomplete terms');
      autocompleteTerms = [];
    }
    this.searchStore.setState(state => {
      return {
        ...state,
        autocompleteTerms: autocompleteTerms
      };
    });
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

  setSearchInfo(searchInfo) {
    this.searchInfoSource.next(searchInfo);
  }

  // Given a search info object, will create the permalink for the current search
  createPermalinks(searchInfo) {
    // For local testing, use LOCAL_URI, else use HOSTNAME
    const url = `${Dockstore.HOSTNAME}/search`;
    const params = new URLSearchParams();
    const filter = searchInfo.filter;
    filter.forEach((value, key) => {
      value.forEach(subBucket => {
        params.append(key, subBucket);
      });
    });

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

  handleLink(linkArray: Array<string>) {
    this.router.navigateByUrl('search?' + linkArray[1]);
    this.setShortUrl(linkArray[0] + '?' + linkArray[1]);
  }

  createURIParams(): URLSearchParams {
    const curURL = this.router.url;
    const url = curURL.substr('/search'.length + 1);
    const params = new URLSearchParams(url);
    return params;
  }

  sortByAlphabet(orderedArray, orderMode): any {
    orderedArray = orderedArray.sort((a, b) => {
      if (orderMode) {
        return a.key > b.key ? 1 : -1;
      } else {
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
    if (typeof categoryValue === 'number') {
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
    this.setFilterKeys(filters);
    return filters;
  }

  sortCategoryValue(valueMap: any, sortMode: boolean, orderMode: boolean): any {
    let orderedArray = <any>[];
    valueMap.forEach((value, key) => {
      orderedArray.push({
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
    orderedArray.forEach(entry => {
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
      ['Source Control', 'source_control_provider.keyword'],
      ['Input File Formats', 'input_file_formats.value.keyword'],
      ['Output File Formats', 'output_file_formats.value.keyword'],
      ['Private Access', 'private_access'],
      ['VerifiedTool', 'verified'],
      ['Author', 'author'],
      ['Namespace', 'namespace'],
      ['Labels', 'labels.value.keyword'],
      ['VerifiedSourceWorkflow', 'workflowVersions.verifiedSource.keyword'],
      ['HasCheckerWorkflow', 'has_checker'],
      ['Organization', 'organization']
    ]);
  }

  initializeFriendlyNames() {
    return new Map([
      ['_type', 'Entry Type'],
      ['descriptorType', 'Language'],
      ['registry', 'Tool: Registry'],
      ['source_control_provider.keyword', 'Workflow: Source Control'],
      ['private_access', 'Tool: Private Access'], // Workflow has no counterpart
      ['verified', 'Verified'],
      ['author', 'Author'],
      ['namespace', 'Tool: Namespace'],
      ['labels.value.keyword', 'Labels'],
      ['input_file_formats.value.keyword', 'Input File Formats'],
      ['output_file_formats.value.keyword', 'Output File Formats'],
      ['workflowVersions.verifiedSource.keyword', 'Verified Source'],
      ['has_checker', 'Has Checker Workflows'],
      ['organization', 'Workflow: Organization']
    ]);
  }

  initializeEntryOrder() {
    return new Map([
      ['_type', new SubBucket()],
      ['descriptorType', new SubBucket()],
      ['author', new SubBucket()],
      ['registry', new SubBucket()],
      ['source_control_provider.keyword', new SubBucket()],
      ['namespace', new SubBucket()],
      ['organization', new SubBucket()],
      ['labels.value.keyword', new SubBucket()],
      ['private_access', new SubBucket()],
      ['verified', new SubBucket()],
      ['workflowVersions.verifiedSource.keyword', new SubBucket()],
      ['input_file_formats.value.keyword', new SubBucket()],
      ['output_file_formats.value.keyword', new SubBucket()],
      ['has_checker', new SubBucket()]
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
      advSearchSet =
        advancedSearchObject.toAdvanceSearch &&
        (advancedSearchObject.ANDSplitFilter ||
          advancedSearchObject.ANDNoSplitFilter ||
          advancedSearchObject.ORFilter ||
          advancedSearchObject.NOTFilter);
    }
    return this.hasResults(searchTerm, hits) || advSearchSet;
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
    return searchTerm
      .trim()
      .split(' ')
      .join(', ');
  }
}
