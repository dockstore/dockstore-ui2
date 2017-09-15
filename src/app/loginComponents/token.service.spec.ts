import { inject, TestBed } from '@angular/core/testing';
import { AuthService } from 'ng2-ui-auth';

import { Configuration, TokensService, UsersService } from '../shared/swagger';
import { Token } from './../shared/swagger/model/token';
import { bitbucketToken, gitHubToken, gitLabToken, quayToken } from './../test/mocked-objects';
import {
    AuthStubService,
    ConfigurationStub,
    TokensStubService,
    UsersStubService,
    UserStubService,
} from './../test/service-stubs';
import { TokenService } from './token.service';
import { UserService } from './user.service';

describe('TokenService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TokenService,
                { provide: AuthService, useClass: AuthStubService },
                { provide: UsersService, useClass: UsersStubService },
                { provide: UserService, useClass: UserStubService },
                { provide: TokensService, useClass: TokensStubService },
                { provide: Configuration, useClass: ConfigurationStub }
            ],
        });
    });

    it('should be created', inject([TokenService], (service: TokenService) => {
        expect(service).toBeTruthy();
    }));

    it('should register token', inject([TokenService], (service: TokenService) => {
        service.registerToken('asdf', 'quay.io').subscribe(token => expect(token).toEqual(quayToken));
        service.registerToken('asdf', 'bitbucket.org').subscribe(token => expect(token).toEqual(bitbucketToken));
        service.registerToken('asdf', 'gitlab.com').subscribe(token => expect(token).toEqual(gitLabToken));
        service.registerToken('asdf', 'github.com').subscribe(token => expect(token).toEqual(gitHubToken));
        service.registerToken('asdf', 'mmmrrrggglll').subscribe(() => fail('expected error'),
            error => expect(error).toEqual('Unknown provider.'));
    }));
    it('should get token status set', inject([TokenService], (service: TokenService) => {
        const expectedStatusSet = {
            dockstore: true,
            github: true,
            bitbucket: true,
            quayio: true,
            gitlab: true
        };
        const dockstoreToken: Token = {
            tokenSource: 'dockstore'
        };
        expect(service.getUserTokenStatusSet([dockstoreToken, quayToken, bitbucketToken, gitLabToken, gitHubToken]))
            .toEqual(expectedStatusSet);
    }));

    it('should delete token', inject([TokenService], (service: TokenService) => {
        service.deleteToken(1).subscribe(result => expect(result).toEqual({}));
    }));
});
