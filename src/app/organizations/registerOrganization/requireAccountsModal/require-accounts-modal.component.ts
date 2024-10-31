import { Component, OnInit } from '@angular/core';
import { TokenQuery } from '../../../shared/state/token.query';
import { MatLegacyDialog as MatDialog, MatLegacyDialogModule } from '@angular/material/legacy-dialog';
import { RegisterOrganizationComponent } from '../register-organization.component';
import { TagEditorMode } from '../../../shared/enum/tagEditorMode.enum';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AsyncPipe, I18nPluralPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { FlexModule } from '@ngbracket/ngx-layout/flex';

@Component({
  selector: 'app-require-accounts-modal',
  templateUrl: './require-accounts-modal.component.html',
  standalone: true,
  imports: [MatLegacyDialogModule, FlexModule, MatLegacyButtonModule, RouterLink, AsyncPipe, I18nPluralPipe],
})
export class RequireAccountsModalComponent implements OnInit {
  public numLinkedAccounts$: Observable<number>;
  messageMapping: any = {
    '=1': '1 account',
    other: '# accounts',
  };
  constructor(private tokenQuery: TokenQuery, private matDialog: MatDialog) {}

  ngOnInit(): void {
    this.numLinkedAccounts$ = this.tokenQuery.tokens$.pipe(map((tokens) => tokens.length - 1));
  }

  createOrganization(): void {
    this.matDialog.open(RegisterOrganizationComponent, { data: { organization: null, mode: TagEditorMode.Add }, width: '600px' });
  }
}
