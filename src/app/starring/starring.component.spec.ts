import { StarentryService } from './../shared/starentry.service';
import { ContainerStubService, StarEntryStubService } from './../test/service-stubs';
import { ContainerService } from './../shared/container.service';
import { WorkflowService } from './../shared/workflow.service';
import { UserService } from './../loginComponents/user.service';
import { TrackLoginService } from '../shared/track-login.service';
import { StarringStubService, TrackLoginStubService, UserStubService, WorkflowStubService } from '../test/service-stubs';
import { StarringService } from './starring.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarringComponent } from './starring.component';

describe('StarringComponent', () => {
  let component: StarringComponent;
  let fixture: ComponentFixture<StarringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarringComponent ],
      providers: [{provide: StarringService, useClass: StarringStubService}, {
        provide: TrackLoginService, useClass: TrackLoginStubService}, {
         provide: UserService, useClass: UserStubService
      }, {
        provide: WorkflowService, useClass: WorkflowStubService
      }, {provide: ContainerService, useClass: ContainerStubService}, {provide: StarentryService, useClass: StarEntryStubService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
