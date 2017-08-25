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
@NgModule({
  declarations: [
    AdvancedSearchComponent,
    SearchComponent
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
  providers: [AdvancedSearchService, SearchService],
  exports: [SearchComponent]

})
export class SearchModule { }
