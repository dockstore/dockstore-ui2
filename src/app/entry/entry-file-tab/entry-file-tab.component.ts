import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { SafeUrl } from '@angular/platform-browser';
import { ga4ghPath, ga4ghWorkflowIdPrefix } from 'app/shared/constants';
import { Dockstore } from 'app/shared/dockstore.model';
import { FileService } from 'app/shared/file.service';
import { GA4GHFiles } from 'app/shared/ga4gh-files/ga4gh-files.model';
import { GA4GHFilesQuery } from 'app/shared/ga4gh-files/ga4gh-files.query';
import { GA4GHFilesService } from 'app/shared/ga4gh-files/ga4gh-files.service';
import { WorkflowQuery } from 'app/shared/state/workflow.query';
import { FileWrapper, GA4GHService, ToolDescriptor, ToolFile } from 'app/shared/swagger';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-entry-file-tab',
  templateUrl: './entry-file-tab.component.html',
  styleUrls: ['./entry-file-tab.component.scss']
})
export class EntryFileTabComponent implements OnInit {
  toolFiles: ToolFile[];
  differentFileTypes: Set<ToolFile.FileTypeEnum>;
  descriptorType$: Observable<ToolDescriptor.TypeEnum>;
  selected: ToolFile;
  fileContents: string;
  dropdown: ToolFile[];
  selectedFileType: ToolFile.FileTypeEnum;
  loading = true;
  published$: Observable<boolean>;
  downloadFilePath: string;
  customDownloadHREF: SafeUrl;
  customDownloadPath: string;
  constructor(
    private ga4ghFilesQuery: GA4GHFilesQuery,
    private workflowQuery: WorkflowQuery,
    private ga4ghService: GA4GHService,
    private fileService: FileService,
    private ga4ghFileService: GA4GHFilesService
  ) {}

  ngOnInit() {
    this.published$ = this.workflowQuery.workflowIsPublished$;
    this.descriptorType$ = this.workflowQuery.descriptorType$;
    this.ga4ghFilesQuery.selectAll().subscribe((files: GA4GHFiles[]) => {
      if (files.length !== 1) {
        // Probably hasn't initialized yet
        this.toolFiles = [];
      } else {
        this.toolFiles = files[0].toolFiles;
        this.differentFileTypes = new Set(this.toolFiles.map(toolFile => toolFile.file_type).sort());
        this.selectedFileType = this.differentFileTypes.values().next().value;
        this.handleFileTypeChange();
      }
    });
  }

  /**
   * Update the custom download button attributes ('href' and 'download')
   *
   * @memberof EntryFileSelector
   */
  updateCustomDownloadFileButtonAttributes(): void {
    this.customDownloadHREF = this.fileService.getFileData(this.fileContents);
    this.customDownloadPath = this.fileService.getFileName(this.selected.path);
  }

  matTabChange(event: MatTabChangeEvent) {
    this.selectedFileType = <ToolFile.FileTypeEnum>event.tab.textLabel;
    this.handleFileTypeChange();
  }

  handleFileTypeChange() {
    this.dropdown = this.getFiles(this.selectedFileType);
    this.selected = this.dropdown[0];
    this.getFile();
  }

  getFile() {
    this.ga4ghFileService.injectAuthorizationToken(this.ga4ghService);
    const toolFile: ToolFile = this.selected;
    if (!toolFile) {
      return;
    }
    const workflow = this.workflowQuery.getActive();
    const version = this.workflowQuery.getSnapshot().version;
    const path = toolFile.path;
    const fileType = workflow.descriptorType;
    this.loading = true;
    this.ga4ghService
      .toolsIdVersionsVersionIdTypeDescriptorRelativePathGet(
        fileType,
        ga4ghWorkflowIdPrefix + workflow.full_workflow_path,
        version.name,
        path
      )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((fileWrapper: FileWrapper) => {
        this.handleFileChange(fileWrapper);
      });
  }

  handleFileChange(fileWrapper: FileWrapper) {
    this.fileContents = fileWrapper.content;
    const workflow = this.workflowQuery.getActive();
    const version = this.workflowQuery.getSnapshot().version;
    this.downloadFilePath = this.getDescriptorPath(
      workflow.full_workflow_path,
      version.name,
      this.selected.path,
      <ToolDescriptor.TypeEnum>workflow.descriptorType.toUpperCase(),
      'workflow'
    );
    this.updateCustomDownloadFileButtonAttributes();
  }

  getDescriptorPath(
    entryPath: string,
    versionName: string,
    filePath: string,
    descriptorType: ToolDescriptor.TypeEnum,
    entryType: string
  ): string {
    if (!entryPath || !versionName || !filePath || !descriptorType || !entryType) {
      return null;
    } else {
      let type = '';
      switch (descriptorType) {
        case ToolDescriptor.TypeEnum.WDL:
          type = 'PLAIN-WDL';
          break;
        case ToolDescriptor.TypeEnum.CWL:
          type = 'PLAIN-CWL';
          break;
        case ToolDescriptor.TypeEnum.NFL:
          type = 'PLAIN-NFL';
          break;
        default:
          console.error('Unhandled descriptor type: ' + descriptorType);
          return null;
      }
      return this.getDownloadFilePath(entryPath, versionName, filePath, type, entryType);
    }
  }

  /**
   * Get the download path of a test parameter file
   * TODO: Convert to pipe
   * @private
   * @param {string} entryPath         the entry's path (e.g. "quay.io/pancancer/pcawg-dkfz-workflow")
   * @param {string} version           the version of the entry (e.g. "2.0.1_cwl1.0")
   * @param {string} filePath          path of the file (e.g. "/Dockstore.json")
   * @param {string} type              the string used for the GA4GH type (e.g. "PLAIN_CWL", "PLAIN_TEST_WDL_FILE")
   * @param {string} entryType         the entry type, either "tool" or "workflow"
   * @returns {string}
   * @memberof FileService
   */
  private getDownloadFilePath(entryPath: string, version: string, filePath: string, type: string, entryType: string): string {
    const basepath = Dockstore.API_URI + ga4ghPath + '/tools/';
    let entry = '';
    if (entryType === 'workflow') {
      entry = encodeURIComponent(ga4ghWorkflowIdPrefix + entryPath);
    } else {
      entry = encodeURIComponent(entryPath);
    }
    // Do not encode the filePath because webservice can handle an unencoded file path.  Also the default file name is prettier this way
    const customPath = entry + '/versions/' + encodeURIComponent(version) + '/' + type + '/descriptor/' + filePath;
    return basepath + customPath;
  }

  getFiles(fileType: ToolFile.FileTypeEnum): ToolFile[] {
    return this.toolFiles.filter(toolFile => toolFile.file_type === fileType);
  }
}
