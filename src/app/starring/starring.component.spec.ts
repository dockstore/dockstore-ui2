/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ContainerService } from '../shared/container.service';
import { StarentryService } from '../shared/starentry.service';
import { WorkflowService } from '../shared/state/workflow.service';
import { TrackLoginService } from '../shared/track-login.service';
import {
  ContainerStubService,
  StarEntryStubService,
  StarringStubService,
  TrackLoginStubService,
  WorkflowStubService
} from '../test/service-stubs';
import { StarringComponent } from './starring.component';
import { StarringService } from './starring.service';

describe('StarringComponent', () => {
  let component: StarringComponent;
  let fixture: ComponentFixture<StarringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StarringComponent],
      imports: [MatIconModule, MatSnackBarModule],
      providers: [
        { provide: StarringService, useClass: StarringStubService },
        { provide: TrackLoginService, useClass: TrackLoginStubService },
        { provide: WorkflowService, useClass: WorkflowStubService },
        { provide: ContainerService, useClass: ContainerStubService },
        { provide: StarentryService, useClass: StarEntryStubService }
      ]
    }).compileComponents();
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
