import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../container/deregister-modal/deregister-modal.component';
import { AlertQuery } from '../alert/state/alert.query';
import { RefreshService } from '../refresh.service';
import { DockstoreTool, Tag } from '../swagger';
import { EntryActionsComponent } from './entry-actions.component';
import { EntryActionsService } from './entry-actions.service';

@Component({
  selector: 'app-tool-actions',
  templateUrl: './tool-actions.component.html',
  styleUrls: ['./entry-actions.component.scss']
})
export class ToolActionsComponent extends EntryActionsComponent implements OnInit, OnChanges {
  @Input() tool: DockstoreTool;
  // This is unused unlike workflow because there's no DOI and refresh doesn't need it (for some reason)
  // Keeping it here anyways to be symmetrical and maybe for future use (although these shouldn't be version specific actions)
  @Input() selectedVersion: Tag;
  constructor(
    protected entryActionsService: EntryActionsService,
    protected alertQuery: AlertQuery,
    private refreshService: RefreshService,
    private dialog: MatDialog
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
    this.entryActionsService.publishToolToggle(this.tool);
  }

  /**
   * How strange, the tool refresh doesn't refresh the GA4GH files of the currently selected version
   * @memberof ToolActionsComponent
   */
  refresh() {
    this.refreshService.refreshTool();
  }

  openDeleteDialog() {
    const dialogRef = this.dialog.open(ModalComponent, { width: '600px' });
  }
}
