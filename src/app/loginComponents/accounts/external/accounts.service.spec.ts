/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AccountsService } from './accounts.service';
import { LoginService } from '../../../login/login.service';
import { LoginStubService, TokenStubService } from '../../../test/service-stubs';
import { TokenService } from '../../token.service';

describe('Service: Accounts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountsService,
        { provide: LoginService, useClass: LoginStubService},
        {provide: TokenService, useClass: TokenStubService}
      ]
    });
  });

  it('should ...', inject([AccountsService], (service: AccountsService) => {
    expect(service).toBeTruthy();
  }));
});
