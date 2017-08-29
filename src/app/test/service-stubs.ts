import { WorkflowVersion } from './../shared/swagger/model/workflowVersion';
import { SourceFile } from './../shared/swagger/model/sourceFile';
import { Workflow } from './../shared/swagger/model/workflow';
import { Configuration } from './../shared/swagger/configuration';
import { SearchService } from './../search/search.service';
import { Observable } from 'rxjs/Observable';
import { Metadata } from './../shared/swagger/model/metadata';
import { Doc } from './../docs/doc.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
export class ContainerStubService {
    private copyBtnSource = new BehaviorSubject<any>(null); // This is the currently selected copy button.
    copyBtn$ = this.copyBtnSource.asObservable();
    tool$ = Observable.of({});
    getDescriptors() {
        return null;
    }
    toolCopyBtnClick(copyBtn): void {
    }
    copyBtnSubscript(): void {
    }
}

export class FileStubService { }
export class DocsStubService {
    getDocs(): Doc[] {
        return null;
    }
    getDoc(slug: string): Doc {
        return null;
    }
}

export class GA4GHStubService {
    metadataGet(): Observable<Metadata> {
        const metadata: Metadata = {
            version: '3',
            apiversion: '3',
        };
        return Observable.of(metadata);
    }
}

export class SearchStubService {
    searchInfo$ = Observable.of({});
    loading$ = Observable.of(false);
    setLoading() {
    }
}

export class ListContainersStubService {
}

export class TrackLoginStubService {
    isLoggedIn$ = Observable.of(true);
}

export class LoginStubService {

}

export class AuthStubService {
    getToken() {
        return 'asdf';
    }
}

export class ConfigurationStub {

}

export class UsersStubService {
    getUser() {
        return Observable.of({});
    }
    userWorkflows() {
        return Observable.of([]);
    }
    getStarredTools() {
        return Observable.of([]);
    }
    getStarredWorkflows() {
        return Observable.of([]);
    }
}

export class HttpStubService {
    getDockstoreToken() {
        return 'IMAFAKEDOCKSTORETOKEN';
    }
}

export class WorkflowStubService {
    workflows$ = Observable.of([]);
    nsWorkflows$ = Observable.of([]);
    workflow$ = Observable.of({});
    copyBtn$ = Observable.of({});
    setWorkflow(thing: Workflow) {
    }
    setWorkflows(thing: any) {
    }
    setNsWorkflows(thing: any) {
    }
    getDescriptors() {
    }
    getTestJson() {
        return Observable.of({});
    }
}

export class RefreshStubService {

}

export class RegisterWorkflowModalStubService {
}

export class PageNumberStubService {
}

export class LogoutStubService {
}

export class UserStubService {
    user$ = Observable.of({});
}

export class AdvancedSearchStubService {
    showModal$ = Observable.of(true);
    advancedSearch$ = Observable.of({});
}

export class StarringStubService {
    getStarring(id: any, type: any) {
        return Observable.of({});
    }
}

export class StarEntryStubService {
    starEntry$ = Observable.of({});
}

export class ImageProviderStubService {

}

export class DagStubService {

}

export class DescriptorsStubService {

}

export class ParamFilesStubService {
    getVersions() {
        return Observable.of([]);
    }
    getDescriptors() {
        return Observable.of({});
    }
}

export class DockstoreStubService {
    getIconClass() {

    }
}

export class DateStubService {
    getVerifiedLink() {
        return '/docs/faq#what-is-a-verified-tool-or-workflow-';
    }
    getDateTimeMessage() {

    }
}

export class WorkflowsStubService {
    getTestParameterFiles(workflowId: number, version?: string, extraHttpRequestParams?: any): Observable<Array<SourceFile>> {
        return Observable.of([]);
    }

    manualRegister(workflowRegistry: string, workflowPath: string, defaultWorkflowPath: string, workflowName: string,
        descriptorType: string, extraHttpRequestParams?: any): Observable<Workflow> {
        return Observable.of({});
    }
    refresh(workflowId: number, extraHttpRequestParams?: any): Observable<Workflow> {
        const refreshedWorkflow: Workflow = {
            'descriptorType': 'cwl',
            'gitUrl': 'refreshedGitUrl',
            'mode': Workflow.ModeEnum.FULL,
            'organization': 'refreshedOrganization',
            'repository': 'refreshedRepository',
            'workflow_path': 'refreshedWorkflowPath',
            'workflowVersions': []
        };
        return Observable.of(refreshedWorkflow);
    }
    updateWorkflow(workflowId: number, body: Workflow, extraHttpRequestParams?: any): Observable<Workflow> {
        const updatedWorkflow: Workflow = {
            'descriptorType': 'cwl',
            'gitUrl': 'updatedGitUrl',
            'mode': Workflow.ModeEnum.FULL,
            'organization': 'updatedOrganization',
            'repository': 'updatedRepository',
            'workflow_path': 'updatedWorkflowPath',
            'workflowVersions': []
        };
        return Observable.of(updatedWorkflow);
    }
    updateWorkflowVersion(workflowId: number, body: Array<WorkflowVersion>, extraHttpRequestParams?: any):
    Observable<Array<WorkflowVersion>> {
        const updatedWorkflowVersions: WorkflowVersion[] = [];
        return Observable.of(updatedWorkflowVersions);
    }
    addTestParameterFiles(workflowId: number, testParameterPaths: Array<string>, body?: string, version?: string,
        extraHttpRequestParams?: any): Observable<Array<SourceFile>> {
            return Observable.of([]);
    }
    deleteTestParameterFiles(workflowId: number, testParameterPaths: Array<string>, version?: string, extraHttpRequestParams?: any):
    Observable<Array<SourceFile>> {
        return Observable.of([]);
    }
}

export class ContainersStubService {
    getTestParameterFiles(containerId: number, tag?: string, descriptorType?: string, extraHttpRequestParams?: any):
        Observable<Array<SourceFile>> {
        return Observable.of([]);
    }
}

export class VersionModalStubService {

}

export class StateStubService {
    publicPage$ = Observable.of(false);
}
