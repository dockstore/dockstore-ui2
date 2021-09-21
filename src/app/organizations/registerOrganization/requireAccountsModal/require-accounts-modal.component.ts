import { Component, OnInit } from '@angular/core';
import { TokenQuery } from '../../../shared/state/token.query';
import { MatDialog } from '@angular/material/dialog';
import { TokenUser } from '../../../shared/swagger';
import { RegisterOrganizationComponent } from '../register-organization.component';
import { TagEditorMode } from '../../../shared/enum/tagEditorMode.enum';

@Component({
  selector: 'app-require-accounts-modal',
  templateUrl: './require-accounts-modal.component.html',
})
export class RequireAccountsModalComponent implements OnInit {
  public numLinkedAccounts: number = 0;
  constructor(private tokenQuery: TokenQuery, private matDialog: MatDialog) {}

  ngOnInit(): void {
    this.tokenQuery.tokens$.subscribe((tokens: TokenUser[]) => {
      tokens.forEach((token) => {
        this.numLinkedAccounts++;
      });
      // The Dockstore token is included in the list, so decrease count by 1
      this.numLinkedAccounts--;
    });
  }

  createOrganization(): void {
    this.matDialog.open(RegisterOrganizationComponent, { data: { organization: null, mode: TagEditorMode.Add }, width: '600px' });
  }
}
