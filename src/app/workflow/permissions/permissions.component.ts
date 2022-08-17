import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { EntryType } from 'app/shared/enum/entry-type';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from '../../shared/alert/state/alert.service';
import { Dockstore } from '../../shared/dockstore.model';
import { TokenSource } from '../../shared/enum/token-source.enum';
import { TokenQuery } from '../../shared/state/token.query';
import { Permission, Workflow, WorkflowsService } from '../../shared/swagger';
import RoleEnum = Permission.RoleEnum;

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
})
export class PermissionsComponent implements OnInit {
  public Role = RoleEnum;
  public canViewPermissions = false;
  public owners: string[] = [];
  public writers: string[] = [];
  public readers: string[] = [];
  public hosted = false;
  public updating = 0;
  public hasGoogleAccount = false;
  public terraUrl = Dockstore.TERRA_IMPORT_URL.substr(0, Dockstore.TERRA_IMPORT_URL.indexOf('/#'));
  private _workflow: Workflow;
  protected ngUnsubscribe: Subject<{}> = new Subject();
  public entryType: EntryType;
  separatorKeysCodes = [ENTER, COMMA];
  addOnBlur = true;

  @Input() set workflow(workflow: Workflow) {
    this._workflow = workflow;
    this.onChange();
  }

  get workflow(): Workflow {
    return this._workflow;
  }

  constructor(private workflowsService: WorkflowsService, private alertService: AlertService, private tokenQuery: TokenQuery) {}

  ngOnInit() {
    this.tokenQuery.tokens$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((tokens) => {
      this.hasGoogleAccount = !!tokens.find((token) => token.tokenSource === TokenSource.GOOGLE);
    });
  }

  remove(entity: string, permission: RoleEnum) {
    this.updating++;
    this.alertService.start('Removing permissions');
    this.workflowsService
      .removeWorkflowRole(this.workflow.full_workflow_path, entity, permission, this.entryType === EntryType.Service)
      .subscribe(
        (userPermissions: Permission[]) => {
          this.alertService.detailedSuccess('Removed permissions');
          this.updating--;
          this.processResponse(userPermissions);
        },
        (e: HttpErrorResponse) => {
          this.handleError(e);
        }
      );
  }

  add(event: MatChipInputEvent, permission: RoleEnum): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.updating++;
      this.alertService.start('Updating permissions');
      this.workflowsService
        .addWorkflowPermission(this.workflow.full_workflow_path, { email: value, role: permission }, this.entryType === EntryType.Service)
        .subscribe(
          (userPermissions: Permission[]) => {
            this.alertService.detailedSuccess('Permissions updated');
            this.updating--;
            this.processResponse(userPermissions);
          },
          (e: HttpErrorResponse) => {
            this.handleError(e);
          }
        );
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  private handleError(e: HttpErrorResponse) {
    this.updating--;
    if (e.status === 409) {
      // A more severe error that deserves more attention than a disappearing snackbar
      this.alertService.detailedError(e);
    } else {
      this.alertService.simpleError();
    }
  }

  private onChange() {
    this.canViewPermissions = false;
    this.owners = [];
    if (this._workflow) {
      this.hosted = this.workflow.mode === 'HOSTED';
      this.workflowsService.getWorkflowPermissions(this._workflow.full_workflow_path, this.entryType === EntryType.Service).subscribe(
        (userPermissions: Permission[]) => {
          this.canViewPermissions = true;
          this.processResponse(userPermissions);
        },
        () => {}
      );
    }
  }

  private specificPermissionEmails(permissions: Permission[], role: RoleEnum): string[] {
    return permissions.filter((u) => u.role === role).map((c) => c.email);
  }

  private processResponse(userPermissions: Permission[]): void {
    this.owners = this.specificPermissionEmails(userPermissions, RoleEnum.OWNER);
    this.writers = this.specificPermissionEmails(userPermissions, RoleEnum.WRITER);
    this.readers = this.specificPermissionEmails(userPermissions, RoleEnum.READER);
  }
}
