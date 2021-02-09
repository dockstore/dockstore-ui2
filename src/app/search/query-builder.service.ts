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

  getTagCloudQuery(type: string): string {
    const tagCloudSize = 20;
    const index = type + 's';
    let body = bodybuilder().size(tagCloudSize);
    body = this.excludeContent(body);
    body = body.query('match', '_index', index);
    body = body.aggregation('significant_text', 'description', 'tagcloud', { size: tagCloudSize });
    const toolQuery = JSON.stringify(body.build(), null, 1);
    return toolQuery;
  }

  getSidebarQuery(
    query_size: number,
    values: string,
    advancedSearchObject: AdvancedSearchObject,
    searchTerm: boolean,
    bucketStubs: any,
    filters: any,
    sortModeMap: any
  ): string {
    const count = this.getNumberOfFilters(filters);
    let sidebarBody = bodybuilder().size(query_size);
    sidebarBody = this.excludeContent(sidebarBody);
    sidebarBody = this.appendQuery(sidebarBody, values, advancedSearchObject, searchTerm);
    sidebarBody = this.appendAggregations(count, sidebarBody, bucketStubs, filters, sortModeMap);
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
      'author',
      'descriptorType',
      'full_workflow_path',
      'gitUrl',
      'name',
      'namespace',
      'organization',
      'providerUrl',
      'repository',
      'starredUsers',
      'toolname',
      'tool_path',
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
    filters: any
  ): string {
    let tableBody = bodybuilder().size(query_size);
    tableBody = this.sourceOptions(tableBody);
    tableBody = this.appendQuery(tableBody, values, advancedSearchObject, searchTerm);
    tableBody = this.appendFilter(tableBody, null, filters);
    const builtTableBody = tableBody.build();
    const tableQuery = JSON.stringify(builtTableBody);
    return tableQuery;
  }

  getResultSingleIndexQuery(query_size: number, index: 'tools' | 'workflows'): string {
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
  appendFilter(body: any, aggKey: string, filters: any): any {
    filters.forEach((value: Set<string>, key: string) => {
      value.forEach((insideFilter) => {
        const isExclusiveFilter = this.searchService.exclusiveFilters.includes(key);
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
    if (values.toString().length > 0) {
      body = this.searchEverything(body, values);
    } else {
      body = body.query('match_all', {});
    }
    if (advancedSearchObject) {
      if (advancedSearchObject.searchMode === 'description') {
        this.advancedSearchDescription(body, advancedSearchObject);
      } else if (advancedSearchObject.searchMode === 'files') {
        this.advancedSearchFiles(body, advancedSearchObject);
      }
      values = '';
      searchTerm = false;
    }
    return body;
  }

  /**
   * Appends search-everything filter to the query
   * Currently searches sourcefiles, description, labels, author, and path
   * Some requiremnts:
   * 1. Need to be able to match substring (ex. "chicken pot pie" should match "pot")
   * 2. Need to be able to handle slashes (ex. "beef/stew" should match "beef/stew")
   * A query (instead of filter) is used to handle #1 because wildcard does work for filters
   * The paths use keyword instead of string because #2 wouldn't work otherwise
   *
   * @param body Body from the Bodybuilder package which will be mutated
   * @param searchString The string entered into the basic search bar by the user
   */
  private searchEverything(body: bodybuilder.Bodybuilder, searchString: string): bodybuilder.Bodybuilder {
    return body
      .orQuery('wildcard', { 'full_workflow_path.keyword': { value: '*' + searchString + '*', case_insensitive: true } })
      .orQuery('wildcard', { 'tool_path.keyword': { value: '*' + searchString + '*', case_insensitive: true } })
      .orQuery('wildcard', { 'workflowVersions.sourceFiles.content': { value: '*' + searchString + '*', case_insensitive: true } })
      .orQuery('wildcard', { 'tags.sourceFiles.content': { value: '*' + searchString + '*', case_insensitive: true } })
      .orQuery('wildcard', { description: { value: '*' + searchString + '*', case_insensitive: true } })
      .orQuery('wildcard', { labels: { value: '*' + searchString + '*', case_insensitive: true } })
      .orQuery('wildcard', { author: { value: '*' + searchString + '*', case_insensitive: true } });
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
  appendAggregations(count: number, body: any, bucketStubs: any, filters: any, sortModeMap: any): any {
    // go through buckets
    bucketStubs.forEach((key) => {
      const order = this.searchService.parseOrderBy(key, sortModeMap);
      if (count > 0) {
        body = body.agg('filter', key, key, (a) => {
          return this.appendFilter(a, key, filters).aggregation('terms', key, key, { size: this.shard_size, order });
        });
      } else {
        body = body.agg('terms', key, key, { size: this.shard_size, order });
      }
    });
    return body;
  }

  // Advanced search query related functions

  /* TODO: Make this better */
  advancedSearchFiles(body: any, advancedSearchObject: AdvancedSearchObject) {
    if (advancedSearchObject.ANDSplitFilter) {
      const filters = advancedSearchObject.ANDSplitFilter.split(' ');
      let insideFilter_tool = bodybuilder();
      filters.forEach((filter) => {
        insideFilter_tool = insideFilter_tool.filter('match_phrase', 'tags.sourceFiles.content', filter);
      });
      let insideFilter_workflow = bodybuilder();
      filters.forEach((filter) => {
        insideFilter_workflow = insideFilter_workflow.filter('match_phrase', 'workflowVersions.sourceFiles.content', filter);
      });
      body = body.filter('bool', (filter) =>
        filter
          .orFilter('bool', (toolfilter) => (toolfilter = insideFilter_tool))
          .orFilter('bool', (workflowfilter) => (workflowfilter = insideFilter_workflow))
      );
    }
    if (advancedSearchObject.ANDNoSplitFilter) {
      body = body.filter('bool', (filter) =>
        filter
          .orFilter('bool', (toolfilter) =>
            toolfilter.filter('match_phrase', 'tags.sourceFiles.content', advancedSearchObject.ANDNoSplitFilter)
          )
          .orFilter('bool', (workflowfilter) =>
            workflowfilter.filter('match_phrase', 'workflowVersions.sourceFiles.content', advancedSearchObject.ANDNoSplitFilter)
          )
      );
    }
    if (advancedSearchObject.ORFilter) {
      const filters = advancedSearchObject.ORFilter.split(' ');
      let insideFilter_tool = bodybuilder();
      filters.forEach((filter) => {
        insideFilter_tool = insideFilter_tool.orFilter('match_phrase', 'tags.sourceFiles.content', filter);
      });
      let insideFilter_workflow = bodybuilder();
      filters.forEach((filter) => {
        insideFilter_workflow = insideFilter_workflow.orFilter('match_phrase', 'workflowVersions.sourceFiles.content', filter);
      });
      body = body.filter('bool', (filter) =>
        filter
          .orFilter('bool', (toolfilter) => (toolfilter = insideFilter_tool))
          .orFilter('bool', (workflowfilter) => (workflowfilter = insideFilter_workflow))
      );
    }
    if (advancedSearchObject.NOTFilter) {
      const filters = advancedSearchObject.NOTFilter.split(' ');
      let insideFilter_tool = bodybuilder();
      filters.forEach((filter) => {
        insideFilter_tool = insideFilter_tool.notFilter('match_phrase', 'tags.sourceFiles.content', filter);
      });
      let insideFilter_workflow = bodybuilder();
      filters.forEach((filter) => {
        insideFilter_workflow = insideFilter_workflow.notFilter('match_phrase', 'workflowVersions.sourceFiles.content', filter);
      });
      body = body.filter('bool', (filter) =>
        filter
          .filter('bool', (toolfilter) => (toolfilter = insideFilter_tool))
          .filter('bool', (workflowfilter) => (workflowfilter = insideFilter_workflow))
      );
    }
  }

  advancedSearchDescription(body: any, advancedSearchObject: AdvancedSearchObject) {
    if (advancedSearchObject.ANDSplitFilter) {
      const filters = advancedSearchObject.ANDSplitFilter.split(' ');
      filters.forEach((filter) => (body = body.filter('match_phrase', 'description', filter)));
    }
    if (advancedSearchObject.ANDNoSplitFilter) {
      body = body.query('match_phrase', 'description', advancedSearchObject.ANDNoSplitFilter);
    }
    if (advancedSearchObject.ORFilter) {
      const filters = advancedSearchObject.ORFilter.split(' ');
      filters.forEach((filter) => {
        body = body.orFilter('match_phrase', 'description', filter);
      });
    }
    if (advancedSearchObject.NOTFilter) {
      const filters = advancedSearchObject.NOTFilter.split(' ');
      filters.forEach((filter) => {
        body = body.notQuery('match_phrase', 'description', filter);
      });
    }
  }
}
