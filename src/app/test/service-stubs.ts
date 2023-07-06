/*
 *     Copyright 2018 OICR
 *
 *     Licensed under the Apache License, Version 2.0 (the "License")
 *     you may not use this file except in compliance with the License
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */
import { HttpResponse } from '@angular/common/http';
import { EntryType } from 'app/shared/enum/entry-type';
import { EntryType as newEntryType, EntryTypeMetadata, EntryUpdateTime } from 'app/shared/openapi';
import { BehaviorSubject, EMPTY, Observable, of as observableOf } from 'rxjs';
import { SearchFields } from '../search/state/search.service';
import { TagEditorMode } from '../shared/enum/tagEditorMode.enum';
import { CloudInstance, TRSService } from '../shared/openapi';
import { Dockstore } from './../shared/dockstore.model';
import { AdvancedSearchObject } from './../shared/models/AdvancedSearchObject';
import { SubBucket } from './../shared/models/SubBucket';
import { Permission, ToolDescriptor } from './../shared/openapi';
import { DockstoreTool } from './../shared/openapi/model/dockstoreTool';
import { Entry } from './../shared/openapi/model/entry';
import { SourceFile } from './../shared/openapi/model/sourceFile';
import { StarRequest } from './../shared/openapi/model/starRequest';
import { TokenUser } from './../shared/openapi/model/tokenUser';
import { User } from './../shared/openapi/model/user';
import { Workflow } from './../shared/openapi/model/workflow';
import { WorkflowVersion } from './../shared/openapi/model/workflowVersion';
import { bitbucketToken, gitHubToken, gitLabToken, quayToken, sampleTag, sampleWorkflow1, updatedWorkflow } from './mocked-objects';
import RoleEnum = Permission.RoleEnum;
import DescriptorTypeEnum = Workflow.DescriptorTypeEnum;

export class ContainerStubService {
  private copyBtnSource = new BehaviorSubject<any>(null); // This is the currently selected copy button.
  copyBtn$ = this.copyBtnSource.asObservable();
  tool$: BehaviorSubject<any> = new BehaviorSubject({});
  toolId$ = observableOf(1);
  tools$: BehaviorSubject<DockstoreTool[]> = new BehaviorSubject([]); // This contains the list of unsorted workflows
  getDescriptors() {
    return null;
  }
  toolCopyBtnClick(copyBtn): void {}
  copyBtnSubscript(): void {}
  setTools(tools: DockstoreTool[]) {
    this.tools$.next(tools);
  }
  setTool(tools: DockstoreTool) {
    this.tool$.next(tools);
  }
  replaceTool(tools: any, newTool: any) {
    return observableOf(tools);
  }
  getBuildModeTooltip(mode: DockstoreTool.ModeEnum) {
    return 'Fully automated: All versions are automated builds';
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

export class SourceFileTabsStubService {
  getSourceFiles(workflowId: number, versionId: number) {
    return observableOf(null);
  }

  getFileTypes(files: SourceFile[]) {
    return [];
  }

  getDescriptorPath(descriptorType: ToolDescriptor.TypeEnum, filePath: string, versionName: string): string {
    return '';
  }
}

export class QueryBuilderStubService {
  getTagCloudQuery(type: string): string {
    return '';
  }
  getSidebarQuery(
    query_size: number,
    values: string,
    advancedSearchObject: AdvancedSearchObject,
    searchTerm: boolean,
    bucketStubs: any,
    filters: any,
    sortModeMap: any
  ): string {
    return 'thisissomefakequery';
  }
  getResultQuery(
    query_size: number,
    values: string,
    advancedSearchObject: AdvancedSearchObject,
    searchTerm: boolean,
    filters: any
  ): string {
    return 'thisissomefakequery';
  }
  getResultSingleIndexQuery(query_size: number, index: 'tools' | 'workflows' | 'notebooks'): string {
    return 'thisissomefakequery';
  }
  getNonVerifiedQuery(query_size: number, values: string, advancedSearchObject: AdvancedSearchObject, searchTerm: boolean, filters: any) {
    return 'thisissomefakequery';
  }

  getVerifiedQuery(query_size: number, values: string, advancedSearchObject: AdvancedSearchObject, searchTerm: boolean, filters: any) {
    return 'thisissomefakequery';
  }
}

export class ExtendedGA4GHStubService {
  toolsIndexSearch(): Observable<any> {
    return EMPTY;
  }
}

export class GA4GHV20StubService {
  getServiceInfo(): Observable<TRSService> {
    const serviceInfo: TRSService = {
      version: '1.14.0-SNAPSHOT',
      type: {
        artifact: 'TRS',
        group: 'org.ga4gh',
        version: '2.0.1',
      },
      id: '1',
      name: 'Dockstore',
      organization: undefined,
    };
    return observableOf(serviceInfo);
  }
}

export class SearchStubService {
  public readonly expandedPanelsStorageKey = 'expandedPanels';
  workflowhit$ = observableOf([]);
  toolhit$ = observableOf([]);
  searchInfo$ = observableOf({});
  toSaveSearch$ = observableOf(false);
  values$ = observableOf('');
  setSearchText(searchText: string) {}
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
  setAutoCompleteTerms() {}

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

  setFilterKeys(filters: Map<string, Set<string>>) {}

  setPageSizeAndIndex(pageSize: number, pageIndex: number) {}

  // Initialization Functions
  initializeCommonBucketStubs() {
    return new Map([
      ['Entry Type', '_type'],
      ['Registry', 'registry'],
      ['Private Access', 'private_access'],
      ['Verified', 'verified'],
      ['Author', 'author'],
      ['Organization', 'namespace'],
      ['Labels', 'labels.value.keyword'],
      ['Verified Source', 'verifiedSource'],
    ]);
  }

  createPermalinks(searchInfo: any) {
    return 'thisisafakepermalink';
  }

  createURIParams() {
    const params = new URLSearchParams('/search');
    return params;
  }
  initializeFriendlyNames() {
    return new Map([
      ['_type', 'Entry Type'],
      ['registry', 'Registry'],
      ['private_access', 'Private Access'],
      ['verified', 'Verified'],
      ['author', 'Author'],
      ['namespace', 'Organization'],
      ['labels.value.keyword', 'Labels'],
      ['verifiedSource', 'Verified Source'],
    ]);
  }

  initializeToolTips() {
    return new Map([
      // Git hook auto fixes from single quotes with an escaped 's but linter complains about double quotes.
      /* eslint-disable-next-line quotes, @typescript-eslint/quotes */
      ['private_access', "A private tool requires authentication to view on Docker's registry website and to pull the Docker image."],
      ['verified', 'Indicates that at least one version of a tool or workflow has been successfully run by our team or an outside party.'],
      [SearchFields.VERIFIED_SOURCE, 'Indicates which party performed the verification process on a tool or workflow.'],
      [
        'has_checker',
        'Checker workflows are additional workflows you can associate with a tool or workflow to ensure ' +
          'that, when given some inputs, it produces the expected outputs on a different platform other than the one it was developed on.',
      ],
      ['verified_platforms.keyword', 'Indicates which platform a tool or workflow (at least one version) was successfully run on.'],
    ]);
  }

  initializeEntryOrder() {
    return new Map([
      ['_type', new SubBucket()],
      ['author', new SubBucket()],
      ['registry', new SubBucket()],
      ['namespace', new SubBucket()],
      ['labels.value.keyword', new SubBucket()],
      ['private_access', new SubBucket()],
      ['verified', new SubBucket()],
      ['verifiedSource', new SubBucket()],
    ]);
  }

  initializeExpandedPanels() {
    if (localStorage.getItem(this.expandedPanelsStorageKey)) {
      return new Map<string, boolean>(JSON.parse(localStorage.getItem(this.expandedPanelsStorageKey)));
    } else {
      return new Map([
        ['descriptorType', true],
        ['registry', true],
        ['source_control_provider.keyword', true],
        ['private_access', false],
        ['verified', true],
        ['author', false],
        ['namespace', true],
        ['labels.value.keyword', false],
        ['input_file_formats.value.keyword', false],
        ['output_file_formats.value.keyword', false],
        [SearchFields.VERIFIED_SOURCE, false],
        ['has_checker', false],
        ['organization', true],
        ['verified_platforms.keyword', false],
        ['categories.name.keyword', true],
        ['descriptor_type_versions.keyword', false],
        ['openData', false],
      ]);
    }
  }

  initializeFriendlyValueNames() {
    return new Map([
      [
        'verified',
        new Map([
          ['1', 'verified'],
          ['0', 'non-verified'],
        ]),
      ],
      [
        'private_access',
        new Map([
          ['1', 'private'],
          ['0', 'public'],
        ]),
      ],
      [
        'registry',
        new Map([
          ['QUAY_IO', 'Quay.io'],
          ['DOCKER_HUB', 'Docker Hub'],
          ['GITLAB', 'GitLab'],
          ['AMAZON_ECR', 'Amazon ECR'],
        ]),
      ],
    ]);
  }

  initializeExclusiveFilters() {
    return new Map([]);
  }

  handleLink(linkArray: Array<string>) {}
}

export class ListContainersStubService {}

export class TrackLoginStubService {
  isLoggedIn$ = observableOf(true);
}

export class LoginStubService {}

export class AuthStubService {
  getToken() {
    return 'asdf';
  }
  authenticate() {
    return observableOf({});
  }
}

export class ConfigurationStub {
  apiKeys = {
    accessToken: '',
    apiKeys: {},
    basePath: Dockstore.API_URI,
  };
}

export class UsersStubService {
  getUser() {
    return observableOf({});
  }
  userWorkflows() {
    return observableOf([]);
  }
  getStarredTools() {
    return observableOf([]);
  }
  getStarredWorkflows() {
    return observableOf([]);
  }

  getStarredOrganizations() {
    return observableOf([]);
  }
  getStarredNotebooks() {
    return observableOf([]);
  }
  refresh(userId: number, extraHttpRequestParams?: any): Observable<Array<DockstoreTool>> {
    return observableOf([]);
  }
  refreshWorkflows(userId: number, extraHttpRequestParams?: any): Observable<Array<Workflow>> {
    return observableOf([]);
  }
  getUserTokens(userId: number, extraHttpRequestParams?: any): Observable<Array<TokenUser>> {
    return observableOf([]);
  }
  getUserOrganizations(gitRegistry: string) {
    return observableOf([]);
  }
  getExtendedUserData() {
    return observableOf(null);
  }
  getUserMemberships() {
    return observableOf([]);
  }
  checkUserExists(username) {
    return observableOf([]);
  }
  changeUsername(username) {
    return observableOf([]);
  }
  getUserCloudInstances(userId: number): Observable<Array<CloudInstance>> {
    return observableOf([]);
  }

  postUserCloudInstance(userId: number, body: CloudInstance): Observable<Array<CloudInstance>> {
    return observableOf([]);
  }
  getUserEntries(
    count?: number,
    filter?: string,
    type?: 'TOOLS' | 'WORKFLOWS' | 'SERVICES' | 'NOTEBOOKS',
    observe?: 'response'
  ): Observable<HttpResponse<Array<EntryUpdateTime>>> {
    return observableOf(null);
  }
}

export class HttpStubService {
  getDockstoreToken() {
    return 'IMAFAKEDOCKSTORETOKEN';
  }
}

export class DescriptorTypeCompatStubService {
  stringToDescriptorType(descriptorType: string | Workflow.DescriptorTypeEnum) {}
  toolDescriptorTypeEnumToPlainTRS(typeEnum: ToolDescriptor.TypeEnum) {}
}

export class WorkflowStubService {
  nsWorkflows$ = observableOf([]);
  nsSharedWorkflows$ = observableOf([]);
  workflow$: BehaviorSubject<any> = new BehaviorSubject({}); // This is the selected workflow
  workflowId$ = observableOf(1);
  workflows$: BehaviorSubject<Workflow[]> = new BehaviorSubject([]); // This contains the list of unsorted workflows
  sharedWorkflows$: BehaviorSubject<Workflow[]> = new BehaviorSubject([]); // This contains the list of unsorted workflows
  copyBtn$ = observableOf({});
  clearVersion() {}
  clearActive() {}
  setEntryType(entryType: EntryType) {}
  setWorkflow(thing: Workflow) {
    this.workflow$.next(thing);
  }
  setWorkflows(thing: any) {
    this.workflows$.next(thing);
  }
  setSharedWorkflows(thing: any) {
    this.sharedWorkflows$.next(thing);
  }
  setNsWorkflows(thing: any) {}
  setSharedNsWorkflows(thing: any) {}
  getDescriptors() {}
  getTestJson() {
    return observableOf({});
  }
}

export class EntriesStubService {
  getVersionsFileTypes(entryid: number, versionid: number): Observable<Array<string>> {
    return observableOf([]);
  }
  deleteEntry(entryid: number): Observable<HttpResponse<Entry>> {
    return observableOf(null);
  }
}

export class HostedStubService {
  deleteHostedWorkflowVersion(id: string, version: string) {
    return observableOf({});
  }

  editHostedWorkflow(id: string, sourceFiles: any) {
    return observableOf({});
  }

  createHostedWorkflow(name: string, descriptorType: string) {
    return observableOf({});
  }
}

export class MetadataStubService {
  sourceControlList = observableOf([
    {
      value: 'github.com',
      friendlyName: 'GitHub',
    },
    {
      value: 'bitbucket.org',
      friendlyName: 'BitBucket',
    },
    {
      value: 'gitlab.com',
      friendlyName: 'GitLab',
    },
  ]);

  dockerRegistriesList = observableOf([
    {
      dockerPath: 'quay.io',
      customDockerPath: 'false',
      privateOnly: 'false',
      enum: 'QUAY_IO',
      friendlyName: 'Quay.io',
      url: 'https://quay.io/repository/',
    },
    {
      dockerPath: 'registry.hub.docker.com',
      customDockerPath: 'false',
      privateOnly: 'false',
      enum: 'DOCKER_HUB',
      friendlyName: 'Docker Hub',
      url: 'https://hub.docker.com/',
    },
    {
      dockerPath: 'registry.gitlab.com',
      customDockerPath: 'false',
      privateOnly: 'false',
      enum: 'GITLAB',
      friendlyName: 'GitLab',
      url: 'https://gitlab.com/',
    },
    {
      dockerPath: 'public.ecr.aws',
      customDockerPath: 'true',
      privateOnly: 'false',
      enum: 'AMAZON_ECR',
      friendlyName: 'Amazon ECR',
      url: 'https://gallery.ecr.aws/',
    },
    {
      dockerPath: null,
      customDockerPath: 'true',
      privateOnly: 'true',
      enum: 'SEVEN_BRIDGES',
      friendlyName: 'Seven Bridges',
      url: null,
    },
  ]);

  descriptorLanguageList = observableOf([
    {
      value: ToolDescriptor.TypeEnum.CWL,
      friendlyName: 'Common Workflow Language',
    },
    {
      value: ToolDescriptor.TypeEnum.WDL,
      friendlyName: 'Workflow Description Language',
    },
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
  refreshAllWorkflows() {}
  refreshWorkflow() {}
  refreshWorkflowVersion() {}
  handleSuccess(message: string): void {}

  handleError(message: string, error: any): void {}
}

export class ExtendedDockstoreToolStubService {
  update() {}
  remove() {}
}

export class AccountsStubService {
  link(thing: string) {}
}

export class RegisterWorkflowModalStubService {
  setIsModalShown() {}
  setWorkflowRepository(repository) {}
}

export class RegisterToolStubService {
  tool: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  setIsModalShown() {}
  setToolRepository(repository) {}
}

export class PageNumberStubService {}

export class LogoutStubService {}

export class UserStubService {
  userId$ = observableOf(5);
  user$ = observableOf({});
  extendedUser$ = observableOf({});
  getUser() {}
  updateUser() {}
  getExtendedUserData() {}
}

export class TosBannerStubService {}

export class TokenStubService {
  tokens$: BehaviorSubject<DockstoreTool[]> = new BehaviorSubject([]);
  hasGitHubToken$ = observableOf(false);
  updateTokens(): void {}
}

export class TokensStubService {
  public addQuayToken(accessToken?: string, extraHttpRequestParams?: any): Observable<TokenUser> {
    return observableOf(quayToken);
  }
  public addBitbucketToken(accessToken?: string, extraHttpRequestParams?: any): Observable<TokenUser> {
    return observableOf(bitbucketToken);
  }
  public addGithubToken(accessToken?: string, extraHttpRequestParams?: any): Observable<TokenUser> {
    return observableOf(gitHubToken);
  }
  public addGitlabToken(accessToken?: string, extraHttpRequestParams?: any): Observable<TokenUser> {
    return observableOf(gitLabToken);
  }
  public deleteToken(tokenId: number, extraHttpRequestParams?: any): Observable<{}> {
    return observableOf({});
  }
}

export class StarringStubService {
  getStarring(id: any, type: any): Observable<Array<User>> {
    return observableOf([]);
  }
}

export class OrganizationStarringStubService {
  getStarring(id: number): Observable<Array<User>> {
    return observableOf([]);
  }
}

export class CheckerWorkflowStubService {
  entry$ = observableOf({ id: 1 });
  checkerWorkflow$ = observableOf(null);
  checkerWorkflowPath$ = observableOf({});
  checkerWorkflowDefaultWorkflowPath$ = observableOf('checkerWorkflowDefaultWorkflowPath');
  checkerWorkflowVersionName$ = observableOf({});
  isEntryAWorkflow() {
    return true;
  }
  clearAll() {
    return;
  }
  getCheckerWorkflowURLObservable() {
    return observableOf(null);
  }
  canAdd() {
    return observableOf(false);
  }
}

export class DescriptorLanguageStubService {
  descriptorLanguages$ = observableOf([
    ToolDescriptor.TypeEnum.CWL,
    ToolDescriptor.TypeEnum.WDL,
    ToolDescriptor.TypeEnum.NFL,
    ToolDescriptor.TypeEnum.SERVICE,
  ]);
  filteredDescriptorLanguages$ = observableOf([ToolDescriptor.TypeEnum.CWL, ToolDescriptor.TypeEnum.WDL, ToolDescriptor.TypeEnum.NFL]);
}

export class RegisterCheckerWorkflowStubService {
  errorObj$ = observableOf(null);
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
  starEntry$ = observableOf({});
}

export class StarOrganizationStubService {
  starOrganization$ = observableOf({});
}

export class ImageProviderStubService {
  setUpImageProvider(tool) {
    tool.imgProvider = 'Quay.io';
    tool.imgProviderUrl = 'an image provider url';
    return tool;
  }
}

export class DagStubService {
  loadExtensions() {}
}

export class DescriptorsStubService {
  getDescriptors(versions, version) {
    if (version) {
      const typesAvailable = new Array();
      for (const file of version.sourceFiles) {
        const type = file.type;
        if (type === 'DOCKSTORE_CWL' && !typesAvailable.includes(DescriptorTypeEnum.CWL)) {
          typesAvailable.push(DescriptorTypeEnum.CWL);
        } else if (type === 'DOCKSTORE_WDL' && !typesAvailable.includes(DescriptorTypeEnum.WDL)) {
          typesAvailable.push(DescriptorTypeEnum.WDL);
        }
      }
      return typesAvailable;
    }
  }
}

export class ParamFilesStubService {
  getVersions(version) {
    return observableOf([]);
  }
  getDescriptors(id, type, versionName, descriptor) {
    return observableOf({});
  }
}

export class ContainertagsStubService {}

export class DockstoreStubService {
  getIconClass() {}

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
    return Dockstore.DOCUMENTATION_URL + '/faq.html#what-is-a-verified-tool-or-workflow';
  }
  getDateTimeMessage() {
    return 'a date time message';
  }
  getAgoMessage(timestamp: number) {
    return 'an ago message';
  }
}

export class OrganizationsStubService {
  starOrganization(entryID: number, body: StarRequest): Observable<{}> {
    return observableOf({});
  }

  unstarOrganization(entryId: number): Observable<{}> {
    return observableOf({});
  }
  getStarredUsersForApprovedOrganization(entryId: number): Observable<Array<User>> {
    return observableOf([]);
  }
}

export class CloudInstancesStubService {
  getCloudInstances(): Observable<Array<CloudInstance>> {
    return observableOf([]);
  }
}

export class WorkflowsStubService {
  getTableToolContent(workflowId: number, workflowVersionId: number, observe?: 'body', reportProgress?: boolean): Observable<string> {
    return observableOf('tableToolContentString');
  }
  sharedWorkflows() {
    return observableOf([]);
  }
  getTestParameterFiles1(workflowId: number, version?: string, extraHttpRequestParams?: any): Observable<Array<SourceFile>> {
    return observableOf([]);
  }

  starEntry1(workflowId: number, body: StarRequest, extraHttpRequestParams?: any): Observable<{}> {
    return observableOf({});
  }

  unstarEntry(workflowId: number, extraHttpRequestParams?: any): Observable<{}> {
    return observableOf({});
  }

  getStarredUsers1(workflowId: number, extraHttpRequestParams?: any): Observable<Array<User>> {
    return observableOf([]);
  }

  manualRegister(
    workflowRegistry: string,
    workflowPath: string,
    defaultWorkflowPath: string,
    workflowName: string,
    descriptorType: string,
    extraHttpRequestParams?: any
  ): Observable<Workflow> {
    return observableOf(sampleWorkflow1);
  }
  refresh1(workflowId: number, extraHttpRequestParams?: any): Observable<Workflow> {
    const refreshedWorkflow: Workflow = {
      type: '',
      descriptorType: DescriptorTypeEnum.CWL,
      gitUrl: 'refreshedGitUrl',
      mode: Workflow.ModeEnum.FULL,
      organization: 'refreshedOrganization',
      repository: 'refreshedRepository',
      workflow_path: 'refreshedWorkflowPath',
      workflowVersions: [],
      defaultTestParameterFilePath: 'refreshedDefaultTestParameterFilePath',
      sourceControl: 'github.com',
      source_control_provider: 'GITHUB',
      descriptorTypeSubclass: 'n/a',
    };
    return observableOf(refreshedWorkflow);
  }
  updateWorkflow(workflowId: number, body: Workflow, extraHttpRequestParams?: any): Observable<Workflow> {
    return observableOf(updatedWorkflow);
  }
  updateWorkflowVersion(
    workflowId: number,
    body: Array<WorkflowVersion>,
    extraHttpRequestParams?: any
  ): Observable<Array<WorkflowVersion>> {
    const updatedWorkflowVersions: WorkflowVersion[] = [];
    return observableOf(updatedWorkflowVersions);
  }
  addTestParameterFiles1(
    workflowId: number,
    testParameterPaths: Array<string>,
    body?: string,
    version?: string,
    extraHttpRequestParams?: any
  ): Observable<Array<SourceFile>> {
    return observableOf([]);
  }
  deleteTestParameterFiles1(
    workflowId: number,
    testParameterPaths: Array<string>,
    version?: string,
    extraHttpRequestParams?: any
  ): Observable<Array<SourceFile>> {
    return observableOf([]);
  }
  getWorkflowDag(workflowId: number, workflowVersionId: number, extraHttpRequestParams?: any): Observable<string> {
    return observableOf('someDAG');
  }
  wdl(workflowId: number, tag: string) {
    return observableOf({});
  }
  secondaryWdl(workflowId: number, tag: string) {
    return observableOf([]);
  }
  removeWorkflowRole(workflowPath: string, entity: string, permission: RoleEnum) {
    return observableOf([]);
  }
  addWorkflowPermission(workflowPath: string, object: any) {
    return observableOf([]);
  }
  getWorkflowPermissions(workflowPath: string) {
    return observableOf([]);
  }
  updateWorkflowDefaultVersion(workflowId: number, tag: string) {
    return observableOf([]);
  }
}

export class ContainersStubService {
  getTestParameterFiles(
    containerId: number,
    tag?: string,
    descriptorType?: string,
    extraHttpRequestParams?: any
  ): Observable<Array<SourceFile>> {
    return observableOf([]);
  }

  starEntry(containerId: number, body: StarRequest, extraHttpRequestParams?: any): Observable<{}> {
    return observableOf({});
  }

  unstarEntry(containerId: number, extraHttpRequestParams?: any): Observable<{}> {
    return observableOf({});
  }

  getStarredUsers(containerId: number, extraHttpRequestParams?: any): Observable<Array<User>> {
    return observableOf([]);
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
      defaultWDLTestParameterFile: 'refreshedDefaultWDLTestParameterFile',
    };
    return observableOf(tool);
  }
}

export class VersionModalStubService {
  version = observableOf(sampleTag);
  mode = observableOf(TagEditorMode.View);
  unsavedTestCWLFile = observableOf([]);
  unsavedTestWDLFile = observableOf([]);
}

export class OrgLogoStubService {
  setDefault(img: any) {}
}

export class EntryTypeMetadataStubService {
  get(type: newEntryType): EntryTypeMetadata {
    switch (type) {
      case newEntryType.WORKFLOW: {
        return {
          searchEntryType: 'workflows',
          searchSupported: true,
          sitePath: 'workflows',
          term: 'workflow',
          termPlural: 'workflows',
          trsPrefix: '#workflow/',
          trsSupported: true,
          type: 'WORKFLOW',
        };
      }
      case newEntryType.TOOL: {
        return {
          searchEntryType: 'tools',
          searchSupported: true,
          sitePath: 'containers',
          term: 'tool',
          termPlural: 'tools',
          trsPrefix: '',
          trsSupported: true,
          type: 'TOOL',
        };
      }
      case newEntryType.SERVICE: {
        return {
          searchEntryType: '',
          searchSupported: false,
          sitePath: 'services',
          term: 'service',
          termPlural: 'services',
          trsPrefix: '#service/',
          trsSupported: true,
          type: 'SERVICE',
        };
      }
      case newEntryType.APPTOOL: {
        return {
          searchEntryType: 'tools',
          searchSupported: true,
          sitePath: 'containers',
          term: 'tool',
          termPlural: 'tools',
          trsPrefix: '',
          trsSupported: true,
          type: 'APPTOOL',
        };
      }
      case newEntryType.NOTEBOOK: {
        return {
          searchEntryType: '',
          searchSupported: false,
          sitePath: 'notebooks',
          term: 'notebook',
          termPlural: 'notebooks',
          trsPrefix: '#notebook/',
          trsSupported: true,
          type: 'NOTEBOOK',
        };
      }
    }
    return null;
  }
}

export class MarkdownWrapperStubService {
  customCompile(data, baseUrl): string {
    return `compiled-markdown(${data})`;
  }
  customSanitize(html): string {
    return `sanitized(${html})`;
  }
}
