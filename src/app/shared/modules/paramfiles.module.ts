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
import { HighlightJsModule, HighlightJsService } from '../../shared/angular2-highlight-js/lib/highlight-js.module';
import { SelectModule } from './select.module';

import { ParamfilesComponent } from '../../paramfiles/paramfiles.component';

@NgModule({
  declarations: [
    ParamfilesComponent
  ],
  imports: [
    CommonModule,
    HighlightJsModule,
    SelectModule
  ],
  providers: [
    HighlightJsService
  ],
  exports: [
    ParamfilesComponent
  ]
})
export class ParamfilesModule { }
