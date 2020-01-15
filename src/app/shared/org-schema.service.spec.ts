import { inject, TestBed } from '@angular/core/testing';
import { Organization } from './swagger';
import { OrgSchemaService } from './org-schema.service';

describe('OrgSchemaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrgSchemaService]
    });
  });

  it('should be created', inject([OrgSchemaService], (service: OrgSchemaService) => {
    expect(service).toBeTruthy();
  }));
  it('should have expected attributes', inject([OrgSchemaService], (service: OrgSchemaService) => {
    const org: Organization = {
      name: 'org',
      link: 'http://org.org',
      avatarUrl: 'http://org.org/image',
      email: 'contact@org.org',
      status: 'APPROVED',
      users: []
    };
    const schema = service.getSchema(org);
    expect(schema.name).toEqual('org');
    expect(schema.url).toEqual('http://org.org');
    expect(schema.logo).toEqual('http://org.org/image');
    expect(schema.contactPoint).toEqual([{ '@type': 'ContactPoint', email: 'contact@org.org' }]);
  }));
  it('should handle null organization', inject([OrgSchemaService], (service: OrgSchemaService) => {
    const org: Organization = null;
    const schema = service.getSchema(org);
    expect(schema).toBeNull();
  }));
});
