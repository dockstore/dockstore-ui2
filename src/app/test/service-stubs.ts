import { AdvancedSearchObject } from './../shared/models/AdvancedSearchObject';
import { SubBucket } from './../shared/models/SubBucket';
import { Dockstore } from './../shared/dockstore.model';
import { Token } from './../shared/swagger/model/token';
import { bitbucketToken, gitHubToken, gitLabToken, quayToken, sampleWorkflow1, updatedWorkflow } from './mocked-objects';
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
    replaceTool(tools: any, newTool: any) {
        return Observable.of(tools);
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


export class QueryBuilderStubService {
    getTagCloudQuery(type: string): string {
        return '';
    }
    getSidebarQuery(query_size: number, values: string, advancedSearchObject: AdvancedSearchObject, searchTerm: boolean,
        bucketStubs: any, filters: any, sortModeMap: any): string {
        return 'thisissomefakequery';
    }
    getResultQuery(query_size: number, values: string, advancedSearchObject: AdvancedSearchObject, searchTerm: boolean,
        filters: any): string {
        return 'thisissomefakequery';
    }
    getNonVerifiedQuery(query_size: number, values: string, advancedSearchObject: AdvancedSearchObject, searchTerm: boolean, filters: any) {
        return 'thisissomefakequery';
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
    workflowhit$ = Observable.of([]);
    toolhit$ = Observable.of([]);
    searchInfo$ = Observable.of({});
    toSaveSearch$ = Observable.of(false);
    values$ = Observable.of('');
    joinComma(searchTerm: string): string {
        return searchTerm.trim().split(' ').join(', ');
    }
    haveNoHits(object: Object[]): boolean {
        if (!object || object.length === 0) {
            return true;
        } else {
            return false;
        }
    }

    noResults(searchTerm: string, hits: any) {
        return false;
    }
    hasSearchText(advancedSearchObject: any, searchTerm: string, hits: any) {
        return true;
    }

    hasFilters(filters: any) {
        return true;
    }

    hasResults(searchTerm: string, hits: any) {
        return true;
    }

    // Initialization Functions
    initializeBucketStubs() {
        return new Map([
            ['Entry Type', '_type'],
            ['Registry', 'registry'],
            ['Private Access', 'private_access'],
            ['Verified', 'tags.verified'],
            ['Author', 'author'],
            ['Organization', 'namespace'],
            ['Labels', 'labels.value.keyword'],
            ['Verified Source', 'tags.verifiedSource'],
        ]);
    }

    createPermalinks(searchInfo: any) {
        return 'thisisafakepermalink';
    }

    createURIParams(cururl) {
        const url = cururl.substr('/search'.length + 1);
        const params = new URLSearchParams(url);
        return params;
    }
    initializeFriendlyNames() {
        return new Map([
            ['_type', 'Entry Type'],
            ['registry', 'Registry'],
            ['private_access', 'Private Access'],
            ['tags.verified', 'Verified'],
            ['author', 'Author'],
            ['namespace', 'Organization'],
            ['labels.value.keyword', 'Labels'],
            ['tags.verifiedSource', 'Verified Source'],
        ]);
    }

    initializeEntryOrder() {
        return new Map([
            ['_type', new SubBucket],
            ['author', new SubBucket],
            ['registry', new SubBucket],
            ['namespace', new SubBucket],
            ['labels.value.keyword', new SubBucket],
            ['private_access', new SubBucket],
            ['tags.verified', new SubBucket],
            ['tags.verifiedSource', new SubBucket]
        ]);
    }

    initializeFriendlyValueNames() {
        return new Map([
            ['tags.verified', new Map([
                ['1', 'verified'], ['0', 'non-verified']
            ])],
            ['private_access', new Map([
                ['1', 'private'], ['0', 'public']
            ])],
            ['registry', new Map([
                ['QUAY_IO', 'Quay.io'], ['DOCKER_HUB', 'Docker Hub'], ['GITLAB', 'GitLab'], ['AMAZON_ECR', 'Amazon ECR']
            ])]
        ]);
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
    errorObj$: BehaviorSubject<any> = new BehaviorSubject(null);  // This contains the list of unsorted workflows

}

export class ConfigurationStub {
    apiKeys = {
        accessToken: '',
        apiKeys: {},
        basePath: Dockstore.API_URI
    };
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
    getUserTokens(userId: number, extraHttpRequestParams?: any): Observable<Array<Token>> {
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
    workflow$: BehaviorSubject<any> = new BehaviorSubject({ sampleWorkflow1 }); // This is the selected workflow
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
    replaceWorkflow(workflows: Workflow[], newWorkflow: Workflow) { }
}

export class RefreshStubService {
    refreshAllWorkflows() { }
}

export class RegisterWorkflowModalStubService {
    setIsModalShown() {

    }
    setWorkflowRepository(repository) {
    }
}

export class PageNumberStubService {
}

export class LogoutStubService {
}

export class UserStubService {
    userId$ = Observable.of(5);
    user$ = Observable.of({});
}

export class TokensStubService {
    public addQuayToken(accessToken?: string, extraHttpRequestParams?: any): Observable<Token> {
        return Observable.of(quayToken);
    }
    public addBitbucketToken(accessToken?: string, extraHttpRequestParams?: any): Observable<Token> {
        return Observable.of(bitbucketToken);
    }
    public addGithubToken(accessToken?: string, extraHttpRequestParams?: any): Observable<Token> {
        return Observable.of(gitHubToken);
    }
    public addGitlabToken(accessToken?: string, extraHttpRequestParams?: any): Observable<Token> {
        return Observable.of(gitLabToken);
    }
    public deleteToken(tokenId: number, extraHttpRequestParams?: any): Observable<{}> {
        return Observable.of({});
    }
}

export class AdvancedSearchStubService {
    showModal$ = Observable.of(true);
    advancedSearch$ = Observable.of({});
}

export class StarringStubService {
    getStarring(id: any, type: any): Observable<Array<User>> {
        return Observable.of([]);
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
    getDescriptors(versions, version) {
        if (version) {
            const typesAvailable = new Array();
            for (const file of version.sourceFiles) {
                const type = file.type;
                if (type === 'DOCKSTORE_CWL' && !typesAvailable.includes('cwl')) {
                    typesAvailable.push('cwl');
                } else if (type === 'DOCKSTORE_WDL' && !typesAvailable.includes('wdl')) {
                    typesAvailable.push('wdl');
                }
            }
            return typesAvailable;
        }
    }
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
    refreshMessage$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
}
