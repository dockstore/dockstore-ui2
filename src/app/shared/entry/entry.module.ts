/*
 *    Copyright 2018 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License")
 *    you may not use this file except in compliance with the License
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxJsonLdModule } from '@ngx-lite/json-ld';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { CodeEditorListComponent } from '../code-editor-list/code-editor-list.component';
import { CodeEditorComponent } from '../code-editor/code-editor.component';
import { CustomMaterialModule } from '../modules/material.module';
import { CommitUrlPipe } from './commit-url.pipe';
import { GA4GHFilesStateService } from './GA4GHFiles.state.service';
import {
  InfoTabCheckerWorkflowPathComponent,
} from './info-tab-checker-workflow-path/info-tab-checker-workflow-path.component';
import { LaunchCheckerWorkflowComponent } from './launch-checker-workflow/launch-checker-workflow.component';
import { RegisterCheckerWorkflowComponent } from './register-checker-workflow/register-checker-workflow.component';
import { VerifiedByComponent } from './verified-by/verified-by.component';
import { VerifiedDisplayComponent } from './verified-display/verified-display.component';
import { VerifiedPlatformsPipe } from './verified-platforms.pipe';
import { VersionProviderUrlPipe } from './versionProviderUrl.pipe';
import { ClipboardModule } from 'ngx-clipboard';
import { PublicFileDownloadPipe } from '../entry/public-file-download.pipe';
import { PrivateFileDownloadPipe } from './private-file-download.pipe';
import { PrivateFilePathPipe } from './private-file-path.pipe';

@NgModule({
  imports: [
    CommonModule,
    TooltipModule.forRoot(),
    FormsModule,
    ModalModule,
    CustomMaterialModule,
    NgxJsonLdModule,
    ClipboardModule
  ],
  declarations: [
    InfoTabCheckerWorkflowPathComponent,
    RegisterCheckerWorkflowComponent,
    LaunchCheckerWorkflowComponent,
    CodeEditorComponent,
    CodeEditorListComponent,
    CommitUrlPipe,
    VerifiedByComponent,
    VerifiedDisplayComponent,
    VerifiedPlatformsPipe,
    VersionProviderUrlPipe,
    PublicFileDownloadPipe,
    PrivateFileDownloadPipe,
    PrivateFilePathPipe
  ],
  providers: [
    GA4GHFilesStateService
  ],
  exports: [
    InfoTabCheckerWorkflowPathComponent,
    LaunchCheckerWorkflowComponent,
    CodeEditorComponent,
    CodeEditorListComponent,
    CustomMaterialModule,
    CommitUrlPipe,
    VerifiedByComponent,
    VerifiedDisplayComponent,
    VerifiedPlatformsPipe,
    VersionProviderUrlPipe,
    PublicFileDownloadPipe,
    NgxJsonLdModule
  ]
})
export class EntryModule { }
