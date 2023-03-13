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

  it('should return undefined if type is invalid', inject([EntryTypeMetadataService], (service: EntryTypeMetadataService) => {
    expect(service.get(undefined)).toBe(undefined);
  }));

  it('should return undefined at first', inject([EntryTypeMetadataService], (service: EntryTypeMetadataService) => {
    expect(service.get(EntryType.NOTEBOOK)).toBe(undefined);
  }));

  it('should return correct value', inject([EntryTypeMetadataService], (service: EntryTypeMetadataService) => {
    const entryTypeMetadata: EntryTypeMetadata = {
      type: EntryType.NOTEBOOK,
      term: 'notebook',
    };
    const blank: EntryTypeMetadata = {};
    service.entryTypeMetadataList = [blank, entryTypeMetadata];
    expect(service.get(EntryType.NOTEBOOK).term).toBe('notebook');
  }));
});
