import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEntryComponent } from './add-entry/add-entry.component';
import { CustomMaterialModule } from '../../shared/modules/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RefreshAlertModule } from '../../shared/alert/alert.module';

@NgModule({
  imports: [ CommonModule, CustomMaterialModule, FlexLayoutModule, RefreshAlertModule ],
  declarations: [ AddEntryComponent ],
  entryComponents: [ AddEntryComponent ]
})
export class AddEntryModule { }
