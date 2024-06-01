import { HttpUrlEncodingCodec } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogModule } from '@angular/material/legacy-dialog';
import { DescriptorLanguageService } from 'app/shared/entry/descriptor-language.service';
import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { Base } from '../../shared/base';
import { DescriptorTypeCompatService } from '../../shared/descriptor-type-compat.service';
import { Dockstore } from '../../shared/dockstore.model';
import { GA4GHFilesQuery } from '../../shared/ga4gh-files/ga4gh-files.query';
import { CloudInstance, CloudInstancesService, User, UsersService, ToolFile, Workflow, WorkflowVersion } from '../../shared/openapi';
import { WorkflowsService } from '../../shared/openapi/api/workflows.service';
import { SourceFile } from '../../shared/openapi/model/sourceFile';
import { UserQuery } from '../../shared/user/user.query';
import { DescriptorsQuery } from './state/descriptors-query';
import { DescriptorsStore } from './state/descriptors-store';
import { DescriptorsService } from './state/descriptors.service';
import { LaunchToCodespaceDialogComponent } from './dialog/launch-to-codespace-dialog.component';
import { bootstrap4largeModalSize } from '../../shared/constants';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { MultiCloudLaunchComponent } from './multi-cloud-launch/multi-cloud-launch.component';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { NgIf, AsyncPipe } from '@angular/common';
import FileTypeEnum = ToolFile.FileTypeEnum;

/* eslint-disable max-len */
/**
 *  # Overview
 *
 *  A component that has buttons linking to external platforms that can launch workflows hosted on Dockstore.
 *
 *  # Instructions for adding a button for an external platform
 *
 *  ## Configuration -- optional, but highly recommended
 *
 *  The endpoint of the external platform should ideally be configurable instead of hard-coded in the UI. This will allow the
 *  staging and production instances of Dockstore to redirect to the external platform's equivalent instances.
 *
 *  Even if the external platform only has one deployment environment, making the endpoint configurable is preferred,
 *  as locations change, and a configurable endpoint allows Dockstore to redirect to a new endpoint without
 *  building and deploying a new version of the software.
 *
 *  ### How the UI gets its configuration data
 *
 *  Configuration data is supplied to the UI via the `/metadata/config.json` endpoint in the
 *  [Dockstore web service](https://github.com/dockstore/dockstore).
 *
 *  ### Update the web service
 *
 *  1. Add a new property in [DockstoreWebserviceConfiguration#UIConfig](https://github.com/dockstore/dockstore/blob/0a734abe9dbe34eed12404d4697ebc43b71da8d8/dockstore-webservice/src/main/java/io/dockstore/webservice/DockstoreWebserviceConfiguration.java#L616)
 *  that has the endpoint.
 *  2. Add a getter and setter for it.
 *  3. Submit a PR for approval
 *  3. After this PR has been merged, you will need the Dockstore team to do a Maven release that contains this change.
 *
 *  ### Update compose_setup
 *
 *  [Compose setup](https://github.com/dockstore/compose_setup) is a wrapper used around docker-compose that is used to
 *  deploy Dockstore to staging and production environments. It prompts for configurable data and
 *  writes out a configuration file that the dockstore web service reads upon startup.
 *
 *  1. Update [install_bootstrap](https://github.com/dockstore/compose_setup/blob/develop/install_bootstrap) to prompt for the endpoint
 *  2. Update the [yml template](https://github.com/dockstore/compose_setup/blob/develop/templates/web.yml.template) for the new setting.
 *  3. Submit a PR against the develop branch
 *
 *  ### Consume the configuration from the web service
 *
 *  1. Ensure that the `webservice_version` in the package.json references a version that contains the merged PR from the previous section.
 *  2. Update src/app/shared/dockstore.model.ts with a new property for the external endpoint
 *  3. In src/app/configuration.service.ts, update the `updateDockstoreModel` method so that it reads the new data from
 *  `config` parameter and
 *  puts it into dockstore.model.ts. The `config` parameter has the response from the web service to fetch configuration data.
 *
 *  ### Add the button
 *
 *  1. Optionally, but preferably, add an icon for the new platform, putting it in `src/assets/images/thirdparty`.
 *  2. If the icon is an SVG, you will need to add it to the icon registry in the constructor of this class, below.
 *  Follow the existing pattern.
 *  3. Add your HTML to launch-third-party.component.html, following the pattern of the existing code. There are
 *  several properties you can access from your HTML that should provide all the info needed for the new button. If
 *  additional properties are necessary, add them to this file.
 *  4. Add the new div and anchor to the end of the file. Currently, the buttons are ordered by when they were added
 *  to the codebase.
 *  5. Submit a PR against the develop branch.
 *
 *  ## Non WDL platforms
 *
 *  So far Dockstore only has buttons linking to external platforms that run WDL. When buttons are added for
 *  external platforms that support other languages, keep the following in mind:
 *
 *  * The first external non WDL external platform needs to change the `*ngIf` first line of launch-third-party.component.html.
 *  * The `hasHttpImports$` property is specific to WDL, although it can be extended to other languages if necessary.
 *
 */

/* eslint-enable max-len */

@Component({
  selector: 'app-launch-third-party',
  templateUrl: './launch-third-party.component.html',
  styleUrls: ['./launch-third-party.component.scss'],
  providers: [DescriptorsService, DescriptorsQuery, DescriptorsStore],
  standalone: true,
  imports: [
    NgIf,
    MatLegacyCardModule,
    MatDividerModule,
    FlexModule,
    MultiCloudLaunchComponent,
    MatLegacyTooltipModule,
    MatLegacyButtonModule,
    MatLegacyDialogModule,
    AsyncPipe,
  ],
})
export class LaunchThirdPartyComponent extends Base implements OnChanges, OnInit {
  /**
   * The workflow
   */
  @Input()
  workflow: Workflow;

  /**
   * The selected workflow version
   */
  @Input()
  selectedVersion: WorkflowVersion;

  user$: Observable<User>;

  /**
   * Indicates whether the selected version has any content
   */
  hasContent$ = this.descriptorsQuery.hasContent$.pipe(shareReplay({ refCount: true }));

  /**
   * Indicates whether the selected version's workflow has any file-based imports.
   */
  hasFileImports$ = this.descriptorsQuery.hasFileImports$;

  /**
   * Indicates whether the selected version's workflow has any http(s) imports.
   * Note: this currently only works for WDL; not clear if needed for CWL yet.
   */
  hasHttpImports$ = this.descriptorsQuery.hasHttpImports$;

  /**
   * The selected version's devcontainer files, currently retrieved only for notebooks.
   * Set to "undefined" during retrieval or if never retrieved.
   */
  devcontainers: SourceFile[] | undefined;

  /**
   * A reference to dockstore.model.ts
   */
  config = Dockstore;

  /**
   * The TRS url for the current workflow and selected version.
   * Note: We are using this value as a query param for DNAnexus,
   * even though we should be using the encoded value. But their server
   * works with the value as is, so expose this as well.
   */
  trsUrl: string;

  /**
   * The TRS url for the current workflow and selected version, encoded for use as a query parameter value.
   */
  trsUrlAsQueryValue: string;

  /**
   * The workflow path encoded for use as a query parameter value.
   */
  workflowPathAsQueryValue: string;

  /**
   * The workflow organization, URL encoded.
   */
  workflowOrganizationAsQueryValue: string;

  /**
   * The workflow repository, URL encoded.
   */
  workflowRepositoryAsQueryValue: string;

  /**
   * The name of the selected version, URL encoded.
   */
  selectedVersionNameAsQueryValue: string;

  /**
   * The workflow path of the selected version, in absolute form, URL encoded.
   */
  selectedVersionWorkflowPathAsQueryValue: string;

  partner = CloudInstance.PartnerEnum;
  cloudInstances: Array<CloudInstance>;
  usersCloudInstances: Array<CloudInstance>;
  WorkflowModel = Workflow;

  // Note: intentionally not using this.hasContent$ in the next line, as that does not work
  cgcTooltip$: Observable<string> = combineLatest([this.hasContent$, this.hasHttpImports$]).pipe(
    map(([hasContent, hasHttpImports]) => this.sevenBridgesTooltip(hasContent, hasHttpImports, 'the CGC'))
  );

  disableSevenBridgesPlatform$: Observable<boolean> = combineLatest([this.hasContent$, this.hasHttpImports$]).pipe(
    map(([hasContent, hasHttpImports]) => !hasContent || hasHttpImports)
  );

  bdCatalystSevenBridgesTooltip$: Observable<string> = combineLatest([this.hasContent$, this.hasHttpImports$]).pipe(
    map(([hasContent, hasHttpImports]) =>
      this.sevenBridgesTooltip(hasContent, hasHttpImports, 'BioData Catalyst (BDC) Powered by Seven Bridges')
    )
  );

  terraTooltip$: Observable<string> = combineLatest([this.hasContent$, this.hasFileImports$]).pipe(
    map(([hasContent, hasFileImports]) => this.terraBasedPlatformTooltip(hasContent, hasFileImports, 'Terra'))
  );

  elwaziToolTip$: Observable<string> = combineLatest([this.hasContent$, this.hasFileImports$]).pipe(
    map(([hasContent, hasFileImports]) => this.terraBasedPlatformTooltip(hasContent, hasFileImports, 'Elwazi'))
  );

  anvilTooltip$: Observable<string> = combineLatest([this.hasContent$, this.hasFileImports$]).pipe(
    map(([hasContent, hasFileImports]) => this.terraBasedPlatformTooltip(hasContent, hasFileImports, 'AnVIL'))
  );

  bdCatalystTerraTooltip$: Observable<string> = combineLatest([this.hasContent$, this.hasFileImports$]).pipe(
    map(([hasContent, hasFileImports]) =>
      this.terraBasedPlatformTooltip(hasContent, hasFileImports, 'BioData Catalyst (BDC) Powered by Terra')
    )
  );

  disableTerraPlatform$: Observable<boolean> = combineLatest([this.hasContent$, this.hasFileImports$]).pipe(
    map(([hasContent, hasFileImports]) => !hasContent || (hasFileImports && !this.isGitHubWorkflow()))
  );

  cavaticaTooltip$: Observable<string> = combineLatest([this.hasContent$, this.hasHttpImports$]).pipe(
    map(([hasContent, hasHttpImports]) => this.sevenBridgesTooltip(hasContent, hasHttpImports, 'Cavatica'))
  );

  colabTooltip$: Observable<string> = combineLatest([this.hasContent$]).pipe(
    map(([hasContent]) => (hasContent ? 'Run this notebook in Google Colaboratory' : 'The notebook has no content.'))
  );

  codespaceTooltip$: Observable<string> = combineLatest([this.hasContent$]).pipe(
    map(([hasContent]) => (hasContent ? 'Run this notebook in a GitHub Codespace' : 'The notebook has no content.'))
  );

  mybinderTooltip$: Observable<string> = combineLatest([this.hasContent$]).pipe(
    map(([hasContent]) => (hasContent ? 'Run this notebook at mybinder.org' : 'The notebook has no content.'))
  );

  constructor(
    private workflowsService: WorkflowsService,
    private descriptorTypeCompatService: DescriptorTypeCompatService,
    private gA4GHFilesQuery: GA4GHFilesQuery,
    private descriptorsQuery: DescriptorsQuery,
    private descriptorsService: DescriptorsService,
    private cloudInstanceService: CloudInstancesService,
    private usersService: UsersService,
    private userQuery: UserQuery,
    private descriptorLanguageService: DescriptorLanguageService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.user$ = this.userQuery.user$;
    this.cloudInstanceService.getCloudInstances().subscribe((cloudInstances: Array<CloudInstance>) => {
      this.cloudInstances = cloudInstances;
    });
    // Uncomment when we want to get the users custom cloud instances, but may not work if user object is slow to get
    // if (this.user) {
    //   this.usersService.getUserCloudInstances(this.user.id).subscribe((cloudInstances: Array<CloudInstance>) => {
    //     this.usersCloudInstances = cloudInstances;
    //   });
    // }

    this.gA4GHFilesQuery
      .getToolFiles(this.descriptorTypeCompatService.stringToDescriptorType(this.workflow.descriptorType), [
        FileTypeEnum.PRIMARYDESCRIPTOR,
        FileTypeEnum.SECONDARYDESCRIPTOR,
      ])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((fileDescriptors) => {
        if (fileDescriptors && fileDescriptors.length) {
          // No idea if this.workflow.descriptorType is the one that's required or if it's some other enum
          const descriptorType = this.workflow.descriptorType;
          const descriptorLanguageEnum =
            this.descriptorLanguageService.workflowDescriptorTypeEnumToExtendedDescriptorLanguageBean(
              descriptorType
            ).descriptorLanguageEnum;
          this.workflowsService.primaryDescriptor1(this.workflow.id, descriptorType, this.selectedVersion.name).subscribe((sourceFile) => {
            this.descriptorsService.updatePrimaryDescriptor(sourceFile);
            if (fileDescriptors.some((file) => file.file_type === FileTypeEnum.SECONDARYDESCRIPTOR)) {
              this.workflowsService
                .secondaryDescriptors1(this.workflow.id, descriptorLanguageEnum, this.selectedVersion.name)
                .subscribe((sourceFiles: Array<SourceFile>) => {
                  this.descriptorsService.updateSecondaryDescriptors(sourceFiles);
                });
            }
          });
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.descriptorsQuery.clear();
    this.trsUrl = this.trsUrlAsQueryValue = this.workflowPathAsQueryValue = null;
    if (this.workflow && this.selectedVersion) {
      this.trsUrl = this.descriptorsService.trsUrl(this.workflow.full_workflow_path, this.selectedVersion.name);
      this.trsUrlAsQueryValue = this.encode(this.trsUrl);
      this.workflowPathAsQueryValue = this.encode(this.workflow.full_workflow_path);
      this.workflowOrganizationAsQueryValue = this.encode(this.workflow.organization);
      this.workflowRepositoryAsQueryValue = this.encode(this.workflow.repository);
      this.selectedVersionNameAsQueryValue = this.encode(this.selectedVersion.name);
      this.selectedVersionWorkflowPathAsQueryValue = this.encode(this.prependIfNotPrefix('/', this.selectedVersion.workflow_path));
      this.devcontainers = undefined;
      if (this.workflow.descriptorType === Workflow.DescriptorTypeEnum.Jupyter) {
        const workflowId = this.workflow.id;
        const versionId = this.selectedVersion.id;
        this.workflowsService.getWorkflowVersionsSourcefiles(workflowId, versionId, ['DOCKSTORE_NOTEBOOK_DEVCONTAINER']).subscribe(
          (devcontainers: SourceFile[]) => (this.devcontainers = devcontainers),
          (error) => (this.devcontainers = [])
        );
      }
    }
  }

  private encode(value: string): string {
    return new HttpUrlEncodingCodec().encodeValue(value);
  }

  private prependIfNotPrefix(prefix: string, value: string): string {
    return value.startsWith(prefix) ? value : prefix + value;
  }

  private sevenBridgesTooltip(hasContent: boolean, hasHttpImports, platform: string): string {
    if (!hasContent) {
      return 'The CWL has no content.';
    }
    if (hasHttpImports) {
      return `This version of the CWL has http(s) imports, which are not supported by ${platform}. Select a version without http(s) imports.`;
    }
    return `Export this workflow version to ${platform}.`;
  }

  private isGitHubWorkflow(): boolean {
    return this.workflow && this.workflow.gitUrl && this.workflow.gitUrl.startsWith('git@github.com');
  }

  private terraBasedPlatformTooltip(hasContent: boolean, hasFileImports, platform: string): string {
    if (!hasContent) {
      return 'The WDL has no content.';
    }
    if (!this.isGitHubWorkflow() && hasFileImports) {
      return `This version of the WDL has file-path imports, which are only supported by ${platform} for GitHub-based workflows.`;
    }
    return `Export this workflow version to ${platform}.`;
  }

  launchToCodespace() {
    const correctDevcontainerPath = this.computeCorrectDevcontainerPath(this.devcontainers);
    if (correctDevcontainerPath) {
      this.openNewCodespaceWindow(correctDevcontainerPath);
    } else {
      this.displayLaunchToCodespaceDialog(this.devcontainers.length > 0)
        .afterClosed()
        .subscribe((shouldLaunch: boolean) => {
          if (shouldLaunch) {
            this.openNewCodespaceWindow(undefined);
          }
        });
    }
  }

  private displayLaunchToCodespaceDialog(hasDevcontainer: boolean) {
    return this.dialog.open(LaunchToCodespaceDialogComponent, {
      width: bootstrap4largeModalSize,
      data: { entry: this.workflow, hasDevcontainer: hasDevcontainer },
    });
  }

  private computeCorrectDevcontainerPath(devcontainers: SourceFile[]): string | undefined {
    // Return the path, relative to root, of the devcontainer with a body that contains the absolute notebook path as a substring,
    // or undefined if there is no such devcontainer
    return devcontainers.find((file) => file.content.includes(this.selectedVersion.workflow_path))?.absolutePath?.substring(1);
  }

  private openNewCodespaceWindow(devcontainerPath: string | undefined) {
    let url: string =
      this.config.GITHUB_CODESPACES_IMPORT_URL +
      '?hide_repo_select=true' +
      '&ref=' +
      this.selectedVersionNameAsQueryValue +
      '&repo=' +
      this.workflowOrganizationAsQueryValue +
      '/' +
      this.workflowRepositoryAsQueryValue;
    if (devcontainerPath) {
      url += '&devcontainer_path=' + this.encode(devcontainerPath);
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
