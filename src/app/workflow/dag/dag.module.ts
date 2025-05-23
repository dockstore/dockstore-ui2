/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the 'License');
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an 'AS IS' BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { FullscreenOverlayContainer, OverlayContainer } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { CwlViewerComponent } from './cwl-viewer/cwl-viewer.component';
import { DagComponent } from './dag.component';

@NgModule({
  providers: [{ provide: OverlayContainer, useClass: FullscreenOverlayContainer }],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
    DagComponent,
    CwlViewerComponent,
  ],
  exports: [DagComponent],
})
export class DagModule {}
