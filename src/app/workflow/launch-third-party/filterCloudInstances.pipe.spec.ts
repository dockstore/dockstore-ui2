import { CloudInstance, Language } from '../../shared/openapi';
import { FilterCloudInstancesPipe } from './filterCloudInstances.pipe';

describe('Pipe: filter cloud instances', () => {
  const cloudInstances: Array<CloudInstance> = [
    {
      url: 'galaxy.org',
      partner: CloudInstance.PartnerEnum.GALAXY,
      supportsFileImports: null,
      supportsHttpImports: null,
      supportedLanguages: new Array<Language>(),
      displayName: 'galaxy.org',
    },
    {
      url: 'DNAnexus',
      partner: CloudInstance.PartnerEnum.DNANEXUS,
      supportsFileImports: null,
      supportsHttpImports: null,
      supportedLanguages: new Array<Language>(),
      displayName: 'DNAnexus',
    },
  ];
  it('create instance and test', () => {
    const pipe = new FilterCloudInstancesPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform(cloudInstances, null)).toBe(null);
    expect(pipe.transform(cloudInstances, '')).toBe(null);
    expect(pipe.transform(cloudInstances, CloudInstance.PartnerEnum.DNANEXUS).length).toEqual(1);
  });
});
