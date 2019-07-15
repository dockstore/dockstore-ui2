import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AliasesComponent } from './aliases.component';
import { AlertModule } from 'ngx-bootstrap';
import { HeaderModule } from '../shared/modules/header.module';
import { AliasesRouting } from './aliases.routing';
import { CustomMaterialModule } from '../shared/modules/material.module';
import { RefreshAlertModule } from '../shared/alert/alert.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [CommonModule, AlertModule.forRoot(), HeaderModule, AliasesRouting, CustomMaterialModule, RefreshAlertModule, FlexLayoutModule],
  declarations: [AliasesComponent],
  exports: [AliasesComponent]
})
export class AliasesModule {}
