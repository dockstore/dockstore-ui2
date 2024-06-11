import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatLegacySnackBarModule } from '@angular/material/legacy-snack-bar';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { ga4ghPath } from 'app/shared/constants';
import { DescriptorTypeCompatService } from 'app/shared/descriptor-type-compat.service';
import { DescriptorLanguageService } from 'app/shared/entry/descriptor-language.service';
import { EntryType } from 'app/shared/enum/entry-type';
import { WorkflowsService } from 'app/shared/openapi';
import { ExtendedWorkflowQuery } from 'app/shared/state/extended-workflow.query';
import { WorkflowService } from 'app/shared/state/workflow.service';
import { WorkflowsStubService, WorkflowStubService } from 'app/test/service-stubs';
import { sampleWorkflow3 } from '../../test/mocked-objects';
import { InfoTabService } from './info-tab.service';

describe('ValueService', () => {
  let service: InfoTabService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InfoTabService,
        {
          provide: WorkflowsService,
          useClass: WorkflowsStubService,
        },
        {
          provide: WorkflowService,
          useClass: WorkflowStubService,
        },
        AlertService,
        ExtendedWorkflowQuery,
        DescriptorTypeCompatService,
        DescriptorLanguageService,
      ],
      imports: [HttpClientTestingModule, MatLegacySnackBarModule],
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
      ga4ghPath +
        // eslint-disable-next-line max-len
        '/tools/%23workflow%2Fgithub.com%2Fdockstore-testing%2FMetaphlan-ISBCGC/versions/master/PLAIN_CWL/descriptor//metaphlan_wfl.cwl'
    );
    // TODO: service test
  });

  it(`getTRSId should work for tools and workflows`, () => {
    service = TestBed.inject(InfoTabService);
    const fullWorkflowPath = sampleWorkflow3.full_workflow_path;
    expect(service.getTRSId(sampleWorkflow3, EntryType.BioWorkflow)).toBe(`#workflow/${fullWorkflowPath}`);
    expect(service.getTRSId(sampleWorkflow3, EntryType.AppTool)).toBe(fullWorkflowPath);
    expect(service.getTRSId(sampleWorkflow3, EntryType.Service)).toBe(`#service/${fullWorkflowPath}`);
    expect(service.getTRSId(null, EntryType.BioWorkflow)).toBe('');
  });

  it(`getTRSPlainType should work for various descriptor types`, () => {
    service = TestBed.inject(InfoTabService);
    expect(service.getTRSPlainType('CWL')).toBe('PLAIN_CWL');
    expect(service.getTRSPlainType('WDL')).toBe('PLAIN_WDL');
    expect(service.getTRSPlainType('NFL')).toBe('PLAIN_NFL');
    expect(service.getTRSPlainType('gxformat2')).toBe('PLAIN_GALAXY');
    expect(service.getTRSPlainType('jupyter')).toBe('PLAIN_JUPYTER');
    expect(service.getTRSPlainType('bogus')).toBe('PLAIN_BOGUS');
  });
});
