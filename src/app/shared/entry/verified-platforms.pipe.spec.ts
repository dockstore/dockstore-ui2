import { testSourceFiles } from '../../test/mocked-objects';
import { VerifiedPlatformsPipe } from './verified-platforms.pipe';

describe('Pipe: VerifiedPlatformse', () => {
  it('create an instance', () => {
    const pipe = new VerifiedPlatformsPipe();
    expect(pipe.transform(testSourceFiles)).toEqual('Dockstore CLI');
  });
});
