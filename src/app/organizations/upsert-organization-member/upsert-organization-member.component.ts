import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgFormsManager } from '@ngneat/forms-manager';
import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';
import { OrganizationUser } from '../../shared/swagger';
import { FormsState, UpsertOrganizationMemberService } from '../state/upsert-organization-member.service';

@Component({
  selector: 'app-upsert-organization-member',
  templateUrl: './upsert-organization-member.component.html',
})
export class UpsertOrganizationMemberComponent implements OnInit, OnDestroy {
  roleKeys: any;

  constructor(
    private upsertOrganizationMemberService: UpsertOrganizationMemberService,
    private formsManager: NgFormsManager<FormsState>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.roleKeys = Object.keys(this.RoleEnum);
  }
  RoleEnum = OrganizationUser.RoleEnum;
  form: UntypedFormGroup;
  public title: string;
  public TagEditorMode = TagEditorMode;

  ngOnInit() {
    this.form = this.upsertOrganizationMemberService.createForm(this.formsManager, this.data);
    this.title = this.upsertOrganizationMemberService.getTitle(this.data);
  }

  upsertUser(): void {
    this.upsertOrganizationMemberService.upsertUser(this.form.value, this.data);
  }

  get name(): AbstractControl {
    return this.form.get('username');
  }

  ngOnDestroy(): void {
    this.formsManager.unsubscribe();
  }
}
