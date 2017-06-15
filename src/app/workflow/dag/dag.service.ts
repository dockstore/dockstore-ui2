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
