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
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { CloudData, CloudOptions, TagCloudComponent } from 'angular-tag-cloud-module';
import { ExtendedGA4GHService } from 'app/shared/openapi';
import { Observable } from 'rxjs';
import { Base } from '../../shared/base';
import { QueryBuilderService } from '../query-builder.service';
import { SearchQuery } from '../state/search.query';
import { SearchService } from '../state/search.service';
import { SearchNotebookTableComponent } from '../search-notebook-table/search-notebook-table.component';
import { SearchToolTableComponent } from '../search-tool-table/search-tool-table.component';
import { SearchWorkflowTableComponent } from '../search-workflow-table/search-workflow-table.component';
import { MatDividerModule } from '@angular/material/divider';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    FlexModule,
    FontAwesomeModule,
    TagCloudComponent,
    MatDividerModule,
    SearchWorkflowTableComponent,
    SearchToolTableComponent,
    SearchNotebookTableComponent,
    AsyncPipe,
  ],
})
export class SearchResultsComponent extends Base implements OnInit {
  faPlus = faPlus;
  faMinus = faMinus;
  public noToolHits$: Observable<boolean>;
  public noWorkflowHits$: Observable<boolean>;
  public noNotebookHits$: Observable<boolean>;
  public showWorkflowTagCloud$: Observable<boolean>;
  public showToolTagCloud$: Observable<boolean>;
  public showNotebookTagCloud$: Observable<boolean>;
  toolTagCloudData: Array<CloudData>;
  workflowTagCloudData: Array<CloudData>;
  notebookTagCloudData: Array<CloudData>;
  options: CloudOptions = {
    width: 500,
    height: 200,
    overflow: false,
  };

  constructor(
    private searchService: SearchService,
    private queryBuilderService: QueryBuilderService,
    private searchQuery: SearchQuery,
    private extendedGA4GHService: ExtendedGA4GHService
  ) {
    super();
    this.noWorkflowHits$ = this.searchQuery.noWorkflowHits$;
    this.noToolHits$ = this.searchQuery.noToolHits$;
    this.noNotebookHits$ = this.searchQuery.noNotebookHits$;
    this.showToolTagCloud$ = this.searchQuery.showToolTagCloud$;
    this.showWorkflowTagCloud$ = this.searchQuery.showWorkflowTagCloud$;
    this.showNotebookTagCloud$ = this.searchQuery.showNotebookTagCloud$;
  }

  ngOnInit() {
    this.createTagCloud('tool');
    this.createTagCloud('workflow');
    this.createTagCloud('notebook');
  }

  createTagCloud(type: string) {
    const toolQuery = this.queryBuilderService.getTagCloudQuery(type);
    this.createToolTagCloud(toolQuery, type);
  }

  clickTagCloudBtn(type: 'tool' | 'workflow' | 'notebook') {
    this.searchService.setShowTagCloud(type);
  }

  createToolTagCloud(toolQuery: string, type) {
    this.extendedGA4GHService.toolsIndexSearch(toolQuery).subscribe(
      (hits: any) => {
        let weight = 10;
        let count = 0;
        if (hits && hits.aggregations && hits.aggregations.tagcloud) {
          hits.aggregations.tagcloud.buckets.forEach((tag) => {
            const theTag = {
              text: tag.key,
              weight: weight,
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
            } else if (type === 'workflow') {
              if (!this.workflowTagCloudData) {
                this.workflowTagCloudData = new Array<CloudData>();
              }
              this.workflowTagCloudData.push(theTag);
            } else {
              if (!this.notebookTagCloudData) {
                this.notebookTagCloudData = new Array<CloudData>();
              }
              this.notebookTagCloudData.push(theTag);
            }
            count--;
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // Tells the search service to tell the search filters to save its data
  saveSearchFilter() {
    this.searchService.toSaveSearch$.next(true);
  }

  getTabIndex() {
    return this.searchQuery.getValue().currentTabIndex;
  }

  tagClicked(clicked: CloudData) {
    this.searchService.searchTerm$.next(true);
    this.searchService.setSearchText(clicked.text);
    this.searchService.tagClicked$.next(true);
  }
}
