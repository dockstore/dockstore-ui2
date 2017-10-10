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

import { WorkflowsService } from '../../shared/swagger';
import { WorkflowService } from './../../shared/workflow.service';
import { WorkflowsStubService, WorkflowStubService } from './../../test/service-stubs';
import { FormsModule } from '@angular/forms';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { ToolTabComponent } from './tool-tab.component';

describe('ToolTabComponent', () => {
  let component: ToolTabComponent;
  let fixture: ComponentFixture<ToolTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolTabComponent ],
      imports: [FormsModule],
      providers: [
        {provide: WorkflowService, useClass: WorkflowStubService},
      {provide: WorkflowsService, useClass: WorkflowsStubService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
