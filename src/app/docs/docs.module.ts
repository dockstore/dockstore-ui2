import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'angular2-markdown';
import { HeaderModule } from '../shared/modules/header.module';
import { docsRouting } from './docs.routing';
import { DocsService } from './docs.service';

import { DocsComponent } from './docs.component';
import { MainComponent } from './main/main.component';
import { PageComponent } from './page/page.component';

@NgModule({
  declarations: [
    DocsComponent,
    MainComponent,
    PageComponent
  ],
  imports: [
    CommonModule,
    MarkdownModule.forRoot(),
    docsRouting,
    HeaderModule
  ],
  providers: [DocsService]
})
export class DocsModule { }
