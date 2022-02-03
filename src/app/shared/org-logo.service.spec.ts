import { OrgLogoService } from './org-logo.service';

describe('OrgLogoService', () => {
  it('has the constant DEFAULT_URL', () => {
    expect(typeof new OrgLogoService().DEFAULT_URL).toBe('string');
  });
});
