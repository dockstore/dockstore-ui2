import { DocsService } from './docs.service';
import { Configuration } from './../shared/swagger/configuration';
import { UsersStubService, ConfigurationStub } from './../test/service-stubs';
import { UsersService } from '../shared/swagger';
import { AuthStubService } from '../test/service-stubs';
import { AuthService } from 'ng2-ui-auth/commonjs/auth.service';
import { TestBed, inject } from '@angular/core/testing';

describe('DocsService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DocsService ],
        });
    });

    it('should be created', inject([DocsService], (service: DocsService) => {
        expect(service).toBeTruthy();
    }));
    it('should have multiple docs', inject([DocsService], (service: DocsService) => {
        expect(service.getDocs().length).toBeGreaterThanOrEqual(12);
    }));
    it('should have doc', inject([DocsService], (service: DocsService) => {
        expect(service.getDoc('about')).toBeTruthy();
    }));
    it('should not have doc', inject([DocsService], (service: DocsService) => {
        expect(service.getDoc('mmmrrrggglll')).toBeFalsy();
    }));
});
