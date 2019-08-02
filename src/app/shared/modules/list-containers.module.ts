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
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { ListContainersComponent } from '../../containers/list/list.component';
import { ListContainersService } from '../../containers/list/list.service';
import { PublishedToolsDataSource } from '../../containers/list/published-tools.datasource';
import { PrivateIconModule } from '../private-icon/private-icon.module';
import { HeaderModule } from './header.module';
import { CustomMaterialModule } from './material.module';

@NgModule({
  declarations: [ListContainersComponent],
  imports: [CommonModule, RouterModule, ClipboardModule, CustomMaterialModule, HeaderModule, PrivateIconModule, TabsModule],
  providers: [PublishedToolsDataSource, ListContainersService],
  exports: [ListContainersComponent]
})
export class ListContainersModule {}
