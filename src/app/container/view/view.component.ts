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
  private unsavedVersion;
  public TagEditorMode = TagEditorMode;
  constructor(private viewService: ViewService, private listContainersService: ListContainersService,
    dateService: DateService) {
    super(dateService);

    // Initially setting tag editor version equal to the actual version
    this.unsavedVersion = this.version;
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
  }
}
