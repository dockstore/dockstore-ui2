import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { DescriptorTypeCompatService } from 'app/shared/descriptor-type-compat.service';
import { DescriptorLanguageService } from 'app/shared/entry/descriptor-language.service';
import { EntryType } from 'app/shared/enum/entry-type';
import { CustomMaterialModule } from 'app/shared/modules/material.module';
import { ExtendedWorkflowQuery } from 'app/shared/state/extended-workflow.query';
import { WorkflowService } from 'app/shared/state/workflow.service';
import { WorkflowsService } from 'app/shared/swagger';
import { WorkflowsStubService, WorkflowStubService } from 'app/test/service-stubs';
import { InfoTabService } from './info-tab.service';

describe('ValueService', () => {
  let service: InfoTabService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InfoTabService,
        {
          provide: WorkflowsService,
          useClass: WorkflowsStubService
        },
        {
          provide: WorkflowService,
          useClass: WorkflowStubService
        },
        AlertService,
        ExtendedWorkflowQuery,
        DescriptorTypeCompatService,
        DescriptorLanguageService
      ],
      imports: [CustomMaterialModule, HttpClientTestingModule]
    });
  });

  it('#getTRSLink should return real value', () => {
    service = TestBed.inject(InfoTabService);
    const path = 'github.com/dockstore-testing/Metaphlan-ISBCGC';
    const versionName = 'master';
    const descriptorType = 'CWL';
    const descriptorPath = '/metaphlan_wfl.cwl';
    const entryType: EntryType = EntryType.BioWorkflow;
    expect(service.getTRSLink(path, versionName, descriptorType, descriptorPath, entryType)).toContain(
      // tslint:disable-next-line: max-line-length
      '/api/ga4gh/v2/tools/%23workflow%2Fgithub.com%2Fdockstore-testing%2FMetaphlan-ISBCGC/versions/master/plain-CWL/descriptor//metaphlan_wfl.cwl'
    );
    // TODO: service test
  });
});
