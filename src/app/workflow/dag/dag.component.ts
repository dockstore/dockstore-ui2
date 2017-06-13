declare var cytoscape: any;
import { Observable } from 'rxjs/Rx';
import { CommunicatorService } from './../../shared/communicator.service';
import { DagService } from './dag.service';
import { Component, OnInit, Input, OnChanges, AfterViewInit, AfterContentInit } from '@angular/core';
@Component({
  selector: 'app-dag',
  templateUrl: './dag.component.html',
  styleUrls: ['./dag.component.scss'],
  providers: [DagService]
})
export class DagComponent implements OnInit, OnChanges, AfterContentInit {
  @Input() validVersions: any;
  @Input() defaultVersion: any;
  @Input() id: number;

  private currentVersion: any;
  private currentWorkflowId;
  private element: any;
  private dagResults;
  private dagPromise: Promise<any>;
  private style = [
    {
      selector: 'node',
      style: {
        'content': 'data(name)',
        'font-size': '16px',
        'text-valign': 'center',
        'text-halign': 'center',
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
  refreshDocument() {
    console.log('refreshing document');
    const cy = cytoscape({
      container: this.element,
      boxSelectionEnabled: false,
      autounselectify: true,
      layout: {
        name: 'dagre'
      },
      style: this.style,
      elements: {nodes: [
            { data: { id: 'n0' } },
            { data: { id: 'n1' } },
            { data: { id: 'n2' } },
            { data: { id: 'n3' } },
            { data: { id: 'n4' } },
            { data: { id: 'n5' } },
            { data: { id: 'n6' } },
            { data: { id: 'n7' } },
            { data: { id: 'n8' } },
            { data: { id: 'n9' } },
            { data: { id: 'n10' } },
            { data: { id: 'n11' } },
            { data: { id: 'n12' } },
            { data: { id: 'n13' } },
            { data: { id: 'n14' } },
            { data: { id: 'n15' } },
            { data: { id: 'n16' } }
        ],
        edges: [
            { data: { source: 'n0', target: 'n1' } },
            { data: { source: 'n1', target: 'n2' } },
            { data: { source: 'n1', target: 'n3' } },
            { data: { source: 'n4', target: 'n5' } },
            { data: { source: 'n4', target: 'n6' } },
            { data: { source: 'n6', target: 'n7' } },
            { data: { source: 'n6', target: 'n8' } },
            { data: { source: 'n8', target: 'n9' } },
            { data: { source: 'n8', target: 'n10' } },
            { data: { source: 'n11', target: 'n12' } },
            { data: { source: 'n12', target: 'n13' } },
            { data: { source: 'n13', target: 'n14' } },
            { data: { source: 'n13', target: 'n15' } },
        ]}
    });
  }
 ngAfterContentInit() {
   this.refreshDocument();
 }
  refreshDocument2(results) {
    console.log(results);
    const cy = cytoscape({
      container: this.element,
      boxSelectionEnabled: false,
      autounselectify: true,
      layout: {
        name: 'dagre'
      },
      style: this.style,
      elements: results
    });
  }

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
    this.refreshDocument();
    this.element = document.getElementById('cy');
    this.dagService.currentWorkflowId.subscribe(workflowId => {
      console.log('1st');
      this.currentWorkflowId = workflowId;
      this.dagService.currentVersion.subscribe(version => {
        console.log('2nd');
        this.currentVersion = version;
        this.dagService.getDagResults(this.currentWorkflowId, this.currentVersion).subscribe(results => {
          this.dagResults = results;
          console.log(this.dagResults);
          this.refreshDocument();
        });
      });
    });
  }
}
