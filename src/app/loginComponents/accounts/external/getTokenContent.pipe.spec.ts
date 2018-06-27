/* tslint:disable:no-unused-variable */
import { bitbucketToken, gitHubToken, gitLabToken, quayToken } from '../../../../app/test/mocked-objects';
import { Token } from '../../../shared/swagger';
import { GetTokenContentPipe } from './getTokenContent.pipe';

describe('Pipe: GetTokenContent', () => {
  it('create an instance', () => {
    const pipe = new GetTokenContentPipe();
    const tokens: Array<Token> = [quayToken, bitbucketToken, gitHubToken, gitLabToken];
    expect(pipe).toBeTruthy();
    expect(pipe.transform('github.com', tokens)).toBe('fakeGitHubToken');
    expect(pipe.transform('dockstore.org', tokens)).toBe(null);
    expect(pipe.transform('bitbucket.org', tokens)).toBe('fakeBitbucketToken');
    expect(pipe.transform('gitlab.com', tokens)).toBe('fakeGitLabToken');
    expect(pipe.transform('quay.io', tokens)).toBe('fakeQuayToken');
  });
});
