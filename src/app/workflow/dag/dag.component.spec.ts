import { WorkflowService } from './../../shared/workflow.service';
import { HttpService } from '../../shared/http.service';
import { DagStubService, HttpStubService, WorkflowStubService } from './../../test/service-stubs';
import { DagService } from './dag.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DagComponent } from './dag.component';

describe('DagComponent', () => {
  let component: DagComponent;
  let fixture: ComponentFixture<DagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DagComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [ {provide: HttpService, useClass: HttpStubService },
        {provide: WorkflowService, useClass: WorkflowStubService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
