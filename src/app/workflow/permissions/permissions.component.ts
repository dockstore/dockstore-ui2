import { Component, Input, OnInit } from '@angular/core';
import { UserPermission, Workflow, WorkflowsService } from '../../shared/swagger';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

import PermissionEnum = UserPermission.PermissionEnum;

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
    this.add(event, PermissionEnum.OWNER);
  }

  addWriter(event: MatChipInputEvent): void {
    this.add(event, PermissionEnum.WRITE);
  }

  addReader(event: MatChipInputEvent): void {
    this.add(event, PermissionEnum.READ);
  }


  remove(entity: string) {
    this.workflowsService.removeWorkflowPermission(this.workflow.full_workflow_path, entity).subscribe(
      (userPermissions: UserPermission[]) => this.processResponse(userPermissions)
    );
  }

  private add(event: MatChipInputEvent, permission: UserPermission.PermissionEnum): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.workflowsService.addWorkflowPermission(this.workflow.full_workflow_path, {email: value, permission: permission}).subscribe(
        (userPermissions: UserPermission[]) => {
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
      (userPermissions: UserPermission[]) => {
        this.canViewPermissions = true;
        this.processResponse(userPermissions);
      },
      () => {
      }
    );
  }

  private specificPermissionEmails(userPermissions: UserPermission[], permission: PermissionEnum): string[] {
    return userPermissions
      .filter(u => u.permission === permission)
      .map(c => c.email);
  }

  private processResponse(userPermissions: UserPermission[]): void {
    this.owners = this.specificPermissionEmails(userPermissions, PermissionEnum.OWNER);
    this.writers = this.specificPermissionEmails(userPermissions, PermissionEnum.WRITE);
    this.readers = this.specificPermissionEmails(userPermissions, PermissionEnum.READ);
  }

}
