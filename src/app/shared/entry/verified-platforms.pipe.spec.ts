import { versionVerifiedPlatform } from '../../test/mocked-objects';
import { VerifiedPlatformsPipe } from './verified-platforms.pipe';

describe('Pipe: VerifiedPlatforms', () => {
  it('create an instance', () => {
    const pipe = new VerifiedPlatformsPipe();
    expect(pipe.transform(1, versionVerifiedPlatform)).toEqual('Dockstore CLI');
  });
});
