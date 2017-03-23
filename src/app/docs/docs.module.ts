import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MarkdownModule } from 'angular2-markdown';

import { DocsComponent } from './docs.component';
import { MainComponent } from './main/main.component';
import { PageComponent } from './page/page.component';
import { HeaderComponent } from '../header/header.component';

import { docsRouting } from './docs.routing';

import { DocsService } from './docs.service';

@NgModule({
  declarations: [
    DocsComponent,
    MainComponent,
    PageComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    MarkdownModule.forRoot(),
    docsRouting
  ],
  providers: [DocsService]
})
export class DocsModule { }
