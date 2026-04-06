import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { ga4ghPath } from 'app/shared/constants';
import { DescriptorTypeCompatService } from 'app/shared/descriptor-type-compat.service';
import { DescriptorLanguageService } from 'app/shared/entry/descriptor-language.service';
import { EntryType } from 'app/shared/enum/entry-type';
import { WorkflowsService } from 'app/shared/openapi';
import { ExtendedWorkflowQuery } from 'app/shared/state/extended-workflow.query';
import { WorkflowService } from 'app/shared/state/workflow.service';
import { WorkflowsStubService, WorkflowStubService } from 'app/test/service-stubs';
import { sampleWorkflow3, appToolEntryTypeMetadata, serviceEntryTypeMetadata, notebookEntryTypeMetadata } from '../../test/mocked-objects';
import { InfoTabService } from './info-tab.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ValueService', () => {
  let service: InfoTabService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
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
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
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
    const clone = Object.assign({}, sampleWorkflow3);
    expect(service.getTRSId(clone)).toBe(`#workflow/${fullWorkflowPath}`);
    clone.entryTypeMetadata = appToolEntryTypeMetadata;
    expect(service.getTRSId(clone)).toBe(fullWorkflowPath);
    clone.entryTypeMetadata = serviceEntryTypeMetadata;
    expect(service.getTRSId(clone)).toBe(`#service/${fullWorkflowPath}`);
    clone.entryTypeMetadata = notebookEntryTypeMetadata;
    expect(service.getTRSId(clone)).toBe(`#notebook/${fullWorkflowPath}`);
    expect(service.getTRSId(null)).toBe('');
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
