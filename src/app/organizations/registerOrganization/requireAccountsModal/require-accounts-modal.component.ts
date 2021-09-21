import { Component, OnInit } from '@angular/core';
import { TokenQuery } from '../../../shared/state/token.query';
import { MatDialog } from '@angular/material/dialog';
import { TokenUser } from '../../../shared/swagger';
import { RegisterOrganizationComponent } from '../register-organization.component';
import { TagEditorMode } from '../../../shared/enum/tagEditorMode.enum';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-require-accounts-modal',
  templateUrl: './require-accounts-modal.component.html',
})
export class RequireAccountsModalComponent implements OnInit {
  public numLinkedAccounts: number = 0;
  private ngUnsubscribe: Subject<{}> = new Subject();
  messageMapping: any = {
    '=1': '1 account',
    other: '# accounts',
  };
  constructor(private tokenQuery: TokenQuery, private matDialog: MatDialog) {}

  ngOnInit(): void {
    this.tokenQuery.tokens$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((tokens: TokenUser[]) => {
      this.numLinkedAccounts = tokens.length - 1;
    });
  }

  createOrganization(): void {
    this.matDialog.open(RegisterOrganizationComponent, { data: { organization: null, mode: TagEditorMode.Add }, width: '600px' });
  }
}
