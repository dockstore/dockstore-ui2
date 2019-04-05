import { Organization } from '../../shared/swagger';
import { OrganizationsQuery } from './organizations.query';
import { OrganizationsStore } from './organizations.store';

describe('OrganizationsQuery', () => {
  let query: OrganizationsQuery;

  beforeEach(() => {
    query = new OrganizationsQuery(new OrganizationsStore);
  });

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

  it('should filter organizations', () => {
    const exampleOrganizations: Array<Organization> = [
      { name: 'potato', status: Organization.StatusEnum.APPROVED, users: [], topic: 'nothing relevant' },
      { name: 'beef', status: Organization.StatusEnum.APPROVED, users: [], topic: 'nothing relevant' },
      { name: 'chicken', status: Organization.StatusEnum.APPROVED, users: [], topic: 'nothing relevant' },
      { name: 'pork', status: Organization.StatusEnum.APPROVED, users: [], topic: 'nothing relevant' },
      { name: 'mutton', status: Organization.StatusEnum.APPROVED, users: [], topic: 'nothing relevant' },
      { name: 'duck', status: Organization.StatusEnum.APPROVED, users: [], topic: 'nothing relevant' },
    ];
    expect(query.filterOrganizations(exampleOrganizations, 'potato')).toEqual(
      [{ name: 'potato', status: Organization.StatusEnum.APPROVED, users: [], topic: 'nothing relevant' }]);
    expect(query.filterOrganizations(exampleOrganizations, 'po'))
      .toEqual([{ name: 'potato', status: Organization.StatusEnum.APPROVED, users: [], topic: 'nothing relevant' },
      { name: 'pork', status: Organization.StatusEnum.APPROVED, users: [], topic: 'nothing relevant' }]);
    expect(query.filterOrganizations(exampleOrganizations, 'POTATO'))
      .toEqual([{ name: 'potato', status: Organization.StatusEnum.APPROVED, users: [], topic: 'nothing relevant' }]);
    expect(query.filterOrganizations(exampleOrganizations, 'PO'))
      .toEqual([{ name: 'potato', status: Organization.StatusEnum.APPROVED, users: [], topic: 'nothing relevant' },
      { name: 'pork', status: Organization.StatusEnum.APPROVED, users: [], topic: 'nothing relevant' }]);
    expect(query.filterOrganizations(exampleOrganizations, 'ck'))
      .toEqual([{ name: 'chicken', status: Organization.StatusEnum.APPROVED, users: [], topic: 'nothing relevant' },
      { name: 'duck', status: Organization.StatusEnum.APPROVED, users: [], topic: 'nothing relevant' }]);
    expect(query.filterOrganizations(exampleOrganizations, 'CK'))
      .toEqual([{ name: 'chicken', status: Organization.StatusEnum.APPROVED, users: [], topic: 'nothing relevant' },
      { name: 'duck', status: Organization.StatusEnum.APPROVED, users: [], topic: 'nothing relevant' }]);
      expect(query.filterOrganizations(null, 'CK'))
      .toEqual(null);
      expect(query.filterOrganizations([], 'CK'))
      .toEqual([]);
  });

});
