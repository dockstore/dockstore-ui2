import { TestBed } from '@angular/core/testing';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DescriptorTypeCompatService } from 'app/shared/descriptor-type-compat.service';
import { FileService } from 'app/shared/file.service';
import { WorkflowsService } from 'app/shared/openapi';
import { DescriptorTypeCompatStubService, FileStubService, ProviderStubService, WorkflowsStubService } from 'app/test/service-stubs';
import { ProviderService } from '../shared/provider.service';
import { SourceFileTabsService } from './source-file-tabs.service';
import { DescriptorLanguageService } from '../shared/entry/descriptor-language.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SourceFileTabsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: FileService, useClass: FileStubService },
        { provide: WorkflowsService, useClass: WorkflowsStubService },
        { provide: DescriptorTypeCompatService, useClass: DescriptorTypeCompatStubService },
        { provide: DescriptorLanguageService, useClass: DescriptorLanguageService },
        { provide: ProviderService, useClass: ProviderStubService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    })
  );

  it('should be created', () => {
    const service: SourceFileTabsService = TestBed.inject(SourceFileTabsService);
    expect(service).toBeTruthy();
  });
});
