import { ParamfilesService } from './../paramfiles/paramfiles.service';
import { ContainerService } from '../../shared/container.service';
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
  public TagEditorMode = TagEditorMode;
  public DescriptorType = DescriptorType;
  private editMode = true;
  private mode: TagEditorMode;
  private tool: any;
  private unsavedVersion;
  private unsavedCWLTestParameterFiles;
  private unsavedWDLTestParameterFiles;
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
  }

  setMode(mode: TagEditorMode) {
    console.log('Setting mode to: ' + TagEditorMode[mode]);
    this.mode = mode;
    this.paramfilesService.getFiles(this.tool.id, this.version.name, 'CWL').subscribe(file => {
      this.unsavedCWLTestParameterFiles = file;
    });
    this.paramfilesService.getFiles(this.tool.id, this.version.name, 'WDL').subscribe(file => {
      this.unsavedWDLTestParameterFiles = file;
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
        const newTestFile = { 'content': '', 'id': '', 'path': this.unsavedTestCWLFile, 'type': 'CWL_TEST_JSON' };
        this.unsavedCWLTestParameterFiles.push(newTestFile);
        this.unsavedTestCWLFile = '';
        break;
      }
      case DescriptorType.WDL: {
        const newTestFile = { 'content': '', 'id': '', 'path': this.unsavedTestWDLFile, 'type': 'WDL_TEST_JSON' };
        this.unsavedWDLTestParameterFiles.push(newTestFile);
        this.unsavedTestWDLFile = '';
        break;
      }
      default : {
        console.log('No idea how you submitted in neither edit or add mode');
      }
    }
  }

  removeTestParameterFile(index: Number, descriptorType: DescriptorType) {
    switch (descriptorType) {
      case DescriptorType.CWL: {
        this.unsavedCWLTestParameterFiles.splice(index, 1);
        break;
      }
      case DescriptorType.WDL: {
        this.unsavedWDLTestParameterFiles.splice(index, 1);
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
    this.tool = this.communicatorService.getTool();
    this.unsavedTestCWLFile = '';
    this.unsavedTestWDLFile = '';
  }
}
