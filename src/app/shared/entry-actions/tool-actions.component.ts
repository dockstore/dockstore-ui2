import { Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AlertQuery } from '../alert/state/alert.query';
import { RefreshService } from '../refresh.service';
import { DockstoreTool, Tag } from '../openapi';
import { EntryActionsComponent } from './entry-actions.component';
import { EntryActionsService } from './entry-actions.service';
import { ModalComponent } from '../../container/deregister-modal/deregister-modal.component';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { RouterLink } from '@angular/router';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-tool-actions',
  templateUrl: './tool-actions.component.html',
  styleUrls: ['./entry-actions.component.scss'],
  standalone: true,
  imports: [NgIf, FlexModule, MatLegacyButtonModule, RouterLink, MatLegacyTooltipModule, ModalComponent, AsyncPipe],
})
export class ToolActionsComponent extends EntryActionsComponent implements OnInit, OnChanges {
  @Input() tool: DockstoreTool;
  // This is unused unlike workflow because there's no DOI and refresh doesn't need it (for some reason)
  // Keeping it here anyways to be symmetrical and maybe for future use (although these shouldn't be version specific actions)
  @Input() selectedVersion: Tag;
  @Output() showVersions = new EventEmitter<void>();
  constructor(
    protected entryActionsService: EntryActionsService,
    protected alertQuery: AlertQuery,
    private refreshService: RefreshService
  ) {
    super(alertQuery, entryActionsService);
  }

  ngOnInit() {
    this.commonNgOnInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.publishDisabled = this.entryActionsService.publishToolDisabled(this.tool);
    this.commonNgOnChanges(this.tool);
  }

  /**
   * Handles the publish/unpublish button being clicked
   *
   * @memberof ToolActionsComponent
   */
  publishToggle() {
    this.entryActionsService.publishToolToggle(this.tool, this.showVersions);
  }

  /**
   * How strange, the tool refresh doesn't refresh the GA4GH files of the currently selected version
   * @memberof ToolActionsComponent
   */
  refresh() {
    this.refreshService.refreshTool();
  }

  archive() {
    this.entryActionsService.archiveEntry(this.tool);
  }

  unarchive() {
    this.entryActionsService.unarchiveEntry(this.tool);
  }
}
