/*
 *     Copyright 2025 OICR and UCSC
 *
 *     Licensed under the Apache License, Version 2.0 (the "License")
 *     you may not use this file except in compliance with the License
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Base } from '../shared/base';
import { SearchQuery, SearchResult } from './state/search.query';
import { SearchService } from './state/search.service';
import { EntryType, ExtendedGA4GHService, Workflow } from 'app/shared/openapi';
import { AsyncPipe, DatePipe, KeyValuePipe, LowerCasePipe, NgFor, NgIf } from '@angular/common';
import TopicSelectionEnum = Workflow.TopicSelectionEnum;
import { RouterLink } from '@angular/router';
import { AiBubbleComponent } from 'app/shared/ai-bubble/ai-bubble.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ExtendedModule, FlexLayoutModule } from '@ngbracket/ngx-layout';
import { RouterLinkPipe } from 'app/entry/router-link.pipe';
import { EntryToDisplayNamePipe } from 'app/shared/entry-to-display-name.pipe';
import { DescriptorLanguagePipe } from 'app/shared/entry/descriptor-language.pipe';
import { DoiBadgeComponent } from 'app/shared/entry/doi/doi-badge/doi-badge.component';
import { JoinWithEllipsesPipe } from './join-with-ellipses.pipe';
import { SearchAuthorsHtmlPipe } from './search-authors-html.pipe';
import { CloudData, CloudOptions, TagCloudComponent } from 'angular-tag-cloud-module';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { QueryBuilderService } from './query-builder.service';
import { CategoryButtonComponent } from 'app/categories/button/category-button.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PreviewWarningComponent } from 'app/preview-warning/preview-warning.component';

export interface SortOption {
  label: string;
  sort: Sort;
}

/**
 * this component refers to search page not workflow listing search
 */

@Component({
  selector: 'app-search-entry-table',
  templateUrl: './search-entry-table.component.html',
  styleUrls: ['../shared/styles/entry-table.scss', './search-entry-table.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatProgressBarModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    RouterLink,
    AiBubbleComponent,
    ExtendedModule,
    MatIconModule,
    FontAwesomeModule,
    NgFor,
    MatPaginatorModule,
    KeyValuePipe,
    DescriptorLanguagePipe,
    SearchAuthorsHtmlPipe,
    JoinWithEllipsesPipe,
    MatCardModule,
    FlexLayoutModule,
    DatePipe,
    DoiBadgeComponent,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    EntryToDisplayNamePipe,
    RouterLinkPipe,
    MatDividerModule,
    TagCloudComponent,
    AsyncPipe,
    MatButtonModule,
    LowerCasePipe,
    CategoryButtonComponent,
    MatChipsModule,
    PreviewWarningComponent,
  ],
})
export class SearchEntryTableComponent extends Base implements OnInit {
  faPlus = faPlus;
  faMinus = faMinus;
  public EntryType = EntryType;
  protected readonly TopicSelectionEnum = TopicSelectionEnum;
  protected readonly DescriptorTypeEnum = Workflow.DescriptorTypeEnum;
  @Input() entryType: EntryType;
  @ViewChild(MatPaginator, { static: true }) protected paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) protected sort: MatSort;
  protected ngUnsubscribe: Subject<{}> = new Subject();

  public readonly displayedColumns = ['result'];
  public readonly columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  public readonly searchEverythingFriendlyNames = new Map([
    ['full_workflow_path', 'Path'],
    ['tool_path', 'Path'],
    ['workflowVersions.sourceFiles.content', 'Source Files'],
    ['tags.sourceFiles.content', 'Source Files'],
    ['description', 'Description'],
    ['labels', 'Labels'],
    ['all_authors.name', 'Authors'],
    ['topicAutomatic', 'Topic'],
    ['categories.topic', 'Category Topic'],
    ['categories.displayName', 'Category'],
  ]);
  public defaultSortOption: SortOption = {
    label: 'Relevance',
    sort: { active: null, direction: 'desc' },
  };
  public sortOptions: SortOption[] = [
    this.defaultSortOption,
    {
      label: 'Most Stars',
      sort: { active: 'starredUsers', direction: 'desc' },
    },
    {
      label: 'Recently Updated',
      sort: { active: 'last_modified_date', direction: 'desc' },
    },
    {
      label: 'Name, A-Z',
      sort: { active: 'name', direction: 'asc' },
    },
    {
      label: 'Name, Z-A',
      sort: { active: 'name', direction: 'desc' },
    },
    {
      label: 'Authors, A-Z',
      sort: { active: 'all_authors', direction: 'asc' },
    },
    {
      label: 'Authors, Z-A',
      sort: { active: 'all_authors', direction: 'desc' },
    },
  ];

  dataSource: MatTableDataSource<SearchResult>;
  tagCloudData: Array<CloudData>;
  showTagCloudForEntryType: boolean;
  options: CloudOptions = {
    width: 500,
    height: 200,
    overflow: false,
  };

  privateNgOnInit(): Observable<Array<SearchResult>> {
    switch (this.entryType) {
      case EntryType.WORKFLOW:
        return this.searchQuery.workflows$;
      case EntryType.TOOL:
        return this.searchQuery.tools$;
      case EntryType.NOTEBOOK:
        return this.searchQuery.notebooks$;
      default:
        return null;
    }
  }

  constructor(
    private readonly searchQuery: SearchQuery,
    private readonly searchService: SearchService,
    private readonly queryBuilderService: QueryBuilderService,
    private readonly extendedGA4GHService: ExtendedGA4GHService
  ) {
    super();
  }

  ngOnInit(): void {
    this.createTagCloud(this.entryType);

    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
    this.setSort(this.defaultSortOption.sort);
    this.dataSource.paginator = this.paginator;

    combineLatest([this.searchQuery.showTagCloud$, this.searchQuery.currentEntryType$])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([showTagCloud, currentEntryType]) => {
        this.showTagCloudForEntryType = showTagCloud && currentEntryType === this.entryType;
      });

    combineLatest([this.searchQuery.pageSize$, this.searchQuery.pageIndex$, this.privateNgOnInit()])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([pageSize, pageIndex, entries]) => {
        this.dataSource.paginator.pageSize = pageSize;
        this.dataSource.paginator.pageIndex = pageIndex;
        // Must set data after paginator, just a material datatables thing.
        this.dataSource.data = entries || [];
      });
    this.dataSource.sortData = (data: SearchResult[], sort: MatSort) => {
      if (sort.active && sort.direction) {
        return data.slice().sort((a: SearchResult, b: SearchResult) => {
          return this.searchService.compareAttributes(a.source, b.source, sort.active, sort.direction, this.entryType);
        });
      } else {
        // Either the active field or direction is unset, so return the data in the original order, unsorted.
        return data;
      }
    };
  }

  updatePageSizeAndIndex($event: PageEvent) {
    this.searchService.setPageSizeAndIndex($event.pageSize, $event.pageIndex);
  }

  setSort(sortValue: Sort) {
    this.sort.active = sortValue.active;
    this.sort.direction = sortValue.direction;
    this.sort.sortChange.emit(sortValue);
  }

  createTagCloud(type: EntryType) {
    const toolQuery = this.queryBuilderService.getTagCloudQuery(type);
    this.createToolTagCloud(toolQuery);
  }

  clickTagCloudBtn(type: EntryType) {
    this.searchService.setShowTagCloud(type);
  }

  createToolTagCloud(toolQuery: string) {
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
            if (!this.tagCloudData) {
              this.tagCloudData = new Array<CloudData>();
            }
            this.tagCloudData.push(theTag);
            count--;
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  tagClicked(clicked: CloudData) {
    this.searchService.searchTerm$.next(true);
    this.searchService.setSearchText(clicked.text);
    this.searchService.tagClicked$.next(true);
  }
}
