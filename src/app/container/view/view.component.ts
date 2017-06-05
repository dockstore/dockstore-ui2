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
  private editMode = true;
  private mode: TagEditorMode;
  private tool: any;
  private unsavedVersion;
  private unsavedCWLTestParameterFiles;
  private unsavedWDLTestParameterFiles;
  public TagEditorMode = TagEditorMode;
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
        console.log('No idea how you submitted in neither editor or add mode');
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
      console.log(this.unsavedCWLTestParameterFiles);
    });
    this.paramfilesService.getFiles(this.tool.id, this.version.name, 'WDL').subscribe(file => {
      this.unsavedWDLTestParameterFiles = file;
      console.log(this.unsavedWDLTestParameterFiles);
    });
  }

  getMode() {
    return this.mode;
  }
  hasBlankPath(descriptorType: DescriptorType) {
    if (descriptorType === DescriptorType.CWL) {
      // return ($scope.cwlItems.indexOf("") !== -1);
      return false;
    } else if (descriptorType === DescriptorType.WDL) {
      // return ($scope.wdlItems.indexOf("") !== -1);
      return false;
    } else {
      return true;
    }
  }
  getFilteredDockerPullCmd(path: string, tagName: string = ''): string {
    return this.listContainersService.getDockerPullCmd(path, tagName);
  }
  ngOnInit() {
    this.unsavedVersion = this.version;
    this.tool = this.communicatorService.getObj();
  }
}
