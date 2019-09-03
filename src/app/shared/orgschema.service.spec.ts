import { inject, TestBed } from '@angular/core/testing';
import { BioschemaService } from './bioschema.service';
import { Organization } from './openapi';
import { OrgschemaService } from './orgschema.service';
import { DateService } from './date.service';

describe('OrgschemaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrgschemaService]
    });
  });

  it('should be created', inject([OrgschemaService], (service: OrgschemaService) => {
    expect(service).toBeTruthy();
  }));
  it('should have expected attributes', inject([OrgschemaService], (service: OrgschemaService) => {
    const org: Organization = {
      name: 'org',
      link: 'http://org.org',
      avatarUrl: 'http://org.org/image',
      email: 'contact@org.org'
    };
    const schema = service.getSchema(org);
    expect(schema.name).toEqual('org');
    expect(schema.url).toEqual('http://org.org');
    expect(schema.logo).toEqual('http://org.org/image');
    expect(schema.contactPoint).toEqual([{ '@type': 'ContactPoint', email: 'contact@org.org' }]);
  }));
});
