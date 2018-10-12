import { inject, TestBed } from '@angular/core/testing';

import { LoginService } from '../../../login/login.service';
import { UserService } from '../../../shared/user/user.service';
import { LoginStubService, TokenStubService, UserStubService } from '../../../test/service-stubs';
import { TokenService } from '../../token.service';
import { AccountsService } from './accounts.service';

describe('Service: Accounts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountsService,
        { provide: UserService, useClass: UserStubService },
        { provide: LoginService, useClass: LoginStubService },
        { provide: TokenService, useClass: TokenStubService }
      ]
    });
  });

  it('should ...', inject([AccountsService], (service: AccountsService) => {
    expect(service).toBeTruthy();
  }));
});
