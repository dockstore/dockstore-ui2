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

import { QueryBuilderService } from './query-builder.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { SearchService } from './search.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { HeaderModule } from './../shared/modules/header.module';
import { TagCloudModule } from 'angular-tag-cloud-module';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SearchComponent } from './search.component';
import { AdvancedSearchComponent } from './advancedsearch/advancedsearch.component';
import { AdvancedSearchService } from './advancedsearch/advanced-search.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ListentryModule } from '../listentry/listentry.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ClipboardModule } from 'ngx-clipboard';
import { searchRouting } from './search.routing';
import { SearchResultsComponent } from './search-results/search-results.component';
@NgModule({
  declarations: [
    AdvancedSearchComponent,
    SearchComponent,
    SearchResultsComponent
],
  imports: [
    CommonModule,
    ListentryModule,
    AccordionModule.forRoot(),
    ModalModule.forRoot(),
    FormsModule,
    HeaderModule,
    TagCloudModule,
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    PopoverModule.forRoot(),
    ClipboardModule,
    searchRouting
  ],
  providers: [AdvancedSearchService, SearchService, QueryBuilderService],
  exports: [SearchComponent]

})
export class SearchModule { }
