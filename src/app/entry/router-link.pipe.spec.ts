import { TestBed, inject } from '@angular/core/testing';
import { sampleWorkflow1, sampleTool1, sampleCollectionEntry1, sampleCollectionEntry2 } from '../test/openapi-mocked-objects';
import { RouterLinkPipe } from './router-link.pipe';
import { EntryTypeMetadataService } from './type-metadata/entry-type-metadata.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EntryTypeMetadataStubService } from '../test/service-stubs';

describe('RouterLinkPipe', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: EntryTypeMetadataService, useClass: EntryTypeMetadataStubService }],
    })
  );

  it('should be created', inject([EntryTypeMetadataService], (entryTypeMetadataService: EntryTypeMetadataService) => {
    const pipe = new RouterLinkPipe(entryTypeMetadataService);
    expect(pipe).toBeTruthy();
  }));

  it('generates the right router links', inject([EntryTypeMetadataService], (entryTypeMetadataService: EntryTypeMetadataService) => {
    const pipe = new RouterLinkPipe(entryTypeMetadataService);
    expect(pipe.transform(null)).toBeNull();
    expect(pipe.transform(sampleWorkflow1)).toEqual('/workflows/github.com/updatedOrganization/updatedWorkflowPath');
    expect(pipe.transform(sampleTool1)).toEqual('/containers/quay.io/sampleNamespace/sampleName');
    expect(pipe.transform(sampleCollectionEntry1)).toEqual('/containers/quay.io/pancancer/pcawg-dkfz-workflow');
    expect(pipe.transform(sampleCollectionEntry2)).toEqual('/notebooks/github.com/david4096/simple-notebook/simplers:version');
  }));
});
