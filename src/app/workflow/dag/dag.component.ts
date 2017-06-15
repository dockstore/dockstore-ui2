declare var cytoscape: any;
import { Observable } from 'rxjs/Rx';
import { CommunicatorService } from './../../shared/communicator.service';
import { WorkflowService } from './../../shared/workflow.service';
import { DagService } from './dag.service';
import { Component, OnInit, Input, OnChanges, AfterViewInit, ViewChild, ElementRef, AfterContentInit } from '@angular/core';
@Component({
  selector: 'app-dag',
  templateUrl: './dag.component.html',
  styleUrls: ['./dag.component.scss'],
  providers: [DagService]
})
export class DagComponent implements OnInit, AfterViewInit {
  @Input() validVersions: any;
  @Input() defaultVersion: any;
  @Input() id: number;

  private currentWorkflowId;
  private element: any;
  private dagPromise: Promise<any>;
  private cy: any;
  public expanded: Boolean = false;
  private selectVersion;
  @ViewChild('cy') el: ElementRef;
  private style;
  private workflow;

  refreshDocument() {
    const self = this;
    this.element = document.getElementById('cy');
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
    self.cy.on('mouseover', 'node', function () {
      const node = this;
      self.cy.elements().difference(node.connectedEdges()).not(node).addClass('notselected');

      node.outgoers('edge').animate({
        style: {
          'line-color': '#e57373',
          'target-arrow-color': '#e57373',
          'width': 5
        }
      }, {
          duration: 150
        });
      node.incomers('edge').animate({
        style: {
          'line-color': '#81c784',
          'target-arrow-color': '#81c784',
          'width': 5
        }
      }, {
          duration: 150
        });
    });

    self.cy.on('mouseout', 'node', function () {
      const node = this;
      self.cy.elements().removeClass('notselected');
      node.connectedEdges().animate({
        style: {
          'line-color': '#9dbaea',
          'target-arrow-color': '#9dbaea',
          'width': 3
        }
      }, {
          duration: 150
        });
    });
    this.selectVersion = this.defaultVersion;
    $(document).on('keyup', function (e) {
      // Keycode 27 is the ESC key
      if (e.keyCode === 27) {
        self.expanded = false;
        self.refreshDocument();
      }
    });
  }

  constructor(private dagService: DagService, private workflowService: WorkflowService) {
  }

  toggleExpand() {
    this.expanded = !this.expanded;
    this.refreshDocument();  // This will set the DAG after the view has been checked
  }

  ngOnInit() {
    this.dagPromise = this.dagService.getCurrentDAG(this.id, this.defaultVersion.id).toPromise();
    this.workflowService.workflow$.subscribe(workflow => this.workflow = workflow);
    this.selectVersion = this.defaultVersion;
    this.style = this.dagService.style;
  }

  download() {
    const pngDAG = this.cy.png({ full: true, scale: 2 });
    const name = this.workflow.repository + '_' + this.selectVersion.name + '.png';
    $('#exportLink').attr('href', pngDAG).attr('download', name);
  }

  ngAfterViewInit() {
    this.refreshDocument();
  }
}
