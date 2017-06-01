import { Component } from '@angular/core';

import { View } from '../../shared/view';

import { ViewService } from './view.service';
import { DateService } from '../../shared/date.service';

@Component({
  selector: 'app-view-container',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewContainerComponent extends View {
  private editMode = true;
  private mode: Mode;
  constructor(private viewService: ViewService,
    dateService: DateService) {
    super(dateService);
  }

  getSizeString(size) {
    return this.viewService.getSizeString(size);
  }

  setMode(mode: Mode) {
    console.log('Setting mode to: ' + mode);
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
}
export enum DescriptorType {
  'CWL',
  'WDL'
}
export enum Mode {
  'Edit',
  'View',
  'Add'
}

