import { inject, TestBed } from '@angular/core/testing';

import { LoginService } from '../../../login/login.service';
import { LoginStubService, TokenStubService, UserStubService } from '../../../test/service-stubs';
import { TokenService } from '../../token.service';
import { UserService } from '../../user.service';
import { AccountsService } from './accounts.service';

describe('Service: Accounts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountsService,
        { provide: LoginService, useClass: LoginStubService },
        { provide: TokenService, useClass: TokenStubService },
        { provide: UserService, useClass: UserStubService }
      ]
    });
  });

  it('should ...', inject([AccountsService], (service: AccountsService) => {
    expect(service).toBeTruthy();
  }));
});
