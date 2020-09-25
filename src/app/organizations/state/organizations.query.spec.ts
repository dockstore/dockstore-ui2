import { Organization } from '../../shared/swagger';
import { OrganizationsQuery } from './organizations.query';
import { OrganizationsStore } from './organizations.store';

describe('OrganizationsQuery', () => {
  let query: OrganizationsQuery;

  beforeEach(() => {
    query = new OrganizationsQuery(new OrganizationsStore());
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

  it('should filter organizations', () => {
    const potatoOrganization: Organization = {
      name: 'potato',
      status: Organization.StatusEnum.APPROVED,
      users: [],
      topic: 'someTopic',
      displayName: 'someDisplayName',
      email: 'someEmail',
      description: 'someDescription',
      link: 'someLink',
      location: 'someLocation',
      avatarUrl: 'someAvatarUrl',
    };

    const beefOrganization: Organization = { name: 'beef', status: Organization.StatusEnum.APPROVED, users: [], topic: 'nothing relevent' };
    const chickenOrganization: Organization = {
      name: 'chicken',
      status: Organization.StatusEnum.APPROVED,
      users: [],
      topic: 'nothing relevent',
    };
    const porkOrganization: Organization = { name: 'pork', status: Organization.StatusEnum.APPROVED, users: [], topic: 'nothing relevent' };
    const muttonOrganization: Organization = {
      name: 'mutton',
      status: Organization.StatusEnum.APPROVED,
      users: [],
      topic: 'nothing relevent',
    };
    const duckOrganization: Organization = { name: 'duck', status: Organization.StatusEnum.APPROVED, users: [], topic: 'nothing relevent' };
    const exampleOrganizations: Array<Organization> = [
      potatoOrganization,
      beefOrganization,
      chickenOrganization,
      porkOrganization,
      muttonOrganization,
      duckOrganization,
    ];
    expect(query.filterOrganizations(exampleOrganizations, 'potato')).toEqual([potatoOrganization]);
    expect(query.filterOrganizations(exampleOrganizations, 'po')).toEqual([potatoOrganization, porkOrganization]);
    expect(query.filterOrganizations(exampleOrganizations, 'POTATO')).toEqual([potatoOrganization]);
    expect(query.filterOrganizations(exampleOrganizations, 'PO')).toEqual([potatoOrganization, porkOrganization]);
    expect(query.filterOrganizations(exampleOrganizations, 'ck')).toEqual([chickenOrganization, duckOrganization]);
    expect(query.filterOrganizations(exampleOrganizations, 'CK')).toEqual([chickenOrganization, duckOrganization]);
    expect(query.filterOrganizations(exampleOrganizations, 'someTopic')).toEqual([potatoOrganization]);
    expect(query.filterOrganizations(exampleOrganizations, 'someDisplayName')).toEqual([potatoOrganization]);
    expect(query.filterOrganizations(exampleOrganizations, 'someEmail')).toEqual([]);
    expect(query.filterOrganizations(exampleOrganizations, 'someDescription')).toEqual([potatoOrganization]);
    expect(query.filterOrganizations(exampleOrganizations, 'someLink')).toEqual([]);
    expect(query.filterOrganizations(exampleOrganizations, 'someLocation')).toEqual([potatoOrganization]);
    expect(query.filterOrganizations(exampleOrganizations, 'someAvatarUrl')).toEqual([]);
    expect(query.filterOrganizations([], 'CK')).toEqual([]);
  });
});
