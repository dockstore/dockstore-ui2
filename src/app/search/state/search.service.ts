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
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Router } from '@angular/router';
import { transaction } from '@datorama/akita';
import { AdvancedSearchObject, initialAdvancedSearchObject } from 'app/shared/models/AdvancedSearchObject';
import { Explanation } from 'elasticsearch';
import { BehaviorSubject } from 'rxjs';
import { AlertService } from '../../shared/alert/state/alert.service';
import { searchTermLengthLimit } from '../../shared/constants';
import { Dockstore } from '../../shared/dockstore.model';
import { ImageProviderService } from '../../shared/image-provider.service';
import { SubBucket } from '../../shared/models/SubBucket';
import { ExtendedGA4GHService } from '../../shared/openapi/api/extendedGA4GH.service';
import { ProviderService } from '../../shared/provider.service';
import { DockstoreTool, Workflow } from '../../shared/swagger';
import { SearchQuery } from './search.query';
import { SearchStore } from './search.store';

export interface Hit {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: any;
  _version?: number;
  _explanation?: Explanation;
  fields?: any;
  highlight?: any;
  inner_hits?: any;
  sort?: string[];
}

/**
 * Manually set these based on the fields shown by Kibana.
 * All of these should be 'aggregatable' in Kibana.
 *
 * @export
 * @enum {number}
 */
export enum SearchFields {
  VERIFIED_SOURCE = 'workflowVersions.verifiedSources.keyword',
}

@Injectable()
export class SearchService {
  private static readonly WORKFLOWS_TAB_INDEX = 0;
  private static readonly TOOLS_TAB_INDEX = 1;
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
  public exclusiveFilters = ['verified', 'private_access', 'has_checker'];
  constructor(
    private searchStore: SearchStore,
    private searchQuery: SearchQuery,
    private providerService: ProviderService,
    private router: Router,
    private imageProviderService: ImageProviderService,
    private extendedGA4GHService: ExtendedGA4GHService,
    private alertService: AlertService
  ) {}

  static convertTabIndexToEntryType(index: number): 'tools' | 'workflows' {
    return index === this.WORKFLOWS_TAB_INDEX ? 'workflows' : 'tools';
  }

  static convertEntryTypeToTabIndex(entryType: string): number {
    return entryType === 'workflows' ? this.WORKFLOWS_TAB_INDEX : this.TOOLS_TAB_INDEX;
  }

  /**
   * Return a negative number if a sorts before b, positive if b sorts before a, and 0 if they are the same,
   * comparing based on the given attribute and direction
   * @param a: DockstoreTool or Workflow
   * @param b: DockstoreTool or Workflow
   * @param attribute: workflow or tool property to sort by
   * @param direction: 'asc' or 'desc'
   */
  compareAttributes(
    a: DockstoreTool | Workflow,
    b: DockstoreTool | Workflow,
    attribute: string,
    direction: SortDirection,
    entryType: 'tool' | 'workflow'
  ) {
    // For sorting tools by name, sort tool_path
    // For sorting workflows by name, sort full_workflow_path
    if (entryType === 'tool' && attribute === 'name') {
      attribute = 'tool_path';
    } else if (entryType === 'workflow' && attribute === 'name') {
      attribute = 'full_workflow_path';
    }
    let aVal = a[attribute];
    let bVal = b[attribute];
    const sortFactor = direction === 'asc' ? 1 : -1;

    // if sorting the stars column, consider 'undefined' stars to be 0
    if (attribute === 'starredUsers') {
      if (!aVal) {
        aVal = [];
      }
      if (!bVal) {
        bVal = [];
      }
    } else {
      // otherwise, regardless of sort direction, null or empty values go at the end
      if (!aVal) {
        return 1;
      }
      if (!bVal) {
        return -1;
      }
    }

    // ignore case when sorting by a string and handle characters with accents, etc
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
      return aVal.localeCompare(bVal) * sortFactor;
    } else {
      return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * sortFactor;
    }
  }

  // Given a URL, will attempt to shorten it
  // TODO: Find another method for shortening URLs
  setShortUrl(url: string) {
    this.searchStore.update((state) => {
      return {
        ...state,
        shortUrl: url,
      };
    });
  }

  setPageSizeAndIndex(pageSize: number, pageIndex: number) {
    this.searchStore.update((state) => {
      return {
        ...state,
        pageSize: pageSize,
        pageIndex: pageIndex,
      };
    });
  }

  @transaction()
  setSearchText(text: string) {
    if (text.length > searchTermLengthLimit) {
      text = '';
      this.alertService.customDetailedError('Request Entity Too Large', 'Cannot perform search because search term is too large.');
    }
    this.searchStore.update((state) => {
      return {
        ...state,
        searchText: text,
      };
    });
    if (text) {
      this.clear();
    }
  }

  searchSuggestTerm() {
    const suggestTerm = this.searchQuery.getValue().suggestTerm;
    this.setSearchText(suggestTerm);
  }

  setShowTagCloud(entryType: 'tool' | 'workflow') {
    if (entryType === 'tool') {
      const showTagCloud: boolean = this.searchQuery.getValue().showToolTagCloud;
      this.searchStore.update((state) => {
        return {
          ...state,
          showToolTagCloud: !showTagCloud,
        };
      });
    } else {
      const showTagCloud: boolean = this.searchQuery.getValue().showWorkflowTagCloud;
      this.searchStore.update((state) => {
        return {
          ...state,
          showWorkflowTagCloud: !showTagCloud,
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
  filterEntry(hits: Array<Hit>, query_size: number): [Array<Hit>, Array<Hit>] {
    const workflowHits = [];
    const toolHits = [];
    hits.forEach((hit) => {
      hit['_source'] = this.providerService.setUpProvider(hit['_source']);
      if (workflowHits.length + toolHits.length < query_size - 1) {
        if (hit['_index'] === 'tools') {
          hit['_source'] = this.imageProviderService.setUpImageProvider(hit['_source']);
          toolHits.push(hit);
        } else if (hit['_index'] === 'workflows') {
          workflowHits.push(hit);
        }
      }
    });
    return [toolHits, workflowHits];
  }

  setHits(toolHits: Array<Hit>, workflowHits: Array<Hit>) {
    this.searchStore.update((state) => {
      return {
        ...state,
        toolhit: toolHits,
        workflowhit: workflowHits,
      };
    });
  }

  setFilterKeys(filters: Map<string, Set<string>>) {
    this.searchStore.update((state) => {
      return {
        ...state,
        filterKeys: filters ? Array.from(filters.keys()) : [],
      };
    });
  }

  suggestSearchTerm(searchText: string) {
    const body = {
      suggest: {
        do_you_mean: {
          prefix: searchText,
          term: {
            field: 'description',
          },
        },
      },
    };
    this.extendedGA4GHService.toolsIndexSearch(JSON.stringify(body)).subscribe(
      (hits) => {
        const suggestions: Array<any> = hits['suggest']['do_you_mean'][0].options;
        if (suggestions.length > 0) {
          this.setSuggestTerm(suggestions[0].text);
        } else {
          this.setSuggestTerm('');
        }
      },
      (error) => console.log(error)
    );
  }

  setSuggestTerm(suggestTerm: string) {
    this.searchStore.update((state) => {
      return {
        ...state,
        suggestTerm: suggestTerm,
      };
    });
  }

  setAutoCompleteTerms(hits: any) {
    let autocompleteTerms;
    try {
      autocompleteTerms = hits.aggregations.autocomplete.buckets.map((term) => term.key);
    } catch (error) {
      console.error('Could not retrieve autocomplete terms');
      autocompleteTerms = [];
    }
    this.searchStore.update((state) => {
      return {
        ...state,
        autocompleteTerms: autocompleteTerms,
      };
    });
  }

  setFacetAutocompleteTerms(hits: any) {
    const autocompleteTerms = [];
    const maxTerms = 3;
    for (let i = 0; i <= maxTerms; i++) {
      if (hits[i]) {
        autocompleteTerms.push(hits[i]);
      }
    }
    this.searchStore.update((state) => {
      return {
        ...state,
        facetAutocompleteTerms: autocompleteTerms,
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
  createPermalinks(searchInfo): string[] {
    // For local testing, use LOCAL_URI, else use HOSTNAME
    const url = `${Dockstore.HOSTNAME}/search`;
    let httpParams = new HttpParams();
    const filter = searchInfo.filter;
    filter.forEach((value, key) => {
      value.forEach((subBucket) => {
        httpParams = httpParams.append(key, subBucket);
      });
    });
    httpParams = httpParams.append('entryType', searchInfo.entryType);
    if (searchInfo.searchValues) {
      httpParams = httpParams.append('search', searchInfo.searchValues);
    } else {
      const advSearchKeys = Object.keys(searchInfo.advancedSearchObject);
      for (let index = 0; index < advSearchKeys.length; index++) {
        const key = advSearchKeys[index];
        const val = searchInfo.advancedSearchObject[key];
        if ((key.includes('Filter') || key === 'searchMode') && val !== '') {
          httpParams = httpParams.append(key, val);
        }
      }
    }
    return [url, httpParams.toString()];
  }

  handleLink(linkArray: Array<string>) {
    this.router.navigateByUrl('search?' + linkArray[1]);
    this.setShortUrl(linkArray[0] + '?' + linkArray[1]);
  }

  reset() {
    this.setSearchText(' ');
    this.setSearchText('');
    this.router.navigateByUrl('search');
  }

  sortByAlphabet(orderedArray, orderMode): any {
    orderedArray = orderedArray.sort((a, b) => {
      if (!a.key) {
        return 1;
      }
      if (!b.key) {
        return -1;
      }
      if (orderMode) {
        return a.key.toLowerCase().localeCompare(b.key.toLowerCase());
      } else {
        return b.key.toLowerCase().localeCompare(a.key.toLowerCase());
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
            _count: sortModeMap.get(key).CountOrderBy ? 'asc' : 'desc',
          };
          break;
        }
        case false: {
          order = {
            _term: sortModeMap.get(key).AlphabetOrderBy ? 'asc' : 'desc',
          };
          break;
        }
        default: {
          order = {
            _count: 'desc',
          };
          break;
        }
      }
    } else {
      order = {
        _count: 'desc',
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
  handleFilters(category: string, categoryValue: string | number, filters: Map<string, Set<string>>) {
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

  updateFiltersFromParameter(category: string, categoryValue: string, filters: Map<string, Set<string>>): Map<string, Set<string>> {
    if (typeof categoryValue === 'number') {
      categoryValue = String(categoryValue);
    }
    if (!filters.has(category)) {
      filters.set(category, new Set<string>());
    }
    filters.get(category).add(categoryValue);
    return filters;
  }

  sortCategoryValue(valueMap: any, sortMode: boolean, orderMode: boolean): any {
    let orderedArray = <any>[];
    valueMap.forEach((value, key) => {
      orderedArray.push({
        key: key,
        value: value,
      });
    });
    if (!sortMode) {
      orderedArray = this.sortByAlphabet(orderedArray, orderMode);
    } else {
      orderedArray = this.sortByCount(orderedArray, orderMode);
    }
    const tempMap: Map<string, string> = new Map<string, string>();
    orderedArray.forEach((entry) => {
      tempMap.set(entry.key, entry.value);
    });
    return tempMap;
  }

  // Initialization Functions
  initializeCommonBucketStubs() {
    return new Map([
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
      ['VerifiedSourceWorkflow', SearchFields.VERIFIED_SOURCE],
      ['HasCheckerWorkflow', 'has_checker'],
      ['Organization', 'organization'],
      ['VerifiedPlatforms', 'verified_platforms.keyword'],
      ['Category', 'categories.name.keyword'],
    ]);
  }

  initializeFriendlyNames() {
    return new Map([
      ['descriptorType', 'Language'],
      ['registry', 'Registry'],
      ['source_control_provider.keyword', 'Source Control'],
      ['private_access', 'Private Access'],
      ['verified', 'Verified'],
      ['author', 'Author'],
      ['namespace', 'Namespace'],
      ['labels.value.keyword', 'Labels'],
      ['input_file_formats.value.keyword', 'Input File Formats'],
      ['output_file_formats.value.keyword', 'Output File Formats'],
      [SearchFields.VERIFIED_SOURCE, 'Verified Source'],
      ['has_checker', 'Has Checker Workflows'],
      ['organization', 'Organization'],
      ['verified_platforms.keyword', 'Verified Platforms'],
      ['categories.name.keyword', 'Category'],
    ]);
  }

  initializeToolTips() {
    return new Map([
      // Git hook auto fixes from single quotes with an escaped 's but linter complains about double quotes.
      /* eslint-disable-next-line quotes, @typescript-eslint/quotes */
      ['private_access', "A private tool requires authentication to view on Docker's registry website and to pull the Docker image."],
      ['verified', 'Indicates that at least one version of a tool or workflow has been successfuly run by our team or an outside party.'],
      [SearchFields.VERIFIED_SOURCE, 'Indicates which party performed the verification process on a tool or workflow.'],
      [
        'has_checker',
        'Checker workflows are additional workflows you can associate with a tool or workflow to ensure ' +
          'that, when given some inputs, it produces the expected outputs on a different platform other than the one it was developed on.',
      ],
      ['verified_platforms.keyword', 'Indicates which platform a tool or workflow (at least one version) was successfully run on.'],
    ]);
  }

  initializeEntryOrder() {
    return new Map([
      ['categories.name.keyword', new SubBucket()],
      ['descriptorType', new SubBucket()],
      ['author', new SubBucket()],
      ['registry', new SubBucket()],
      ['source_control_provider.keyword', new SubBucket()],
      ['namespace', new SubBucket()],
      ['organization', new SubBucket()],
      ['labels.value.keyword', new SubBucket()],
      ['private_access', new SubBucket()],
      ['verified', new SubBucket()],
      [SearchFields.VERIFIED_SOURCE, new SubBucket()],
      ['verified_platforms.keyword', new SubBucket()],
      ['input_file_formats.value.keyword', new SubBucket()],
      ['output_file_formats.value.keyword', new SubBucket()],
      ['has_checker', new SubBucket()],
    ]);
  }

  // Functions called from HTML
  /**
   * Returns true if either basic search is set and has results, or advanced search is set
   * (though not just the searchMode, which is set by default)
   */
  hasSearchText(advancedSearchObject: AdvancedSearchObject, searchTerm: boolean, hits: any) {
    let advSearchSet;
    if (!advancedSearchObject) {
      advSearchSet = false;
    } else {
      advSearchSet =
        advancedSearchObject.ANDSplitFilter ||
        advancedSearchObject.ANDNoSplitFilter ||
        advancedSearchObject.ORFilter ||
        advancedSearchObject.NOTFilter;
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
  hasFilters(filters: Map<string, Set<string>>) {
    let count = 0;
    filters.forEach((filter) => {
      count += filter.size;
    });
    return count > 0;
  }

  /**
   * Returns true if any search filters have been applied, false otherwise
   */
  hasNarrowedSearch(advancedSearchObject: any, searchTerm: boolean, hits: any, filters: Map<string, Set<string>>) {
    return this.hasSearchText(advancedSearchObject, searchTerm, hits) || this.hasFilters(filters);
  }

  setAdvancedSearch(advancedSearch: AdvancedSearchObject): void {
    this.searchStore.update((state) => {
      return {
        ...state,
        advancedSearch: { ...advancedSearch },
        searchText: '',
      };
    });
  }

  saveCurrentTab(index: number) {
    this.searchStore.update((state) => {
      return {
        ...state,
        currentTabIndex: index,
      };
    });
  }

  /**
   * This navigates to the correct page and clears all facets, search text, and advanced search
   */
  saveCurrentTabAndClear(index: number) {
    if (index === SearchService.WORKFLOWS_TAB_INDEX) {
      this.router.navigateByUrl('search?entryType=workflows&searchMode=Files');
    } else {
      this.router.navigateByUrl('search?entryType=tools&searchMode=Files');
    }
  }

  goToCleanSearch() {
    this.router.navigateByUrl('search');
  }

  clear(): void {
    this.searchStore.update((state) => {
      return {
        ...state,
        advancedSearch: { ...initialAdvancedSearchObject },
      };
    });
  }
}
