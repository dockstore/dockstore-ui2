import { LoginService } from './login.service';
import { Configuration } from './../shared/swagger/configuration';
import { UsersStubService, ConfigurationStub } from './../test/service-stubs';
import { UsersService } from '../shared/swagger';
import { AuthStubService } from '../test/service-stubs';
import { AuthService } from 'ng2-ui-auth/commonjs/auth.service';
import { TestBed, inject } from '@angular/core/testing';

describe('LoginService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LoginService,
                { provide: AuthService, useClass: AuthStubService}
            ],
        });
    });

    it('should be created', inject([LoginService], (service: LoginService) => {
        expect(service).toBeTruthy();
    }));
    it('should be able to authenticate', inject([LoginService], (service: LoginService) => {
        service.authenticate('github').subscribe(user => {
            expect(user).toEqual({});
        });
    }));
});
