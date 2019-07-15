import { Injectable } from '@angular/core';
import { transaction } from '@datorama/akita';
import { Base } from 'app/shared/base';
import { ga4ghWorkflowIdPrefix } from 'app/shared/constants';
import { DescriptorTypeCompatService } from 'app/shared/descriptor-type-compat.service';
import { FileService } from 'app/shared/file.service';
import { GA4GHFiles } from 'app/shared/ga4gh-files/ga4gh-files.model';
import { GA4GHFilesQuery } from 'app/shared/ga4gh-files/ga4gh-files.query';
import { GA4GHFilesService } from 'app/shared/ga4gh-files/ga4gh-files.service';
import { WorkflowQuery } from 'app/shared/state/workflow.query';
import { FileWrapper, GA4GHService, ToolDescriptor, ToolFile } from 'app/shared/swagger';
import { takeUntil } from 'rxjs/operators';
import { EntryFileTabQuery } from './entry-file-tab.query';
import { EntryFileTabStore } from './entry-file-tab.store';

@Injectable()
export class EntryFileTabService extends Base {
  constructor(
    private entryFileTabStore: EntryFileTabStore,
    private workflowQuery: WorkflowQuery,
    private entryFileTabQuery: EntryFileTabQuery,
    private gA4GHFilesQuery: GA4GHFilesQuery,
    private ga4ghService: GA4GHService,
    private ga4ghFilesService: GA4GHFilesService,
    private descriptorTypeCompatService: DescriptorTypeCompatService,
    private fileService: FileService
  ) {
    super();
  }

  private setSelectedFileType(fileType: ToolFile.FileTypeEnum) {
    this.entryFileTabStore.setState(state => {
      return {
        ...state,
        selectedFileType: fileType
      };
    });
  }

  private setUnfilteredFiles(files: ToolFile[]) {
    this.entryFileTabStore.setState(state => {
      return {
        ...state,
        unfilteredFiles: files
      };
    });
  }

  private setFiles(files: ToolFile[]) {
    this.entryFileTabStore.setState(state => {
      return {
        ...state,
        files: files
      };
    });
  }

  private setSelectedFile(file: ToolFile) {
    this.entryFileTabStore.setState(state => {
      return {
        ...state,
        selectedFile: file
      };
    });
  }

  /**
   * If any file contents were changed (aside from set to null), it must be finished loading
   *
   * @private
   * @param {string} fileContents  The new file contents
   * @memberof EntryFileTabService
   */
  @transaction()
  private setFileContents(fileContents: string) {
    this.entryFileTabStore.setState(state => {
      return {
        ...state,
        fileContents: fileContents
      };
    });
    this.setLoading(false);
  }

  private setDownloadFilePath(downloadFilePath: string) {
    this.entryFileTabStore.setState(state => {
      return {
        ...state,
        downloadFilePath: downloadFilePath
      };
    });
  }

  private setLoading(loading: boolean) {
    this.entryFileTabStore.setLoading(loading);
  }

  /**
   * Grabbing all files and handles which file to select
   *
   * @memberof EntryFileTabService
   */
  @transaction()
  public init() {
    this.gA4GHFilesQuery
      .selectAll()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((files: GA4GHFiles[]) => {
        if (files.length !== 1) {
          // Probably hasn't initialized yet
          this.setUnfilteredFiles([]);
        } else {
          const toolFiles = files[0].toolFiles;
          this.setAlmostEverything(toolFiles);
          this.getFileContents();
        }
      });
  }

  /**
   * Handles when the file is changed (ex. when a file is selected in the dropdown)
   *
   * @param {ToolFile} file  The ToolFile selected
   * @memberof EntryFileTabService
   */
  @transaction()
  public changeFile(file: ToolFile) {
    this.setSelectedFile(file);
    this.getFileContents();
  }

  /**
   * Handles when the file type is changed (ex. when the tab is changed)
   *
   * @param {ToolFile.FileTypeEnum} selectedFileType  The file type to change to
   * @memberof EntryFileTabService
   */
  @transaction()
  public changeFileType(selectedFileType: ToolFile.FileTypeEnum) {
    const toolFiles = this.entryFileTabQuery.getSnapshot().unfilteredFiles;
    const filteredFiles = this.filterFiles(selectedFileType, toolFiles);
    const selectedFile = filteredFiles[0];
    this.setSelectedFileType(selectedFileType);
    this.setFiles(filteredFiles);
    this.changeFile(selectedFile);
  }

  /**
   * On initial load, set almost everything in one transaction
   *
   * @param {ToolFile[]} unfilteredFiles  The list of all ToolFiles
   * @memberof EntryFileTabService
   */
  private setAlmostEverything(unfilteredFiles: ToolFile[]) {
    const fileTypes = this.getFileTypes(unfilteredFiles);
    const selectedFileType: ToolFile.FileTypeEnum = fileTypes.values().next().value;
    const files = this.filterFiles(selectedFileType, unfilteredFiles);
    const file = files[0];
    this.entryFileTabStore.setState(state => {
      return {
        ...state,
        unfilteredFiles: unfilteredFiles,
        fileTypes: fileTypes,
        selectedFileType: selectedFileType,
        files: files,
        selectedFile: file,
        fileContents: null
      };
    });
  }

  /**
   * Filters to only have unique values
   * Sorts alphabetically because coincidentally it's in the desired order
   * @param {ToolFile[]} toolFiles  The list of all ToolFiles
   * @returns
   * @memberof EntryFileTabService
   */
  private getFileTypes(toolFiles: ToolFile[]): ToolFile.FileTypeEnum[] {
    return toolFiles
      .map(toolFile => toolFile.file_type)
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort();
  }

  /**
   * Gets the actual FileWrapper (file contents and base url)
   * TODO: Add caching
   *
   * @private
   * @returns
   * @memberof EntryFileTabService
   */
  private getFileContents() {
    this.ga4ghFilesService.injectAuthorizationToken(this.ga4ghService);
    const toolFile: ToolFile = this.entryFileTabQuery.getSnapshot().selectedFile;
    if (!toolFile) {
      return;
    }
    const workflow = this.workflowQuery.getActive();
    const version = this.workflowQuery.getSnapshot().version;
    const path = toolFile.path;
    const fileType = workflow.descriptorType;
    this.setFileContents(null);
    this.setLoading(true);
    this.ga4ghService
      .toolsIdVersionsVersionIdTypeDescriptorRelativePathGet(
        fileType,
        ga4ghWorkflowIdPrefix + workflow.full_workflow_path,
        version.name,
        path
      )
      .subscribe(
        (fileWrapper: FileWrapper) => {
          this.handleFileWrapperChange(fileWrapper);
        },
        error => {
          this.setFileContents(null);
          this.setDownloadFilePath(null);
        }
      );
  }

  /**
   * Handle when a new FileWrapper object is received
   *
   * @private
   * @param {FileWrapper} fileWrapper  The object returned for a specific file
   * @memberof EntryFileTabService
   */
  @transaction()
  private handleFileWrapperChange(fileWrapper: FileWrapper) {
    this.setFileContents(fileWrapper.content);
    this.changeDownloadFilePath();
  }

  /**
   * Change the download file HREF
   *
   * @private
   * @memberof EntryFileTabService
   */
  private changeDownloadFilePath() {
    const downloadFilePath = this.getWorklowDownloadFilePath();
    this.setDownloadFilePath(downloadFilePath);
  }

  /**
   * Gets the download file HREF
   *
   * @private
   * @returns {string | null}  The download file HREF, null if something went wrong
   * @memberof EntryFileTabService
   */
  private getWorklowDownloadFilePath(): string | null {
    const workflow = this.workflowQuery.getActive();
    const version = this.workflowQuery.getSnapshot().version;
    const entryPath = workflow.full_workflow_path;
    const toolDescriptorType = <ToolDescriptor.TypeEnum>workflow.descriptorType.toUpperCase();
    if (!workflow || !version) {
      console.error('Worklow or version is not truthy');
      return null;
    }
    const id = ga4ghWorkflowIdPrefix + entryPath;
    const versionId = version.name;
    const type = this.descriptorTypeCompatService.toolDescriptorTypeEnumToPlainTRS(toolDescriptorType);
    const relativePath = this.entryFileTabQuery.getSnapshot().selectedFile.path;
    return this.fileService.getDownloadFilePath(id, versionId, type, relativePath);
  }

  /**
   * Filters all the files returned from the GA4GH endpoint down to a single file type
   *
   * @private
   * @param {ToolFile.FileTypeEnum} fileType  The file type to return
   * @param {ToolFile[]} toolFiles  All the ToolFiles
   * @returns {ToolFile[]}  Subset of all ToolFiles with a certain file type
   * @memberof EntryFileTabService
   */
  private filterFiles(fileType: ToolFile.FileTypeEnum, toolFiles: ToolFile[]): ToolFile[] {
    return toolFiles.filter(toolFile => toolFile.file_type === fileType);
  }
}
