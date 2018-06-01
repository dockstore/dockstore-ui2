import { Component, Input, OnInit } from '@angular/core';
import { Permission, Workflow, WorkflowsService } from '../../shared/swagger';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import RoleEnum = Permission.RoleEnum;

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {

  public canViewPermissions = false;
  public owners: string[] = [];
  public writers: string[] = [];
  public readers: string[] = [];
  public hosted = false;
  private _workflow: Workflow;

  separatorKeysCodes = [ENTER, COMMA];
  addOnBlur = true;

  @Input() set workflow(workflow: Workflow) {
    this._workflow = workflow;
    this.onChange();
  }

  get workflow(): Workflow {
    return this._workflow;
  }

  constructor(private workflowsService: WorkflowsService) {
  }

  ngOnInit() {
  }

  addOwner(event: MatChipInputEvent): void {
    this.add(event, RoleEnum.OWNER);
  }

  addWriter(event: MatChipInputEvent): void {
    this.add(event, RoleEnum.WRITER);
  }

  addReader(event: MatChipInputEvent): void {
    this.add(event, RoleEnum.READER);
  }


  remove(entity: string, permission: RoleEnum) {
    this.workflowsService.removeWorkflowRole(this.workflow.full_workflow_path, entity, permission).subscribe(
      (userPermissions: Permission[]) => this.processResponse(userPermissions)
    );
  }

  private add(event: MatChipInputEvent, permission: RoleEnum): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.workflowsService.addWorkflowPermission(this.workflow.full_workflow_path, {email: value, role: permission}).subscribe(
        (userPermissions: Permission[]) => {
          this.processResponse(userPermissions);
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
