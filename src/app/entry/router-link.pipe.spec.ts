import { EntryType } from '../shared/enum/entry-type';
import { sampleWorkflow1 } from '../test/openapi-mocked-objects';
import { RouterLinkPipe } from './router-link.pipe';

describe('RouterLinkPipe', () => {
  it('create an instance', () => {
    const pipe = new RouterLinkPipe();
    expect(pipe).toBeTruthy();
  });
  it('generates the right router links', () => {
    const pipe = new RouterLinkPipe();
    expect(pipe.transform(null, null)).toBeNull();
    expect(pipe.transform(EntryType.Service, null)).toBeNull();
    expect(pipe.transform(null, sampleWorkflow1)).toBeNull();

    expect(pipe.transform(EntryType.AppTool, sampleWorkflow1)).toEqual('/containers/github.com/updatedOrganization/updatedWorkflowPath');
    expect(pipe.transform(EntryType.Service, sampleWorkflow1)).toEqual('/services/github.com/updatedOrganization/updatedWorkflowPath');
    expect(pipe.transform(EntryType.BioWorkflow, sampleWorkflow1)).toEqual('/workflows/github.com/updatedOrganization/updatedWorkflowPath');
  });
});
