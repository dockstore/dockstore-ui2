import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialog } from '@angular/material/legacy-dialog';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { Base } from 'app/shared/base';
import { DockstoreTool, Entry, EntryTypeMetadata, Workflow } from 'app/shared/openapi';
import { SessionQuery } from 'app/shared/session/session.query';
import { Observable } from 'rxjs';
import { EditTopicDialogComponent } from '../edit-topic/edit-topic-dialog.component';
import { bootstrap4largeModalSize } from 'app/shared/constants';
import { AiBubbleComponent } from 'app/shared/ai-bubble/ai-bubble.component';
import { FlexModule } from '@ngbracket/ngx-layout';

@Component({
  selector: 'app-display-topic',
  templateUrl: './display-topic.component.html',
  styleUrls: ['../../../styles/info-tab.component.scss'],
  standalone: true,
  imports: [NgIf, MatLegacyTooltipModule, MatLegacyButtonModule, MatIconModule, AsyncPipe, AiBubbleComponent, FlexModule],
})
export class DisplayTopicComponent extends Base implements OnInit, OnDestroy {
  TopicSelectionEnum = Entry.TopicSelectionEnum;
  isPublic$: Observable<boolean>;
  isGitHubAppEntry: boolean;
  entryTypeMetadata: EntryTypeMetadata;
  @Input() entry: DockstoreTool | Workflow;
  @Input() disableEditing: boolean;
  constructor(private sessionQuery: SessionQuery, private dialog: MatLegacyDialog) {
    super();
  }

  ngOnInit(): void {
    this.isPublic$ = this.sessionQuery.isPublic$;
    this.entryTypeMetadata = this.entry.entryTypeMetadata;
    this.isGitHubAppEntry = (this.entry as Workflow | DockstoreTool).mode === Workflow.ModeEnum.DOCKSTOREYML; // The workflow and tool enums are confirmed to be equal in a test.
  }

  editTopic() {
    this.dialog.open(EditTopicDialogComponent, { width: bootstrap4largeModalSize, data: { entry: this.entry } });
  }
}
