import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchThirdPartyComponent } from './launch-third-party.component';
import { WorkflowsService } from '../../shared/swagger/api/workflows.service';
import { sampleWdlWorkflow2, sampleWorkflowVersion } from '../../test/mocked-objects';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { WorkflowsStubService } from '../../test/service-stubs';
import { CustomMaterialModule } from '../../shared/modules/material.module';
import { HttpClientModule } from '@angular/common/http';
import { GA4GHFilesService } from '../../shared/ga4gh-files/ga4gh-files.service';
import { GA4GHService } from '../../shared/swagger';
import { GA4GHFilesStore } from '../../shared/ga4gh-files/ga4gh-files.store';
import { Dockstore } from '../../shared/dockstore.model';

describe('LaunchThirdPartyComponent', () => {
  let component: LaunchThirdPartyComponent;
  let fixture: ComponentFixture<LaunchThirdPartyComponent>;
  let workflowsService: WorkflowsService;
  let ga4ghFilesService: GA4GHFilesService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LaunchThirdPartyComponent],
      imports: [CustomMaterialModule, HttpClientModule],
      providers: [GA4GHFilesService, GA4GHService, GA4GHFilesStore, { provide: WorkflowsService, useClass: WorkflowsStubService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    workflowsService = TestBed.get(WorkflowsService);
    ga4ghFilesService = TestBed.get(GA4GHFilesService);
    fixture = TestBed.createComponent(LaunchThirdPartyComponent);
    component = fixture.componentInstance;
    component.workflow = sampleWdlWorkflow2;
    component.selectedVersion = sampleWorkflowVersion;
    fixture.detectChanges();
  });

  it('should set properties correctly', () => {
    component.ngOnChanges({
      workflow: new SimpleChange(null, sampleWdlWorkflow2, true),
      selectedVersion: new SimpleChange(null, sampleWorkflowVersion, true)
    });
    fixture.detectChanges();
    const nativeElement: HTMLElement = fixture.nativeElement;

    // Verify urls are correct; got these from prod (except for Terra, which is new) to verify there is no breakage.
    // tslint:disable:max-line-length
    expect(
      nativeElement.querySelector(
        'a[href="https://app.dnastack.com/#/app/workflow/import/dockstore?descriptorType=wdl&path=github.com/DataBiosphere/topmed-workflows/UM_aligner_wdl"]'
      )
    ).toBeTruthy();
    // https://platform.dnanexus.com/panx/tools/import-workflow?source=https://dockstore.org:443/api/api/ga4gh/v2/tools/%23workflow%2Fgithub.com%2FDataBiosphere%2Ftopmed-workflows%2FUM_aligner_wdl/versions/master
    expect(
      nativeElement.querySelector(
        'a[href="https://platform.dnanexus.com/panx/tools/import-workflow?source=' +
          Dockstore.API_URI +
          '/api/ga4gh/v2/tools/%23workflow%2Fgithub.com%2FDataBiosphere%2Ftopmed-workflows%2FUM_aligner_wdl/versions/master"]'
      )
    ).toBeTruthy();
    expect(
      nativeElement.querySelector(
        'a[href="https://app.terra.bio/#import-tool/dockstore/github.com/DataBiosphere/topmed-workflows/UM_aligner_wdl:master"]'
      )
    ).toBeTruthy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
