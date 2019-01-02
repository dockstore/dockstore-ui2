import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { CytoscapeOptions } from 'cytoscape';
import * as cytoscape from 'cytoscape';
import dagreExtension from 'cytoscape-dagre';
import popperExtension from 'cytoscape-popper';

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

  constructor(private workflowsService: WorkflowsService, private dagStore: DagStore, private dagQuery: DagQuery,
    private renderer: Renderer2, private workflowQuery: WorkflowQuery) {
  }

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
      run: run ? run : 'n/a'
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

  getDockerText(link: string, docker: string) {
    const validLink = !this.isNA(docker);
    if (validLink) {
      return `<div><b>Docker: </b> <a href='` + link + `'>` + docker + `</a></div>`;
    } else {
      return `<div><b>Docker: </b>` + docker + `</div>`;
    }
  }

  isNA(docker: string) {
    return (docker === 'n/a');
  }

  isHttp(run: string) {
    if (run.match('^http') || run.match('^https')) {
      return true;
    } else {
      return false;
    }
  }

  setDagResults(results: any): void {
    this.dagStore.setState(state => {
      return {
        ...state,
        dagResults: results
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
      this.getCurrentDAG(workflowId, workflowVersion.id).subscribe(result => {
        this.setDagResults(result);
      }, error => {
        this.setDagResults(null);
      });
    }
  }

  getCurrentDAG(workflowId, versionId) {
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
  private createPopupHTML(name: string, runText: string): HTMLDivElement {
    const div = document.createElement('div');
    div.innerHTML = `
    <div class="qtip-titlebar">${name}</div>
    <div class="qtip-content">${runText}</div>
    `;
    div.setAttribute('class', 'opaq qtip-bootstrap bootstrap-tooltip-z-index');
    document.body.appendChild(div);
    return div;
  }

  /**
   * Creates event handlers for a single node
   *
   * @private
   * @param {cytoscape.NodeSingular} node  The node to create event handlers for
   * @memberof DagService
   */
  private setDAGNodeTooltip(node: cytoscape.NodeSingular): void {
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
          return this.createPopupHTML(name, runText);
        },
        popper: {removeOnDestroy: true}
      });
      popper.scheduleUpdate();
    };
    const destroy = () => {
      popper.destroy();
    };
    node.on('mouseover', update);
    node.on('mouseout mousedown', destroy);
  }

  refreshDocument(cy: cytoscape.Core, element): cytoscape.Core {
    const dagResult = JSON.parse(JSON.stringify(this.dagQuery.getSnapshot().dagResults));
    if (dagResult) {
      const cytoscapeOptions: CytoscapeOptions = {
        container: element,
        boxSelectionEnabled: false,
        autounselectify: true,
        layout: {
          name: 'dagre'
        },
        style: this.style,
        elements: dagResult
      };
      cytoscape.use(dagreExtension);
      cytoscape.use(popperExtension);
      cy = cytoscape(cytoscapeOptions);

      // Sets up popups on all nodes (except begin and end)
      const nodes: cytoscape.NodeCollection = cy.nodes().filter(node => node.id() !== 'UniqueBeginKey' && node.id() !== 'UniqueEndKey');
      nodes.forEach((node: cytoscape.NodeSingular) => this.setDAGNodeTooltip(node));

      cy.on('mouseout', 'node', function () {
        const node = this;
        cy.elements().removeClass('notselected');
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

      cy.on('mouseover', 'node', function () {
        const node = this;
        cy.elements().difference(node.connectedEdges()).not(node).addClass('notselected');

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

      cy.on('tap', 'node[id!="UniqueBeginKey"][id!="UniqueEndKey"]', function () {
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
    return cy;
  }
}
