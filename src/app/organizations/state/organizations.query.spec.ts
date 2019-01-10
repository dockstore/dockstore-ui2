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
      { name: 'potato', approved: true },
      { name: 'beef', approved: true },
      { name: 'chicken', approved: true },
      { name: 'pork', approved: true },
      { name: 'mutton', approved: true },
      { name: 'duck', approved: true },
    ];
    expect(query.filterOrganizations(exampleOrganizations, 'potato')).toEqual([{ name: 'potato', approved: true }]);
    expect(query.filterOrganizations(exampleOrganizations, 'po'))
      .toEqual([{ name: 'potato', approved: true }, { name: 'pork', approved: true }]);
    expect(query.filterOrganizations(exampleOrganizations, 'POTATO'))
      .toEqual([{ name: 'potato', approved: true }]);
    expect(query.filterOrganizations(exampleOrganizations, 'PO'))
      .toEqual([{ name: 'potato', approved: true }, { name: 'pork', approved: true }]);
    expect(query.filterOrganizations(exampleOrganizations, 'ck'))
      .toEqual([{ name: 'chicken', approved: true }, { name: 'duck', approved: true }]);
    expect(query.filterOrganizations(exampleOrganizations, 'CK'))
      .toEqual([{ name: 'chicken', approved: true }, { name: 'duck', approved: true }]);
      expect(query.filterOrganizations(null, 'CK'))
      .toEqual(null);
      expect(query.filterOrganizations([], 'CK'))
      .toEqual([]);
  });

});
