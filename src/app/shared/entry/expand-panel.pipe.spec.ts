import { orgObj1, orgObj2, orgObj3, orgObj4 } from '../../test/mocked-objects';
import { ExpandPanelPipe } from './expand-panel.pipe';

describe('Pipe: ExpandPanele', () => {
  it('create an instance', () => {
    const pipe = new ExpandPanelPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform(orgObj1, 1)).toEqual(true);
    expect(pipe.transform(orgObj2, 1)).toEqual(true);
    expect(pipe.transform(orgObj3, 1)).toEqual(false);
    expect(pipe.transform(orgObj4, 1)).toEqual(false);
  });
});
