import { Configuration } from './../shared/swagger/configuration';
import { UsersStubService, ConfigurationStub } from './../test/service-stubs';
import { UsersService } from '../shared/swagger';
import { AuthStubService } from '../test/service-stubs';
import { AuthService } from 'ng2-ui-auth/commonjs/auth.service';
import { UserService } from './user.service';
import { TestBed, inject } from '@angular/core/testing';

describe('UserService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [UserService,
                { provide: AuthService, useClass: AuthStubService },
                { provide: UsersService, useClass: UsersStubService },
                { provide: Configuration, useClass: ConfigurationStub }
            ],
        });
    });

    it('should be created', inject([UserService], (service: UserService) => {
        expect(service).toBeTruthy();
    }));

    it('should get gravatarUrl', inject([UserService], (service: UserService) => {
        expect(service.gravatarUrl('testEmail@gmail.com', 'defaultImage.com')).toEqual(
            'https://www.gravatar.com/avatar/5916c97a3b45ca7917256e566f49aa12?d=defaultImage.com&s=500');
        expect(service.gravatarUrl('', 'defaultImage.com')).toEqual('defaultImage.com');
        expect(service.gravatarUrl('', '')).toEqual('http://www.gravatar.com/avatar/?d=mm&s=500');
    }));
});
