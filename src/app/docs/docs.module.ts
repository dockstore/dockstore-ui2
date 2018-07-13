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
import { NgxMdModule } from 'ngx-md';
import { HeaderModule } from '../shared/modules/header.module';
import { docsRouting } from './docs.routing';

import { DocsComponent } from './docs.component';

@NgModule({
  declarations: [
    DocsComponent
  ],
  imports: [
    CommonModule,
    NgxMdModule.forRoot(),
    docsRouting,
    HeaderModule
  ],
  providers: []
})
export class DocsModule { }
