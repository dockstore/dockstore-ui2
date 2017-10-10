/*
 *    Copyright 2017 OICR
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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StargazersComponent } from './stargazers.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StarentryService } from '../shared/starentry.service';
import { StarringService } from '../starring/starring.service';
import { UserService } from '../loginComponents/user.service';
@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule
  ],
  declarations: [
    StargazersComponent
  ],
  exports: [
    StargazersComponent
  ],
  providers: [
    StarringService,
    UserService,
    StarentryService
  ]
})
export class StargazersModule { }
