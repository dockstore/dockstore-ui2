/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { bitbucketToken, gitHubToken, gitLabToken, quayToken } from '../../../../app/test/mocked-objects';
import { TokenUser } from '../../../shared/swagger';
import { GetTokenUsernamePipe } from './getTokenUsername.pipe';

describe('Pipe: GetTokenUsername', () => {
  it('create an instance', () => {
    const pipe = new GetTokenUsernamePipe();
    const tokens: Array<TokenUser> = [quayToken, bitbucketToken, gitHubToken, gitLabToken];
    expect(pipe).toBeTruthy();
    expect(pipe.transform('github.com', tokens)).toBe('fakeGitHubUsername');
    expect(pipe.transform('dockstore.org', tokens)).toBe(null);
    expect(pipe.transform('bitbucket.org', tokens)).toBe('fakeBitbucketUsername');
    expect(pipe.transform('gitlab.com', tokens)).toBe('fakeGitLabUsername');
    expect(pipe.transform('quay.io', tokens)).toBe('fakeQuayUsername');
  });
});
