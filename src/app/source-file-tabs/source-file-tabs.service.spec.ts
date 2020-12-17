import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DescriptorTypeCompatService } from 'app/shared/descriptor-type-compat.service';
import { FileService } from 'app/shared/file.service';
import { WorkflowsService } from 'app/shared/swagger';
import { DescriptorTypeCompatStubService, FileStubService, WorkflowsStubService } from 'app/test/service-stubs';
import { SourceFileTabsService } from './source-file-tabs.service';

describe('SourceFileTabsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: FileService, useClass: FileStubService },
        { provide: WorkflowsService, useClass: WorkflowsStubService },
        { provide: DescriptorTypeCompatService, useClass: DescriptorTypeCompatStubService },
      ],
    })
  );

  it('should be created', () => {
    const service: SourceFileTabsService = TestBed.inject(SourceFileTabsService);
    expect(service).toBeTruthy();
  });
});
