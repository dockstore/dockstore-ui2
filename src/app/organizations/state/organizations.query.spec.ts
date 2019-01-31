import { Organisation } from '../../shared/swagger';
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
    const exampleOrganizations: Array<Organisation> = [
      { name: 'potato', status: Organisation.StatusEnum.APPROVED, users: [] },
      { name: 'beef', status: Organisation.StatusEnum.APPROVED, users: [] },
      { name: 'chicken', status: Organisation.StatusEnum.APPROVED, users: [] },
      { name: 'pork', status: Organisation.StatusEnum.APPROVED, users: [] },
      { name: 'mutton', status: Organisation.StatusEnum.APPROVED, users: [] },
      { name: 'duck', status: Organisation.StatusEnum.APPROVED, users: [] },
    ];
    expect(query.filterOrganizations(exampleOrganizations, 'potato')).toEqual(
      [{ name: 'potato', status: Organisation.StatusEnum.APPROVED, users: [] }]);
    expect(query.filterOrganizations(exampleOrganizations, 'po'))
      .toEqual([{ name: 'potato', status: Organisation.StatusEnum.APPROVED, users: [] },
      { name: 'pork', status: Organisation.StatusEnum.APPROVED, users: [] }]);
    expect(query.filterOrganizations(exampleOrganizations, 'POTATO'))
      .toEqual([{ name: 'potato', status: Organisation.StatusEnum.APPROVED, users: [] }]);
    expect(query.filterOrganizations(exampleOrganizations, 'PO'))
      .toEqual([{ name: 'potato', status: Organisation.StatusEnum.APPROVED, users: [] },
      { name: 'pork', status: Organisation.StatusEnum.APPROVED, users: [] }]);
    expect(query.filterOrganizations(exampleOrganizations, 'ck'))
      .toEqual([{ name: 'chicken', status: Organisation.StatusEnum.APPROVED, users: [] },
      { name: 'duck', status: Organisation.StatusEnum.APPROVED, users: [] }]);
    expect(query.filterOrganizations(exampleOrganizations, 'CK'))
      .toEqual([{ name: 'chicken', status: Organisation.StatusEnum.APPROVED, users: [] },
      { name: 'duck', status: Organisation.StatusEnum.APPROVED, users: [] }]);
      expect(query.filterOrganizations(null, 'CK'))
      .toEqual(null);
      expect(query.filterOrganizations([], 'CK'))
      .toEqual([]);
  });

});
