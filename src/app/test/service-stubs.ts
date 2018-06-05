/*
 *    Copyright 2017 OICR
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
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { Dockstore } from './../shared/dockstore.model';
import { AdvancedSearchObject } from './../shared/models/AdvancedSearchObject';
import { SubBucket } from './../shared/models/SubBucket';
import { DockstoreTool } from './../shared/swagger/model/dockstoreTool';
import { Metadata } from './../shared/swagger/model/metadata';
import { SourceFile } from './../shared/swagger/model/sourceFile';
import { StarRequest } from './../shared/swagger/model/starRequest';
import { Token } from './../shared/swagger/model/token';
import { User } from './../shared/swagger/model/user';
import { Workflow } from './../shared/swagger/model/workflow';
import { WorkflowVersion } from './../shared/swagger/model/workflowVersion';
import { bitbucketToken, gitHubToken, gitLabToken, quayToken, sampleWorkflow1, updatedWorkflow } from './mocked-objects';

export class ContainerStubService {
    private copyBtnSource = new BehaviorSubject<any>(null); // This is the currently selected copy button.
    copyBtn$ = this.copyBtnSource.asObservable();
    tool$: BehaviorSubject<any> = new BehaviorSubject({});
    toolId$ = Observable.of(1);
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
    getBuildMode(mode: DockstoreTool.ModeEnum) {
        return 'Fully-Automated';
    }
    getBuildModeTooltip(mode: DockstoreTool.ModeEnum) {
        return 'Fully-Automated: All versions are automated builds';
    }
}
export class ProviderStubService {
    setUpProvider(tool) {
        tool.provider = 'a provider';
        tool.providerUrl = 'a provider url';
        return tool;
    }
}
export class FileStubService {
  getFilePath(file): string {
    return '';
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

    getVerifiedQuery(query_size: number, values: string, advancedSearchObject: AdvancedSearchObject, searchTerm: boolean, filters: any) {
        return 'thisissomefakequery';
    }
}

export class GA4GHStubService {
    metadataGet(): Observable<Metadata> {
        const metadata: Metadata = {
            version: '3',
            api_version: '3',
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
    initializeCommonBucketStubs() {
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
    workflow$: BehaviorSubject<any> = new BehaviorSubject({}); // This is the selected workflow
    workflowId$ = Observable.of(1);
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
    get full_workflow_path() { return ''; }
    get descriptorType() { return ''; }
}

export class HostedStubService {
    deleteHostedWorkflowVersion(id: string, version: string) {
      return Observable.of({});
    }

    editHostedWorkflow(id: string, sourceFiles: any) {
      return Observable.of({});
    }

    createHostedWorkflow(name: string, descriptorType: string) {
      return Observable.of({});
    }
}

export class MetadataStubService {
    sourceControlList = Observable.of([
        {
            'value': 'github.com',
            'friendlyName': 'GitHub'
        },
        {
            'value': 'bitbucket.org',
            'friendlyName': 'BitBucket'
        },
        {
            'value': 'gitlab.com',
            'friendlyName': 'GitLab'
        }
    ]);

    dockerRegistriesList = Observable.of([
        {
            'dockerPath': 'quay.io',
            'friendlyName': 'Quay.io',
            'url': 'https://quay.io/repository/',
            'privateOnly': 'false',
            'customDockerPath': 'false',
            'enum': 'QUAY_IO'
        },
        {
            'dockerPath': 'registry.hub.docker.com',
            'friendlyName': 'Docker Hub',
            'url': 'https://hub.docker.com/',
            'privateOnly': 'false',
            'customDockerPath': 'false',
            'enum': 'DOCKER_HUB'
        },
        {
            'dockerPath': 'registry.gitlab.com',
            'friendlyName': 'GitLab',
            'url': 'https://gitlab.com/',
            'privateOnly': 'false',
            'customDockerPath': 'false',
            'enum': 'GITLAB'
        },
        {
            'dockerPath': null,
            'friendlyName': 'Amazon ECR',
            'url': null,
            'privateOnly': 'true',
            'customDockerPath': 'true',
            'enum': 'AMAZON_ECR'
        }
    ]);

    descriptorLanguageList = Observable.of([
        {
            'value': 'CWL',
            'friendlyName': 'Common Workflow Language'
        },
        {
            'value': 'WDL',
            'friendlyName': 'Workflow Description Language'
        }
    ]);

    getSourceControlList(thing?: any): Observable<any> {
        return this.sourceControlList;
    }

    getDockerRegistries(thing?: any): Observable<any> {
        return this.dockerRegistriesList;
    }

    getDescriptorLanguages(thing?: any): Observable<any> {
        return this.descriptorLanguageList;
    }
}

export class RefreshStubService {
    refreshAllWorkflows() { }
    refreshWorkflow() {
    }
    handleSuccess(message: string): void {
    }

    handleError(message: string, error: any): void {
    }
}

export class AccountsStubService {
    link(thing: string) {

    }
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

export class TokenStubService {
    hasGitHubToken$ = Observable.of(false);
    updateTokens(): void {
    }
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

export class CheckerWorkflowStubService {
    entry$ = Observable.of({id: 1});
    checkerWorkflow$ = Observable.of(null);
    checkerWorkflowPath$ = Observable.of({});
    checkerWorkflowDefaultWorkflowPath$ = Observable.of('checkerWorkflowDefaultWorkflowPath');
    checkerWorkflowVersionName$ = Observable.of({});
    isEntryAWorkflow() {
        return true;
    }
}

export class DescriptorLanguageStubService {
    descriptorLanguages$ = Observable.of(['cwl', 'wdl', 'nextflow']);
}

export class RegisterCheckerWorkflowStubService {
    errorObj$ = Observable.of(null);
    public isModalShown$ = new BehaviorSubject<boolean>(false);
    public refreshMessage$ = new BehaviorSubject<string>(null);
    public mode$ = new BehaviorSubject<'add' | 'edit'>('edit');
}

export class LaunchCheckerWorkflowStubService {
    command = 'potato';
}

export class UrlResolverStubService {
    getEntryPathFromURL() {
        return 'quay.io/garyluu/dockstore-tool-md5sum';
    }
}

export class StarEntryStubService {
    starEntry$ = Observable.of({});
}

export class ImageProviderStubService {
    setUpImageProvider(tool) {
        tool.imgProvider = 'Quay.io';
        tool.imgProviderUrl = 'an image provider url';
        return tool;
    }
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
    getVersions(version) {
        return Observable.of([]);
    }
    getDescriptors(id, type, versionName, descriptor) {
        return Observable.of({});
    }
}

export class ContainertagsStubService {

}

export class DockstoreStubService {
    getIconClass() {

    }

    /* Strip mailto from email field */
    stripMailTo(email: string) {
        return 'stripped email';
    }

    getVersionVerified(versions) {
        return true;
    }

    getVerifiedSource(name: string, verifiedSource: any) {
        return 'a verified source';
    }

    getVerifiedSources(tool) {
        return [{ version: 'c', verifiedSource: 'tester' }];
    }
    getVerifiedWorkflowSources(tool) {
        return [{ version: 'c', verifiedSource: 'tester' }];
    }
}

export class DateStubService {
    getVerifiedLink() {
        return '/docs/faq#what-is-a-verified-tool-or-workflow-';
    }
    getDateTimeMessage() {
        return 'a date time message';
    }
    getAgoMessage(timestamp: number) {
        return 'an ago message';
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
        return Observable.of(sampleWorkflow1);
    }
    refresh(workflowId: number, extraHttpRequestParams?: any): Observable<Workflow> {
        const refreshedWorkflow: Workflow = {
            'descriptorType': 'cwl',
            'gitUrl': 'refreshedGitUrl',
            'mode': Workflow.ModeEnum.FULL,
            'organization': 'refreshedOrganization',
            'repository': 'refreshedRepository',
            'workflow_path': 'refreshedWorkflowPath',
            'workflowVersions': [],
            'defaultTestParameterFilePath': 'refreshedDefaultTestParameterFilePath',
            'sourceControl': 'github.com',
            'source_control_provider': 'GITHUB'
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
    wdl(workflowId: number, tag: string ) {
      return Observable.of({});
    }
    secondaryWdl(workflowId: number, tag: string) {
      return Observable.of([]);
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
            registry_string: 'quay.io',
            registry: DockstoreTool.RegistryEnum.QUAYIO,
            toolname: 'refreshedToolname',
            defaultCWLTestParameterFile: 'refreshedDefaultCWLTestParameterFile',
            defaultWDLTestParameterFile: 'refreshedDefaultWDLTestParameterFile'
        };
        return Observable.of(tool);
    }
}

export class VersionModalStubService {

}

export class WorkflowVersionStubService {
  get name() {return ''; }
}

export class StateStubService {
    publicPage$ = Observable.of(false);
    refreshMessage$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
}
