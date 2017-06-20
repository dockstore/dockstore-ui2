import { DynamicPopover } from './dynamicPopover.model';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Dockstore } from './../../shared/dockstore.model';
import { HttpService } from './../../shared/http.service';
import { Injectable } from '@angular/core';


@Injectable()
export class DagService {
    validVersions: Subject<any> = new Subject<any>();
    currentWorkflowId: Subject<number> = new Subject<number>();
    currentVersion: Subject<any> = new Subject<any>();
    currentDagResults: Subject<any> = new Subject<any>();
    dynamicPopover: DynamicPopover = {
        link: '',
        title: '',
        type: '',
        docker: '',
        run: ''
      };
    style = [
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

    constructor(private httpService: HttpService) {
    }

    getTooltipText(name: string, tool: string, type: string, docker: string, run: string) {
        this.setDynamicPopover(name, tool, type, docker, run);
        return `<div>
          <div><b>Type:</b>` + this.dynamicPopover.type + `</div>` +
          this.getRunText(this.dynamicPopover.run) +
          this.getDockerText(this.dynamicPopover.link, this.dynamicPopover.docker) +
           `</div>`
        ;
    };

    updateUndefinedPopoverContent() {
    if (this.dynamicPopover.title === undefined) {
      this.dynamicPopover.title = 'n/a';
    }
    if (this.dynamicPopover.type === undefined) {
      this.dynamicPopover.type = 'n/a';
    }
    if (this.dynamicPopover.docker === undefined) {
      this.dynamicPopover.docker = 'n/a';
    }
    if (this.dynamicPopover.run === undefined) {
      this.dynamicPopover.run = 'n/a';
    }
  };

    setDynamicPopover(name: string, tool: string, type: string, docker: string, run: string) {
    this.dynamicPopover.title = name;
      this.dynamicPopover.link = tool;
      this.dynamicPopover.type = type;
      this.dynamicPopover.docker = docker;
      this.dynamicPopover.run = run;
      this.updateUndefinedPopoverContent();
    }

    getRunText(run: string) {
        const isHttp = this.isHttp(run);
        if (isHttp) {
            return `<div><b>Run:</b> <a href='` + run + `'>` + run + `</a></div>`;
        } else {
            return `<div><b>Run:</b>` + run + `</div>`;
        }
    };

    getDockerText(link: string, docker: string) {
        const validLink = !this.isNA(docker);
        console.log(validLink);
        if (validLink) {
            return `<div><b>Docker:</b> <a href='` + link + `'>` + docker + `</a></div>`;
        } else {
            return `<div><b>Docker:</b>` + docker + `</div>`;
        }
    }

    isNA(docker: string) {
        return(docker === 'n/a');
    };

    isHttp(run: string) {
        if (run.match('^http') || run.match('^https')) {
            return true;
        } else {
            return false;
        }
    };

    setCurrentWorkflowId(newWorkflowId: number): void {
        this.currentWorkflowId.next(newWorkflowId);
    }

    setCurrentVersion(newVersion: number): void {
        this.currentVersion.next(newVersion);
    }

    setDagResults(results: any): void {
        this.currentDagResults.next(results);
    }
    updateDagResults(workflowId, versionId) {
        const url: string = Dockstore.API_URI + '/workflows/' + workflowId + '/dag/' + versionId;
        this.httpService.getAuthResponse(url).subscribe(results => this.currentDagResults.next(results));
    }
    getDagResults(workflowId, versionId): Observable<any> {
        const url: string = Dockstore.API_URI + '/workflows/' + workflowId + '/dag/' + versionId;
        return this.httpService.getAuthResponse(url);
    }
    getCurrentDAG(workflowId, versionId) {
        if (workflowId != null && versionId != null) {
            const url: string = Dockstore.API_URI + '/workflows/' + workflowId + '/dag/' + versionId;
            return this.httpService.getAuthResponse(url);
        } else {
            return null;
        }
    }
}
