import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DescriptorTypeCompatService } from 'app/shared/descriptor-type-compat.service';
import { FileService } from 'app/shared/file.service';
import { WorkflowsService } from 'app/shared/openapi';
import { DescriptorTypeCompatStubService, FileStubService, ProviderStubService, WorkflowsStubService } from 'app/test/service-stubs';
import { ProviderService } from '../shared/provider.service';
import { SourceFileTabsService } from './source-file-tabs.service';
import { DescriptorLanguageService } from '../shared/entry/descriptor-language.service';

describe('SourceFileTabsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: FileService, useClass: FileStubService },
        { provide: WorkflowsService, useClass: WorkflowsStubService },
        { provide: DescriptorTypeCompatService, useClass: DescriptorTypeCompatStubService },
        { provide: DescriptorLanguageService, useClass: DescriptorLanguageService },
        { provide: ProviderService, useClass: ProviderStubService },
      ],
    })
  );

  it('should be created', () => {
    const service: SourceFileTabsService = TestBed.inject(SourceFileTabsService);
    expect(service).toBeTruthy();
  });
});
