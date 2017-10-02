import { ELASTIC_SEARCH_CLIENT } from '../elastic-search-client';
import { CloudData, CloudOptions } from 'angular-tag-cloud-module';
import { SearchService } from './../search.service';
import { Component, OnInit } from '@angular/core';
import bodybuilder from 'bodybuilder';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  public activeToolBar = true;
  public workflowHits: any;
  public toolHits: any;
  public browseToolsTab = 'browseToolsTab';
  public browseWorkflowsTab = 'browseWorkflowsTab';
  toolTagCloudData: Array<CloudData>;
  workflowTagCloudData: Array<CloudData>;
  showToolTagCloud = false;
  showWorkflowTagCloud = false;
  options: CloudOptions = {
    width: 600,
    height: 200,
    overflow: false,
  };
  constructor(private searchService: SearchService) {

  }

  ngOnInit() {
    this.searchService.workflowhit$.subscribe(workflowHits => {
      this.workflowHits = workflowHits;
      this.setTabActive();
    });
    this.searchService.toolhit$.subscribe(toolHits => {
      this.toolHits = toolHits;
      this.setTabActive();
    });
    this.createTagCloud('tool');
    this.createTagCloud('workflow');
  }

  createTagCloud(type: string) {
    let body = bodybuilder().size();
    body = body.query('match', '_type', type);
    body = body.aggregation('significant_terms', 'description', 'tagcloud', { size: 20 }).build();
    const toolQuery = JSON.stringify(body, null, 1);
    this.createToolTagCloud(toolQuery, type);
  }

  clickTagCloudBtn(type: string) {
    if (type === 'tool') {
      this.showToolTagCloud = !this.showToolTagCloud;
    } else {
      this.showWorkflowTagCloud = !this.showWorkflowTagCloud;
    }
  }

  createToolTagCloud(toolQuery, type) {
    ELASTIC_SEARCH_CLIENT.search({
      index: 'tools',
      type: 'entry',
      body: toolQuery
    }).then(hits => {
      let weight = 10;
      let count = 0;
      hits.aggregations.tagcloud.buckets.forEach(
        tag => {
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
        }
      );
    });
  }

  // Tells the search service to tell the search filters to save its data
  saveSearchFilter() {
    this.searchService.toSaveSearch$.next(true);
  }

  tagClicked(clicked: CloudData) {
    this.searchService.searchTerm$.next(true);
    this.searchService.values$.next(clicked.text);
    this.searchService.tagClicked$.next(true);
    // this.searchTerm = true;
    // this.values = clicked.text;
    // this.updateQuery();
  }

  /**
   * This handles the which tab (tool or workflow) is set to active based on hits.
   * The default is tool if both have hits
   *
   * @memberof SearchResultsComponent
   */
  setTabActive(): void {
    if (!this.toolHits || !this.workflowHits) {
      this.activeToolBar = true;
      return;
    }
    if (this.toolHits.length === 0 && this.workflowHits.length > 0) {
      this.activeToolBar = false;
    } else if (this.workflowHits.length === 0 && this.toolHits.length > 0) {
      this.activeToolBar = true;
    } else {
      this.activeToolBar = true;
    }
  }

  haveNoHits(object: Object[]): boolean {
    return this.searchService.haveNoHits(object);
  }
}
