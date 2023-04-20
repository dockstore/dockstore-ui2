import { EntryType } from '../shared/enum/entry-type';
import { sampleWorkflow1, sampleTool1, sampleCollectionEntry1, sampleCollectionEntry2 } from '../test/openapi-mocked-objects';
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
    expect(pipe.transform(EntryType.Tool, sampleTool1)).toEqual('/containers/quay.io/sampleNamespace/sampleName');
    expect(pipe.transform(EntryType.Tool, sampleCollectionEntry1)).toEqual('/containers/quay.io/pancancer/pcawg-dkfz-workflow');
    expect(pipe.transform(EntryType.Notebook, sampleCollectionEntry2)).toEqual(
      '/notebooks/github.com/david4096/simple-notebook/simplers:version'
    );
  });
});
