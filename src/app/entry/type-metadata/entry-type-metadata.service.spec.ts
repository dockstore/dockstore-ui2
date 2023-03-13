import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { ConfigService } from 'ng2-ui-auth';
import { EntryTypeMetadataService } from './entry-type-metadata.service';
import { EntryType, EntryTypeMetadata } from '../../shared/openapi';

describe('EntryTypeMetadataService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EntryTypeMetadataService, { provide: ConfigService, useValue: {} }, { provide: Window, useValue: window }],
    })
  );

  it('should be created', inject([EntryTypeMetadataService], (service: EntryTypeMetadataService) => {
    expect(service).toBeTruthy();
  }));

  it('should initially return undefined', inject([EntryTypeMetadataService], (service: EntryTypeMetadataService) => {
    expect(service.get(EntryType.NOTEBOOK)).toBe(undefined);
  }));

  it('should return the correct value', inject([EntryTypeMetadataService], (service: EntryTypeMetadataService) => {
    const notebookMetadata: EntryTypeMetadata = {
      type: EntryType.NOTEBOOK,
      term: 'notebook',
    };
    const workflowMetadata: EntryTypeMetadata = {
      type: EntryType.WORKFLOW,
      term: 'workflow',
    };
    service.entryTypeMetadataList = [notebookMetadata, workflowMetadata];
    expect(service.get(EntryType.NOTEBOOK).term).toBe('notebook');
    expect(service.get(EntryType.WORKFLOW).term).toBe('workflow');
    expect(service.get(EntryType.SERVICE)).toBe(undefined);
  }));
});
