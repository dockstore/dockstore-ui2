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
import * as bodybuilder from 'bodybuilder';
import { AdvancedSearchObject } from './../shared/models/AdvancedSearchObject';
import { SearchService } from './state/search.service';
import { tagCloudCommonTerms } from './../shared/constants';

/**
 * This service constructs all the querys and should be only class that interacts with the bodybuilder library.
 *
 * @export
 * @class QueryBuilderService
 */
@Injectable()
export class QueryBuilderService {
  // TODO: Comment on why shard_size is 10,000
  private shard_size = 10000;
  constructor(private searchService: SearchService) {}
  public readonly searchEverythingFriendlyNames = new Map([
    ['full_workflow_path.keyword', 'Workflow Path'],
    ['tool_path.keyword', 'Tool Path'],
    ['workflowVersions.sourceFiles.content', 'Source Files'],
    ['tags.sourceFiles.content', 'Source Files'],
    ['description', 'Description'],
    ['labels', 'Labels'],
    ['all_authors.name', 'Authors'],
    ['topicAutomatic', 'Topic'],
  ]);

  getTagCloudQuery(type: string): string {
    const tagCloudSize = 20;
    const index = type + 's';
    // Size to 0 here because https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html#agg-caches
    let body = bodybuilder().size(0);
    body = this.excludeContent(body);
    body = body.query('match', '_index', index);
    body = body.aggregation('significant_text', 'description', 'tagcloud', { size: tagCloudSize, exclude: tagCloudCommonTerms });
    const toolQuery = JSON.stringify(body.build(), null, 1);
    return toolQuery;
  }

  getSidebarAggregationQuery(
    values: string,
    advancedSearchObject: AdvancedSearchObject,
    searchTerm: boolean,
    bucketStubs: any,
    filters: any,
    exclusiveFilters: any,
    sortModeMap: any,
    index: 'workflows' | 'tools' | 'notebooks'
  ): string {
    const count = this.getNumberOfFilters(filters);
    // Size to 0 here because https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html#agg-caches
    let sidebarBody = bodybuilder().size(0);
    sidebarBody = this.excludeContent(sidebarBody);
    sidebarBody = sidebarBody.query('match', '_index', index);
    sidebarBody = this.appendQuery(sidebarBody, values, advancedSearchObject, searchTerm);
    sidebarBody = this.appendAggregations(count, sidebarBody, bucketStubs, filters, exclusiveFilters, sortModeMap);
    const builtSideBarBody = sidebarBody.build();
    const sideBarQuery = JSON.stringify(builtSideBarBody);
    return sideBarQuery;
  }

  private excludeContent(body: any) {
    return body.rawOption('_source', false);
  }

  // These are the properties to return in the search to display the results table correctly
  private sourceOptions(body: any) {
    return body.rawOption('_source', [
      'all_authors',
      'descriptorType',
      'descriptorTypeSubclass',
      'full_workflow_path',
      'gitUrl',
      'name',
      'namespace',
      'organization',
      'private_access',
      'providerUrl',
      'repository',
      'starredUsers',
      'toolname',
      'tool_path',
      'topicAutomatic',
      'verified',
      'workflowName',
    ]);
  }

  getNumberOfFilters(filters: any) {
    let count = 0;
    filters.forEach((filter) => {
      count += filter.size;
    });
    return count;
  }

  getResultQuery(
    query_size: number,
    values: string,
    advancedSearchObject: AdvancedSearchObject,
    searchTerm: boolean,
    filters: any,
    exclusiveFilters: any,
    index: 'tools' | 'workflows' | 'notebooks'
  ): string {
    let tableBody = bodybuilder().size(query_size);
    tableBody = this.sourceOptions(tableBody);
    tableBody = tableBody.query('match', '_index', index);
    tableBody = this.appendQuery(tableBody, values, advancedSearchObject, searchTerm);
    tableBody = this.appendFilter(tableBody, null, filters, exclusiveFilters);
    // if there's no inclusive search term, tell ES to sort hits by stars
    // otherwise, use the default ES hit ordering, which should be by
    // ES-calcalated score if we craft our query correctly
    if (this.isEmpty(values) && !this.hasInclusiveSettings(advancedSearchObject)) {
      tableBody = tableBody.sort('stars_count', 'desc');
    }
    tableBody.rawOption('highlight', {
      type: 'unified',
      pre_tags: ['<b>'],
      post_tags: ['</b>'],
      fields: {
        full_workflow_path: {},
        tool_path: {},
        'workflowVersions.sourceFiles.content': {},
        'tags.sourceFiles.content': {},
        description: {},
        labels: {},
        'all_authors.name': {},
        topicAutomatic: {},
        'categories.topic': {},
        'categories.displayName': {},
      },
    });
    const builtTableBody = tableBody.build();
    const tableQuery = JSON.stringify(builtTableBody);
    return tableQuery;
  }

  getResultSingleIndexQuery(query_size: number, index: 'tools' | 'workflows' | 'notebooks'): string {
    let body = bodybuilder().size(query_size);
    body = this.sourceOptions(body);
    body = body.query('match', '_index', index);
    const builtBody = body.build();
    const singleIndexQuery = JSON.stringify(builtBody);
    return singleIndexQuery;
  }

  /**===============================================
   *                Append Functions
   * ==============================================
   */
  /**
   * Append filters to a body builder object in order to add filter functionality to the overall elastic search query
   * This is used to add to query object as well as each individual aggregation
   * @param {*} body
   * @returns the new body builder object with filter applied
   * @memberof SearchComponent
   */
  appendFilter(body: any, aggKey: string, filters: any, exclusiveFilters: any): any {
    filters.forEach((value: Set<string>, key: string) => {
      value.forEach((insideFilter) => {
        const isExclusiveFilter = exclusiveFilters.includes(key);
        if (aggKey === key && !isExclusiveFilter) {
          // Return some garbage filter because we've decided to append a filter, there's no turning back
          // return body;  // <--- this does not work
          body = body.notFilter('term', 'some garbage term that hopefully never gets matched', insideFilter);
        } else {
          // value refers to the buckets selected
          if (value.size > 1) {
            body = body.orFilter('term', key, insideFilter);
          } else {
            if (isExclusiveFilter) {
              body = body.filter('term', key, this.convertIntStringToBoolString(insideFilter));
            } else {
              body = body.filter('term', key, insideFilter);
            }
          }
        }
      });
    });
    return body;
  }

  /**
   * Aside from the _index key, the exclusive facets have buckets that are boolean values (verified, not verified, etc)
   * For some reason, ES is expecting booleans to be 'true' and 'false' but is returning values as 0 to 1
   * @param bucketValue Bucket value of an exclusive facet
   */
  private convertIntStringToBoolString(bucketValue: string) {
    if (bucketValue === '0') {
      return 'false';
    }
    if (bucketValue === '1') {
      return 'true';
    }
    return bucketValue;
  }

  /**
   * Append the query to a body builder object in order to add query functionality to the overall elastic search query
   *
   * @param {*} body the body build object
   * @returns {*} the new body builder object
   * @memberof SearchComponent
   */
  appendQuery(body: any, values: string, oldAdvancedSearchObject: AdvancedSearchObject, searchTerm: boolean): any {
    const advancedSearchObject = { ...oldAdvancedSearchObject };
    if (this.hasSettings(advancedSearchObject)) {
      if (advancedSearchObject.searchMode === 'description') {
        this.advancedSearchDescription(body, advancedSearchObject);
      } else if (advancedSearchObject.searchMode === 'files') {
        this.advancedSearchFiles(body, advancedSearchObject);
      }
      values = '';
      searchTerm = false;
    } else {
      if (!this.isEmpty(values)) {
        body = this.searchEverything(body, values);
      } else {
        body = body.query('match_all', {});
      }
    }
    return body;
  }

  private isEmpty(values: string): boolean {
    return values == undefined || values.toString().trim().length <= 0;
  }

  private hasSettings(advancedSearchObject: AdvancedSearchObject): boolean {
    return (
      !this.isEmpty(advancedSearchObject?.ANDSplitFilter) ||
      !this.isEmpty(advancedSearchObject?.ANDNoSplitFilter) ||
      !this.isEmpty(advancedSearchObject?.ORFilter) ||
      !this.isEmpty(advancedSearchObject?.NOTFilter)
    );
  }

  private hasInclusiveSettings(advancedSearchObject: AdvancedSearchObject): boolean {
    return (
      !this.isEmpty(advancedSearchObject?.ANDSplitFilter) ||
      !this.isEmpty(advancedSearchObject?.ANDNoSplitFilter) ||
      !this.isEmpty(advancedSearchObject?.ORFilter)
    );
  }

  /**
   * Appends search-everything filter to the query
   * Currently searches sourcefiles, description, labels, author, and path
   * Some requirements:
   * 1. Need to be able to match substring (ex. "chicken pot pie" should match "pot")
   * 2. Need to be able to handle slashes (ex. "beef/stew" should match "beef/stew")
   * Wildcard is used for #1
   * The paths use keyword instead of string because #2 wouldn't work otherwise
   *
   * @param body Body from the Bodybuilder package which will be mutated
   * @param searchString The string entered into the basic search bar by the user
   */
  private searchEverything(body: bodybuilder.Bodybuilder, searchString: string): bodybuilder.Bodybuilder {
    // Extract each search term from the search string, limiting to a maximum of 20 terms to prevent a DOS attack
    const terms = searchString.trim().split(' ').slice(0, 20);
    terms.forEach((term) => {
      body
        .orQuery('wildcard', 'full_workflow_path', { value: '*' + term + '*', case_insensitive: true, boost: 7 })
        .orQuery('wildcard', 'tool_path', { value: '*' + term + '*', case_insensitive: true, boost: 7 })
        .orQuery('match', 'workflowVersions.sourceFiles.content', { query: term, boost: 0.2 })
        .orQuery('match', 'tags.sourceFiles.content', { query: term, boost: 0.2 })
        .orQuery('match', 'description', { query: term, boost: 2 })
        .orQuery('match', 'labels', { query: term, boost: 2 })
        .orQuery('match', 'all_authors.name', { query: term, boost: 3 })
        .orQuery('match', 'topicAutomatic', { query: term, boost: 4 })
        .orQuery('match', 'categories.topic', { query: term, boost: 1.5 })
        .orQuery('match', 'categories.displayName', { query: term, boost: 2 });
    });
    body.queryMinimumShouldMatch(1);
    return body;
  }

  /**===============================================
   *                Advanced Search Functions
   * ===============================================
   */

  /**
   * Append aggregations to a body builder object in order to add aggregation functionality to the overall elastic search query
   *
   * @param {number} count number of filters
   * @param {*} body the body builder object
   * @returns {*} the new body builder object
   * @memberof SearchComponent
   */
  appendAggregations(count: number, body: any, bucketStubs: any, filters: any, exclusiveFilters: any, sortModeMap: any): any {
    // go through buckets
    bucketStubs.forEach((key) => {
      const order = this.searchService.parseOrderBy(key, sortModeMap);
      if (count > 0) {
        body = body.agg('filter', key, key, (a) => {
          return this.appendFilter(a, key, filters, exclusiveFilters).aggregation('terms', key, key, { size: this.shard_size, order });
        });
      } else {
        body = body.agg('terms', key, key, { size: this.shard_size, order });
      }
    });
    return body;
  }

  advancedSearchDescription(body: any, advancedSearchObject: AdvancedSearchObject) {
    this.advancedSearch(body, advancedSearchObject, 'description');
  }

  advancedSearchFiles(body: any, advancedSearchObject: AdvancedSearchObject) {
    this.advancedSearch(body, advancedSearchObject, 'tags.sourceFiles.content');
    this.advancedSearch(body, advancedSearchObject, 'workflowVersions.sourceFiles.content');
  }

  advancedSearch(body: any, advancedSearchObject: AdvancedSearchObject, fieldName: string): number {
    let shouldCount: number = 0;
    if (advancedSearchObject.ANDSplitFilter) {
      body.orQuery('match', fieldName, { query: advancedSearchObject.ANDSplitFilter, operator: 'AND' });
      shouldCount++;
    }
    if (advancedSearchObject.ANDNoSplitFilter) {
      body.orQuery('match_phrase', fieldName, advancedSearchObject.ANDNoSplitFilter);
      shouldCount++;
    }
    if (advancedSearchObject.ORFilter) {
      body.orQuery('match', fieldName, advancedSearchObject.ORFilter);
      shouldCount++;
    }
    if (advancedSearchObject.NOTFilter) {
      const filters = advancedSearchObject.NOTFilter.split(' ');
      filters.forEach((filter) => {
        body = body.notQuery('match', fieldName, filter);
      });
    }
    // Add a dummy no-op orQuery, to prevent a bodybuilder bug that omits a specified `minimum_should_match` when `orQuery` is called once
    body.orQuery('match_none');
    body.queryMinimumShouldMatch(shouldCount);
    return shouldCount;
  }
}
