import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

import { DescriptorTypeCompatService } from '../../shared/descriptor-type-compat.service';
import { ToolDescriptor, Workflow, WorkflowVersion } from '../../shared/swagger';
import { WorkflowsService } from '../../shared/swagger/api/workflows.service';
import { SourceFile } from '../../shared/swagger/model/sourceFile';
import { LaunchThirdPartyService } from './launch-third-party.service';

const importHttpRegEx: RegExp = new RegExp(/^\s*import\s+"https?/, 'm');

@Component({
  selector: 'app-launch-third-party',
  templateUrl: './launch-third-party.component.html',
  styleUrls: ['./launch-third-party.component.scss']
})
export class LaunchThirdPartyComponent implements OnChanges {

  @Input()
  workflow: Workflow;

  @Input()
  selectedVersion: WorkflowVersion;

  dnastackURL: string;
  fireCloudURL: string;
  dnanexusURL: string;
  wdlHasHttpImports: boolean;
  wdlHasFileImports: boolean;
  wdlHasContent: boolean;
  isWdl: boolean;

  constructor(private workflowsService: WorkflowsService, private descriptorTypeCompatService: DescriptorTypeCompatService,
              private launchThirdPartyService: LaunchThirdPartyService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('firecloud',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/thirdparty/FireCloud-white-icon.svg'));
    iconRegistry.addSvgIcon('dnanexus',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/thirdparty/DX_Logo_white_alpha.svg'));
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.fireCloudURL = this.dnastackURL = this.dnanexusURL = null;
    this.wdlHasContent = this.wdlHasFileImports = this.wdlHasHttpImports = false;
    this.isWdl = this.workflow && this.workflow && this.workflow.full_workflow_path &&
      this.descriptorTypeCompatService.stringToDescriptorType(this.workflow.descriptorType) === ToolDescriptor.TypeEnum.WDL;
    if (this.isWdl && this.selectedVersion) {
      this.workflowsService.wdl(this.workflow.id, this.selectedVersion.name).subscribe((sourceFile: SourceFile) => {
        if (sourceFile && sourceFile.content && sourceFile.content.length) {
          this.wdlHasContent = true;
          // DNAnexus handles file and http(s) imports, no need to check
          this.dnanexusURL = this.launchThirdPartyService.dnanexusUrl(this.workflow.full_workflow_path, this.selectedVersion.name);
          // DNAstack doesn't get passed a specific version
          this.dnastackURL = this.launchThirdPartyService.dnastackUrl(this.workflow.full_workflow_path, this.workflow.descriptorType);
          this.workflowsService.secondaryWdl(this.workflow.id, this.selectedVersion.name).subscribe((sourceFiles: Array<SourceFile>) => {
            if (!sourceFiles || sourceFiles.length === 0) {
              this.wdlHasHttpImports = importHttpRegEx.test(sourceFile.content);
              this.fireCloudURL = this.launchThirdPartyService.firecloudUrl(this.workflow.full_workflow_path, this.selectedVersion.name);
            } else {
              this.wdlHasFileImports = true;
            }
          });
        }
      });
    }
  }

}
