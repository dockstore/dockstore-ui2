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
    currentDagResults: Subject<any> = new BehaviorSubject<any>({
        nodes: [
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
        ]
    });

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
