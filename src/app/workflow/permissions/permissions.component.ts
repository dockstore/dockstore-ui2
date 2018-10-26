import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Dockstore } from '../../shared/dockstore.model';
import { TokenSource } from '../../shared/enum/token-source.enum';
import { RefreshService } from '../../shared/refresh.service';
import { TokenQuery } from '../../shared/state/token.query';
import { Permission, Workflow, WorkflowsService } from '../../shared/swagger';

import RoleEnum = Permission.RoleEnum;
import { AlertService } from '../../shared/alert/state/alert.service';
@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
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
  public firecloudUrl = Dockstore.FIRECLOUD_IMPORT_URL.substr(0, Dockstore.FIRECLOUD_IMPORT_URL.indexOf('/#'));
  private _workflow: Workflow;
  protected ngUnsubscribe: Subject<{}> = new Subject();

  separatorKeysCodes = [ENTER, COMMA];
  addOnBlur = true;

  @Input() set workflow(workflow: Workflow) {
    this._workflow = workflow;
    this.onChange();
  }

  get workflow(): Workflow {
    return this._workflow;
  }

  constructor(private workflowsService: WorkflowsService, private snackBar: MatSnackBar, private alertService: AlertService,
    private tokenQuery: TokenQuery, private refreshService: RefreshService) {
  }

  ngOnInit() {
    this.tokenQuery.tokens$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(tokens => {
      this.hasGoogleAccount = !!tokens.find(token => token.tokenSource === TokenSource.GOOGLE);
    });
  }

  remove(entity: string, permission: RoleEnum) {
    this.updating++;
    this.workflowsService.removeWorkflowRole(this.workflow.full_workflow_path, entity, permission).subscribe(
      (userPermissions: Permission[]) => {
        this.updating--;
        this.processResponse(userPermissions);
      },
      (e: HttpErrorResponse) => {
        this.handleError(e, `Error removing user ${entity}.`);
      }
    );
  }

  private add(event: MatChipInputEvent, permission: RoleEnum): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.updating++;
      this.alertService.start('Updating permissions');
      this.workflowsService.addWorkflowPermission(this.workflow.full_workflow_path, { email: value, role: permission }).subscribe(
        (userPermissions: Permission[]) => {
          this.updating--;
          this.processResponse(userPermissions);
        },
        (e: HttpErrorResponse) => {
          this.handleError(e, `Error adding user ${value}. Please make sure ${value} is registered with FireCloud`);
        }
      );
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  private handleError(e: HttpErrorResponse, defaultMessage: string) {
    this.updating--;
    const message = e.error || defaultMessage;
    if (e.status === 409) { // A more severe error that deserves more attention than a disappearing snackbar
      this.alertService.detailedError(e);
    } else {
      this.alertService.simpleError();
    }
  }

  private onChange() {
    this.canViewPermissions = false;
    this.owners = [];
    this.hosted = this.workflow.mode === 'HOSTED';
    this.workflowsService.getWorkflowPermissions(this._workflow.full_workflow_path).subscribe(
      (userPermissions: Permission[]) => {
        this.canViewPermissions = true;
        this.processResponse(userPermissions);
      },
      () => {
      }
    );
  }

  private specificPermissionEmails(permissions: Permission[], role: RoleEnum): string[] {
    return permissions
      .filter(u => u.role === role)
      .map(c => c.email);
  }

  private processResponse(userPermissions: Permission[]): void {
    this.owners = this.specificPermissionEmails(userPermissions, RoleEnum.OWNER);
    this.writers = this.specificPermissionEmails(userPermissions, RoleEnum.WRITER);
    this.readers = this.specificPermissionEmails(userPermissions, RoleEnum.READER);
  }

}
