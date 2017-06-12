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

    getCurrentDAG(workflowId, versionId) {
        if (workflowId != null && versionId != null) {
        const url: string = Dockstore.API_URI + '/workflows/' + workflowId + '/dag/' + versionId;
        return this.httpService.getAuthResponse(url);
        } else {
            return null;
        }
    }
}
