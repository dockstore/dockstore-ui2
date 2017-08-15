import { DateService } from './../../shared/date.service';
import { ToolVersion } from './../../shared/swagger/model/toolVersion';
import { VersionModalService } from './version-modal.service';
import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';

import { ContainerService } from './../../shared/container.service';
import { ContainerTagsWebService } from './../../shared/webservice/container-tags-web.service';
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
  public tool: any;
  public unsavedVersion;
  private savedCWLTestParameterFiles: Array<any>;
  private savedWDLTestParameterFiles: Array<any>;
  private savedCWLTestParameterFilePaths: Array<string>;
  private savedWDLTestParameterFilePaths: Array<string>;
  public unsavedCWLTestParameterFilePaths: Array<string>;
  public unsavedWDLTestParameterFilePaths: Array<string>;
  public unsavedTestCWLFile = '';
  public unsavedTestWDLFile = '';
  public formErrors = formErrors;
  private version: ToolVersion;
  public validationPatterns = validationPatterns;
  tagEditorForm: NgForm;
  @ViewChild('tagEditorForm') currentForm: NgForm;

  constructor(
    private paramfilesService: ParamfilesService,
    private versionModalService: VersionModalService,
    private listContainersService: ListContainersService,
    private containerService: ContainerService,
    private containerTagsService: ContainerTagsWebService,
    private stateService: StateService,
    private dateService: DateService) {
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
    const newCWL = this.unsavedCWLTestParameterFilePaths.filter(x => !this.savedCWLTestParameterFilePaths.includes(x));
    if (newCWL && newCWL.length > 0) {
      this.paramfilesService.putFiles(this.tool.id, newCWL, this.version.name, 'CWL').subscribe();
    }
    const missingCWL = this.savedCWLTestParameterFilePaths.filter(x => !this.unsavedCWLTestParameterFilePaths.includes(x));
    if (missingCWL && missingCWL.length > 0) {
      this.paramfilesService.deleteFiles(this.tool.id, missingCWL, this.version.name, 'CWL').subscribe();
    }
    const newWDL = this.unsavedWDLTestParameterFilePaths.filter(x => !this.savedWDLTestParameterFilePaths.includes(x));
    if (newWDL && newWDL.length > 0) {
      this.paramfilesService.putFiles(this.tool.id, newWDL, this.version.name, 'WDL').subscribe();
    }
    const missingWDL = this.savedWDLTestParameterFilePaths.filter(x => !this.unsavedWDLTestParameterFilePaths.includes(x));
    if (missingWDL && missingWDL.length > 0) {
      this.paramfilesService.deleteFiles(this.tool.id, missingWDL, this.version.name, 'WDL').subscribe();
    }
    this.containerTagsService.putTags(this.tool.id, this.unsavedVersion).subscribe(response => {
      this.versionModalService.setIsModalShown(false);
    });
  }

  deleteTag() {
    this.containerTagsService.deleteTag(this.tool.id, this.unsavedVersion.id).subscribe(deleteResponse => {
      this.containerTagsService.getTags(this.tool.id).subscribe(response => {
        this.tool.tags = response;
        this.containerService.setTool(this.tool);
      });
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

  getFilteredDockerPullCmd(path: string, tagName: string = ''): string {
    return this.listContainersService.getDockerPullCmd(path, tagName);
  }

  ngOnInit() {
    this.versionModalService.version.subscribe(version => {
      this.version = version;
      this.unsavedVersion = Object.assign({}, this.version);
    });
    this.versionModalService.isModalShown.subscribe(isModalShown => this.isModalShown = isModalShown);
    this.versionModalService.mode.subscribe(
      (mode: TagEditorMode) => {
        this.mode = mode;
        if (mode !== null) {
          this.setMode(mode);
        }
      }
    );
    this.stateService.publicPage.subscribe(publicPage => this.editMode = !publicPage);
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
}
