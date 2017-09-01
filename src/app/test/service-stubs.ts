import { User } from './../shared/swagger/model/user';
import { StarRequest } from './../shared/swagger/model/starRequest';
import { DockstoreTool } from './../shared/swagger/model/dockstoreTool';
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
    tool$: BehaviorSubject<any> = new BehaviorSubject({});
    tools$: BehaviorSubject<DockstoreTool[]> = new BehaviorSubject([]);  // This contains the list of unsorted workflows
    getDescriptors() {
        return null;
    }
    toolCopyBtnClick(copyBtn): void {
    }
    copyBtnSubscript(): void {
    }
    setTools(tools: DockstoreTool[]) {
        this.tools$.next(tools);
    }
    setTool(tools: DockstoreTool) {
        this.tool$.next(tools);
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
    authenticate() {
        return Observable.of({});
    }
}

export class ErrorStubService {

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
    refresh(userId: number, extraHttpRequestParams?: any): Observable<Array<DockstoreTool>> {
        return Observable.of([]);
    }
    refreshWorkflows(userId: number, extraHttpRequestParams?: any): Observable<Array<Workflow>> {
        return Observable.of([]);
    }
}

export class HttpStubService {
    getDockstoreToken() {
        return 'IMAFAKEDOCKSTORETOKEN';
    }
}

export class WorkflowStubService {
    nsWorkflows$ = Observable.of([]);
    workflow$: BehaviorSubject<any> = new BehaviorSubject({}); // This is the selected workflow
    workflows$: BehaviorSubject<Workflow[]> = new BehaviorSubject([]);  // This contains the list of unsorted workflows
    copyBtn$ = Observable.of({});
    setWorkflow(thing: Workflow) {
        this.workflow$.next(thing);
    }
    setWorkflows(thing: any) {
        this.workflows$.next(thing);
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

    starEntry(workflowId: number, body: StarRequest, extraHttpRequestParams?: any): Observable<{}> {
        return Observable.of({});
    }

    unstarEntry(workflowId: number, extraHttpRequestParams?: any): Observable<{}> {
        return Observable.of({});
    }

    getStarredUsers(workflowId: number, extraHttpRequestParams?: any): Observable<Array<User>> {
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
    getWorkflowDag(workflowId: number, workflowVersionId: number, extraHttpRequestParams?: any): Observable<string> {
        return Observable.of('someDAG');
    }
}

export class ContainersStubService {
    getTestParameterFiles(containerId: number, tag?: string, descriptorType?: string, extraHttpRequestParams?: any):
        Observable<Array<SourceFile>> {
        return Observable.of([]);
    }

    starEntry(containerId: number, body: StarRequest, extraHttpRequestParams?: any): Observable<{}> {
        return Observable.of({});
    }

    unstarEntry(containerId: number, extraHttpRequestParams?: any): Observable<{}> {
        return Observable.of({});
    }

    getStarredUsers(containerId: number, extraHttpRequestParams?: any): Observable<Array<User>> {
        return Observable.of([]);
    }

    getDockerRegistries(extraHttpRequestParams?: any): Observable<Array<{ [key: string]: any; }>> {
        return Observable.of([
            {
              'dockerPath': 'quay.io',
              'customDockerPath': 'false',
              'privateOnly': 'false',
              'enum': 'QUAY_IO',
              'friendlyName': 'Quay.io',
              'url': 'https://quay.io/repository/'
            },
            {
              'dockerPath': 'registry.hub.docker.com',
              'customDockerPath': 'false',
              'privateOnly': 'false',
              'enum': 'DOCKER_HUB',
              'friendlyName': 'Docker Hub',
              'url': 'https://hub.docker.com/'
            },
            {
              'dockerPath': 'registry.gitlab.com',
              'customDockerPath': 'false',
              'privateOnly': 'false',
              'enum': 'GITLAB',
              'friendlyName': 'GitLab',
              'url': 'https://gitlab.com/'
            },
            {
              'dockerPath': null,
              'customDockerPath': 'true',
              'privateOnly': 'true',
              'enum': 'AMAZON_ECR',
              'friendlyName': 'Amazon ECR',
              'url': null
            }
          ]);
    }
    refresh(containerId: number, extraHttpRequestParams?: any): Observable<DockstoreTool> {
        const tool: DockstoreTool = {
            default_cwl_path: 'refreshedDefaultCWLPath',
            default_dockerfile_path: 'refreshedDefaultDockerfilePath',
            default_wdl_path: 'refreshedDefaultWDLPath',
            gitUrl: 'refreshedGitUrl',
            mode: DockstoreTool.ModeEnum.AUTODETECTQUAYTAGSAUTOMATEDBUILDS,
            name: 'refreshedName',
            namespace: 'refreshedNamespace',
            private_access: false,
            registry: DockstoreTool.RegistryEnum.QUAYIO,
            toolname: 'refreshedToolname'
        };
        return Observable.of(tool);
    }
}

export class VersionModalStubService {

}

export class StateStubService {
    publicPage$ = Observable.of(false);
    refreshing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}
