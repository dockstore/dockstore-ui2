/*
 *    Copyright 2019 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { DOCUMENT } from '@angular/common';
import { ElementRef, Inject, Injectable, Renderer2 } from '@angular/core';
import * as cytoscape from 'cytoscape';
import { CytoscapeOptions } from 'cytoscape';
import dagreExtension from 'cytoscape-dagre';
import popperExtension from 'cytoscape-popper';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { WorkflowQuery } from '../../../shared/state/workflow.query';
import { WorkflowsService, WorkflowVersion } from '../../../shared/swagger';
import { DynamicPopover } from '../dynamicPopover.model';
import { DagQuery } from './dag.query';
import { DagStore } from './dag.store';

@Injectable()
export class DagService {
  readonly style = [
    {
      selector: 'node',
      style: {
        content: 'data(name)',
        'font-size': '16px',
        'text-valign': 'center',
        'text-halign': 'center',
        'background-color': '#7a88a9',
      },
    },

    {
      selector: 'edge',
      style: {
        width: 3,
        'target-arrow-shape': 'triangle',
        'line-color': '#9dbaea',
        'target-arrow-color': '#9dbaea',
        'curve-style': 'bezier',
      },
    },

    {
      selector: 'node[id = "UniqueBeginKey"]',
      style: {
        content: 'Start',
        'font-size': '16px',
        'text-valign': 'center',
        'text-halign': 'center',
        'background-color': '#4caf50',
      },
    },

    {
      selector: 'node[id = "UniqueEndKey"]',
      style: {
        content: 'End',
        'font-size': '16px',
        'text-valign': 'center',
        'text-halign': 'center',
        'background-color': '#f44336',
      },
    },

    {
      selector: 'node[type = "workflow"]',
      style: {
        content: 'data(name)',
        'font-size': '16px',
        'text-valign': 'center',
        'text-halign': 'center',
        'background-color': '#4ab4a9',
      },
    },

    {
      selector: 'node[type = "tool"]',
      style: {
        content: 'data(name)',
        'font-size': '16px',
        'text-valign': 'center',
        'text-halign': 'center',
        'background-color': '#51aad8',
      },
    },

    {
      selector: 'node[type = "expressionTool"]',
      style: {
        content: 'data(name)',
        'font-size': '16px',
        'text-valign': 'center',
        'text-halign': 'center',
        'background-color': '#9966FF',
      },
    },

    {
      selector: 'edge.notselected',
      style: {
        opacity: '0.4',
      },
    },
  ];

  constructor(
    private workflowsService: WorkflowsService,
    private dagStore: DagStore,
    private dagQuery: DagQuery,
    private renderer: Renderer2,
    private workflowQuery: WorkflowQuery,
    @Inject(DOCUMENT) private document: HTMLDocument
  ) {}

  getTooltipText(name: string, tool: string, type: string, docker: string, run: string): string {
    const dynamicPopover = this.setDynamicPopover(name, tool, type, docker, run);
    return `
    <div>
    <div><b>Type: </b>${dynamicPopover.type}</div>
    ${this.getRunText(dynamicPopover.run)}
    ${this.getDockerText(dynamicPopover.link, dynamicPopover.docker)}
    </div>`;
  }

  setDynamicPopover(name: string, tool: string, type: string, docker: string, run: string): DynamicPopover {
    return {
      title: name ? name : 'n/a',
      link: tool,
      type: type ? type : 'n/a',
      docker: docker ? docker : 'n/a',
      run: run ? run : 'n/a',
    };
  }

  getRunText(run: string) {
    const isHttp = this.isHttp(run);
    if (isHttp) {
      return `<div><b>Run: </b> <a href='` + run + `'>` + run + `</a></div>`;
    } else {
      return `<div><b>Run: </b>` + run + `</div>`;
    }
  }

  /**
   * Make element fullscreen.
   * TODO: Possibly move this function out into a shared service because it may be useful elsewhere
   *
   * @param {((HTMLElement | any))} nativeElement  The element to make fullscreen.
   * any because mozRequestFullScreen, webkitRequestFullscreen, and msRequestFullscreen not found
   * @memberof DagComponent
   */
  openFullscreen(nativeElement: HTMLElement | any) {
    if (nativeElement.requestFullscreen) {
      nativeElement.requestFullscreen();
    } else if (nativeElement.mozRequestFullScreen) {
      /* Firefox */
      nativeElement.mozRequestFullScreen();
    } else if (nativeElement.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      nativeElement.webkitRequestFullscreen();
    } else if (nativeElement.msRequestFullscreen) {
      /* IE/Edge */
      nativeElement.msRequestFullscreen();
    }
  }

  /**
   * Exit fullscreen
   * TODO: Possibly move this function out into a shared service because it may be useful elsewhere
   *
   * @memberof DagComponent
   */
  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    }
  }

  /**
   * Determines whether the page is in fullscreen mode or not
   *
   * @returns {boolean}
   * @memberof DagService
   */
  isFullScreen(): boolean {
    // any because those properties apparently don't exist in type def
    const document: HTMLDocument | any = this.document;
    return (
      (document.fullscreenElement && document.fullscreenElement !== null) ||
      (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
      (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
      (document.msFullscreenElement && document.msFullscreenElement !== null)
    );
  }

  getDockerText(link: string, docker: string) {
    const validLink = this.isValidUrl(link);
    if (validLink) {
      return `<div><b>Docker: </b> <a href='` + link + `'>` + docker + `</a></div>`;
    } else {
      return `<div><b>Docker: </b>` + docker + `</div>`;
    }
  }

  isValidUrl(possibleUrl: string | null | undefined): boolean {
    try {
      // tslint:disable-next-line: no-unused-expression
      new URL(possibleUrl);
    } catch (_) {
      return false;
    }
    return true;
  }

  isHttp(run: string) {
    if (run.match('^http') || run.match('^https')) {
      return true;
    } else {
      return false;
    }
  }

  setDagResults(results: any): void {
    this.dagStore.update((state) => {
      return {
        ...state,
        dagResults: results,
      };
    });
  }

  download(cy: cytoscape.Core, versionName: string, exportLink: ElementRef) {
    if (cy) {
      const pngDAG = cy.png({ full: true, scale: 2 });
      const name = this.workflowQuery.getActive().repository + '_' + versionName + '.png';
      this.renderer.setAttribute(exportLink.nativeElement, 'href', pngDAG);
      this.renderer.setAttribute(exportLink.nativeElement, 'download', name);
    }
  }

  getDAGResults(workflowVersion: WorkflowVersion, workflowId: number) {
    if (workflowVersion && workflowVersion.id) {
      this.dagStore.setLoading(true);
      this.getCurrentDAG(workflowId, workflowVersion.id)
        .pipe(finalize(() => this.dagStore.setLoading(false)))
        .subscribe(
          (result) => {
            this.setDagResults(result);
          },
          (error) => {
            this.setDagResults(null);
          }
        );
    }
  }

  getCurrentDAG(workflowId: number, versionId: number): Observable<string> {
    if (workflowId && versionId) {
      return this.workflowsService.getWorkflowDag(workflowId, versionId);
    } else {
      return null;
    }
  }

  /**
   * Create the tooltip HTMLDivElement from scratch because popper doesn't have a default
   *
   * @private
   * @param {string} name  Name of the node
   * @param {string} runText  Most text for the node
   * @returns {HTMLDivElement}  The tooltip HTML element that still uses qtip styles
   * @memberof DagService
   */
  private createPopupHTML(name: string, runText: string, cyElement: HTMLDivElement): HTMLDivElement {
    const div = document.createElement('div');
    div.innerHTML = `
    <div class="qtip-titlebar">${name}</div>
    <div class="qtip-content">${runText}</div>
    `;
    div.setAttribute('class', 'opaq qtip-bootstrap bootstrap-tooltip-z-index');
    if (this.isFullScreen()) {
      // If fullscreen append it to the cy element because the cdk-overlay-container div is not in the fullscreen element
      cyElement.appendChild(div);
    } else {
      document.body.appendChild(div);
    }
    return div;
  }

  /**
   * Creates event handlers for a single node
   *
   * @private
   * @param {cytoscape.NodeSingular} node  The node to create event handlers for
   * @memberof DagService
   */
  private setDAGNodeTooltip(node: cytoscape.NodeSingular, element: HTMLDivElement): void {
    let popper: any;
    const name = node.data('name');
    const tool = node.data('tool');
    const type = node.data('type');
    const docker = node.data('docker');
    const run = node.data('run');
    const runText = this.getTooltipText(name, tool, type, docker, run);
    const update = () => {
      // popper() doesn't exist on type cytoscape.NodeSingular because type definitions don't know about extensions
      popper = (<any>node).popper({
        content: () => {
          return this.createPopupHTML(name, runText, element);
        },
        popper: { removeOnDestroy: true },
      });
      popper.scheduleUpdate();
    };
    const destroy = () => {
      try {
        popper.destroy();
      } catch (error) {
        return;
      }
    };
    node.on('mouseover', update);
    node.on('mouseout mousedown', destroy);
  }

  loadExtensions() {
    cytoscape.use(dagreExtension);
    // Check if extension is registered already. If it is, don't try to re-register.
    // Typedef doesn't have 2 argument overload, using <any> to override.
    if (typeof (<any>cytoscape)('core', 'popper') !== 'function') {
      cytoscape.use(popperExtension);
    }
  }

  refreshDocument(cy: cytoscape.Core, element): cytoscape.Core {
    const dagResult = JSON.parse(JSON.stringify(this.dagQuery.getValue().dagResults));
    if (dagResult) {
      const cytoscapeOptions: CytoscapeOptions = {
        container: element,
        boxSelectionEnabled: false,
        autounselectify: true,
        // We don't have the type definition for cytoscape-dagre
        layout: <cytoscape.BaseLayoutOptions>{
          name: 'dagre',
          nodeDimensionsIncludeLabels: true,
        },
        style: this.style,
        elements: dagResult,
      };
      cy = cytoscape(cytoscapeOptions);

      // Sets up popups on all nodes (except begin and end)
      const nodes: cytoscape.NodeCollection = cy.nodes().filter((node) => node.id() !== 'UniqueBeginKey' && node.id() !== 'UniqueEndKey');
      nodes.forEach((node: cytoscape.NodeSingular) => this.setDAGNodeTooltip(node, element));

      cy.on('mouseout', 'node', function () {
        const node = this;
        cy.elements().removeClass('notselected');
        node.connectedEdges().animate(
          {
            style: {
              'line-color': '#9dbaea',
              'target-arrow-color': '#9dbaea',
              width: 3,
            },
          },
          {
            duration: 150,
          }
        );
      });

      cy.on('mouseover', 'node', function () {
        const node = this;
        cy.elements().difference(node.connectedEdges()).not(node).addClass('notselected');

        node.outgoers('edge').animate(
          {
            style: {
              'line-color': '#e57373',
              'target-arrow-color': '#e57373',
              width: 5,
            },
          },
          {
            duration: 150,
          }
        );
        node.incomers('edge').animate(
          {
            style: {
              'line-color': '#81c784',
              'target-arrow-color': '#81c784',
              width: 5,
            },
          },
          {
            duration: 150,
          }
        );
      });

      cy.on('tap', 'node[id!="UniqueBeginKey"][id!="UniqueEndKey"]', function () {
        try {
          // your browser may block popups
          if (this.data('tool') !== 'https://hub.docker.com/_/' && this.data('tool') !== '' && this.data('tool') !== undefined) {
            window.open(this.data('tool'));
          }
        } catch (e) {
          // fall back on url change
          if (this.data('tool') !== 'https://hub.docker.com/_/' && this.data('tool') !== '' && this.data('tool') !== undefined) {
            window.location.href = this.data('tool');
          }
        }
      });
    }
    return cy;
  }
}
