import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationComponent } from './organization/organization.component';
import { HeaderModule } from '../shared/modules/header.module';
import { MatIconModule, MatCardModule, MatProgressBarModule, MatExpansionModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [ CommonModule, FlexLayoutModule, HeaderModule, MatCardModule, MatExpansionModule, MatIconModule, MatProgressBarModule ],
  declarations: [ OrganizationComponent ],
  exports: [ OrganizationComponent ]
})
export class OrganizationModule { }
