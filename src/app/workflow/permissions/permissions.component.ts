import { Component, Input, OnInit } from '@angular/core';
import { Permission, Workflow, WorkflowsService } from '../../shared/swagger';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import RoleEnum = Permission.RoleEnum;
import { TokenService } from '../../loginComponents/token.service';
import { TokenSource } from '../../shared/enum/token-source.enum';
import { Dockstore } from '../../shared/dockstore.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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

  constructor(private workflowsService: WorkflowsService, private snackBar: MatSnackBar, private tokenService: TokenService) {
  }

  ngOnInit() {
    this.tokenService.tokens$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(tokens => {
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
      () => this.updating--
    );
  }

  private add(event: MatChipInputEvent, permission: RoleEnum): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.updating++;
      this.workflowsService.addWorkflowPermission(this.workflow.full_workflow_path, {email: value, role: permission}).subscribe(
        (userPermissions: Permission[]) => {
          this.updating--;
          this.processResponse(userPermissions);
        },
        (e) => {
          this.updating--;
          this.snackBar.open(`Error adding user ${value}. Please make sure ${value} is registered with FireCloud`,
            'Dismiss', {duration: 5000});
        }
      );
    }

    // Reset the input value
    if (input) {
      input.value = '';
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
