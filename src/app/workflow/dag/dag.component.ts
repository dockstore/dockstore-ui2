declare var cytoscape: any;
declare var window: any;
import { Observable } from 'rxjs/Rx';
import { CommunicatorService } from './../../shared/communicator.service';
import { DagService } from './dag.service';
import { Component, OnInit, Input, OnChanges, AfterViewInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
@Component({
  selector: 'app-dag',
  templateUrl: './dag.component.html',
  styleUrls: ['./dag.component.scss'],
  providers: [DagService]
})
export class DagComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @Input() validVersions: any;
  @Input() defaultVersion: any;
  @Input() id: number;

  private currentVersion: any;
  private currentWorkflowId;
  private element: any;
  private dagResults;
  private dagPromise: Promise<any>;
  private cy: any;
  private query: any;
  private initialized: Boolean = false;
  @ViewChild('cy') el: ElementRef;
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
    this.cy = cytoscape({
      container: this.element,
      boxSelectionEnabled: false,
      autounselectify: true,
      layout: {
        name: 'dagre'
      },
      style: this.style,
      elements: this.dagPromise
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
    this.dagPromise = this.dagService.getCurrentDAG(this.id, this.defaultVersion.id).toPromise();
  }

  ngAfterViewInit() {
    this.element = document.getElementById('cy');
    this.query = $('#cy');
  }

  ngAfterViewChecked() {
    if (this.initialized === false) {
      const isVisible = this.query.is(':visible');
      if (isVisible) {
        this.initialized = true;
        this.cy = window.cy = cytoscape({
          container: this.element,
          boxSelectionEnabled: false,
          autounselectify: true,
          layout: {
            name: 'dagre'
          },
          style: this.style,
          elements: this.dagPromise
        });
      }
    }
  }
}
