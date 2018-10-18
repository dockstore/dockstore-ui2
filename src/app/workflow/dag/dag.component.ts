/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the 'License');
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an 'AS IS' BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { AfterViewChecked, Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

import { Dockstore } from '../../shared/dockstore.model';
import { EntryTab } from '../../shared/entry/entry-tab';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { Workflow } from './../../shared/swagger/model/workflow';
import { WorkflowVersion } from './../../shared/swagger/model/workflowVersion';
import { DagService } from './dag.service';

declare var cytoscape: any;
declare var window: any;

@Component({
  selector: 'app-dag',
  templateUrl: './dag.component.html',
  styleUrls: ['./dag.component.scss'],
  providers: [DagService]
})
export class DagComponent extends EntryTab implements OnInit, AfterViewChecked {
  @Input() validVersions: Array<WorkflowVersion>;
  @Input() defaultVersion: WorkflowVersion;
  @Input() id: number;

  _selectedVersion: WorkflowVersion;
  @Input() set selectedVersion(value: WorkflowVersion) {
    if (value != null) {
      this._selectedVersion = value;
      this.onChange();
    }
  }

  @ViewChild('exportLink') exportLink: ElementRef;

  private element: any;
  public dagResult: any;
  private cy: any;

  public expanded: Boolean = false;
  @ViewChild('cy') el: ElementRef;
  private style;
  public workflow: Workflow;
  private tooltip: string;
  public missingTool;
  private refresh = false;

  public dagType: 'classic' | 'cwlviewer' = 'classic';
  public enableCwlViewer = Dockstore.FEATURES.enableCwlViewer;
  public refreshCounter = 1;

  setDagResult(dagResult: any) {
    this.dagResult = dagResult;
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      this.expanded = false;
      this.refreshDocument();
    }
  }

  reset() {
    this.refreshCounter++;
    this.refreshDocument();
  }

  refreshDocument() {
    const self = this;
    if (this.dagResult) {
      this.element = document.getElementById('cy');
      this.cy = cytoscape({
        container: this.element,
        boxSelectionEnabled: false,
        autounselectify: true,
        layout: {
          name: 'dagre'
        },
        style: this.style,
        elements: this.dagResult
      });

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
  }

  constructor(private renderer: Renderer2, private dagService: DagService, private workflowQuery: WorkflowQuery) {
    super();
  }

  toggleExpand() {
    this.expanded = !this.expanded;
    this.refresh = true;  // This will set the DAG after the view has been checked
  }

  ngOnInit() {
    this.workflowQuery.workflow$.subscribe(workflow => this.workflow = workflow);
    this.style = this.dagService.style;
    this.missingTool = false;
  }

  updateMissingTool() {
    if (!this.dagResult) {
      this.missingTool = true;
    } else {
      if (this.dagResult.edges.length < 1 && this.dagResult.nodes.length < 1) {
        this.missingTool = true;
      } else {
        this.missingTool = false;
      }
    }
  }

  download() {
    if (this.cy) {
      const pngDAG = this.cy.png({ full: true, scale: 2 });
      const name = this.workflow.repository + '_' + this._selectedVersion.name + '.png';
      this.renderer.setAttribute(this.exportLink.nativeElement, 'href', pngDAG);
      this.renderer.setAttribute(this.exportLink.nativeElement, 'download', name);
    }
  }
  ngAfterViewChecked() {
    if (this.refresh) {
      this.refresh = false;
      this.refreshDocument();
    }
  }

  onChange() {
    if (this._selectedVersion) {
      this.getDag(this._selectedVersion.id);
    }
  }

  getDag(versionId: number) {
    this.dagService.getCurrentDAG(this.id, versionId).subscribe(result => {
      this.handleDagResponse(result);
    }, error => {
      this.handleDagResponse(null);
    });
  }

  handleDagResponse(result: any) {
    this.setDagResult(result);
    this.refresh = true;
    this.updateMissingTool();
  }
}
