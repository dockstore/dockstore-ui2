import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEntryComponent } from './add-entry/add-entry.component';
import { CustomMaterialModule } from '../../shared/modules/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [ CommonModule, CustomMaterialModule, FlexLayoutModule ],
  declarations: [ AddEntryComponent ],
  entryComponents: [ AddEntryComponent ]
})
export class AddEntryModule { }
