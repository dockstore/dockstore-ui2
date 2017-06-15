declare var cytoscape: any;
import { Observable } from 'rxjs/Rx';
import { CommunicatorService } from './../../shared/communicator.service';
import { WorkflowService } from './../../shared/workflow.service';
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

  private currentWorkflowId;
  private element: any;
  private dagPromise: Promise<any>;
  private cy: any;
  private query: any;
  private initialized: Boolean = false;
  private expanded: Boolean = false;
  private selectVersion;
  @ViewChild('cy') el: ElementRef;
  private style;
  private workflow;

  refreshDocument() {
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

  constructor(private dagService: DagService, private workflowService: WorkflowService) {
  }

  toggleExpand() {
    this.expanded = !this.expanded;
    this.initialized = false;  // This will set the DAG after the view has been checked
  }

  ngOnInit() {
    this.dagPromise = this.dagService.getCurrentDAG(this.id, this.defaultVersion.id).toPromise();
    this.workflowService.workflow$.subscribe(workflow => this.workflow = workflow);
    this.selectVersion = this.defaultVersion;
    this.style = this.dagService.style;
  }

  download() {
    const pngDAG = this.cy.png({full: true, scale: 2});
    const name = this.workflow.repository + '_' + this.selectVersion.name + '.png';
    $('#exportLink').attr('href', pngDAG).attr('download', name);
  }

  ngAfterViewInit() {
    this.element = document.getElementById('cy');
    this.query = $('#cy');
    this.selectVersion = this.defaultVersion;
  }

  ngAfterViewChecked() {
    if (this.initialized === false) {
      const isVisible = this.query.is(':visible');
      if (isVisible) {
        this.initialized = true;
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
    }
  }
}
