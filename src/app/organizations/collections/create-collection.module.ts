import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateCollectionComponent } from './create-collection/create-collection.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatButtonModule, MatInputModule, MatDialogModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [ CommonModule, FlexLayoutModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule ],
  declarations: [ CreateCollectionComponent ],
  entryComponents: [ CreateCollectionComponent ]
})
export class CreateCollectionModule { }
