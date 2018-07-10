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
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TagCloudModule } from 'angular-tag-cloud-module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { ClipboardModule } from 'ngx-clipboard';

import { CustomMaterialModule } from '../shared/modules/material.module';
import { PrivateIconModule } from '../shared/private-icon/private-icon.module';
import { HeaderModule } from './../shared/modules/header.module';
import { getTooltipConfig } from './../shared/tooltip';
import { AdvancedSearchService } from './advancedsearch/advanced-search.service';
import { AdvancedSearchComponent } from './advancedsearch/advancedsearch.component';
import { ExpandService } from './expand.service';
import { MapFriendlyValuesPipe } from './map-friendly-values.pipe';
import { QueryBuilderService } from './query-builder.service';
import { SearchResultsComponent } from './search-results/search-results.component';
import { SearchToolTableComponent } from './search-tool-table/search-tool-table.component';
import { SearchWorkflowTableComponent } from './search-workflow-table/search-workflow-table.component';
import { SearchComponent } from './search.component';
import { searchRouting } from './search.routing';
import { SearchService } from './search.service';
import { ExpandCollapseComponent } from './sidebar/expand-collapse/expand-collapse.component';

@NgModule({
  declarations: [
    AdvancedSearchComponent,
    ExpandCollapseComponent,
    SearchComponent,
    SearchResultsComponent,
    SearchToolTableComponent,
    SearchWorkflowTableComponent,
    MapFriendlyValuesPipe
],
  imports: [
    CommonModule,
    CustomMaterialModule,
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
    searchRouting,
    HttpClientModule,
    PrivateIconModule
  ],
  providers: [AdvancedSearchService, ExpandService,
    SearchService, QueryBuilderService, {provide: TooltipConfig, useFactory: getTooltipConfig}],
  exports: [SearchComponent]

})
export class SearchModule { }
