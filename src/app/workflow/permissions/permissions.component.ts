import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from '../../shared/alert/state/alert.service';
import { Dockstore } from '../../shared/dockstore.model';
import { TokenSource } from '../../shared/enum/token-source.enum';
import { TokenQuery } from '../../shared/state/token.query';
import { Permission, Workflow, WorkflowsService, WorkflowSubClass } from '../../shared/openapi';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf, NgFor } from '@angular/common';
import RoleEnum = Permission.RoleEnum;
import { FlexModule } from '@ngbracket/ngx-layout';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
  standalone: true,
  imports: [NgIf, MatProgressBarModule, MatFormFieldModule, MatChipsModule, NgFor, MatIconModule, FlexModule],
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

  remove(email: string, permission: RoleEnum) {
    this.updating++;
    this.alertService.start(`Removing ${email}`);
    this.workflowsService.removeWorkflowRole(this.workflow.full_workflow_path, WorkflowSubClass.BIOWORKFLOW, email, permission).subscribe(
      (userPermissions: Permission[]) => {
        this.alertService.detailedSuccess(`Removed ${email}`);
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
    const email = event.value;

    if ((email || '').trim()) {
      this.updating++;
      this.alertService.start(`Adding ${email}`);
      this.workflowsService
        .addWorkflowPermission(this.workflow.full_workflow_path, WorkflowSubClass.BIOWORKFLOW, {
          email: email,
          role: permission,
        })
        .subscribe(
          (userPermissions: Permission[]) => {
            this.alertService.detailedSuccess(`Added ${email}`);
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
    if (this.workflow) {
      this.hosted = this.workflow.mode === 'HOSTED';
      this.workflowsService.getWorkflowPermissions(this.workflow.full_workflow_path, WorkflowSubClass.BIOWORKFLOW).subscribe(
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
