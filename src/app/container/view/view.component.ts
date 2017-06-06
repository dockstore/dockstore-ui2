import { ContainerTagsService } from './../../shared/containerTags.service';
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
  private savedCWLTestParameterFilePaths: Array<string>;
  private savedWDLTestParameterFilePaths: Array<string>;
  private unsavedCWLTestParameterFilePaths: Array<string>;
  private unsavedWDLTestParameterFilePaths: Array<string>;
  private unsavedTestCWLFile: string;
  private unsavedTestWDLFile: string;

  constructor(
    private paramfilesService: ParamfilesService,
    private viewService: ViewService,
    private listContainersService: ListContainersService,
    dateService: DateService,
    private communicatorService: CommunicatorService,
    private containerTagsService: ContainerTagsService) {
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

  setMode(mode: TagEditorMode) {
    console.log('Setting mode to: ' + TagEditorMode[mode]);
    this.mode = mode;
    this.unsavedCWLTestParameterFilePaths = [];
    this.unsavedWDLTestParameterFilePaths = [];
    this.savedCWLTestParameterFilePaths = [];
    this.savedWDLTestParameterFilePaths = [];
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
