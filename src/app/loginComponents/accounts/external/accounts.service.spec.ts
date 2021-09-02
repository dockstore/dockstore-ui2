import { inject, TestBed } from '@angular/core/testing';

import { LoginService } from '../../../login/login.service';
import { TokenService } from '../../../shared/state/token.service';
import { UserService } from '../../../shared/user/user.service';
import { LoginStubService, TokenStubService, UserStubService } from '../../../test/service-stubs';
import { AccountsService } from './accounts.service';

describe('Service: Accounts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AccountsService,
        { provide: UserService, useClass: UserStubService },
        { provide: LoginService, useClass: LoginStubService },
        { provide: TokenService, useClass: TokenStubService },
      ],
    });
  });

  it('should ...', inject([AccountsService], (service: AccountsService) => {
    expect(service).toBeTruthy();
  }));

  it('should compute correct root urls', inject([AccountsService], (service: AccountsService) => {
    expect(service.getRoot('https://sandbox.orcid.org/oauth/authorize')).toBe('https://sandbox.orcid.org');
    expect(service.getRoot('https://orcid.org/oauth/authorize')).toBe('https://orcid.org');
  }));
});
