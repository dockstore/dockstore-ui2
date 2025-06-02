import { AsyncPipe, NgIf, TitleCasePipe } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Base } from 'app/shared/base';
import { DockstoreTool, Entry, EntryTypeMetadata, Workflow } from 'app/shared/openapi';
import { SessionQuery } from 'app/shared/session/session.query';
import { Observable } from 'rxjs';
import { EditTopicDialogComponent } from '../edit-topic/edit-topic-dialog.component';
import { bootstrap4largeModalSize } from 'app/shared/constants';
import { AiBubbleComponent } from 'app/shared/ai-bubble/ai-bubble.component';
import { FlexModule } from '@ngbracket/ngx-layout';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-display-topic',
  templateUrl: './display-topic.component.html',
  styleUrls: ['../../../styles/info-tab.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    AiBubbleComponent,
    FlexModule,
    TitleCasePipe,
    MatChipsModule,
  ],
})
export class DisplayTopicComponent extends Base implements OnInit, OnChanges, OnDestroy {
  TopicSelectionEnum = Entry.TopicSelectionEnum;
  isPublic$: Observable<boolean>;
  isGitHubAppEntry: boolean;
  entryTypeMetadata: EntryTypeMetadata;
  selectedTopic: string;
  @Input() entry: DockstoreTool | Workflow;
  @Input() disableEditing: boolean;
  constructor(private readonly sessionQuery: SessionQuery, private readonly dialog: MatDialog) {
    super();
  }

  ngOnInit(): void {
    this.isPublic$ = this.sessionQuery.isPublic$;
    this.entryTypeMetadata = this.entry.entryTypeMetadata;
    this.isGitHubAppEntry = (this.entry as Workflow).mode === Workflow.ModeEnum.DOCKSTOREYML; // Only Workflow has DOCKSTOREYML ModeEnum
  }

  ngOnChanges(): void {
    this.selectedTopic = this.getSelectedTopic();
  }

  editTopic() {
    this.dialog.open(EditTopicDialogComponent, { width: bootstrap4largeModalSize, data: { entry: this.entry } });
  }

  private getSelectedTopic(): string | null {
    switch (this.entry.topicSelection) {
      case this.TopicSelectionEnum.MANUAL:
        return this.entry.topicManual;
      case this.TopicSelectionEnum.AUTOMATIC:
        return this.entry.topicAutomatic;
      case this.TopicSelectionEnum.AI:
        return this.entry.topicAI;
      default:
        return null;
    }
  }
}
