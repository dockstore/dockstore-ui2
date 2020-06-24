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
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxJsonLdModule } from '@ngx-lite/json-ld';
import { ClipboardModule } from 'ngx-clipboard';
import { ShareModule } from 'ngx-sharebuttons';
import { RefreshAlertModule } from '../alert/alert.module';
import { AvailableLogsModule } from '../available-logs.module';
import { BioschemaService } from '../bioschema.service';
import { CodeEditorListComponent } from '../code-editor-list/code-editor-list.component';
import { CodeEditorComponent } from '../code-editor/code-editor.component';
import { EntryActionsService } from '../entry-actions/entry-actions.service';
import { PublicFileDownloadPipe } from '../entry/public-file-download.pipe';
import { CustomMaterialModule } from '../modules/material.module';
import { CommitUrlPipe } from './commit-url.pipe';
import { InfoTabCheckerWorkflowPathComponent } from './info-tab-checker-workflow-path/info-tab-checker-workflow-path.component';
import { LaunchCheckerWorkflowComponent } from './launch-checker-workflow/launch-checker-workflow.component';
import { PrivateFileDownloadPipe } from './private-file-download.pipe';
import { PrivateFilePathPipe } from './private-file-path.pipe';
import { RegisterCheckerWorkflowComponent } from './register-checker-workflow/register-checker-workflow.component';
import { UrlDeconstructPipe } from './url-deconstruct.pipe';
import { VerifiedByComponent } from './verified-by/verified-by.component';
import { VerifiedDisplayComponent } from './verified-display/verified-display.component';
import { VerifiedPlatformsPipe } from './verified-platforms.pipe';
import { VersionProviderUrlPipe } from './versionProviderUrl.pipe';

@NgModule({
  imports: [
    AvailableLogsModule,
    CommonModule,
    FormsModule,
    CustomMaterialModule,
    FlexLayoutModule,
    NgxJsonLdModule,
    ClipboardModule,
    RouterModule,
    ReactiveFormsModule,
    RefreshAlertModule
  ],
  declarations: [
    InfoTabCheckerWorkflowPathComponent,
    RegisterCheckerWorkflowComponent,
    LaunchCheckerWorkflowComponent,
    CodeEditorComponent,
    CodeEditorListComponent,
    CommitUrlPipe,
    VerifiedByComponent,
    VerifiedPlatformsPipe,
    VersionProviderUrlPipe,
    PublicFileDownloadPipe,
    PrivateFileDownloadPipe,
    PrivateFilePathPipe,
    UrlDeconstructPipe
  ],
  exports: [
    InfoTabCheckerWorkflowPathComponent,
    LaunchCheckerWorkflowComponent,
    CodeEditorComponent,
    CodeEditorListComponent,
    CustomMaterialModule,
    CommitUrlPipe,
    FlexLayoutModule,
    VerifiedByComponent,
    VerifiedDisplayComponent,
    VerifiedPlatformsPipe,
    VersionProviderUrlPipe,
    PublicFileDownloadPipe,
    NgxJsonLdModule,
    RefreshAlertModule,
    ShareModule,
    UrlDeconstructPipe,
    RouterModule,
    ReactiveFormsModule
  ],
  entryComponents: [RegisterCheckerWorkflowComponent],
  providers: [BioschemaService, EntryActionsService]
})
export class EntryModule {}
