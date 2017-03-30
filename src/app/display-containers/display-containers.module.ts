import { NgModule } from '@angular/core';
import { HeaderModule } from '../shared/header.module';
import { ContainersModule } from '../shared/containers.module';

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
    HeaderModule,
    ContainersModule,
    containersRouting
  ],
  providers: [ ]
})
export class DisplayContainersModule { }
