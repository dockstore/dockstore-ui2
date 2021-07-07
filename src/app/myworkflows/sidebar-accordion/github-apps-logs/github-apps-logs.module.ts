/*
 *    Copyright 2020 OICR
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
import { RefreshAlertModule } from 'app/shared/alert/alert.module';
import { CustomMaterialModule } from 'app/shared/modules/material.module';
import { PipeModule } from '../../../shared/pipe/pipe.module';
import { GithubAppsLogsComponent } from './github-apps-logs.component';

@NgModule({
  imports: [CustomMaterialModule, CommonModule, RefreshAlertModule, FlexLayoutModule, PipeModule],
  declarations: [GithubAppsLogsComponent],
})
export class GitHubAppsLogsModule {}
