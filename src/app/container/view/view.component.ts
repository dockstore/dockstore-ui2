import { ParamfilesService } from './../paramfiles/paramfiles.service';
import { ContainerService } from './../container.service';
import { CommunicatorService } from './../../shared/communicator.service';
import { Component, OnInit } from '@angular/core';

import { DateService } from '../../shared/date.service';
import { ListContainersService } from './../../containers/list/list.service';
import { View } from '../../shared/view';
import { ViewService } from './view.service';
import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';
import { DescriptorType } from '../../shared/enum/descriptorType.enum';
@Component({
  selector: 'app-view-container',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
// This is actually the tag edtior
export class ViewContainerComponent extends View implements OnInit {

  // Enums
  public TagEditorMode = TagEditorMode;
  public DescriptorType = DescriptorType;

  private editMode = true;
  private mode: TagEditorMode;
  private tool: any;
  private unsavedVersion;
  private savedCWLTestParameterFiles: Array<any>;
  private savedWDLTestParameterFiles: Array<any>;
  private savedCWLTestParameterFilePaths: Array<String>;
  private savedWDLTestParameterFilePaths: Array<String>;
  private unsavedCWLTestParameterFilePaths: Array<String>;
  private unsavedWDLTestParameterFilePaths: Array<String>;
  private unsavedTestCWLFile: String;
  private unsavedTestWDLFile: String;

  constructor(
    private paramfilesService: ParamfilesService,
    private viewService: ViewService,
    private listContainersService: ListContainersService,
    dateService: DateService,
    private communicatorService: CommunicatorService) {
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

  editTag() {
    console.log('Editing tag...');
    const newCWL = this.unsavedCWLTestParameterFilePaths.filter(x => this.savedCWLTestParameterFilePaths.indexOf(x) === -1);
    const missingCWL = this.savedCWLTestParameterFilePaths.filter(x => this.unsavedCWLTestParameterFilePaths.indexOf(x) === -1);
    const newWDL = this.unsavedCWLTestParameterFilePaths.filter(x => this.savedCWLTestParameterFilePaths.indexOf(x) === -1);
    const missingWDL = this.savedCWLTestParameterFilePaths.filter(x => this.unsavedCWLTestParameterFilePaths.indexOf(x) === -1);
  }

  setMode(mode: TagEditorMode) {
    console.log('Setting mode to: ' + TagEditorMode[mode]);
    this.mode = mode;
    this.unsavedCWLTestParameterFilePaths = [];
    this.unsavedWDLTestParameterFilePaths = [];
    this.paramfilesService.getFiles(this.tool.id, this.version.name, 'CWL').subscribe(file => {
      this.savedCWLTestParameterFiles = file;
      for (let i = 0; i < this.savedCWLTestParameterFiles.length; i++) {
        this.savedCWLTestParameterFilePaths.push(this.savedCWLTestParameterFiles[i].path);

      }
      this.unsavedCWLTestParameterFilePaths = this.savedCWLTestParameterFilePaths.slice();

    });
    this.paramfilesService.getFiles(this.tool.id, this.version.name, 'WDL').subscribe(file => {
      this.savedWDLTestParameterFiles = file;
      for (let i = 0; i < this.savedWDLTestParameterFiles.length; i++) {
        this.savedWDLTestParameterFilePaths.push(this.savedWDLTestParameterFiles[i].path);
      }

      this.unsavedWDLTestParameterFilePaths = this.savedWDLTestParameterFilePaths.slice();
    });
  }

  getMode() {
    return this.mode;
  }
  hasBlankPath(descriptorType: DescriptorType) {
    switch (descriptorType) {
      case DescriptorType.CWL: {
        return false;
      }
      case DescriptorType.WDL: {
        return false;
      }
      default: {
        console.log('No idea how you submitted in neither edit or add mode');
        return false;
      }

    }
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
    this.unsavedVersion = this.version;
    this.tool = this.communicatorService.getObj();
    this.unsavedTestCWLFile = '';
    this.unsavedTestWDLFile = '';
    this.savedCWLTestParameterFilePaths = [];
    this.savedWDLTestParameterFilePaths = [];
  }
}
