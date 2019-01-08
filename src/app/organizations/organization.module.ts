import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationComponent } from './organization/organization.component';
import { HeaderModule } from '../shared/modules/header.module';
import { MatIconModule } from '@angular/material';

@NgModule({
  imports: [ CommonModule, HeaderModule, MatIconModule ],
  declarations: [ OrganizationComponent ],
  exports: [ OrganizationComponent ]
})
export class OrganizationModule { }
