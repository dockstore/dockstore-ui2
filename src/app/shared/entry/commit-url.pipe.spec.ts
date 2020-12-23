/* tslint:disable:no-unused-variable */

import { CommitUrlPipe } from './commit-url.pipe';

describe('Pipe: CommitUrle', () => {
  it('create an instance', () => {
    const pipe = new CommitUrlPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform('868a1c6b02344dd679eb0548889de03e6affef99', 'https://github.com/garyluu/example_cwl_workflow')).toBe(
      'https://github.com/garyluu/example_cwl_workflow/tree/868a1c6b02344dd679eb0548889de03e6affef99'
    );
  });
});
