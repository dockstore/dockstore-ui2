import { RefreshService } from '../../shared/refresh.service';
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

import { ContainersService } from './../../shared/swagger/api/containers.service';
import { DockstoreTool } from './../../shared/swagger/model/dockstoreTool';
import { ToolDescriptor } from './../../shared/swagger/model/toolDescriptor';
import { ContainertagsService } from './../../shared/swagger/api/containertags.service';
import { DateService } from './../../shared/date.service';
import { ToolVersion } from './../../shared/swagger/model/toolVersion';
import { VersionModalService } from './version-modal.service';
import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';

import { ContainerService } from './../../shared/container.service';
import { DescriptorType } from '../../shared/enum/descriptorType.enum';
import { ListContainersService } from './../../containers/list/list.service';
import { ParamfilesService } from './../paramfiles/paramfiles.service';
import { StateService } from './../../shared/state.service';
import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';
import { validationMessages, validationPatterns, formErrors } from '../../shared/validationMessages.model';
import { View } from '../../shared/view';

@Component({
  selector: 'app-version-modal',
  templateUrl: './version-modal.component.html',
  styleUrls: ['./version-modal.component.css']
})
export class VersionModalComponent implements OnInit, AfterViewChecked {
  public TagEditorMode = TagEditorMode;
  public DescriptorType = DescriptorType;
  public isModalShown: boolean;
  public editMode: boolean;
  public mode: TagEditorMode;
  public tool: DockstoreTool;
  public unsavedVersion;
  private savedCWLTestParameterFiles: Array<any>;
  private savedWDLTestParameterFiles: Array<any>;
  private savedCWLTestParameterFilePaths: Array<string>;
  private savedWDLTestParameterFilePaths: Array<string>;
  public unsavedCWLTestParameterFilePaths: Array<string>;
  public unsavedWDLTestParameterFilePaths: Array<string>;
  public unsavedTestCWLFile = '';
  public unsavedTestWDLFile = '';
  public dockerPullCommand = '';

  public formErrors = formErrors;
  private version: ToolVersion;
  public validationPatterns = validationPatterns;
  tagEditorForm: NgForm;
  @ViewChild('tagEditorForm') currentForm: NgForm;

  constructor(private paramfilesService: ParamfilesService, private versionModalService: VersionModalService,
    private listContainersService: ListContainersService, private containerService: ContainerService,
    private containersService: ContainersService, private containertagsService: ContainertagsService,
    private stateService: StateService, private dateService: DateService, private refreshService: RefreshService) {
  }

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
    if (this.currentForm === this.tagEditorForm) { return; }
    this.tagEditorForm = this.currentForm;
    if (this.tagEditorForm) {
      this.tagEditorForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
    }
  }

  onValueChanged(data?: any) {
    if (!this.tagEditorForm) { return; }
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
    this.stateService.setRefreshMessage(message + '...');
    const id = this.tool.id;
    const tagName = this.version.name;

    // Store the unsaved test files if valid and exist
    if (this.unsavedTestCWLFile.length > 0) {
      this.addTestParameterFile(DescriptorType.CWL);
    }
    if (this.unsavedTestWDLFile.length > 0) {
      this.addTestParameterFile(DescriptorType.WDL);
    }

    const newCWL = this.unsavedCWLTestParameterFilePaths.filter(x => !this.savedCWLTestParameterFilePaths.includes(x));
    if (newCWL && newCWL.length > 0) {
      this.containersService.addTestParameterFiles(id, newCWL, null, tagName, 'CWL').subscribe(response => {},
        err => this.refreshService.handleError(message, err) );
    }
    const missingCWL = this.savedCWLTestParameterFilePaths.filter(x => !this.unsavedCWLTestParameterFilePaths.includes(x));
    if (missingCWL && missingCWL.length > 0) {
      this.containersService.deleteTestParameterFiles(id, missingCWL, tagName, 'CWL').subscribe(response => {},
        err => this.refreshService.handleError(message, err) );
    }
    const newWDL = this.unsavedWDLTestParameterFilePaths.filter(x => !this.savedWDLTestParameterFilePaths.includes(x));
    if (newWDL && newWDL.length > 0) {
      this.containersService.addTestParameterFiles(id, newWDL, null, tagName, 'WDL').subscribe(response => {},
        err => this.refreshService.handleError(message, err) );
    }
    const missingWDL = this.savedWDLTestParameterFilePaths.filter(x => !this.unsavedWDLTestParameterFilePaths.includes(x));
    if (missingWDL && missingWDL.length > 0) {
      this.containersService.deleteTestParameterFiles(id, missingWDL, tagName, 'WDL').subscribe(response => {},
        err => this.refreshService.handleError(message, err) );
    }
    this.containertagsService.updateTags(id, [this.unsavedVersion]).subscribe(response => {
      this.tool.tags = response;
      this.containerService.setTool(this.tool);
      this.versionModalService.setIsModalShown(false);
      this.refreshService.handleSuccess(message);
    }, error => {
      this.refreshService.handleError(message, error);
      this.versionModalService.setIsModalShown(false);
    });
  }

  onHidden() {
    this.versionModalService.setIsModalShown(false);
    this.versionModalService.setCurrentMode(null);
  }

  setMode(mode: TagEditorMode) {
    this.unsavedCWLTestParameterFilePaths = [];
    this.unsavedWDLTestParameterFilePaths = [];
    this.savedCWLTestParameterFilePaths = [];
    this.savedWDLTestParameterFilePaths = [];
    this.paramfilesService.getFiles(this.tool.id, 'containers', this.version.name, 'CWL').subscribe(file => {
      this.savedCWLTestParameterFiles = file;
      this.savedCWLTestParameterFiles.forEach((fileObject) => {
        this.savedCWLTestParameterFilePaths.push(fileObject.path);
      });
      this.unsavedCWLTestParameterFilePaths = this.savedCWLTestParameterFilePaths.slice();

    });
    this.paramfilesService.getFiles(this.tool.id, 'containers', this.version.name, 'WDL').subscribe(file => {
      this.savedWDLTestParameterFiles = file;
      this.savedWDLTestParameterFiles.forEach((fileObject) => {
        this.savedWDLTestParameterFilePaths.push(fileObject.path);
      });
      this.unsavedWDLTestParameterFilePaths = this.savedWDLTestParameterFilePaths.slice();
    });
  }

  addTestParameterFile(descriptorType: DescriptorType) {
    switch (descriptorType) {
      case DescriptorType.CWL: {
        const newTestFile = this.unsavedTestCWLFile;
        this.unsavedCWLTestParameterFilePaths.push(newTestFile);
        this.unsavedTestCWLFile = '';
        break;
      }
      case DescriptorType.WDL: {
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

  removeTestParameterFile(index: number, descriptorType: DescriptorType) {
    switch (descriptorType) {
      case DescriptorType.CWL: {
        this.unsavedCWLTestParameterFilePaths.splice(index, 1);
        break;
      }
      case DescriptorType.WDL: {
        this.unsavedWDLTestParameterFilePaths.splice(index, 1);
        break;
      }
      default: {
        this.handleUnrecognizedDescriptorType();
      }
    }
  }

  ngOnInit() {
    this.versionModalService.version.subscribe(version => {
      this.version = version;
      if (this.tool && this.version) {
        this.dockerPullCommand = this.listContainersService.getDockerPullCmd(this.tool.path, this.version.name);
      }
      this.unsavedVersion = Object.assign({}, this.version);
    });
    this.versionModalService.isModalShown.subscribe(isModalShown => {
      if (!this.tool && this.isModalShown) {
        this.versionModalService.setIsModalShown(false);
      } else {
        this.isModalShown = isModalShown; }
    });
    this.versionModalService.mode.subscribe(
      (mode: TagEditorMode) => {
        this.mode = mode;
        if (mode !== null && this.tool) {
          this.setMode(mode);
        }
      }
    );
    this.stateService.publicPage$.subscribe(publicPage => this.editMode = !publicPage);
    this.containerService.tool$.subscribe(tool => {
      this.tool = tool;
    });
    this.versionModalService.unsavedTestCWLFile.subscribe(
      (file: string) => {
        this.unsavedTestCWLFile = file;
      }
    );
    this.versionModalService.unsavedTestWDLFile.subscribe(
      (file: string) => {
        this.unsavedTestWDLFile = file;
      }
    );
    this.savedCWLTestParameterFilePaths = [];
    this.savedWDLTestParameterFilePaths = [];
  }

  getDateTimeMessage(timestamp) {
    return this.dateService.getDateTimeMessage(timestamp);
  }

  // Checks if the currently edited test parameter file already exists
  hasDuplicateTestJson(type) {
    if (type === DescriptorType.CWL) {
      if (this.unsavedCWLTestParameterFilePaths.includes(this.unsavedTestCWLFile)) {
        return true;
      } else {
        return false;
      }
    } else if (type === DescriptorType.WDL) {
      if (this.unsavedWDLTestParameterFilePaths.includes(this.unsavedTestWDLFile)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
