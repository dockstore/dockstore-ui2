import { NgModule } from '@angular/core';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { ToasterComponent } from './toaster.component';

@NgModule({
  imports: [
    SimpleNotificationsModule.forRoot(),
  ],
  declarations: [ToasterComponent],
  exports: [ToasterComponent]
})
export class ToasterModule { }
