import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionComponent } from './collection/collection.component';
import { MatCardModule, MatProgressBarModule, MatIconModule, MatChipsModule } from '@angular/material';
import { HeaderModule } from '../shared/modules/header.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [ CommonModule, HeaderModule,
  MatCardModule, MatProgressBarModule, MatIconModule,
  FlexLayoutModule, RouterModule, MatChipsModule ],
  declarations: [ CollectionComponent ]
})
export class CollectionModule { }
