
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
export class DagComponent implements OnInit, OnChanges {
  @Input() validVersions: any;
  @Input() defaultVersion: any;
  @Input() id: number;

  private currentVersion: any;
  private currentWorkflowId;
  private dagResults: any;
  private dagPromise: any;
  private style = [
    {
      selector: 'node',
      style: {
        'content': 'data(name)',
        'font-size': '16px',
        'text-valign': 'center',
        'text-halign': 'center',
        'background-opacity': '10',
        'background-color': '#7a88a9'
      }
    },

    {
      selector: 'edge',
      style: {
        'width': 3,
        'target-arrow-shape': 'triangle',
        'line-color': '#9dbaea',
        'target-arrow-color': '#9dbaea',
        'curve-style': 'bezier'
      }
    },

    {
      selector: 'node[id = "UniqueBeginKey"]',
      style: {
        'content': 'Start',
        'font-size': '16px',
        'text-valign': 'center',
        'text-halign': 'center',
        'background-opacity': '10',
        'background-color': '#4caf50'
      }
    },

    {
      selector: 'node[id = "UniqueEndKey"]',
      style: {
        'content': 'End',
        'font-size': '16px',
        'text-valign': 'center',
        'text-halign': 'center',
        'background-opacity': '10',
        'background-color': '#f44336'
      }
    },

    {
      selector: 'node[type = "workflow"]',
      style: {
        'content': 'data(name)',
        'font-size': '16px',
        'text-valign': 'center',
        'text-halign': 'center',
        'background-opacity': '10',
        'background-color': '#4ab4a9'
      }
    },

    {
      selector: 'node[type = "tool"]',
      style: {
        'content': 'data(name)',
        'font-size': '16px',
        'text-valign': 'center',
        'text-halign': 'center',
        'background-opacity': '10',
        'background-color': '#51aad8'
      }
    },

    {
      selector: 'node[type = "expressionTool"]',
      style: {
        'content': 'data(name)',
        'font-size': '16px',
        'text-valign': 'center',
        'text-halign': 'center',
        'background-opacity': '10',
        'background-color': '#9966FF'
      }
    },

    {
      selector: 'edge.notselected',
      style: {
        'opacity': '0.4'
      }
    }
  ];

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
  ngOnChanges() {
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
      const element = document.getElementById('cy');
      const cy = cytoscape({
        container: element,
        layout: {
          name: 'dagre'
        },
        style: this.style,
        elements: this.dagResults
      });
    }));
  }
}
