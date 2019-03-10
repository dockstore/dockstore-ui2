import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

import { DescriptorTypeCompatService } from '../../shared/descriptor-type-compat.service';
import { ToolFile, Workflow, WorkflowVersion } from '../../shared/swagger';
import { WorkflowsService } from '../../shared/swagger/api/workflows.service';
import { SourceFile } from '../../shared/swagger/model/sourceFile';
import { GA4GHFilesQuery } from '../../shared/ga4gh-files/ga4gh-files.query';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DescriptorsQuery } from './state/descriptors-query';
import { DescriptorsService } from './state/descriptors.service';
import { DescriptorsStore } from './state/descriptors-store.';
import { Dockstore } from '../../shared/dockstore.model';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import FileTypeEnum = ToolFile.FileTypeEnum;

/**
 *  A component that has buttons linking to external platforms that can launch workflows hosted on Dockstore.
 *
 *  ## Instructions for adding a new button
 *
 *  1. Update dockstore.model.ts with a new property that has the url of the external platform.
 *  2. Optionally, but preferably, add an icon for the new platform, putting it in `src/assets/images/thirdparty`.
 *  3. If the icon is an SVG, you will need to add it to the icon registry in the
 *  constructor of this class, below. Follow the existing pattern.
 *  4. Add your HTML to launch-third-party.component.ts, following the pattern of the existing code. There are
 *  several properties you can access from your HTML that should provide all the info needed for the new button.
 *  If some new property is required, add it, and update it (probably) in `ngOnChanges`.
 *
 *  ### Non WDL platforms
 *
 *  The first external non WDL external platform needs to change the `*ngIf` first line of launch-third-party.component.html.
 *
 */

@Component({
  selector: 'app-launch-third-party',
  templateUrl: './launch-third-party.component.html',
  styleUrls: ['./launch-third-party.component.scss'],
  providers: [ DescriptorsService, DescriptorsQuery, DescriptorsStore]
})
export class LaunchThirdPartyComponent implements OnChanges, OnInit, OnDestroy {

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

  /**
   * Indicates whether the selected version has any content
   */
  hasContent$ = this.descriptorsQuery.hasContent$;

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
   * A reference to dockstore.model.ts
   */
  config = Dockstore;

  /**
   * The TRS url for the current workflow and selected version.
   * Note: We are using this value as a query param for DNANexus,
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

  private ngUnsubscribe: Subject<{}> = new Subject();


  constructor(private workflowsService: WorkflowsService, private descriptorTypeCompatService: DescriptorTypeCompatService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer,
              private gA4GHFilesQuery: GA4GHFilesQuery,
              private descriptorsQuery: DescriptorsQuery,
              private descriptorsService: DescriptorsService) {
    iconRegistry.addSvgIcon('firecloud',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/thirdparty/FireCloud-white-icon.svg'));
    iconRegistry.addSvgIcon('dnanexus',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/thirdparty/DX_Logo_white_alpha.svg'));
    iconRegistry.addSvgIcon('terra',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/thirdparty/terra.svg'));
  }

  ngOnInit(): void {
    this.gA4GHFilesQuery.getToolFiles(this.descriptorTypeCompatService.stringToDescriptorType(this.workflow.descriptorType),
      [FileTypeEnum.PRIMARYDESCRIPTOR, FileTypeEnum.SECONDARYDESCRIPTOR]).pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe(fileDescriptors => {
        if (fileDescriptors && fileDescriptors.length) {
          this.workflowsService.wdl(this.workflow.id, this.selectedVersion.name).subscribe(sourceFile => {
            this.descriptorsService.updatePrimaryDescriptor(sourceFile);
            if (fileDescriptors.some(file => file.file_type === FileTypeEnum.SECONDARYDESCRIPTOR)) {
              this.workflowsService.secondaryWdl(this.workflow.id, this.selectedVersion.name).subscribe(
                (sourceFiles: Array<SourceFile>) => {
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
      this.trsUrlAsQueryValue = new HttpUrlEncodingCodec()
        .encodeValue(this.trsUrl);
      this.workflowPathAsQueryValue = new HttpUrlEncodingCodec().encodeValue(this.workflow.full_workflow_path);
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.descriptorsQuery.destroy();
  }

}
