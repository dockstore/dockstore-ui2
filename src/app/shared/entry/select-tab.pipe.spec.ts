import { orgObj1, orgObj2, orgObj3, orgObj4 } from '../../test/mocked-objects';
import { SelectTabPipe } from './select-tab.pipe';

describe('Pipe: SelectTabe', () => {
  it('create an instance', () => {
    const pipe = new SelectTabPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform(orgObj1, 1)).toEqual(0);
    expect(pipe.transform(orgObj2, 1)).toEqual(1);
    expect(pipe.transform(orgObj3, 1)).toEqual(0);
    expect(pipe.transform(orgObj4, 1)).toEqual(1);
  });
});
