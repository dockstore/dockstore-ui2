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
import { FormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../../shared/modules/material.module';
import { WorkflowService } from '../../shared/state/workflow.service';
import { ToolDescriptor, WorkflowsService } from '../../shared/swagger';
import { WorkflowsStubService, WorkflowStubService } from '../../test/service-stubs';
import { ToolTabComponent } from './tool-tab.component';


describe('ToolTabComponent', () => {
  let component: ToolTabComponent;
  let fixture: ComponentFixture<ToolTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ToolTabComponent],
      imports: [FormsModule, CustomMaterialModule],
      providers: [
        { provide: WorkflowService, useClass: WorkflowStubService },
        { provide: WorkflowsService, useClass: WorkflowsStubService }]
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

  it('should update table tool content', () => {
    component.updateTableToolContent(1, null);
    expect(component.toolsContent).toBe(null);
    component.updateTableToolContent(null, 1);
    expect(component.toolsContent).toBe(null);
    component.updateTableToolContent(1, 1);
    expect(component.toolsContent).toBe('tableToolContentString');
  });

  fit('should determines the correct workflow excerpt row heading', () => {
    expect(component.descriptorTypeToWorkflowExcerptRowHeading(ToolDescriptor.TypeEnum.CWL)).toEqual('tool\xa0ID');
    expect(component.descriptorTypeToWorkflowExcerptRowHeading(ToolDescriptor.TypeEnum.WDL)).toEqual('task\xa0ID');
    expect(component.descriptorTypeToWorkflowExcerptRowHeading(ToolDescriptor.TypeEnum.NFL)).toEqual('process\xa0name');
    expect(component.descriptorTypeToWorkflowExcerptRowHeading(<ToolDescriptor.TypeEnum>'Potato')).toEqual('tool\xa0ID');
  });

  fit('should determines the correct workflow excerpt row heading', () => {
    expect(component.descriptorTypeToHeaderName(ToolDescriptor.TypeEnum.CWL)).toEqual('Tool Excerpt');
    expect(component.descriptorTypeToHeaderName(ToolDescriptor.TypeEnum.WDL)).toEqual('Task Excerpt');
    expect(component.descriptorTypeToHeaderName(ToolDescriptor.TypeEnum.NFL)).toEqual('Process Excerpt');
    expect(component.descriptorTypeToHeaderName(<ToolDescriptor.TypeEnum>'Potato')).toEqual('Tool Excerpt');
  });
});
