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
import { Component, OnInit } from '@angular/core';
import { CloudData, CloudOptions } from 'angular-tag-cloud-module';
import { Observable } from 'rxjs';
import { ELASTIC_SEARCH_CLIENT } from '../elastic-search-client';
import { QueryBuilderService } from '../query-builder.service';
import { SearchQuery } from '../state/search.query';
import { SearchService } from '../state/search.service';
import { Base } from '../../shared/base';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent extends Base implements OnInit {
  public activeToolTab$: Observable<boolean>;
  public noToolHits$: Observable<boolean>;
  public noWorkflowHits$: Observable<boolean>;
  public showWorkflowTagCloud$: Observable<boolean>;
  public showToolTagCloud$: Observable<boolean>;
  public selectedIndex = 0;
  toolTagCloudData: Array<CloudData>;
  workflowTagCloudData: Array<CloudData>;
  options: CloudOptions = {
    width: 600,
    height: 200,
    overflow: false
  };
  constructor(private searchService: SearchService, private queryBuilderService: QueryBuilderService, private searchQuery: SearchQuery) {
    super();
    this.activeToolTab$ = this.searchQuery.activeToolTab$;
    this.noWorkflowHits$ = this.searchQuery.noWorkflowHits$;
    this.noToolHits$ = this.searchQuery.noToolHits$;
    this.showToolTagCloud$ = this.searchQuery.showToolTagCloud$;
    this.showWorkflowTagCloud$ = this.searchQuery.showWorkflowTagCloud$;
  }

  private readonly TOOLS_TAB_INDEX = 0;
  private readonly WORKFLOWS_TAB_INDEX = 1;

  ngOnInit() {
    this.createTagCloud('tool');
    this.createTagCloud('workflow');
    this.activeToolTab$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(toolsActive => (this.selectedIndex = toolsActive ? this.TOOLS_TAB_INDEX : this.WORKFLOWS_TAB_INDEX));
  }

  createTagCloud(type: string) {
    const toolQuery = this.queryBuilderService.getTagCloudQuery(type);
    this.createToolTagCloud(toolQuery, type);
  }

  clickTagCloudBtn(type: 'tool' | 'workflow') {
    this.searchService.setShowTagCloud(type);
  }

  createToolTagCloud(toolQuery, type) {
    ELASTIC_SEARCH_CLIENT.search({
      index: 'tools',
      type: 'entry',
      body: toolQuery
    })
      .then(hits => {
        let weight = 10;
        let count = 0;
        if (hits && hits.aggregations && hits.aggregations.tagcloud) {
          hits.aggregations.tagcloud.buckets.forEach(tag => {
            const theTag = {
              text: tag.key,
              weight: weight
            };
            if (weight === 10) {
              /** just for fun...**/
              theTag['color'] = '#ffaaee';
            }
            if (count % 2 !== 0) {
              weight--;
            }
            if (type === 'tool') {
              if (!this.toolTagCloudData) {
                this.toolTagCloudData = new Array<CloudData>();
              }
              this.toolTagCloudData.push(theTag);
            } else {
              if (!this.workflowTagCloudData) {
                this.workflowTagCloudData = new Array<CloudData>();
              }
              this.workflowTagCloudData.push(theTag);
            }
            count--;
          });
        }
      })
      .catch(error => console.log(error));
  }

  // Tells the search service to tell the search filters to save its data
  saveSearchFilter() {
    this.searchService.toSaveSearch$.next(true);
  }

  tagClicked(clicked: CloudData) {
    this.searchService.searchTerm$.next(true);
    this.searchService.setSearchText(clicked.text);
    this.searchService.tagClicked$.next(true);
  }
}
