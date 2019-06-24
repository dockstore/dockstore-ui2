/*
 *    Copyright 2019 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RefreshAlertModule } from './alert/alert.module';
import { AvailableLogsComponent } from './available-logs/available-logs.component';
import { RemoveExtensionPipe } from './available-logs/remove-extension.pipe';
import { ToolTesterLogPipe } from './available-logs/tool-tester-log.pipe';
import { VerifiedDisplayComponent } from './entry/verified-display/verified-display.component';
import { CustomMaterialModule } from './modules/material.module';

@NgModule({
  imports: [CommonModule, CustomMaterialModule, FlexLayoutModule, RefreshAlertModule],
  declarations: [AvailableLogsComponent, VerifiedDisplayComponent, ToolTesterLogPipe, RemoveExtensionPipe],
  exports: [VerifiedDisplayComponent],
  entryComponents: [AvailableLogsComponent]
})
export class AvailableLogsModule {}
