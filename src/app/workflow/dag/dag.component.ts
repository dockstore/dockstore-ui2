declare var cytoscape: any;
declare var window: any;
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
  private dagResult: any;
  private cy: any;

  public expanded: Boolean = false;
  private selectVersion;
  @ViewChild('cy') el: ElementRef;
  private style;
  private workflow;
  private tooltip: string;
  private missingTool;

  refreshDocument() {
    const self = this;
    if (this.dagResult !== null) {
      this.element = document.getElementById('cy');
      console.log(typeof (this.element));
      console.log(typeof (this.el));
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

    self.cy.on('mouseover', 'node[id!="UniqueBeginKey"][id!="UniqueEndKey"]', function () {
      const node = this;
      const name = this.data('name');
      const tool = this.data('tool');
      const type = this.data('type');
      const docker = this.data('docker');
      const run = this.data('run');
      const runText = self.dagService.getTooltipText(name, tool, type, docker, run);
      const tooltip = node.qtip({
        content: {
          text: runText,
          title: node.data('name')
        },
        show: {
          solo: true
        },
        style: {
          classes: 'qtip-bootstrap',
        }
      });
      const api = tooltip.qtip('api');
      api.toggle(true);
    });

    self.cy.on('mouseout mousedown', 'node[id!="UniqueBeginKey"][id!="UniqueEndKey"]', function () {
      const node = this;
      const api = node.qtip('api');
      api.destroy();
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

    $(document).on('keyup', function (e) {
      // Keycode 27 is the ESC key
      if (e.keyCode === 27) {
        self.expanded = false;
        self.refreshDocument();
      }
    });
    self.cy.on('tap', 'node[id!="UniqueBeginKey"][id!="UniqueEndKey"]', function () {
      try { // your browser may block popups
        if (this.data('tool') !== 'https://hub.docker.com/_/' && this.data('tool') !== '' && this.data('tool') !== undefined) {
          window.open(this.data('tool'));
        }
      } catch (e) { // fall back on url change
        if (this.data('tool') !== 'https://hub.docker.com/_/' && this.data('tool') !== '' && this.data('tool') !== undefined) {
          window.location.href = this.data('tool');
        }
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
    this.dagService.getCurrentDAG(this.id, this.defaultVersion.id).subscribe(result => {
      this.dagResult = result;
      this.updateMissingTool();
    });
    this.workflowService.workflow$.subscribe(workflow => this.workflow = workflow);
    this.selectVersion = this.defaultVersion;
    this.style = this.dagService.style;
    this.missingTool = false;
  }

  updateMissingTool() {
    if (this.dagResult.edges.length < 1 && this.dagResult.nodes.length < 1) {
      this.missingTool = true;
    } else {
      this.missingTool = false;
    }
  }

  download() {
    const pngDAG = this.cy.png({ full: true, scale: 2 });
    const name = this.workflow.repository + '_' + this.selectVersion.name + '.png';
    $('#exportLink').attr('href', pngDAG).attr('download', name);
  }

  ngAfterViewInit() {
    this.refreshDocument();
  }

  onChange(version) {
    this.dagService.getCurrentDAG(this.id, version.id).subscribe(result => {
      this.dagResult = result;
      this.updateMissingTool();
    });
  }
}
