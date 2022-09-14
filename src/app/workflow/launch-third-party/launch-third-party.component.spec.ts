import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { ga4ghPath } from '../../shared/constants';
import { Dockstore } from '../../shared/dockstore.model';
import { GA4GHFilesService } from '../../shared/ga4gh-files/ga4gh-files.service';
import { GA4GHFilesStore } from '../../shared/ga4gh-files/ga4gh-files.store';
import { CustomMaterialModule } from '../../shared/modules/material.module';
import { CloudInstancesService, GA4GHV20Service, UsersService } from '../../shared/openapi';
import { WorkflowsService } from '../../shared/swagger/api/workflows.service';
import { sampleWdlWorkflow2, sampleWorkflowVersion } from '../../test/mocked-objects';
import { CloudInstancesStubService, UsersStubService, WorkflowsStubService } from '../../test/service-stubs';
import { LaunchThirdPartyComponent } from './launch-third-party.component';
import { DescriptorLanguageService } from '../../shared/entry/descriptor-language.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LaunchThirdPartyComponent', () => {
  let component: LaunchThirdPartyComponent;
  let fixture: ComponentFixture<LaunchThirdPartyComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LaunchThirdPartyComponent],
        imports: [CustomMaterialModule, HttpClientModule, HttpClientTestingModule],
        providers: [
          GA4GHFilesService,
          GA4GHV20Service,
          GA4GHFilesStore,
          { provide: WorkflowsService, useClass: WorkflowsStubService },
          { provide: CloudInstancesService, useClass: CloudInstancesStubService },
          { provide: UsersService, useClass: UsersStubService },
          { provide: DescriptorLanguageService, useClass: DescriptorLanguageService },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    TestBed.inject(WorkflowsService);
    TestBed.inject(GA4GHFilesService);
    TestBed.inject(CloudInstancesService);
    TestBed.inject(UsersService);
    fixture = TestBed.createComponent(LaunchThirdPartyComponent);
    component = fixture.componentInstance;
    component.workflow = sampleWdlWorkflow2;
    component.selectedVersion = sampleWorkflowVersion;
    fixture.detectChanges();
  });

  it('should set properties correctly', () => {
    component.ngOnChanges({
      workflow: new SimpleChange(null, sampleWdlWorkflow2, true),
      selectedVersion: new SimpleChange(null, sampleWorkflowVersion, true),
    });
    fixture.detectChanges();
    const nativeElement: HTMLElement = fixture.nativeElement;

    // Verify urls are correct; got these from prod (except for Terra, which is new) to verify there is no breakage.
    // This test was removed as part of: https://ucsc-cgl.atlassian.net/browse/SEAB-3800
    // tslint:disable:max-line-length
    // if (!Dockstore.FEATURES.enableMultiCloudLaunchWithDNAstack) {
    //   expect(
    //     nativeElement.querySelector(
    //       'a[href="https://app.dnastack.com/#/app/workflow/import/dockstore?descriptorType=wdl&path=github.com/DataBiosphere/topmed-workflows/UM_aligner_wdl"]'
    //     )
    //   ).toBeTruthy();
    // }

    // https://platform.dnanexus.com/panx/tools/import-workflow?source=https://dockstore.org:443/api/api/ga4gh/v2/tools/%23workflow%2Fgithub.com%2FDataBiosphere%2Ftopmed-workflows%2FUM_aligner_wdl/versions/master
    expect(
      nativeElement.querySelector(
        'a[href="https://platform.dnanexus.com/panx/tools/import-workflow?source=' +
          Dockstore.API_URI +
          ga4ghPath +
          '/tools/%23workflow%2Fgithub.com%2FDataBiosphere%2Ftopmed-workflows%2FUM_aligner_wdl/versions/master"]'
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
