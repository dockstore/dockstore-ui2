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

  constructor(private viewService: ViewService,
              dateService: DateService) {
    super(dateService);
  }

  getSizeString(size) {
    return this.viewService.getSizeString(size);
  }

}
