/*
 *    Copyright 2024 OICR and UCSC
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

import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef, MatLegacyDialogModule, MAT_LEGACY_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { NgFor, NgIf } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { AlertComponent } from 'app/shared/alert/alert.component';
import { DockstoreTool, Entry, EntryType, EntryTypeMetadata, Workflow } from 'app/shared/openapi';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { AiBubbleComponent } from 'app/shared/ai-bubble/ai-bubble.component';
import { FormsModule } from '@angular/forms';
import { MatLegacyRadioModule } from '@angular/material/legacy-radio';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { EditTopicDialogService } from './edit-topic-dialog.service';
import { EntryActionsService } from 'app/shared/entry-actions/entry-actions.service';
import { MatRadioChange } from '@angular/material/radio';
import { Dockstore } from 'app/shared/dockstore.model';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { SnackbarDirective } from 'app/shared/snackbar.directive';

export interface EditTopicDialogData {
  entry: DockstoreTool | Workflow;
}

export interface TopicOption {
  type: Entry.TopicSelectionEnum;
  label: string;
  description: string;
  value: string | null;
}

@Component({
  selector: 'app-edit-topic-dialog',
  templateUrl: './edit-topic-dialog.component.html',
  styleUrls: ['./edit-topic-dialog.component.scss'],
  standalone: true,
  imports: [
    MatLegacyDialogModule,
    AlertComponent,
    MatDividerModule,
    NgIf,
    MatLegacyFormFieldModule,
    MatLegacyInputModule,
    FlexModule,
    MatLegacyButtonModule,
    MatLegacyTooltipModule,
    AiBubbleComponent,
    FormsModule,
    MatLegacyRadioModule,
    MatIconModule,
    MatLegacyCardModule,
    NgFor,
    ClipboardModule,
    SnackbarDirective,
  ],
})
export class EditTopicDialogComponent {
  Dockstore = Dockstore;
  TopicSelectionEnum = Entry.TopicSelectionEnum;
  entry: Workflow | DockstoreTool;
  entryType: EntryType;
  entryTypeMetadata: EntryTypeMetadata;
  isGitHubAppEntry: boolean;
  isHostedEntry: boolean;
  topicEditing: boolean;
  selectedOption: Entry.TopicSelectionEnum;
  editedTopicManual: string;
  promptToConfirmAISelection: boolean = false;
  topicOptions: TopicOption[];

  constructor(
    public dialogRef: MatLegacyDialogRef<EditTopicDialogComponent>,
    public editTopicDialogService: EditTopicDialogService,
    public entryActionsService: EntryActionsService,
    @Inject(MAT_LEGACY_DIALOG_DATA) public data: EditTopicDialogData
  ) {
    this.entry = data.entry;
    this.entryType = data.entry.entryType;
    this.entryTypeMetadata = data.entry.entryTypeMetadata;
    this.isGitHubAppEntry = (data.entry as Workflow).mode === Workflow.ModeEnum.DOCKSTOREYML; // Only Workflow has DOCKSTOREYML ModeEnum
    this.isHostedEntry = this.entryActionsService.isEntryHosted(data.entry);
    this.selectedOption = data.entry.topicSelection;
    this.editedTopicManual = data.entry.topicManual;
    const manualTopicOption: TopicOption = {
      type: this.TopicSelectionEnum.MANUAL,
      label: 'Manual',
      description: `Entered manually by the user.${
        this.isGitHubAppEntry ? ` Edit the topic field in the .dockstore.yml file on GitHub.` : ''
      }`,
      value: this.entry.topicManual,
    };
    const automaticTopicOption: TopicOption = {
      type: this.TopicSelectionEnum.AUTOMATIC,
      label: 'GitHub',
      description: 'Retrieved automatically from the GitHub repository description.',
      value: this.entry.topicAutomatic,
    };
    const aiTopicOption: TopicOption = {
      type: this.TopicSelectionEnum.AI,
      label: 'AI',
      description: `Generated by AI using the content of your ${this.entryTypeMetadata.term}.`,
      value: this.entry.topicAI,
    };
    this.topicOptions = [manualTopicOption];
    if (!this.isHostedEntry) {
      this.topicOptions = [...this.topicOptions, automaticTopicOption];
    }
    if (this.entry.topicAI) {
      this.topicOptions = [...this.topicOptions, aiTopicOption];
    }
  }

  /**
   * This is triggered when a Topic Selection radio button is changed
   *
   * @param {MatRadioChange} event
   * @memberof RegisterWorkflowModalComponent
   */
  radioButtonChange(event: MatRadioChange): void {
    if (event.value !== this.TopicSelectionEnum.AI) {
      this.promptToConfirmAISelection = false;
    }
  }

  saveTopic() {
    if (this.selectedOption === this.TopicSelectionEnum.AI && !this.entry.approvedAITopic && !this.promptToConfirmAISelection) {
      this.promptToConfirmAISelection = true;
    } else {
      this.editTopicDialogService.saveTopicChanges(this.entry, this.editedTopicManual, this.selectedOption);
      this.dialogRef.close();
    }
  }
}
