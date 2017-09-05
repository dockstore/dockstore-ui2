import { DescriptorService } from '../../shared/descriptor.service';
import { WorkflowDescriptorService } from './../descriptors/workflow-descriptor.service';
import { ContainerStubService, DescriptorsStubService } from './../../test/service-stubs';
import { ContainerService } from './../../shared/container.service';
import { WorkflowLaunchService } from './workflow-launch.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LaunchWorkflowComponent } from './launch.component';

describe('LaunchWorkflowComponent', () => {
  let component: LaunchWorkflowComponent;
  let fixture: ComponentFixture<LaunchWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaunchWorkflowComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [ WorkflowLaunchService, {provide: ContainerService, useClass: ContainerStubService},
      { provide: WorkflowDescriptorService, useClass: DescriptorsStubService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
