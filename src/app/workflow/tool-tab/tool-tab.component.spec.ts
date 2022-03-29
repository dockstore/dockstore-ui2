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
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RefreshAlertModule } from '../../shared/alert/alert.module';
import { CustomMaterialModule } from '../../shared/modules/material.module';
import { WorkflowService } from '../../shared/state/workflow.service';
import { WorkflowsService } from '../../shared/swagger';
import { WorkflowsStubService, WorkflowStubService } from '../../test/service-stubs';
import { ToolTabComponent } from './tool-tab.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DescriptorLanguageService } from '../../shared/entry/descriptor-language.service';

describe('ToolTabComponent', () => {
  let component: ToolTabComponent;
  let fixture: ComponentFixture<ToolTabComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ToolTabComponent],
        imports: [FormsModule, CustomMaterialModule, RefreshAlertModule, HttpClientTestingModule],
        providers: [
          { provide: WorkflowService, useClass: WorkflowStubService },
          { provide: WorkflowsService, useClass: WorkflowsStubService },
          { provide: DescriptorLanguageService, useClass: DescriptorLanguageService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update table tool content', () => {
    component.getTableToolContent(1, null);
    expect(component.toolContent).toBe(null);
    component.getTableToolContent(null, 1);
    expect(component.toolContent).toBe(null);
    component.getTableToolContent(1, 1);
    expect(component.toolContent).toBe('tableToolContentString');
  });
});
