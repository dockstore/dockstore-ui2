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
import { AfterViewChecked, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ListContainersService } from '../../containers/list/list.service';
import { AlertService } from '../../shared/alert/state/alert.service';
import { formInputDebounceTime } from '../../shared/constants';
import { ContainerService } from '../../shared/container.service';
import { DateService } from '../../shared/date.service';
import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';
import { SessionQuery } from '../../shared/session/session.query';
import { ContainersService } from '../../shared/swagger/api/containers.service';
import { ContainertagsService } from '../../shared/swagger/api/containertags.service';
import { DockstoreTool } from '../../shared/swagger/model/dockstoreTool';
import { Tag } from '../../shared/swagger/model/tag';
import { ToolDescriptor } from '../../shared/swagger/model/toolDescriptor';
import { ToolQuery } from '../../shared/tool/tool.query';
import { formErrors, validationDescriptorPatterns, validationMessages } from '../../shared/validationMessages.model';
import { ParamfilesService } from '../paramfiles/paramfiles.service';
import { VersionModalService } from './version-modal.service';

@Component({
  selector: 'app-version-modal',
  templateUrl: './version-modal.component.html',
  styleUrls: ['./version-modal.component.css']
})
export class VersionModalComponent implements OnInit, AfterViewChecked, OnDestroy {
  public TagEditorMode = TagEditorMode;
  public DescriptorType = ToolDescriptor.TypeEnum;
  public editMode: boolean;
  public mode: TagEditorMode;
  public tool: DockstoreTool;
  public unsavedVersion;
  private savedCWLTestParameterFiles: Array<any>;
  private savedWDLTestParameterFiles: Array<any>;
  private savedCWLTestParameterFilePaths: Array<string>;
  private savedWDLTestParameterFilePaths: Array<string>;
  public unsavedCWLTestParameterFilePaths: Array<string> = [];
  public unsavedWDLTestParameterFilePaths: Array<string> = [];
  public unsavedTestCWLFile = '';
  public unsavedTestWDLFile = '';
  public dockerPullCommand = '';
  public DockstoreToolType = DockstoreTool;
  public loading = true;
  public formErrors = formErrors;
  public version: Tag;
  public validationPatterns = validationDescriptorPatterns;
  tagEditorForm: NgForm;
  @ViewChild('tagEditorForm', { static: false }) currentForm: NgForm;

  private ngUnsubscribe: Subject<{}> = new Subject();

  constructor(
    private paramfilesService: ParamfilesService,
    private versionModalService: VersionModalService,
    private listContainersService: ListContainersService,
    private containerService: ContainerService,
    private alertService: AlertService,
    private containersService: ContainersService,
    private containertagsService: ContainertagsService,
    private sessionQuery: SessionQuery,
    private dateService: DateService,
    private matDialog: MatDialog,
    private toolQuery: ToolQuery
  ) {}

  // Almost all these functions should be moved to a service
  getSizeString(size) {
    return this.versionModalService.getSizeString(size);
  }

  onSubmit() {
    this.editTag();
  }

  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    if (this.currentForm === this.tagEditorForm) {
      return;
    }
    this.tagEditorForm = this.currentForm;
    if (this.tagEditorForm) {
      this.tagEditorForm.valueChanges
        .pipe(
          debounceTime(formInputDebounceTime),
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe(data => this.onValueChanged(data));
    }
  }

  onValueChanged(data?: any) {
    if (!this.tagEditorForm) {
      return;
    }
    const form = this.tagEditorForm.form;
    for (const field in formErrors) {
      if (formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        formErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          const messages = validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  editTag() {
    const message = 'Updating tag';
    this.alertService.start(message);
    const id = this.tool.id;
    const tagName = this.version.name;

    // Store the unsaved test files if valid and exist
    if (this.unsavedTestCWLFile.length > 0) {
      this.addTestParameterFile(this.DescriptorType.CWL);
    }
    if (this.unsavedTestWDLFile.length > 0) {
      this.addTestParameterFile(this.DescriptorType.WDL);
    }

    const newCWL = this.unsavedCWLTestParameterFilePaths.filter(x => !this.savedCWLTestParameterFilePaths.includes(x));
    if (newCWL && newCWL.length > 0) {
      // Using the string 'CWL' because this parameter only accepts 'CWL' or 'WDL' and not 'NFL'
      this.containersService
        .addTestParameterFiles(id, newCWL, 'CWL', tagName, null)
        .subscribe(response => {}, err => this.alertService.detailedError(err));
    }
    const missingCWL = this.savedCWLTestParameterFilePaths.filter(x => !this.unsavedCWLTestParameterFilePaths.includes(x));
    if (missingCWL && missingCWL.length > 0) {
      // Using the string 'CWL' because this parameter only accepts 'CWL' or 'WDL' and not 'NFL'
      this.containersService
        .deleteTestParameterFiles(id, missingCWL, 'CWL', tagName)
        .subscribe(response => {}, err => this.alertService.detailedError(err));
    }
    const newWDL = this.unsavedWDLTestParameterFilePaths.filter(x => !this.savedWDLTestParameterFilePaths.includes(x));
    if (newWDL && newWDL.length > 0) {
      // Using the string 'WDL' because this parameter only accepts 'CWL' or 'WDL' and not 'NFL'
      this.containersService
        .addTestParameterFiles(id, newWDL, 'WDL', tagName, null)
        .subscribe(response => {}, err => this.alertService.detailedError(err));
    }
    const missingWDL = this.savedWDLTestParameterFilePaths.filter(x => !this.unsavedWDLTestParameterFilePaths.includes(x));
    if (missingWDL && missingWDL.length > 0) {
      // Using the string 'WDL' because this parameter only accepts 'CWL' or 'WDL' and not 'NFL'
      this.containersService
        .deleteTestParameterFiles(id, missingWDL, 'WDL', tagName)
        .subscribe(response => {}, err => this.alertService.detailedError(err));
    }
    this.containertagsService.updateTags(id, [this.unsavedVersion]).subscribe(
      response => {
        this.tool = { ...this.tool, workflowVersions: response };
        this.containerService.setTool(this.tool);
        this.alertService.detailedSuccess();
        this.matDialog.closeAll();
      },
      error => {
        this.alertService.detailedError(error);
        this.matDialog.closeAll();
      }
    );
  }

  onHidden() {
    this.versionModalService.setCurrentMode(null);
    this.matDialog.closeAll();
  }

  setMode(mode: TagEditorMode) {
    this.loading = true;
    this.unsavedCWLTestParameterFilePaths = [];
    this.unsavedWDLTestParameterFilePaths = [];
    this.savedCWLTestParameterFilePaths = [];
    this.savedWDLTestParameterFilePaths = [];

    forkJoin([
      this.paramfilesService.getFiles(this.tool.id, 'containers', this.version.name, ToolDescriptor.TypeEnum.CWL),
      this.paramfilesService.getFiles(this.tool.id, 'containers', this.version.name, ToolDescriptor.TypeEnum.WDL)
    ]).subscribe(([cwlFile, wdlFile]) => {
      this.savedCWLTestParameterFiles = cwlFile;
      this.savedCWLTestParameterFiles.forEach(fileObject => {
        this.savedCWLTestParameterFilePaths.push(fileObject.path);
      });
      this.unsavedCWLTestParameterFilePaths = this.savedCWLTestParameterFilePaths.slice();
      this.savedWDLTestParameterFiles = wdlFile;
      this.savedWDLTestParameterFiles.forEach(fileObject => {
        this.savedWDLTestParameterFilePaths.push(fileObject.path);
      });
      this.unsavedWDLTestParameterFilePaths = this.savedWDLTestParameterFilePaths.slice();
      this.loading = false;
    });
  }

  addTestParameterFile(descriptorType: ToolDescriptor.TypeEnum) {
    switch (descriptorType) {
      case this.DescriptorType.CWL: {
        const newTestFile = this.unsavedTestCWLFile;
        this.unsavedCWLTestParameterFilePaths.push(newTestFile);
        this.unsavedTestCWLFile = '';
        break;
      }
      case this.DescriptorType.WDL: {
        const newTestFile = this.unsavedTestWDLFile;
        this.unsavedWDLTestParameterFilePaths.push(newTestFile);
        this.unsavedTestWDLFile = '';
        break;
      }
      default: {
        this.handleUnrecognizedDescriptorType();
      }
    }
  }

  handleUnrecognizedDescriptorType() {
    console.log('Unrecognized descriptor type.');
  }

  removeTestParameterFile(index: number, descriptorType: ToolDescriptor.TypeEnum) {
    switch (descriptorType) {
      case this.DescriptorType.CWL: {
        this.unsavedCWLTestParameterFilePaths.splice(index, 1);
        break;
      }
      case this.DescriptorType.WDL: {
        this.unsavedWDLTestParameterFilePaths.splice(index, 1);
        break;
      }
      default: {
        this.handleUnrecognizedDescriptorType();
      }
    }
  }

  /**
   * This updates the docker pull command in the template
   */
  public updateDockerPullCommand(): void {
    if (this.tool && this.version) {
      this.dockerPullCommand = this.listContainersService.getDockerPullCmd(this.tool.path, this.version.name);
    }
  }

  ngOnInit() {
    this.versionModalService.mode.pipe(takeUntil(this.ngUnsubscribe)).subscribe((mode: TagEditorMode) => (this.mode = mode));
    this.versionModalService.version.pipe(takeUntil(this.ngUnsubscribe)).subscribe(version => {
      this.version = version;
      this.unsavedVersion = Object.assign({}, this.version);
      this.updateDockerPullCommand();
    });
    this.sessionQuery.isPublic$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(publicPage => (this.editMode = !publicPage));
    this.toolQuery.tool$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(tool => {
      this.tool = tool;
      this.updateDockerPullCommand();
      if (this.mode !== null && this.tool) {
        this.setMode(this.mode);
      }
    });
    this.versionModalService.unsavedTestCWLFile.pipe(takeUntil(this.ngUnsubscribe)).subscribe((file: string) => {
      this.unsavedTestCWLFile = file;
    });
    this.versionModalService.unsavedTestWDLFile.pipe(takeUntil(this.ngUnsubscribe)).subscribe((file: string) => {
      this.unsavedTestWDLFile = file;
    });
    this.savedCWLTestParameterFilePaths = [];
    this.savedWDLTestParameterFilePaths = [];
  }

  getDateTimeMessage(timestamp) {
    return this.dateService.getDateTimeMessage(timestamp);
  }

  // Validation ends here
  // Checks if the currently edited test parameter file already exists
  // TODO: This code is repeated in add-tag.component.ts for tools, move it somewhere common
  // TODO: This is also executed a bajillion times
  hasDuplicateTestJson(type: ToolDescriptor.TypeEnum): boolean {
    if (type === this.DescriptorType.CWL) {
      return this.hasDuplicateTestJsonCommon(this.unsavedTestCWLFile, this.unsavedTestWDLFile);
    } else if (type === this.DescriptorType.WDL) {
      return this.hasDuplicateTestJsonCommon(this.unsavedTestWDLFile, this.unsavedTestCWLFile);
    } else {
      return false;
    }
  }

  /**
   * Mainly checks 3 things, if we're checking the CWL test parameter file that's about to be added then:
   * - The current list of WDL test parameter files cannot already have it
   * - The current list of CWL test parameter files cannot already have it
   * - The current WDL test parameter file to be added cannot be the same
   *   with the exception that both are empty since nothing happens regardless)
   *
   * @private
   * @param {string} focusedTestFilePath    The test parameter file we're currently checking
   * @param {string} unfocusedTestFilePath  The other test parameter file we're not currently checking
   * @returns {boolean}                     Whether or not a duplicate test file exists
   * @memberof VersionModalComponent
   */
  private hasDuplicateTestJsonCommon(focusedTestFilePath: string, unfocusedTestFilePath: string): boolean {
    if (!focusedTestFilePath) {
      return false;
    } else {
      const paths = this.unsavedCWLTestParameterFilePaths.concat(this.unsavedWDLTestParameterFilePaths).concat(unfocusedTestFilePath);
      return paths.includes(focusedTestFilePath);
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
