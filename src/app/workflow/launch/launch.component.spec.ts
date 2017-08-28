import { ContainerStubService } from './../../test/service-stubs';
import { ContainerService } from './../../shared/container.service';
import { LaunchService } from './launch.service';
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
      providers: [ LaunchService, {provide: ContainerService, useClass: ContainerStubService}]
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
