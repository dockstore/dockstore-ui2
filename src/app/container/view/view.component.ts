import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';

import { ContainerService } from './../../shared/container.service';
import { ContainerTagsWebService } from './../../shared/webservice/container-tags-web.service';
import { DateService } from '../../shared/date.service';
import { DescriptorType } from '../../shared/enum/descriptorType.enum';
import { ListContainersService } from './../../containers/list/list.service';
import { ParamfilesService } from './../paramfiles/paramfiles.service';
import { StateService } from './../../shared/state.service';
import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';
import { validationMessages, formErrors } from '../../shared/validationMessages.model';
import { View } from '../../shared/view';
import { ViewService } from './view.service';

@Component({
  selector: 'app-view-container',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
// This is actually the tag edtior
export class ViewContainerComponent extends View implements OnInit, AfterViewChecked {
  // Enumss
  public TagEditorMode = TagEditorMode;
  public DescriptorType = DescriptorType;

  private editMode;
  private mode: TagEditorMode;
  private tool: any;
  private unsavedVersion;
  private savedCWLTestParameterFiles: Array<any>;
  private savedWDLTestParameterFiles: Array<any>;
  private savedCWLTestParameterFilePaths: Array<string>;
  private savedWDLTestParameterFilePaths: Array<string>;
  private unsavedCWLTestParameterFilePaths: Array<string>;
  private unsavedWDLTestParameterFilePaths: Array<string>;
  private unsavedTestCWLFile: string;
  private unsavedTestWDLFile: string;
  private formErrors = formErrors;

  tagEditorForm: NgForm;
  @ViewChild('tagEditorForm') currentForm: NgForm;

  constructor(
    private paramfilesService: ParamfilesService,
    private viewService: ViewService,
    private listContainersService: ListContainersService,
    dateService: DateService,
    private containerService: ContainerService,
    private containerTagsService: ContainerTagsWebService,
    private stateService: StateService) {
    super(dateService);
  }

  // Almost all these functions should be moved to a service
  getSizeString(size) {
    return this.viewService.getSizeString(size);
  }


  onSubmit() {
    switch (this.mode) {
      case TagEditorMode.Add: {
        this.addTag();
        break;
      }
      case TagEditorMode.Edit: {
        this.editTag();
        break;
      }
      default: {
        console.log('No idea how you submitted in neither edit or add mode');
      }
    }
  }
  addTag() {
    console.log('Saving tag...');
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
    console.log('Editing tag...');
    const newCWL = this.unsavedCWLTestParameterFilePaths.filter(x => this.savedCWLTestParameterFilePaths.indexOf(x) === -1);
    if (newCWL && newCWL.length > 0) {
      this.paramfilesService.putFiles(this.tool.id, newCWL, this.version.name, 'CWL').subscribe();
    }
    const missingCWL = this.savedCWLTestParameterFilePaths.filter(x => this.unsavedCWLTestParameterFilePaths.indexOf(x) === -1);
    if (missingCWL && missingCWL.length > 0) {
      this.paramfilesService.deleteFiles(this.tool.id, missingCWL, this.version.name, 'CWL').subscribe();
    }
    const newWDL = this.unsavedWDLTestParameterFilePaths.filter(x => this.savedWDLTestParameterFilePaths.indexOf(x) === -1);
    if (newWDL && newWDL.length > 0) {
      this.paramfilesService.putFiles(this.tool.id, newWDL, this.version.name, 'WDL').subscribe();
    }
    const missingWDL = this.savedWDLTestParameterFilePaths.filter(x => this.unsavedWDLTestParameterFilePaths.indexOf(x) === -1);
    if (missingWDL && missingWDL.length > 0) {
      this.paramfilesService.deleteFiles(this.tool.id, missingWDL, this.version.name, 'WDL').subscribe();
    }
    this.containerTagsService.putTags(this.tool.id, this.unsavedVersion).subscribe();
  }

  deleteTag() {
    this.containerTagsService.deleteTag(this.tool.id, this.unsavedVersion.id).subscribe(deleteResponse => {
      this.containerTagsService.getTags(this.tool.id).subscribe(response => {
      this.tool.tags = response;
      this.containerService.setTool(this.tool);
    });
    });
  }

  setMode(mode: TagEditorMode) {
    console.log('Setting mode to: ' + TagEditorMode[mode]);
    this.viewService.setCurrentMode(mode);
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
        console.log('No idea how you submitted in neither edit or add mode');
      }
    }
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
        console.log('No idea how you submitted in neither edit or add mode');
      }
    }
  }

  getFilteredDockerPullCmd(path: string, tagName: string = ''): string {
    return this.listContainersService.getDockerPullCmd(path, tagName);
  }
  ngOnInit() {
    this.viewService.mode.subscribe(
      (mode: TagEditorMode) => {
        this.mode = mode;
      }
    );

    this.unsavedVersion = Object.assign({}, this.version);
    this.stateService.publicPage.subscribe(publicPage => this.editMode = !publicPage);
    this.containerService.tool$.subscribe(tool => {
      this.tool = tool;
    });
    this.viewService.unsavedTestCWLFile.subscribe(
      (file: string) => {
        this.unsavedTestCWLFile = file;
      }
    );
    this.viewService.unsavedTestWDLFile.subscribe(
      (file: string) => {
        this.unsavedTestWDLFile = file;
      }
    );
    this.savedCWLTestParameterFilePaths = [];
    this.savedWDLTestParameterFilePaths = [];
  }
}
