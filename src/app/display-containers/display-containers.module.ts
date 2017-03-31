import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'angular2-markdown';
import { HeaderModule } from '../shared/header.module';
import { ContainersModule } from '../shared/containers.module';
import { TabsModule } from '../shared/tabs.module';

import { ContainerService } from './container/container.service';

import { containersRouting } from './display-containers.routing';

import { DisplayContainersComponent } from './display-containers.component';
import { SearchContainersComponent } from './search-containers/search-containers.component';
import { ContainerComponent } from './container/container.component';

@NgModule({
  declarations: [
    DisplayContainersComponent,
    SearchContainersComponent,
    ContainerComponent
  ],
  imports: [
  CommonModule,
    MarkdownModule.forRoot(),
    HeaderModule,
    ContainersModule,
    TabsModule,
    containersRouting
  ],
  providers: [
    ContainerService
  ]
})
export class DisplayContainersModule { }
