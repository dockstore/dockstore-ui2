import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RefreshAlertModule } from '../shared/alert/alert.module';
import { HeaderModule } from '../shared/modules/header.module';
import { CustomMaterialModule } from '../shared/modules/material.module';
import { AliasesComponent } from './aliases.component';
import { AliasesRouting } from './aliases.routing';

@NgModule({
  imports: [CommonModule, HeaderModule, AliasesRouting, CustomMaterialModule, RefreshAlertModule, FlexLayoutModule],
  declarations: [AliasesComponent],
  exports: [AliasesComponent]
})
export class AliasesModule {}
