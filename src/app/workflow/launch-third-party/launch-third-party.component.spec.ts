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
    component.workflow = sampleWorkflow3;
    fixture.detectChanges();
    workflowsService = TestBed.get(WorkflowsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set properites correctly', () => {
    component.selectedVersion = sampleWorkflowVersion;
    component.workflow = sampleWdlWorkflow1;
    component.ngOnChanges({
      'workflow': new SimpleChange(null, sampleWdlWorkflow1, true),
      'selectedVersion': new SimpleChange(null, sampleWorkflowVersion, true)
    });
    fixture.detectChanges();
    // tslint:disable:max-line-length
    expect(component.trsUrl).toEqual('http://localhost:8080/api/ga4gh/v2/tools/%23workflow%2Fgithub.com%2FDataBiosphere%2Ftopmed-workflows%2FFunctional_Equivalence/versions/master');
    expect(component.trsUrlAsQueryValue).toEqual('http://localhost:8080/api/ga4gh/v2/tools/%2523workflow%252Fgithub.com%252FDataBiosphere%252Ftopmed-workflows%252FFunctional_Equivalence/versions/master');
    expect(component.workflowPathAsQueryValue).toEqual('github.com/DataBiosphere/topmed-workflows/Functional_Equivalence');
  });

});
