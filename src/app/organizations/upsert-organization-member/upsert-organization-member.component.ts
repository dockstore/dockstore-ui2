import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { AkitaNgFormsManager } from '@datorama/akita-ng-forms-manager';

import { TagEditorMode } from '../../shared/enum/tagEditorMode.enum';
import { OrganisationUser } from '../../shared/swagger';
import { UpsertOrganizationMemberQuery } from '../state/upsert-organization-member.query';
import { FormsState, UpsertOrganizationMemberService } from '../state/upsert-organization-member.service';

@Component({
  selector: 'upsert-organization-member',
  templateUrl: './upsert-organization-member.component.html',
  styleUrls: ['./upsert-organization-member.component.scss']
})
export class UpsertOrganizationMemberComponent implements OnInit, OnDestroy {

  keys: any;

  constructor(private upsertOrganizationMemberQuery: UpsertOrganizationMemberQuery,
              private upsertOrganizationMemberService: UpsertOrganizationMemberService,
              private formsManager: AkitaNgFormsManager<FormsState>, @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.keys = Object.keys(this.RoleEnum);
  }
  RoleEnum = OrganisationUser.RoleEnum;
  form: FormGroup;
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
