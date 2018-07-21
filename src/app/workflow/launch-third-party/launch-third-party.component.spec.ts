import { of as observableOf } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchThirdPartyComponent } from './launch-third-party.component';
import { WorkflowsService } from '../../shared/swagger/api/workflows.service';
import {
  emptyWdlSourceFile,
  sampleWdlWorkflow1,
  sampleWorkflow3,
  sampleWorkflowVersion,
  wdlSourceFile,
  wdlSourceFileWithHttpImport
} from '../../test/mocked-objects';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { WorkflowsStubService } from '../../test/service-stubs';
import { CustomMaterialModule } from '../../shared/modules/material.module';
import { HttpClientModule } from '@angular/common/http';

describe('LaunchThirdPartyComponent', () => {
  let component: LaunchThirdPartyComponent;
  let fixture: ComponentFixture<LaunchThirdPartyComponent>;
  let workflowsService: WorkflowsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaunchThirdPartyComponent ],
      imports: [CustomMaterialModule, HttpClientModule],
      providers: [
        { provide: WorkflowsService, useClass: WorkflowsStubService}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchThirdPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    workflowsService = TestBed.get(WorkflowsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not set urls if CWL', () => {
    component.selectedVersion = sampleWorkflowVersion;
    component.workflow = sampleWorkflow3;
    // This will (should) not ever be fired, but putting in here in case it does get fired, which would expose a bug
    spyOn(workflowsService, 'wdl').and.returnValue(observableOf(wdlSourceFile));
    component.ngOnChanges({
      'workflow': new SimpleChange(null, sampleWorkflow3, true),
      'selectedVersion': new SimpleChange(null, sampleWorkflowVersion, true)
    });
    fixture.detectChanges();
    expect(component.dnastackURL).toBeFalsy();
    expect(component.fireCloudURL).toBeFalsy();
  });

  it('should set urls if WDL with no secondary files', () => {
    component.selectedVersion = sampleWorkflowVersion;
    component.workflow = sampleWdlWorkflow1;
    spyOn(workflowsService, 'wdl').and.returnValue(observableOf(wdlSourceFile));
    spyOn(workflowsService, 'secondaryWdl').and.returnValue(observableOf([]));
    component.ngOnChanges({
        'workflow': new SimpleChange(null, sampleWdlWorkflow1, true),
        'selectedVersion': new SimpleChange(null, sampleWorkflowVersion, true)
    });
    fixture.detectChanges();
    expect(component.dnastackURL)
      // tslint:disable-next-line:max-line-length
      .toEqual('https://app.dnastack.com/#/app/workflow/import/dockstore?path=github.com/DataBiosphere/topmed-workflows/Functional_Equivalence&descriptorType=wdl');
    expect(component.fireCloudURL)
      // tslint:disable-next-line:max-line-length
      .toEqual('https://portal.firecloud.org/#import/dockstore/github.com/DataBiosphere/topmed-workflows/Functional_Equivalence:master');

    // Expecting something like below; the problem is the dockstore host will not match when running UI locally
    // or on Travis, so match beginning and end of the URL.
    // tslint:disable-next-line:max-line-length
    // https://platform.dnanexus.com/panx/tools/import-workflow?source=https://dockstore.org:8443/api/ga4gh/v2/tools/%23workflow%2Fgithub.com%2FDataBiosphere%2Ftopmed-workflows%2FFunctional_Equivalence/versions/master
    const dnanexusUrlStart = 'https://platform.dnanexus.com/panx/tools/import-workflow?source';
    expect(component.dnanexusURL.indexOf(dnanexusUrlStart))
      .toBe(0);
    // tslint:disable-next-line:max-line-length
    const dnanexusEnd = '/api/ga4gh/v2/tools/%23workflow%2Fgithub.com%2FDataBiosphere%2Ftopmed-workflows%2FFunctional_Equivalence/versions/master';
    expect(component.dnanexusURL.indexOf(dnanexusEnd))
      .toBeGreaterThan(dnanexusUrlStart.length);
  });

  it('should set dnastack and dnanexus but not Firecloud if WDL with secondary files', () => {
    component.selectedVersion = sampleWorkflowVersion;
    component.workflow = sampleWdlWorkflow1;
    spyOn(workflowsService, 'wdl').and.returnValue(observableOf(wdlSourceFile));
    spyOn(workflowsService, 'secondaryWdl').and.returnValue(observableOf([wdlSourceFileWithHttpImport]));
    component.ngOnChanges({
      'workflow': new SimpleChange(null, sampleWdlWorkflow1, true),
      'selectedVersion': new SimpleChange(null, sampleWorkflowVersion, true)
    });
    fixture.detectChanges();
    expect(component.dnastackURL)
      // tslint:disable-next-line:max-line-length
      .toEqual('https://app.dnastack.com/#/app/workflow/import/dockstore?path=github.com/DataBiosphere/topmed-workflows/Functional_Equivalence&descriptorType=wdl');
    expect(component.dnanexusURL).toBeTruthy();
    expect(component.fireCloudURL).toBeFalsy();
  });

  it('should set wdlHasContent to false if source file is empty', () => {
    component.selectedVersion = sampleWorkflowVersion;
    component.workflow = sampleWdlWorkflow1;
    spyOn(workflowsService, 'wdl').and.returnValue(observableOf(emptyWdlSourceFile));
    component.ngOnChanges({
      'workflow': new SimpleChange(null, sampleWdlWorkflow1, true),
      'selectedVersion': new SimpleChange(null, sampleWorkflowVersion, true)
    });
    fixture.detectChanges();
    expect(component.wdlHasContent).toBeFalsy();
  });
});
