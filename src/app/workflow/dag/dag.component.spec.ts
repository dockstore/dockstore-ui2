import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { Workflow } from './../../shared/swagger/model/workflow';
import { WorkflowService } from './../../shared/workflow.service';
import { HttpService } from '../../shared/http.service';
import { DagStubService, HttpStubService, WorkflowsStubService, WorkflowStubService } from './../../test/service-stubs';
import { DagService } from './dag.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
declare var cytoscape: any;
import { DagComponent } from './dag.component';

describe('DagComponent', () => {
  let component: DagComponent;
  let fixture: ComponentFixture<DagComponent>;
  // let de: DebugElement;
  // let el: HTMLElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DagComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [ {provide: WorkflowsService, useClass: WorkflowsStubService },
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

  it('should be able to download', () => {
    // component.refreshDocument();
    // component.download();
    component.selectVersion = {
      reference: 'reference',
      name: 'master',
    };
    component.workflow = {
      'descriptorType': 'cwl',
      'gitUrl': '',
      'mode': Workflow.ModeEnum.FULL,
      'organization': '',
      'repository': 'l',
      'workflow_path': ''
    };
  //   fixture.detectChanges();
  //   de = fixture.debugElement.query(By.css('#exportLink'));
  //   el = de.nativeElement;
  //   expect(el.getAttribute('href')).toBe('l_master.png');
  });
  it('should be able to toggleExpand', () => {
    component.toggleExpand();
    expect(component.expanded).toEqual(true);
  });

  it('should update missing tool', () => {
    component.setDagResult(null);
    component.updateMissingTool();
    expect(component.missingTool).toBeTruthy();
    component.setDagResult({'edges': [], 'nodes': []});
    component.updateMissingTool();
    expect(component.missingTool).toBeTruthy();
    component.setDagResult({'edges': [1], 'nodes': [1]});
    component.updateMissingTool();
    expect(component.missingTool).toBeFalsy();
  });
});
