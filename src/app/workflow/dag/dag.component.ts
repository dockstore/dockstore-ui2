declare var cytoscape: any;
import { Observable } from 'rxjs/Rx';
import { CommunicatorService } from './../../shared/communicator.service';
import { DagService } from './dag.service';
import { Component, OnInit, Input, OnChanges, AfterViewInit } from '@angular/core';
@Component({
  selector: 'app-dag',
  templateUrl: './dag.component.html',
  styleUrls: ['./dag.component.scss'],
  providers: [DagService]
})
export class DagComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() validVersions: any;
  @Input() defaultVersion: any;
  @Input() id: number;

  private currentVersion: any;
  private currentWorkflowId;
  private dagResults: any;
  private dagPromise: any;
  
  constructor(private dagService: DagService) {
  }
  select(data) {
    console.log('Item clicked', data);
  }
  onLegendLabelClick(entry) {
    console.log('Legend clicked', entry);
  }

  toggleExpand(node) {
    console.log('toggle expand', node);
  }

  ngOnInit() {
    this.dagService.setCurrentVersion(this.defaultVersion);
    this.dagService.setCurrentWorkflowId(this.id);
  }

  ngAfterViewInit() {
    const element = document.getElementById('cy');

    console.log('this is fine1');
    const cy = cytoscape({
      container: element,
      layout: {
        name: 'dagre'
      },
      style: [
            {
              selector: 'node',
              style: {
                'content': 'data(id)',
                'text-opacity': 0.5,
                'text-valign': 'center',
                'text-halign': 'right',
                'background-color': '#11479e'
              }
            },
            {
              selector: 'edge',
              style: {
                'width': 4,
                'target-arrow-shape': 'triangle',
                'line-color': '#9dbaea',
                'target-arrow-color': '#9dbaea',
                'curve-style': 'bezier'
              }
            }
          ],
      elements: {
      // selectable: false,
      grabbable: false,
      nodes: [{
        data: {
          id: '0',
          text: 'abc'
        }
      }, {
        data: {
          id: '1',
          text: 'def'
        }
      }, {
        data: {
          id: '2',
          text: 'ghi'
        }
      }, {
        data: {
          id: '3',
          text: 'jkl'
        }
      }], // nodes
      edges: [{
          data: {
            color: '#f00',
            source: '0',
            target: '1'
          }
        }, {
          data: {
            color: '#f00',
            source: '1',
            target: '2'
          }
        }, {
          data: {
            color: '#f00',
            source: '2',
            target: '3'
          }
        }, {
          data: {
            color: '#f00',
            source: '0',
            target: '2'
          }
        }, {
          data: {
            color: '#000',
            source: '0',
            target: '3'
          }
        }, {
          data: {
            color: '#f00',
            source: '0',
            target: '3'
          }
        }] // edges
    }
    });

  }
  ngOnChanges() {
    console.log('ngOnChanges');
    this.dagService.currentVersion.subscribe((version => {
      this.currentVersion = version;
      if (this.currentVersion != null && this.currentWorkflowId != null) {
        this.dagService.getCurrentDAG(this.currentWorkflowId, this.currentVersion.id).subscribe(results => {
          this.dagService.setDagResults(results);
        });
      }
    }));
    this.dagService.currentWorkflowId.subscribe((workflowId => {
      this.currentWorkflowId = workflowId;
      if (this.currentVersion != null && this.currentWorkflowId != null) {
        this.dagService.getCurrentDAG(this.currentWorkflowId, this.currentVersion.id).subscribe(results => {
          this.dagService.setDagResults(results);
        });
      }
    }));
    this.dagPromise = this.dagService.currentDagResults.toPromise();
    this.dagService.currentDagResults.subscribe((results => {
      this.dagResults = results;
      console.log(results);
    }));
  }
}