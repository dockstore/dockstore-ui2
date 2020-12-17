/*
 *    Copyright 2018 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License")
 *    you may not use this file except in compliance with the License
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatCardModule } from '@angular/material/card';
import { CheckerWorkflowService } from '../../state/checker-workflow.service';
import { CheckerWorkflowStubService } from './../../../test/service-stubs';
import { LaunchCheckerWorkflowComponent } from './launch-checker-workflow.component';
describe('LaunchCheckerWorkflowComponent', () => {
  let component: LaunchCheckerWorkflowComponent;
  let fixture: ComponentFixture<LaunchCheckerWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LaunchCheckerWorkflowComponent],
      providers: [{ provide: CheckerWorkflowService, useClass: CheckerWorkflowStubService }],
      imports: [MatCardModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchCheckerWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
