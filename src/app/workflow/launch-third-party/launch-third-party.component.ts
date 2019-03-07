import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

import { DescriptorTypeCompatService } from '../../shared/descriptor-type-compat.service';
import { ToolFile, Workflow, WorkflowVersion } from '../../shared/swagger';
import { WorkflowsService } from '../../shared/swagger/api/workflows.service';
import { SourceFile } from '../../shared/swagger/model/sourceFile';
import { LaunchThirdPartyService } from './launch-third-party.service';
import { GA4GHFilesQuery } from '../../shared/ga4gh-files/ga4gh-files.query';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DescriptorsQuery } from './state/descriptors-query';
import { DescriptorsService } from './state/descriptors.service';
import { DescriptorsStore } from './state/descriptors-store.';
import { Dockstore } from '../../shared/dockstore.model';
import { ga4ghPath, ga4ghWorkflowIdPrefix } from '../../shared/constants';
import FileTypeEnum = ToolFile.FileTypeEnum;

@Component({
  selector: 'app-launch-third-party',
  templateUrl: './launch-third-party.component.html',
  styleUrls: ['./launch-third-party.component.scss'],
  providers: [ DescriptorsService, DescriptorsQuery, DescriptorsStore]
})
export class LaunchThirdPartyComponent implements OnChanges, OnInit, OnDestroy {

  @Input()
  workflow: Workflow;

  @Input()
  selectedVersion: WorkflowVersion;

  hasFileImports$ = this.descriptorsQuery.hasFileImports$;
  hasContent$ = this.descriptorsQuery.hasContent$;
  hasHttpImports$ = this.descriptorsQuery.hasHttpImports$
  config = Dockstore;
  trsUrl: string;
  encodedPath: string;

  private ngUnsubscribe: Subject<{}> = new Subject();


  constructor(private workflowsService: WorkflowsService, private descriptorTypeCompatService: DescriptorTypeCompatService,
              private launchThirdPartyService: LaunchThirdPartyService,
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
                })
            }
          });
        }
      });
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.descriptorsQuery.clear();
    this.trsUrl = this.encodedPath = null;
    if (this.workflow && this.selectedVersion) {

      this.trsUrl = `${Dockstore.API_URI}${ga4ghPath}/tools/`
        + encodeURIComponent(`${ga4ghWorkflowIdPrefix + this.workflow.full_workflow_path}`)
        + '/versions/'
        + encodeURIComponent(`${this.selectedVersion.name}`);

      this.encodedPath = encodeURIComponent(this.workflow.full_workflow_path);

    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.descriptorsQuery.destroy();
  }

}
